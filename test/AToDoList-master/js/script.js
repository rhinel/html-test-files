//绑定事件
function addListener(element, type, listener) {
    if(element.addEventListener) {
        element.addEventListener(type,listener,false);
    }
    else if(element.attachEvent) {
        element.attachEvent("on" + type,listener);
    }
    else {
        element["on" + type] = listener;
    }
}
//用 class 获取元素
function getElementsByClass(className,context) {
    context = context || document;
    if(document.getElementsByClassName) {
        return context.getElementsByClassName(className);
    }
    else {
        var i;
        var arr = [];
        var elements = context.getElementsByTagName("*");
        for (i in elements) {
            if(hasClass(className,elements[i])) {
                arr.push(elements[i]);
            }
        }
        return arr;
    }
}

//判断一个元素有没有给定的class
function hasClass(className,ele) {
    if(!ele.className) {//如果元素根本没有class,退出.
        return false;
    }
    var classNames = ele.className.split(/\s+/);
    for (var i = 0; i < classNames.length; i++) {
        if(className === classNames[i]) {
            return true;
        }
    }
}

//通过属性名查找元素
function getElementsByAttr(attr,context) {
    var elements;
    var match = [];

    if(document.all) {
        elements = context.all;
    }
    else {
        elements = context.getElementsByTagName("*");
    }

    attr = attr.replace(/\[|\]/g,"");//去掉中括号

    if(attr.indexOf("=") == -1) {//没有等于号的情况
        for (var i = 0; i < elements.length; i++) {
            if(elements[i].getAttribute(attr)) {
                match.push(elements[i]);
            }
        }
    }
    else {//有等于号的情况
        attrArr = attr.split("=");
        for (var j = 0; j < elements.length; j++) {
            if(elements[j].getAttribute(attrArr[0]) === attrArr[1]) {
                match.push(elements[j]);
            }
        }
    }

    return match;        
}

//转换为数组
function convertToArray(nodes) {
    var array;
    try {
        array = Array.prototype.slice.call(nodes,0);
    } catch (ex) {
        array = [];
        for(var i in nodes) {
            array.push(nodes[i]);
        }
    }
    return array;
}

// 实现一个简单的Query
function $(selector,context) {
    var element = [];
    current = context || document;

    function query(ele,current) {
        var firstLetter = ele.charAt(0);
        switch (firstLetter) {
            case "#": return current.getElementById(ele.slice(1));
                break;
            case ".": return getElementsByClass(ele.slice(1),current);
                break;
            case "[": return getElementsByAttr(ele,current);
                break;
            default : return current.getElementsByTagName(ele);
                break;

        }
    }

    //因为参数之间的分割是空格,没有逗号,所以 arguments 的长度是1
    //这一步把参数用空格分割开
    var arg = selector.split(/\s+/);
    //console.log(arg);

    for (var i = 0; i < arg.length; i++) {
        if(i == 0) {
            //把结果保存在数组里.
            //getElementsByClassName() getElementsByTagName() 返回的是类数组的对象,但不是数组.不能直接运用数组方法.需要类型转换
            if(arg[i][0] == "#") {
                element = element.concat(query(arg[i],current));
            }
            else {
                element = element.concat(convertToArray(query(arg[i],current)));
            }
        }
        else {
            var temp = [];
            var result = [];
            for(var j in element) {
                // current = element[j];
                temp = convertToArray(query(arg[i],element[j]));
                if(temp.length) {
                    result = result.concat(convertToArray(temp));
                }
            }
            element = result;
            result = [];   
        }
    }
    //如果输入的选择器中最后一个是 id ,就输出第一个元素.因为 id 唯一.
    if(arg[arg.length-1][0] == "#") {
        return element[0];
    }
    else {
        return element;
    }
}

// 为element增加一个样式名为newClassName的新样式
function addClass(newClassName,element) {
    if(newClassName){
        if(element.className == "") {
            element.className = newClassName;
        }
        else if(hasClass(newClassName,element)) {
            return;
        }
        else {
            element.className += " " + newClassName;
        }
    }
}

