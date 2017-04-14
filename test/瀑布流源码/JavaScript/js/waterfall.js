var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'},{'src':'5.jpg'},{'src':'6.jpg'},{'src':'7.jpg'},{'src':'8.jpg'},{'src':'9.jpg'},{'src':'10.jpg'}]};
var datanum=0;//用于储存 增加到数据元素的第几个。
var pinHArr=[];//用于存储 每列中的所有块框相加的高度。
var pinHArrMaxH=0;//用于存储 最长列最后一个元素的高。 
var oParent=document.getElementById('main');//父级对象。
var aPin=oParent.getElementsByClassName('pin');// 获取存储块框pin的数组aPin
var iPinW=aPin[0].offsetWidth;// 一个块框pin的宽
var num=Math.floor(document.documentElement.clientWidth/iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
var flag=true;//判断是否可继续请求

window.onload=function(){
    waterfall();
    window.onscroll=function(){

    	datanum=datanum>=dataInt.data.length?0:datanum;//用来模拟无限滚动,data的数据是无限的
        
        if (checkscrollside() && datanum<dataInt.data.length && flag){//如果滚到底了，并且data还没加载完，继续加载
        	flag=false;
            var ing = new Image();
            ing.src='./images/'+dataInt.data[datanum].src;
            ing.onload=function(){
                var _divpin = document.createElement("div");
                _divpin.className='pin';
                var _divbox = document.createElement("div");
                _divbox.className='box';
                _divbox.appendChild(ing);
                _divpin.appendChild(_divbox);
                oParent.appendChild(_divpin);
                //oParent.innerHTML+='<div class="pin"><div class="box"><img src='+ing.src+' '+'/></div></div>';
                newpic(-1);
                datanum++;
                console.log(_divpin);
                flag=true;
                console.log(datanum);
            };
        }
    };
    window.onresize=function(){
    	waterfall();
    };
};

//重排页面
function waterfall(){
	num=Math.floor(document.documentElement.clientWidth/iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
	oParent.style.cssText='width:'+iPinW*num+'px;margin:0 auto;';
    pinHArr=[];//重排时候重置数组
    for(var i=0;i<aPin.length;i++){//遍历数组aPin的每个块框元素
    	newpic(i);
    }
}

//遍历元素的状态属性
function newpic(type){
    aPin=oParent.getElementsByClassName('pin');
	var aPinlength=type+1?type+1:aPin.length;
	var _aPin=aPin[aPinlength-1];
	var pinH=_aPin.offsetHeight;
	if(aPinlength<=num){
		pinHArr[aPinlength-1]=pinH;
		_aPin.style.cssText='';
	}else{
		var minH=Math.min.apply(null,pinHArr);//数组pinHArr中的最小值minH
        var minHIndex=pinHArr.indexOf(minH);
        _aPin.style.cssText='position:absolute;top:'+minH+'px;left:'+aPin[minHIndex].offsetLeft+'px;';
        pinHArr[minHIndex]+=pinH;//更新添加了块框后的列高，此时为重排最新值
        if(pinHArr[minHIndex]==Math.max.apply(null,pinHArr)){//更新最下面一个元素的高
        	pinHArrMaxH=pinH;
        }
	}
	oParent.style.height=Math.max.apply(null,pinHArr)+'px';
}

//判断是否滑动到底部
function checkscrollside(){
    var lastPinH=Math.max.apply(null,pinHArr)-pinHArrMaxH/2;//真正的最下面的一个
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    var documentH=document.documentElement.clientHeight;//视窗高度
    return (!lastPinH || (lastPinH<(scrollTop+documentH)))?true:false;//到达指定高度后 返回true，触发waterfall()函数
}