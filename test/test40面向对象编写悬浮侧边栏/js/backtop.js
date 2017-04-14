define(['jquery','scrollto'],function ($,scrollto) {
	function BackTop(el,opts){//建立构造函数，存储默认参数，存储变量，构造滚动函数
		this.opts = $.extend({}, BackTop.DEFAULTS, opts);
		this.$el = $(el);
		this.scroll = new scrollto.ScrollTo({
			dest: 0,
			speed: this.opts.speed
		});

		this._checkposition();//初始检查

		if(this.opts.mode=='move'){//绑定事件，点击滚动
			this.$el.on('click',$.proxy(this._move,this));
		}else{
			this.$el.on('click',$.proxy(this._go,this));
		}
		
		$(window).on('scroll',$.proxy(this._checkposition,this));//绑定事件，滚动就检查

	}

	BackTop.DEFAULTS = {//默认参数
		mode:'move',
		pos: $(window).height(),
		speed: 800
	};

	BackTop.prototype._move = function() {
		this.scroll.move();
	};

	BackTop.prototype._go = function () {
		this.scroll.go();
	};

	BackTop.prototype._checkposition = function () {
		if($(window).scrollTop() > this.opts.pos){
			this.$el.fadeIn();
		}else{
			this.$el.fadeOut();
		}
	};

	$.fn.extend({
		backtop: function(opts) {
			return this.each(function() {
				new BackTop(this, opts);
			});
		}
	});

	return{
		BackTop:BackTop
	};

});