// 移除element中的样式oldClassName
function removeClass(oldClassName,element) {
    if(oldClassName){
        var removeClassName = new RegExp(oldClassName);
        element.className = element.className.replace(removeClassName,"");
    }
}

//后一个兄弟元素
function nextSibling(node) {
    var tempLast = node.parentNode.lastChild;
    if (node == tempLast) return null;
    var tempObj = node.nextSibling;
    while (tempObj.nodeType != 1 && tempObj.nextSibling != null) {
        tempObj = tempObj.nextSibling;
    }
    return (tempObj.nodeType==1)? tempObj:null;
}

//前一个兄弟元素
function prevSibling(node) {
    var tempFirst = node.parentNode.firstChild;
    if (node == tempFirst) return null;
    var tempObj = node.previousSibling;
    while (tempObj.nodeType != 1 && tempObj.previousSibling != null) {
        tempObj = tempObj.previousSibling;
    }
    return (tempObj.nodeType==1)? tempObj:null;
}

//设置任务内容元素尺寸
function setWidth(){
    var task = $(".task");
    // console.log(task[0]);
    var contentBox = $("#contentBox");
    // console.log(contentBox);
    for (var i in task) {
        if(task[i].style.display === "block") {
            if(task[i].offsetWidth < 400) {
            task[i].style.width = "400px";
            }
            else if(task[i].offsetWidth >= 400){
                task[i].style.width = contentBox.offsetWidth + "px";
            }
        }
    }

    //设置任务编辑窗口的大小
    var editWindow = $("#editWindow");
    if(editWindow) {
        // console.log(editWindow);

        editWindow.style.width = contentBox.offsetWidth + "px";
        editWindow.getElementsByTagName("textarea")[0].style.height = contentBox.offsetHeight - 94 + "px";
        var input = editWindow.getElementsByTagName("input");
        input[0].style.width = input[1].style.width = contentBox.offsetWidth - 102 + "px";
    }
    
}

//一开始就手动触发 resize 来设置 .task宽度
setWidth();
window.onresize = setWidth;

//点击显示任务内容
function todoItemToggle(){
    var todoItem = $(".todoItem");
    for (var i in todoItem) {
        todoItem[i].onclick = function(){
            for(var j in todoItem) {
                // todoItem[j].style.outline = "";
                todoItem[j].style.backgroundColor = "";
            }
            // this.style.outline = "1px solid blue";
            this.style.backgroundColor = "#ADD8E6";
            var task = $(".task");
            for (var i in task) {
                if(task[i].style.display == "block") {
                    task[i].style.display = "none";
                    break;
                }
            }
            var next = nextSibling(this);
            if(next){
                next.style.display = "block";
            }
            setWidth();
            // console.log(next);
        }
    }
}
todoItemToggle();

//定义取消冒泡事件函数
function cancelBubble(e) { 
    var evt = e ? e : window.event; 
    if (evt.stopPropagation) { 
    //W3C 
    evt.stopPropagation(); 
    } 
    else { 
    //IE 
    evt.cancelBubble = true;
    }
}

//分类列表的子列表点击显示内容
function taskItemToggle(){
    var taskItem = $(".taskItem");
    for (var i in taskItem) {
        taskItem[i].onclick = function(){
            //把所有任务取消选择状态
            for(var j in taskItem) {
                if(hasClass("selectedTaskItem",taskItem[j])) {
                    taskItem[j].className = taskItem[j].className.replace(" selectedTaskItem","");
                }
            }
            //隐藏所有时间的任务
            var taskDate = $(".taskDate");
            // console.log(taskDate);
            for(var i in taskDate) {
                if(taskDate[i].style.display == "block") {
                    taskDate[i].style.display = "none";
                }
                // taskDate[i].onhover = function(e){
                //     cancelBubble(e);
                // }
            }
            //把当前任务的内容显示出来,并标记当前任务为选中状态
            var thisContent = getElementsByClass("taskDate", this)[0];
            // console.log(thisContent);
            if(thisContent){
                thisContent.style.display = "block";
            }
            this.className += " selectedTaskItem";
            // setWidth();
        }
    }
}

