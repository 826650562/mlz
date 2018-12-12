<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
     String url = request.getParameter("url");
     request.setAttribute("url",url);
 %>
<!doctype html>
<html>
<head>
<link href="../public/layui/css/layui.css" rel="stylesheet" title="" type="text/css" />
<link href="../public/css/selfLayout.css" rel="stylesheet" title="" type="text/css" />
<link href="css/xxsb.css" rel="stylesheet" title="" type="text/css" /><!----信息上报css---->
<script src="../public/js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="../public/layui/layui.js" type="text/javascript"></script>
<style type="text/css">
html,body{padding:0px;margin:0px;}
</style>
</head>

<body>

<div class="xllx_add_cont">

 
 
 <div class="xxsb_search_box">
 
 <form class="layui-form" action="">
 
 <div class="layui-form-item">
     <div class="xxsb_time_input">
       <input class="layui-input" placeholder="开始时间" id="xxsb_kssj" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
       <span class="timeImg"><img src="images/rltb.png" width="20" height="20"></span>
     </div>
<!--      <div class="xxsb_time_jiantou"> <img src="images/lsxxjt1.png" width="18" height="4"></div> -->
     <div class="xxsb_time_input">
       <input class="layui-input" placeholder="结束时间" id="xxsb_jssj" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
       <span class="timeImg"><img src="images/rltb.png" width="20" height="20"></span>
     </div>
  </div>   
     
     
     
<div class="layui-form-item">
    <label class="layui-form-label">上报人：</label>
    <div class="layui-input-block">
      <input type="text" name="title" lay-verify="title" autocomplete="off" id="sbr" placeholder="请输入" class="layui-input">
    </div>
  </div>
     
   
   
   <div class="layui-form-item">
    <div class="bqbox" id="xxsb_test">
     
    </div>  
  </div>
   
 <div class="layui-form-item">
    <label class="layui-form-label">上报内容：</label>
    <div class="layui-input-block">
      <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入" id="sbnr" class="layui-input">
    </div>
  </div>  
     
</form>    
     
</div>
 
 
 

</div>
	<script type="text/javascript">
		layui.use([ 'form', 'element','laydate' ], function() {
			var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块
			var form = layui.form();
			var laydate = layui.laydate;
		});
	</script> 
</body>
</html>
