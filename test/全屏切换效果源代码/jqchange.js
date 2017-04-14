(function ($) {
	//通过判断js属性的方式获取前缀
	var _prefix = (function (temp) {
		var aPrefix = ['webkit','Moz','o','ms'],
			props = '';
		for (var i in aPrefix) {
			props = aPrefix[i] + 'Transition';
			if (temp.style[ props] !== undefined) {
				return '-' + aPrefix[i].toLowerCase() + '-';
			}
		}
		return false;
	})(document.createElement(PageSwitch));//实参

	//内部实际主函数
	var PageSwitch = (function () {
		//element = 外层
		function PageSwitch (element, options) {
			this.settings = $.extend(true, $.fn.PageSwitch.defaults, options||{});
			this.element = element;
			this.init();
		}
		PageSwitch.prototype = {
			init : function () {
				//全局公共方法，实现内容
				var me = this;//保存pageSwitch对象
				me.selectors = me.settings.selectors;
				me.sections = me.element.find(me.selectors.sections);//整个页面框架
				me.section = me.sections.find(me.selectors.section);//每个页面元素
				me.direction = me.settings.direction =="vertical"? true : false;
				me.pagesCount = me.pagesCount();//页面元素计数
				me.index =(me.settings.index >= 0 && me.settings.index < me.pagesCount)? me.settings.index : 0;//初始页面位置

				me.canScroll = true;

				if(!me.direction) {
					me._initLayout();//初始化布局
				}

				if(me.settings.pagination) {
					me._initPaging();//创建分页处理
				}

				me._initEvent();//事件绑定

				me._scrollPage();//初始化位置

			},
			//获取滑动页面数量
			pagesCount : function () {
				return this.section.length;
			},
			//获取华东页面宽度、高度
			switchLength : function () {
				return this.direction? this.element.height() : this.element.width();
			},
			//向前滑动上一个页面
			prev : function () {
				var me = this;
				if (me.index > 0) {
					me.index --;
				} else if (me.settings.loop) {
					me.index = me.pagesCount - 1;
				}
				me._scrollPage();
			},
			//向后滑动下一个页面
			next : function () {
				var me = this;
				if (me.index < me.pagesCount - 1) {
					me.index ++;
				} else if (me.settings.loop) {
					me.index = 0;
				}
				me._scrollPage();
			},
			//横屏页面布局
			_initLayout : function () {
				var me = this;
				var width = me.pagesCount * 100 + '%',
					cellWidth = (100/me.pagesCount).toFixed(2) + '%';
				me.sections.width(width);
				me.section.width(cellWidth).css('float','left');
			},
			//创建分页处理
			_initPaging : function () {
				var me = this,
					pageClass = me.selectors.page.substring(1);
				me.activeClass = me.selectors.active.substring(1);
				var pageHtml = '<ul class="'+pageClass+'">';
				for (var i = 0; i < me.pagesCount; i++) {
					pageHtml += '<li></li>';
				}
				pageHtml +='</ul>';
				me.element.append(pageHtml);
				var pages = me.element.find(me.selectors.page);
				me.pageItem = pages.find('li');
				me.pageItem.eq(me.index).addClass(me.activeClass);
				if (me.direction) {
					pages.addClass('vertical');
				} else {
					pages.addClass('horizontal');
				}
			},
			//事件绑定
			_initEvent : function () {
				var me = this;
				//点击事件
				me.element.on('click', me.selectors.page + ' li', function() {
					if (me.sections.is(":animated")) {
						me.sections.stop(true,true);
					}
					me.index = $(this).index();
					me._scrollPage();
				});
				//滚轮事件
				me.element.on('mousewheel DOMMouseScroll', function (e) {
					if (!me.canScroll) {
						return;
					}
					var delta = e.originalEvent.wheelDelta || - e.originalEvent.detail;
					//向上
					if(delta > 0 && ((me.index && !me.settings.loop) || me.settings.loop)) {
						me.prev();
					//向下
					} else if (delta < 0 && ((me.index != (me.pagesCount - 1) && !me.settings.loop) || me.settings.loop)) {
						me.next();
					}
				});
				//j键盘事件
				if (me.settings.keyboard) {
					$(window).on('keydown',function (e) {
						if (!me.canScroll) {
							return;
						}
						var keyCode = e.keyCode;
						if ((keyCode == 37 || keyCode == 38) && ((me.index && !me.settings.loop) || me.settings.loop)) {
							me.prev();
						} else if ((keyCode == 39 || keyCode == 40) && ((me.index != (me.pagesCount - 1) && !me.settings.loop) || me.settings.loop)) {
							me.next();
						}
					});
				}
				//窗口变化事件
				$(window).resize(function () {
					var currentLength = me.switchLength(),
						offset = me.settings.direction? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
					if (Math.abs(offset) > currentLength/2 && me.index < (me.pagesCount - 1)) {
						me.index ++;
					}
					if (me.index) {
						me._scrollPage();
					}
				});
				//动画结束后回调事件
				me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionEnd', function () {
					me.canScroll = true;
					if (me.settings.callback && $.type(me.settings.callback) == 'function') {
						me.settings.callback();
					}
				});
			},

			_scrollPage : function () {
				var me = this;
				me.canScroll = false;
				if (_prefix) {
					me.sections.css(_prefix + 'transition','all ' + me.settings.duration/1000 + 's ' + me.settings.easing);
					var translate = me.direction? 'translateY(-' + me.switchLength() * me.index + 'px)' : 'translateX(-' + me.switchLength() * me.index + 'px)';
					me.sections.css(_prefix + 'transform', translate);
				} else {
					var animateCss = me.direction? {top : -me.switchLength() * me.index} : {left : -me.switchLength() * me.index};
					me.sections.css('position','relative');
					me.sections.animate(animateCss, me.settings.direction, function () {
						me.canScroll = true;
						if (me.settings.callback && $.type(me.settings.callback) == 'function') {
							me.settings.callback();
						}
					});
				}

				if (me.settings.pagination) {
					me.pageItem.eq(me.index).addClass(me.activeClass).siblings('li').removeClass(me.activeClass);
				}
			}
		};
		return PageSwitch;//注册全局方法
	})();

	/*-----------------------------------------------------------------*/

	//主函数
	$.fn.PageSwitch = function (options) {
		return this.each(function () {
			var me = $(this),
				instance = me.data("PageSwitch");//检验是否存在对象实例，用data存放对象的实例
			if (!instance) {
				instance = new PageSwitch(me, options);//从内部实际主函数（全局方法）中新建实例并存储
				me.data("PageSwitch", instance);//保存到data里面
			}
			//判断传入参数如果是字符串，返回该字符串方法调用
			if ($.type(options) ==="string") { return instance[options]();}
				//在使用时访问元素的继承方法init
				//$("div").PageSwitch("init");
		});
	};
	//参数
	$.fn.PageSwitch.defaults = {
		selectors : {
			sections : ".sections",
			section : ".section",
			page : ".pages",
			active : ".active"
		},
		index : 0,
		easing : "ease",
		duration : 500,//毫秒
		loop : false,
		pagination : true,//分页
		keyboard : true,
		direction : "vertical",
		callback : ""
	};

	/*-----------------------------------------------------------------*/

	//可通过属性的方式全局执行一次初始化
	$(function () {
		$("[data-PageSwitch]").PageSwitch();
	});
})(jQuery);