taskItemToggle();

//任务分类列表,点击展开,再点击关闭
function folderToggle(){
    var taskFolder = $(".taskFolder");
    for(var k in taskFolder) {
        taskFolder[k].onclick = function(){
            if(hasClass("folderOpen",this)) {
                this.className = this.className.replace(" folderOpen","");
            }
            else {
                for(var i in taskFolder) {
                    if(hasClass("folderOpen",taskFolder[i])) {
                        taskFolder[i].className = taskFolder[i].className.replace(" folderOpen","");
                    }
                }
                this.className += " folderOpen";
            }

            
        }
    }
}

folderToggle();

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str) {
    str = str.replace(/^\s*|\s*$/g, "");//删除首尾空格
    return str = str.replace(/\s+/g, " ");//删除中间多余空格
}

//刷新项目数
function refreshTaskItemNum(){
    var taskItemNum = $(".taskItemNum");
    for(var i in taskItemNum) {
        var parentEle = nextSibling(taskItemNum[i].parentNode);
        // console.log(parentEle);
        taskItemNum[i].innerHTML = getElementsByClass("taskItem", parentEle).length;
    }
}

refreshTaskItemNum();

//刷新任务数
function refreshTodoItemNum (){
    var todoItemNum = $(".todoItemNum");
    for(var i in todoItemNum) {
        var parentEle = todoItemNum[i].parentNode;
        // console.log(parentEle);
        todoItemNum[i].innerHTML = getElementsByClass("todoItem", parentEle).length;
    }
}

refreshTodoItemNum();

//完成 按钮的事件处理函数
function taskDone(){
    var doneBtn = $(".doneBtn");
    for(var i in doneBtn) {
        doneBtn[i].onclick = function(){
            if(!hasClass("done",this.parentNode)){
                var message = confirm("确定完成任务了?");
                if (message){
                    this.parentNode.className += " done";
                    if(!hasClass("done",prevSibling(this.parentNode))){
                        prevSibling(this.parentNode).className += " done";
                    }
                    prevSibling(this).style.visibility = "hidden";
                }
            }
        }
    }
}
taskDone();

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

//为"所有" "未完成" "已完成" 按钮添加事件函数
(function(){
    var displayAll = $("#all");
    var displayUnDone = $("#unDone");
    var displayAllDone = $("#allDone");

    
    //为当前点击的按钮增加active 类
    function toggleActive(event){
        event = event || window.event;
        var taskListBox = $("#taskListBox");
        var btn = $("div",taskListBox);
        if(!hasClass("active",getEventTarget(event))) {
            for(var i in btn) {
                removeClass("active", btn[i]);
            }
            addClass("active",getEventTarget(event));
        }
    }

    function hideSelected(){
        var selectedTask = $(".selectedTaskItem .todoItem");
        for(var i in selectedTask) {
            if(nextSibling(selectedTask[i])){
                nextSibling(selectedTask[i]).style.display = "none";
            }
            selectedTask[i].style.display = "none";
        }
    }

    displayAll.onclick = function(){
        //为当前点击的按钮增加active 类
        toggleActive();
        //点击"所有"按键时,显示选中任务下的所有子任务
        $(".selectedTaskItem .taskDate")[0].style.display = "block";
        var selectedTask = $(".selectedTaskItem .todoItem");
        for(var i in selectedTask) {
            if(nextSibling(selectedTask[i])){
                // nextSibling(selectedTask[i]).style.display = "block";
                selectedTask[i].style.display = "block";
            }
            

        }
    }

    displayUnDone.onclick = function(){
        //为当前点击的按钮增加active 类
        toggleActive();
        //先显示所有,再把完成的隐藏
        displayAll.onclick();
        var allDone = $(".done");
        for(var i in allDone) {
            allDone[i].style.display = "none";
        }
    }

    displayAllDone.onclick = function(){
        //为当前点击的按钮增加active 类
        toggleActive();
        //先隐藏所有,再把完成的显示
        hideSelected();
        var allDone = $(".done");
        for(var i in allDone) {
            if(allDone[i].nodeName.toLowerCase() === "h3") {
                allDone[i].style.display = "block";
            }
        }
    }
})();

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str) {
    str = str.replace(/^\s*|\s*$/g, "");//删除首尾空格
    return str = str.replace(/\s+/g, " ");//删除中间多余空格
}

