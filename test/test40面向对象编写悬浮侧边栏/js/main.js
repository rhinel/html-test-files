requirejs.config({//配置
	paths:{
		jquery:'jquery-1.8.3.min'
	}
});

requirejs(['jquery','backtop'], function ($,backtop) {//引入其他模块，前面是文件名，后面参数是代表模块名字


//封装插件的写法
	$('#backtop').backtop({
		mode:'move',
	});


//不封装插件的写法
/*	new backtop.BackTop($('#backtop'), {
		mode:'move',
		pos:100,
		speed:2000
	});*/



/*没有模块化实现——————————————————————————————————————————————————————*/
//没有backtop模块的，scrolltop模块的引入

/*	requirejs(['jquery','backtop'], function ($,backtop) {
	var scroll = new scrollto.ScrollTo({//从scrollto模块取出ScrollTo函数
		dest:0,
		speed:2000
	});


	$('#backtop').on('click',$.proxy(scroll.move,scroll));//$.proxy(函数，目标指向)方法，修改函数this的指向

	}
*/



/*没有模块化实现——————————————————————————————————————————————————————*/
//没有模块化的实现滚动
/*	$(window).on('scroll',function(){
		checkposition($(window).height());
	});
	checkposition($(window).height());

	function move(){
		$('html, body').animate({
			scrollTop:0
		},800);
	}

	function go(){
		$('html, body').scrollTop(0);
	}*/

//没有模块话的实现检查是否显示
/*	function checkposition(pos){
		if($(window).scrollTop()>pos){
			$('#backtop').fadeIn();
		}else{
			$('#backtop').fadeOut();
		}
	}*/
});