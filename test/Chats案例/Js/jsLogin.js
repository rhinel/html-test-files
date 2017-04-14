/// <reference path="../Jscript/jquery-1.4.2-vsdoc.js"/>
/// <reference path="../Jscript/jquery-1.4.2.js"/>
$(function() {
    //元素绑定全局ajaxStart事件
    $("#divMsg").ajaxStart(function() {
        $(this).show(); //显示元素
    })
    //元素绑定全局ajaxStop事件
    $("#divMsg").ajaxStop(function() {
        $(this).html("请求处理已完成。").hide();
    })
    $("#Button1").click(function() { //按钮点击事件
        var $name = $("#txtName"); //用户名
        var $pass = $("#txtPass"); //密码
        if ($name.val() != "" && $pass.val() != "") {
            UserLogin($name.val(), $pass.val());
        }
        else {
            if ($name.val() == "") {
                alert("用户名不能为空!");
                $name.focus();
                return false;
            } else {
                alert("密码不能为空!");
                $pass.focus();
                return false;
            }
        }
    })
});

function UserLogin(name, pass) {
    $.ajax({
        type: "POST",
        url: "DealData.aspx",
        data: "action=Login&d=" + new Date() + "&name=" + name + "&pass=" + pass,
        success: function(data) {
            if (data == "True") {
                window.location = "ChatMain.html";
            }
            else {
                alert("用户名或密码错误!");
                return false;
            }
        }
    });
}