//点击 编辑 按钮弹出编辑窗口;定义相关按钮事件
function editTask(){
    var editBtn = getElementsByClass("edit");
    for (var i in editBtn) {
        editBtn[i].onclick = function(){

            //创建 编辑窗口 
            var editWindow = document.createElement("div");
            editWindow.id = "editWindow";
            //创建 几个输入框和按钮
            var taskHead = document.createElement("input");
            var taskDeadline = document.createElement("input");
            var taskContent = document.createElement("textarea");
            var submitBtn = document.createElement("input");
            var cancelBtn = document.createElement("input");    

            taskHead.type = "text";
            taskHead.className = "taskHead";
            taskHead.autofocus = "autofocus";
            taskHead.value = this.parentNode.getElementsByTagName('h3')[0].innerHTML;
            if(!taskHead.value) {
                taskHead.placeholder = "输入标题";
            }
            
            //点击编辑按钮时,如果完成日期有内容,就把编辑窗口内容设为完成日期
            //点击新建按钮时,如果没有完成日期,就把当天作为默认完成日期
            taskDeadline.type = "text";
            taskDeadline.className = "taskDeadline";
            taskDeadline.value = this.parentNode.getElementsByTagName('span')[2].innerHTML;
            if(!taskDeadline.value){
                taskDeadline.placeholder = "完成日期: " + getToday();
            }
            

            taskContent.className = "taskContent";
            var taskContentValue = this.parentNode.getElementsByTagName('p')[0].innerHTML;
            taskContent.value = trim(taskContentValue);
            if(!taskContent.value) {
                taskContent.placeholder = "输入内容";
            }
            
            submitBtn.type = "button";
            submitBtn.className = "submitBtn";
            submitBtn.value = "确定";
            submitBtn.disabled = "disabled";//确定按钮默认是禁用的.通过内容检查后才启用

            cancelBtn.type = "button";
            cancelBtn.className = "cancelBtn";
            cancelBtn.value = "取消";
            //将 输入框和按钮 放入 编辑窗口
            editWindow.appendChild(taskHead);
            editWindow.appendChild(taskDeadline);
            editWindow.appendChild(taskContent);
            editWindow.appendChild(submitBtn);
            editWindow.appendChild(cancelBtn);
            //将 编辑窗口 放到任务div.task 父元素的最后面,也是div.task 的 nextSlibing
            this.parentNode.parentNode.appendChild(editWindow);
            //设置元素尺寸
            setWidth();

            taskHead.onkeyup = function(){
                check();
            }
            // taskContent.onkeyup = function(){
            //     check();
            // }

            //截止日期的格式检查
            taskDeadline.onblur = function() {
                console.log("blur");
                if(!/\d{4}-\d{1,2}-\d{1,2}/.test(taskDeadline.value)) {
                    taskDeadline.style.border = "2px solid red";
                    if(taskDeadline.value.indexOf("请") == -1) {
                        taskDeadline.value += '          请按照格式: "YYYY-MM-DD" 输入日期!';
                    }
                }
                else {
                    taskDeadline.style.border = "";
                }

                check();
            }
            

            //重新focus的时候删掉提示文字
            taskDeadline.onfocus = function() {
                console.log("focus");
                if(taskDeadline.value.indexOf('请按照格式: "YYYY-MM-DD" 输入日期!') > -1) {
                    taskDeadline.value = taskDeadline.value.replace(/\s+请按照格式: "YYYY-MM-DD" 输入日期!/,"");
                    // console.log("wuuuu");
                }
                else if(!taskDeadline.value) {
                    taskDeadline.value = getToday();
                }
            }

            taskHead.onkeyup = check;
            taskContent.onkeyup = check;

            //取消按钮的事件函数
            var cancelBtn = getElementsByClass("cancelBtn",editWindow)[0];
            var body = document.getElementsByTagName("body")[0];
            cancelBtn.onclick = function(){
                var message = confirm("确定放弃任务?");
                if(message) {
                    // editWindow.style.display = "none";
                    editWindow.parentNode.removeChild(editWindow);
                    //检查是否有空的任务
                    checkTask();
                    //检查是否有空的日期
                    checkTodayTask();
                    //刷新任务数
                    refreshTodoItemNum();
                }
            }

            if(submitBtn.disabled) {
                submitBtn.style.color = "#ccc";
                // console.log("disabled");
            }

            var taskContainer = this.parentNode;
            submitBtn.onclick = function(){
                var h3 = taskContainer.getElementsByTagName("h3")[0];

                h3.innerHTML = prevSibling(taskContainer).innerHTML = taskHead.value;
                taskContainer.getElementsByTagName("h4")[0].childNodes[1].innerHTML 
                    = taskDeadline.value;
                taskContainer.getElementsByTagName("p")[0].innerHTML 
                    = taskContent.value;

                editWindow.parentNode.removeChild(editWindow);
            }
            //检查是否所有输入框都有填写
            function check(){
                if(taskHead.value && (taskDeadline.value && taskDeadline.style.border != "2px solid red")) {
                    submitBtn.disabled = "";
                    submitBtn.style.color = "#333";
                }
                else {
                    submitBtn.disabled = "disabled";
                    submitBtn.style.color = "#ccc";
                }
            }

            //检查是否有空的日期
            function checkTodayTask(){
                var dd = document.getElementsByTagName("dd");
                for(var i = 0, len = dd.length; i < len; i++) {
                    if(!dd[i].innerHTML) {
                        dd[i].parentNode.removeChild(prevSibling(dd[i]));
                        dd[i].parentNode.removeChild(dd[i]);
                        break;
                        //此处如果不break,会出错.getElementsByTagName 得到的是个动态的数组,删掉一个内容以后,下一次循环时数组已经改变了

                    }
                }
            }

            //检查是否有空的任务
            function checkTask(){
                var p = document.getElementsByTagName("p");
                for(var i = 0,len = p.length; i < len; i++) {
                    // console.log(p[i].innerHTML);
                    if(!p[i].innerHTML) {
                        p[i].parentNode.parentNode.removeChild(prevSibling(p[i].parentNode));
                        p[i].parentNode.parentNode.removeChild(p[i].parentNode);
                        break;
                    }
                }
            }
        }
    }
}
editTask();

