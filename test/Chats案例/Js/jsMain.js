/// <reference path="../Jscript/jquery-1.4.2-vsdoc.js"/>
/// <reference path="../Jscript/jquery-1.4.2.js"/>
$(function() {
    //元素绑定全局ajaxStart事件
    $("#divMsg").ajaxStart(function() {
        $(this).show(); //显示元素
    })
    //元素绑定全局ajaxStop事件
    $("#divMsg").ajaxStop(function() {
        $(this).html("已完成").hide();
    })
    InitFace();
    GetMessageList();
    GetOnLineList();

    $("#Button1").click(function() { //按钮点击事件
        var $content = $("#txtContent"); //发送内容
        if ($content.val() != "") {
            SendContent($content.val());
        }
        else {
            alert("发送不能为空!");
            $content.focus();
            return false;
        }
    });

    $("table tr td img").click(function() { //表情图标单击事件
        var strContent = $("#txtContent").val() + "<:" + this.id + ":>";
        $("#txtContent").val(strContent);

    })
});
//******************************************
//自定义发送聊天内容函数
//参数 content 为聊天内容
//******************************************
function SendContent(content) {
    $.ajax({
        type: "POST",
        url: "DealData.aspx",
        data: "action=SendContent&d=" + new Date() + "&content=" + content,
        success: function(data) {
            if (data == "True") {
                GetMessageList();
                $("#txtContent").val("");
            }
            else {
                alert("发送失败!");
                return false;
            }
        }
    });
}
//******************************************
//自定义返回聊天内容函数
//参数 data 为返回的聊天内容数据
//******************************************
function GetMessageList() {
    $.ajax({
        type: "POST",
        url: "DealData.aspx",
        data: "action=ChatList&d=" + new Date(),
        success: function(data) {
            $("#divContent").html(data);
        }
    });
    AutoUpdContent(); //执行定时获取函数
}
//******************************************
//自定义返回在线人员函数
//参数 data 为返回的在线人员数据
//******************************************
function GetOnLineList() {
    $.ajax({
        type: "POST",
        url: "DealData.aspx",
        data: "action=OnLineList&d=" + new Date(),
        success: function(data) {
            $("#divOnLine").html(data);
        }
    });
}
//******************************************
//自定义设置表情图标函数
//无参数
//******************************************
function InitFace() {
    var strHTML = "";
    for (var i = 1; i <= 10; i++) {
        strHTML += "<img src='Face/" + i + ".gif ' id='" + i + "'/>";
    }
    $("#divFace").html(strHTML);
}
//******************************************
//自定义定时执行返回聊天内容与在线人员函数
//无参数
//******************************************
function AutoUpdContent() {
    setTimeout(GetMessageList, 5000);
    setTimeout(GetOnLineList, 6000);
}