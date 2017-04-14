var can;//画布
var ctx;//画面

var w;//画布宽
var h;//画布高

var padLeft = 100;//图片左间距
var padTop = 100;//图片上间距
var girlWidth = 600;//图片宽
var girlHeight = 300;//图片高

var deltaTime;
var lastTime;

var girlPic = new Image();//初始化女孩图片
var starPic = new Image();//初始化星星图片

var stars = [];
var num = 30;

var alive = 0;

var switchy = false;

function init() {//初始化函数
	can = document.getElementById("canvas");//获取画布元素
	ctx = can.getContext("2d");//获取2d画面

	w = can.width;//取得画布宽
	h = can.height;//取得画布高

	document.addEventListener('mousemove', mousemove, false);

	girlPic.src = "src/girl.jpg";//加载女孩图片
	starPic.src = "src/star.png";//加载星星图片

	for (var i = 0; i < num; i++) {
		stars[i] = new starObj();
		stars[i].init();
	}

	lastTime = Date.now();
	gameLoop();//初始化完成后运行渲染函数
}

	function gameLoop() {//渲染函数
		window.requestAnimFrame(gameLoop);//根据性能自调用渲染函数
		var now = Date.now();
		deltaTime = now - lastTime;
		lastTime = now;

		fillCanvas();//渲染背景
		drawGirl();//渲染女孩
		drawStars();
		aliveUpdate();
	}

		function fillCanvas() {//渲染背景函数
			ctx.fillStyle = "#393550";
			ctx.fillRect(0, 0, w, h);
		}
		function drawGirl() {//渲染女孩函数
			ctx.drawImage(girlPic, padLeft, padTop, girlWidth, girlHeight);
		}

	function mousemove(e) {
		if (e.offsetX || e.layerX) {

			var px = e.offsetX == undefined ? e.layerX : e.offsetX;
			var py = e.offsetY == undefined ? e.layerY : e.offsetY;

			if (px > padLeft && px < (padLeft + girlWidth) && py > padTop && py < (padTop + girlHeight)) {
				switchy = true;
			} else {
				switchy = false;
			}
		}
	}