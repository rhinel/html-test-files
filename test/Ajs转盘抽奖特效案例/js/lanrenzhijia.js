// 代码整理：懒人之家 lanrenzhijia.com
     
     /*
      * 删除左右两端的空格
      */
     function Trim(str){
         return str.replace(/(^\s*)|(\s*$)/g, ""); 
     }
     
        /*
         * 定义数组
         */
        function GetSide(m,n){
            //初始化数组
            var arr = [];
            for(var i=0;i<m;i++){
                arr.push([]);
                for(var j=0;j<n;j++){
                    arr[i][j]=i*n+j;
                }
            }
            //获取数组最外圈
            var resultArr=[];
            var tempX=0,
             tempY=0,
             direction="Along",
             count=0;
            while(tempX>=0 && tempX<n && tempY>=0 && tempY<m && count<m*n)
            {
                count++;
                resultArr.push([tempY,tempX]);
                if(direction=="Along"){
                    if(tempX==n-1)
                        tempY++;
                    else
                        tempX++;
                    if(tempX==n-1&&tempY==m-1)
                        direction="Inverse"
                }
                else{
                    if(tempX==0)
                        tempY--;
                    else
                        tempX--;
                    if(tempX==0&&tempY==0)
                        break;
                }
            }
            return resultArr;
        }
        
       var index=0,           //当前亮区位置
       prevIndex=0,          //前一位置
       Speed=300,           //初始速度
       Time,            //定义对象
       arr = GetSide(5,5),         //初始化数组
         EndIndex=0,           //决定在哪一格变慢
         tb = document.getElementById("tb"),     //获取tb对象 
         cycle=0,           //转动圈数   
         EndCycle=0,           //计算圈数
        flag=false,           //结束转动标志 
        quick=0;           //加速
        btn = document.getElementById("btn1")
        
        function StartGame(){
	     clearInterval(Time);
         cycle=0;
         flag=false;
         EndIndex=Math.floor(Math.random()*16);
         //EndCycle=Math.floor(Math.random()*4);
         EndCycle=1;
         Time = setInterval(Star,Speed);
        }
        
        function Star(num){
            //跑马灯变速
            if(flag==false){
              //走五格开始加速
             if(quick==5){
                 clearInterval(Time);
                 Speed=50;
                 Time=setInterval(Star,Speed);
             }
             //跑N圈减速
             if(cycle==EndCycle+1 && index==parseInt(EndIndex)){
                 clearInterval(Time);
                 Speed=300;
                 flag=true;       //触发结束			 
                 Time=setInterval(Star,Speed);
             }
            }
            
            if(index>=arr.length){
                index=0;
                cycle++;
            }
            
           //结束转动并选中号码
		   //trim里改成数字就可以减速，变成Endindex的话就没有减速效果了
         if(flag==true && index==parseInt(Trim('5'))-1){ 
          quick=0;
          clearInterval(Time);
            }
            tb.rows[arr[index][0]].cells[arr[index][1]].className="playcurr";
            if(index>0)
                prevIndex=index-1;
            else{
                prevIndex=arr.length-1;
            }
            tb.rows[arr[prevIndex][0]].cells[arr[prevIndex][1]].className="playnormal";
            index++;
            quick++;
            
        }