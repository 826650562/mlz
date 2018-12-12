<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.mlight.chat.service.config.ServiceConfig" %>
<%
    pageContext.setAttribute("basePath", request.getContextPath());
    String fillpath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+ request.getContextPath() +"/";
    pageContext.setAttribute("fillpath", fillpath);
 %>
 <!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>无标题文档</title>
    <link href="${basePath }/mx/public/layui/css/layui.css" rel="stylesheet" title="" type="text/css" />
    <link href="${basePath }/mx/public/css/selfLayout.css" rel="stylesheet" title="" type="text/css" />
    <link href="${basePath }/mx/gztc/css/gztc.css" rel="stylesheet" title="" type="text/css" />
    <!----巡逻路线css---->
    <script src="${basePath }/mx/public/js/jquery-1.11.1.min.js" type="text/javascript"></script>
    <script src="${basePath }/mx/public/layui/layui.js" type="text/javascript"></script>
    <style type="text/css">
    html,
    body {
        padding: 0px;
        margin: 0px;
    }
    </style>

</head>
<script>
   layui.use('laydate', function() {
			var laydate = layui.laydate;
		});
</script>
<body>
    <form class="layui-form" action="">
        <div class="gztc_new_cont">
            <ul>
                <li>
                    <div class="gztcNewCont_txt"> 要素名称：</div>
                    <div class="gztcNewCont_input">
                        <input type="text" class='layui-input  fName' placeholder="名称在18个字符以内" class="layui-input">
                    </div>
                </li>
                
                   <li>
                    <div class="gztcNewCont_txt"> 推送距离：</div>
                    <div class="gztcNewCont_input" >
                       <select name="inJjqy" lay-verify="required">
								<option value=""></option>
								<option value="100">100米</option>
								<option value="200">200米</option>
								<option value="300">300米</option>
							</select>
                        
                    </div>
                </li>
                
                <li>
                    <div class="gztcNewCont_txt"> 要素位置：</div>
                    <div class="gztcNewCont_input">
                        <div class="gztc_pen_tool addgztc point"><img src="${basePath }/mx/gztc/images/dot.png" width="30" height="30"></div>
                       <%--  <div class="gztc_pen_tool addgztc polyline"><img src="${basePath }/mx/gztc/images/line.png" width="30" height="30"></div>
                        <div class="gztc_pen_tool addgztc polygon"><img src="${basePath }/mx/gztc/images/mian.png" width="30" height="30"></div> --%>
                    </div>
                </li>
           <!--   
                <li>
                    <div class="gztcNewCont_txt"> 采集时间：</div>
                     <div class="gztcNewCont_input">
                        <input type="text" placeholder="请输入" class="layui-input  fdate" onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
                    </div>
                </li> -->
                 <li>
                    <div class="gztcNewCont_txt"> 采集人：</div>
                     <div class="gztcNewCont_input">
                        <input type="text" placeholder="名称在10个字符以内" class="layui-input fcjpeo">
                    </div>
                </li>
                            <!-- 添加图片 -->
                   <li>
                   <div class="gztcNewCont_txt"> 要素图片：</div>
                   <div class="gztc_slt"> <img src="${basePath}/mx/gkrw/images/xyr.png"></div>
                      <div class="gztc_shachun" >
                        <input type="file" name="file" lay-type="images" class="layui-upload-file" onclick="upload_imgForGZTC(this)"></form>
                      </div>
                   </li>  
                         
                   <li>
                    <div class="gztcNewCont_txt"> 要素内容：</div>
                     <div class="gztcNewCont_input">
                     <textarea placeholder="内容在500个字符以内" class="layui-textarea" id="gznr"></textarea>
                    </div>
                   </li>
            </ul>
        </div>
    </form>
    <script>
   	jQuery(document).ready(function() {
		layui.use(["form"], function() {
			layui.form();
		});
		window.Myimg=null;
		 layui.use([ 'upload' ], function() {
					layui.upload({
						url : '${basePath}/app/home/addimg', //上传接口
						success : function(res) { //上传成功后的回调
							window.Myimg.attr('src', res.data.src);
						}
					});
				});
		    upload_imgForGZTC = function(e) {
			   window.Myimg = $(e).parents(".gztc_shachun").siblings('.gztc_slt').find("img");
			}
			window.parent.MXZH.effectController.ojbs.addEventListener();
/* 		
		var gztc = new window.parent.MXZH.Gztc();
		gztc.init();
		gztc.dealWithEventListner(); */
	})
    </script> 
    
</body>

</html>
 