//创建 input 函数
function createInput(className,placeholder){
    var input = document.createElement("input");
    input.type = "text";
    input.className = className;
    input.placeholder = placeholder;
    input.autofocus = "autofocus";
    input.style.display = "block";
    input.style.height = "23px";

    return input;
}

//新建文件夹 事件处理函数
(function(){
    var newFolder = $("#newFolder");
    var classifyList = $("#classifyList");
    newFolder.onclick = function(){
        //先用一个input来输入文件夹名,然后用dt替换;
        var temp = createInput("taskFolder","新建文件夹");
        var dl = $("dl",classifyList)[0];
        dl.appendChild(temp);

        var dt = document.createElement("dt");
        dt.className = "taskFolder";

        var span = document.createElement("span");
        span.className = "taskItemNum";
        span.innerHTML = 0;

        var dd = document.createElement("dd");
        dd.className = "taskFolderContent";

        temp.onkeydown = function(event){
            event = event || window.event;
            if(event.keyCode) {
                if(event.keyCode == 13) {
                    temp.blur();
                }
            }
        }

        temp.onblur = function(){
            if(!temp.value) {
                temp.value = temp.placeholder;
            }

            dt.innerHTML = temp.value + "(";
            dt.appendChild(span);
            dt.innerHTML += ")";
            
            dl.removeChild(temp);
            dl.appendChild(dt);
            dl.appendChild(dd);

            folderToggle();
            dt.click();
        }
    }
})();

