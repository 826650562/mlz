<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
     String url = request.getParameter("url");
     request.setAttribute("url",url);
     pageContext.setAttribute("basePath", request.getContextPath()) ;
 %>
<!doctype html>
<html>
<head>

<link href="../public/layui/css/layui.css" rel="stylesheet" title="" type="text/css" />
<link href="../public/css/selfLayout.css" rel="stylesheet" title="" type="text/css" />
<link href="css/tzgg.css" rel="stylesheet" title="" type="text/css" />
<script src="../public/js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="../public/layui/layui.js" type="text/javascript"></script>
<style type="text/css">
html,body{padding:0px;margin:0px;}
</style>
</head>

<body>
<div class="tzgg_new_cont">
<form class="layui-form" action="">


  <div class="layui-form-item">
    <label class="layui-form-label" style="width:40px;">标题</label>
    <div class="layui-input-block" style="    margin-left: 70px;">
      <input type="text" name="title" lay-verify="title" id="tzgg_title" autocomplete="off" placeholder="请输入标题" class="layui-input">
    </div>
  </div>



 <div class="fuwenben">
 <div style="margin-bottom: 20px; width: 570px;">
  <textarea class="layui-textarea" id="tzgg_context" style="display: none"></textarea>
 </div>  
 </div>
 
</form>
</div>
<script type="text/javascript">
layui.use(['form','layedit','element'], function(){
    var element = layui.element()
	,layedit = layui.layedit 
	,form = layui.form()
	,$ = layui.jquery;
	element.on('nav(demo)', function(elem){
	  layer.msg(elem.text());
    });    
//图片上传
	layedit.set({
	  uploadImage: {
	    url:'${basePath}/app/home/addimg',
	    type: 'post' //默认post
	  }
	});
	
//自定义工具栏
  layedit.build('tzgg_context', {
    tool: ['strong', 'italic', '|', 'left', 'center', 'right','image']
    ,height: 200
  });		          
});
</script>
</body>
</html>
