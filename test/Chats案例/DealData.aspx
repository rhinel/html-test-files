<%@ Import Namespace="System.Collections.Generic" %>
<%@ Page Language="C#" ContentType="text/html" ResponseEncoding="gb2312" %>
<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {        
        string strAction = System.Web.HttpUtility.UrlDecode(Request["action"]);
        string strName = System.Web.HttpUtility.UrlDecode(Request["name"]);
        string strPass = System.Web.HttpUtility.UrlDecode(Request["pass"]);
        string strContent = System.Web.HttpUtility.UrlDecode(Request["content"]);
        switch (strAction)
        {
            case "Login":
                Response.Clear();
                Response.Write(UserLogin(strName,strPass));
                Response.End();
                break;
            case "ChatList":
                Response.Clear();
                Response.Write(AllChatList());
                Response.End();
                break;
            case "OnLineList":
                Response.Clear();
                Response.Write(GetOnlineUserList());
                Response.End();
                break;
            case "SendContent":
                Response.Clear();
                Response.Write(AddSendContent(strContent));
                Response.End();
                break;
        }
    }
    /// <summary>
    /// 用户登录
    /// </summary>
    /// <param name="strName"></param>
    /// <returns></returns>
    private bool UserLogin(string strName, string strPass)
    {
        bool blnR = false;
        if (strPass == "123")//初始化密码
        {
            List<string> OnLineUserList = (List<string>)Application["OBJUSERLIST"];
            if (OnLineUserList == null)//对象为NULL
            {
                OnLineUserList = new List<string>();//实例化对象
                OnLineUserList.Add(strName);//新增对象元素
            }
            else
            {
                OnLineUserList.Add(strName);//新增对象元素
            }
            Application["OBJUSERLIST"] = OnLineUserList;
            Session["LOGINUSER"] = strName;
            blnR = true;
        }
        return blnR;
    }
    /// <summary>
    /// 新增发送内容
    /// </summary>
    /// <param name="strContent"></param>
    /// <returns></returns>
    private bool AddSendContent(string strContent)
    {
        string name = Session["LOGINUSER"].ToString();
        string strSendConent = name + " 于 " + DateTime.Now.ToLongTimeString().ToString() + " 说: " + strContent;
        List<string> strSendConentList = (List<string>)Application["OBJMESSAGELIST"];
        if (strSendConentList == null)
        {
            strSendConentList = new List<string>();
        }
        strSendConentList.Add(strSendConent);
        Application["OBJMESSAGELIST"] = strSendConentList;
        return true;
    }
    /// <summary>
    /// 获取全部聊天记录
    /// </summary>
    /// <returns></returns>
    private string AllChatList()
    {
        string strSendConent = string.Empty;
        List<string> strSendConentList = (List<string>)Application["OBJMESSAGELIST"];
        if (strSendConentList == null)
        {
            strSendConent = "日前还没有找到聊天记录";
        }
        else
        {
            foreach (string str in strSendConentList)
            {
                strSendConent += str + "</br>";
            }
        }
       strSendConent= strSendConent.Replace("<:", "<img src='Face/");
       strSendConent=strSendConent.Replace(":>", ".gif '/>");
       return strSendConent;
    }
    /// <summary>
    /// 获取在线人员列表
    /// </summary>
    /// <returns></returns>
    private string GetOnlineUserList()
    {
        string strOnLineUserListHtml = string.Empty;
        List<string> strOnLineUserList = (List<string>)Application["OBJUSERLIST"];
        if (strOnLineUserList == null)
        {
           strOnLineUserList = new List<string>();
        }
        foreach (string str in strOnLineUserList)
        {
            strOnLineUserListHtml += str + "</br>";
        }
        return strOnLineUserListHtml;
    }   
</script>