//新建项目 事件处理函数
(function(){
    var newItem = $("#newItem");
    newItem.onclick = function(){
        var selectedTaskItem = $(".folderOpen")[0];
        var parentEle = selectedTaskItem ? nextSibling(selectedTaskItem) : nextSibling($(".taskFolder")[0]);
        var temp = createInput("taskItem", "新建项目");

        parentEle.appendChild(temp);
        if(!hasClass("folderOpen",prevSibling(parentEle))) {
            prevSibling(parentEle).click();

        }

        var div = document.createElement("div");
        div.className = "taskItem";

        var span = document.createElement("span");
        span.className = "todoItemNum";
        span.innerHTML = 0;

        var dl = document.createElement("dl");
        dl.className = "taskDate";

        temp.onkeydown = function(event){
            event = event || window.event;
            if(event.keyCode) {
                if(event.keyCode == 13) {
                    temp.blur();
                }
            }
        }

        temp.onblur = function(){
            if(!temp.value) {
                temp.value = temp.placeholder;
            }

            div.innerHTML = temp.value + "(";
            div.appendChild(span);
            div.innerHTML += ")";
            div.appendChild(dl);

            parentEle.removeChild(temp);
            parentEle.appendChild(div);

            refreshTaskItemNum();
            taskItemToggle();
            folderToggle();
        }
    }
})();

//新建任务 按钮事件处理函数
(function(){
    var newTask = $("#newTask");
    newTask.onclick = function(){

        //得到旧的editWindow,如果有,说明有新建的任务,退出.防止多次点击.
        var oldEditWindow = document.getElementById("editWindow");
        if(oldEditWindow){
            return false;
        }

        var selectedTaskItem = $(".selectedTaskItem")[0];
        var parentEle = selectedTaskItem || $(".taskItemDefault")[0];
        addClass("folderOpen",prevSibling(parentEle.parentNode));
        parentEle.click();
        
        //用today保存新建任务时候的日期.
        var today = getToday();
        
        // console.log(today);
        var dl = $(".taskDate",parentEle)[0];
        var dt = $("dt",dl);
        // console.log(dt[0]);
        //如果现存的日期中有today,就在目前的日期设为容器.否则,新建一个 today 日期设为容器
        var container = null;
        for(var i in dt) {
            if(dt[i].innerHTML === today) {
                container = nextSibling(dt[i]);
                break;
            }
        }
        if(!container) {
            var _dt = document.createElement("dt");
            _dt.innerHTML = today;
            var dd = document.createElement("dd");
            dl.appendChild(_dt);
            dl.appendChild(dd);
            container = dd;
        }

        var h3 = document.createElement("h3");
        h3.className = "todoItem";
        h3.innerHTML = "新任务";

        var div = document.createElement("div");
        div.className = "task";

        var span1 = document.createElement("span");
        span1.className = "edit";
        span1.title = "编辑任务";
        var span2 = document.createElement("span");
        span2.className = "doneBtn";
        span2.title = "完成任务";
        var h3_2 = document.createElement("h3");
        h3_2.innerHTML = "";
        h3_2.placeholder = "新任务";
        var h4 = document.createElement("h4");
        h4.innerHTML = "任务日期: ";
        h4.appendChild(document.createElement("span"));
        var p = document.createElement("p");

        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(h3_2);
        div.appendChild(h4);
        div.appendChild(p);

        // console.log(container);
        container.appendChild(h3);
        container.appendChild(div);

        //任务点击展开
        todoItemToggle();
        //刷新任务数目
        refreshTodoItemNum();
        //设置宽度
        setWidth();
        //显示任务内容
        h3.click();
        //为完成按钮和编辑按钮添加事件处理函数
        taskDone();
        editTask();
        //显示编辑窗口,编辑任务
        span1.click();
    }
})();

function getToday(){
    var now = new Date();
    var today = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
    return today;
}
