define(['jquery'],function ($) {
	function ScrollTo(opts){//构造函数，内部是函数初始化的时候的值，仅构造时保存一次
		this.opts = $.extend({}, ScrollTo.DEFAULTS, opts);
		this.$el = $('html, body');
	}

	ScrollTo.DEFAULTS = {//构造函数的属性，默认参数
		dest:0,
		speed:800
	};

	ScrollTo.prototype.move = function () {
		var opts = this.opts;//指向调用方法的对象本身，临时缓存

		if($(window).scrollTop()!= opts.dest){//判断是否到达顶部
			if(!this.$el.is(':animated')){//判断是否在运动状态
				this.$el.animate({//执行动画效果
					scrollTop:opts.dest
				},opts.speed);
			}
		}
	};

	ScrollTo.prototype.go = function () {
		var dest = this.opts.dest;//指向调用方法的对象本身，临时缓存

		if($(window).scrollTop()!= dest){//判断是否到达顶部
			this.$el.scrollTop(dest);//指向调用方法的对象本身
		}
	};

	return {//返回是个对象
		ScrollTo:ScrollTo
	};
});