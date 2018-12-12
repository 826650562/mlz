<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.mlight.chat.service.config.ServiceConfig"%>
<%
	pageContext.setAttribute("basePath", request.getContextPath());
	String fillpath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ request.getContextPath() + "/";
	pageContext.setAttribute("fillpath", fillpath);
	String ipPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
	pageContext.setAttribute("ipPath", ipPath);
	// 防止缓存           
	//Forces caches to obtain a new copy of the page from the origin server    
	response.setHeader("Cache-Control", "no-cache");
	//Directs caches not to store the page under any circumstance    
	response.setHeader("Cache-Control", "no-store");
	//HTTP 1.0 backward compatibility     
	response.setHeader("Pragma", "no-cache");
	//Causes the proxy cache to see the page as "stale"    
	response.setDateHeader("Expires", 0);
%>
<!doctype html>
<html>
<head>
<script type="text/javascript">
	var username = "${session['sessionUser'].name}";
	var userid = "${session['sessionUser'].id}";
</script>
<script type="text/javascript"
	src="${basePath }/mx/public/js/jquery-1.11.1.min.js"></script>

<%@include file="public/general.jsp"%>

<script type="text/javaScript" charset="utf-8"
	src="${basePath }/mx/jsxx/js/PTTHandler.js"></script>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>梅陇镇安全生产监管信息系统</title>
<!-- <link rel="icon" href="mx/public/images/logo.ico" type="image/x-icon" /> -->
<link href="mx/lsxx/css/lsxx.css" rel="stylesheet" title=""
	type="text/css" />
<!----历史信息css---->
<link href="mx/xllx/css/xllx.css" rel="stylesheet" title=""
	type="text/css" />
<!----跟控任务css---->
<link href="mx/gkrw/css/gkrw.css" rel="stylesheet" title=""
	type="text/css" />
<!----巡逻路线css---->
<!-- <link href="mx/dzwl/css/dzwl.css" rel="stylesheet" title=""
	type="text/css" /> -->
<link href="mx/lsgj/css/lsgj.css" rel="stylesheet" title=""
	type="text/css" />
<!----历史轨迹css---->
<link href="mx/sswz/css/sswz.css" rel="stylesheet" title=""
	type="text/css" />
<!----感知图层css---->
<link href="mx/gztc/css/gztc.css" rel="stylesheet" title=""
	type="text/css" />
<!----实时位置css---->
<link href="mx/xxsb/css/xxsb.css" rel="stylesheet" title=""
	type="text/css" />
<!----信息上报css---->
<link href="mx/public/css/selfLayout.css" rel="stylesheet" title=""
	type="text/css" />
<link href="mx/public/css/jquery.scrollbar.css" rel="stylesheet"
	title="" type="text/css" />
<link href="mx/tzgg/css/tzgg.css" rel="stylesheet" title=""
	type="text/css" />
<link href="mx/jjqy/css/jjqy.css" rel="stylesheet" title=""
	type="text/css" />
<link href="mx/jkdx/css/jkdx.css" rel="stylesheet" title=""
	type="text/css" />
<link href="mx/tjfx/css/tjfx.css" rel="stylesheet" title=""
	type="text/css" />

<link href="mx/lsgj/css/traj-pointer.css" rel="stylesheet" title=""
	type="text/css" />

<!----通知公告css---->
<script type="text/javascript" src="${basePath }/mx/sswz/js/boxcall.js"></script>
<!-- 框选呼叫 -->
<script type="text/javascript" src="${basePath }/mx/sswz/js/sswz.js"></script>
<!-- 实时位置 -->
<script src="${basePath }/mx/tzgg/js/querytzgg.js"
	type="text/javascript"></script>
<!----------通知公告js------------>
<script src="${basePath }/mx/tzgg/js/tzggtk.js" type="text/javascript"></script>
<!----------通知公告js------------>
<script type='text/javascript' src='${basePath }/mx/sswz/js/index.js'></script>
<script type="text/javascript"
	src="${basePath}/mx/lsxx/js/chathistory.js"></script>
<script type="text/javascript" src="${basePath}/mx/lsxx/js/querychat.js"></script>
<script type="text/javascript" src="${basePath}/mx/lsxx/js/opentk.js"></script>
<script type="text/javascript" src="${basePath }/mx/public/map_index.js"></script>
<script type="text/javascript"
	src="${basePath }/mx/public/js/mqttws31.js"></script>
<script type="text/javascript" src="${basePath }/mx/record/recoder.js"></script>
<!-- 地图加载 -->
<script type="text/javascript" src="${basePath }/mx/lsgj/js/lsgj_v3.js" /></script>

<script type="text/javascript"
	src="${basePath }/mx/xxsb/js/queryxxsb.js" /></script>

<!-- 历史轨迹播放轴js -->
<script type="text/javascript"
	src="${basePath }/mx/lsgj/js/TrajPointer.js" /></script>
<script type="text/javascript" src="${basePath }/mx/lsgj/js/DrawAxis.js" /></script>

<script type="text/javascript"
	src="${basePath }/mx/public/js/base64.min.js"></script>

<!-- 企业信息js -->
<%-- <script type="text/javascript" src="${basePath }/mx/qyxx/js/qyxxData.js"></script> --%>
<script type="text/javascript" src="${basePath }/mx/qyxx/js/index.js"></script>
<!-- 企业信息js--end -->

<!-- 故事地图js -->
<script type="text/javascript" src="${basePath }/mx/gsdt/js/gsdtData.js"></script>
<script type="text/javascript" src="${basePath }/mx/gsdt/js/index.js"></script>
<!-- 故事地图js --end -->

<!-- 安全状况js -->
<script type="text/javascript" src="${basePath }/mx/aqzk/js/aqzkData.js"></script>
<script type="text/javascript" src="${basePath }/mx/aqzk/js/index.js"></script>
<!-- 安全状况js --end -->
<!-- layui -->
<script type="text/javascript" src="${basePath }/mx/public/layui/layui.js"></script>
<!-- layui  end -->
<script type="text/javascript">
	var base_url = "${applicationScope.uploadUrl}",
		uploadUrl = "${applicationScope.uploadUrl}/commander/app/sendimg";
	var basepath = "${fillpath}",
		imagePath = "${applicationScope.accessUrl}",
		uploadUrl = "${applicationScope.uploadUrl}/commander/app/sendimg",
		accessUrl = base_url;

	IM.username = "${session['sessionUser'].username}";
	IM.token = "${session['sessionUser'].password}";
	//是否开启打印
	MXZH.showLog = true;
</script>
<style>
.black_overlay {
	display: none;
	position: absolute;
	top: 0%;
	left: 0%;
	width: 100%;
	height: 100%;
	background-color: black;
	z-index: 1001;
	-moz-opacity: 0.7;
	opacity: .70;
	filter: alpha(opacity = 70);
}

.white_content {
	display: none;
	position: absolute;
	text-align: center;
	top: 50%;
	margin-top: -350px;
	width: 700px;
	height: 700px;
	left: 50%;
	margin-left: -350px;
	z-index: 1002;
	overflow: auto;
}

.demo {
	position: absolute;
	top: 70px;
	right: 18px;
	width: 300px;
	/* margin: 35px auto 10px auto; */
	background: #fff;
	border-bottom-radius: 4px;
	/* float: left; */
	z-index: 10;
	height: 122px;
}

.closeme {
	width: 40px;
	z-index: 10000;
	height: 40px;
	text-align: center;
	line-height: 38px;
	border-radius: 30px;
	background: #333;
	position: absolute;
	top: 15px;
	right: 15px;
	opacity: 0.8;
}

.closeme:hover {
	opacity: 0.7;
}

.closeme:active {
	opacity: 0.5;
}

.pres {
	width: 44px;
	height: 44px;
	position: absolute;
	top: 50%;
	left: 15px;
	z-index: 10000;
	opacity: 0.8;
	margin-top: -22px;
	background: #333;
	border-radius: 30px;
}

.pres:hover {
	opacity: 0.7;
}

.pres:active {
	opacity: 0.5;
}

.nexts {
	width: 44px;
	height: 44px;
	position: absolute;
	top: 50%;
	right: 15px;
	z-index: 10000;
	background: #333;
	opacity: 0.8;
	margin-top: -22px;
	border-radius: 30px;
}

.nexts:hover {
	opacity: 0.7;
}

.nexts:active {
	opacity: 0.5;
}

.iframeCont {
	line-height: 100%;
	text-align: center;
}

.imgconts {
	width: 700px;
	height: 700px;
	position: relative;
	line-height: 700px;
	float: left;
	text-align: center;
}

.imgconts img {
	max-height: 100%;
	max-width: 100%;
	border: none;
}

.dijitSliderImageHandle {
	margin: 0;
	padding: 0;
	position: relative !important;
	border: 6px solid #25A162;
	width: 0;
	height: 0;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	border-radius: 8px;
}

.dijitSliderProgressBar {
	background-color: #25A162;
	z-index: 1;
}

.dijitSliderBottomBumper, .dijitSliderLeftBumper {
	background-color: #25A162;
}

.tsTmp {
	background-color: #002130;
	opacity: 0.7;
}
.layui-form-select .layui-input {
    width: 85px;
}
.dijitButton {
	margin: 0 1px 0 1px;
	vertical-align: middle;
	cursor: pointer !important;
}

.dijitButton:hover {
	opacity: 0.8;
}

.dijitButton:active {
	opacity: 1;
}

.dijitButtonNode {
	border: 1px solid gray;
	margin: 0;
	line-height: normal;
	vertical-align: middle;
	text-align: center;
	white-space: nowrap;
	height: 40px;
	width: 40px;
	background-color: #01465e;
}

.dijitSliderRemainingBarH {
	width: 100% !important;
	background-color: #fff;
}

.esriTimeSlider .tsPlayButton {
	background-position: -54px 8px;
}

.esriTimeSlider .tsButton {
	width: 26px;
	height: 37px;
	background-image: url("${basePath }/mx//public/images/timebarxtb.png");
}

.esriTimeSlider .tsPrevButton {
	background-position: -82px 8px;
}

.esriTimeSlider .tsNextButton {
	background-position: 6px 8px;
}

.esriTimeSlider .tsPauseButton {
	background-position: -23px 8px;
}

.scalebar_bottom-left {
	left: 25px;
	bottom: 7px;
}

.dijitSliderRightBumper {
	background-color: #fff;
}

.dijitRuleMark {
	position: absolute;
	border: 1px solid #8AABA3 line-height: 0;
	height: 100%;
}

.esriTimeSlider .tsTicks {
	height: 6px;
	margin-bottom: -5px;
}

.dijitRuleLabelH {
	position: relative;
	left: -50%;
	color: #aaa;
}

.esriTimeSlider .ts {
	padding: 5px 3px 3px 3px;
	margin: -9px 10px 0 10px;
}

.esriPopup .titlePane {
	background-color: #00212F;
}

.slider_box {
	width: 280px;
	height: 70px;
	margin-left: 7px;
	border-bottom: 1px solid #DDDDDD;
}

.slider_btn_box {
	margin-top: 12px;
	width: 280px;
}

.slider_btn_ok {
	width: 45px;
	height: 30px;
	border-radius: 4px;
	border: 1px solid #407add;
	background: #407add;
	color: #fff;
	float: right;
}

.slider_btn_reset {
	width: 45px;
	height: 30px;
	border-radius: 4px;
	border: 1px solid #407add;
	background: #fff;
	color: #407add;
	float: right;
}

.slider {
	padding-top: 33px;
	width: 170px;
	float: right;
}

.slider_text {
	width: 95px;
	float: left;
	padding-top: 26px;
}

div.set_box>ul>li {
	padding-right: 0px;
}

.nav_img>img {
	margin-right: 10px;
}

.nav_img {
	padding-top: 25px;
}

.nav_img span {
	margin-right: 10px;
	vertical-align: middle;
	color: #fff;
}

.slider_btn_box button {
	margin-left: 10px;
}

.esriPopup .sizer {
	width: auto;
}

.title {
	width: 260px;
	height: 33px;
	background: #002130;
	border-radius: 3px;
	color: #fff;
	line-height: 33px;
	padding-left: 10px;
	font-size: 14px;
	opacity: 0.9;
}

.esriPopup .titlePane {
	background-color: #002130;
}

.esriPopup .titleButton.close {
	right: 13px;
	top: 8px;
}

.esriPopup .contentPane {
	padding: 0px;
	font-size: 13px;
	line-height: 24px;
}

.esriPopup .actionsPane {
	padding: 0px;
}

.esriPopup a {
	/* color: #fff; */
	color: #57abff;
	text-decoration: underline;
}

.esriTimeSlider {
	z-index: 999;
	position: absolute;
	left: 610px;
	bottom: 20px;
}

.esriPopup .pointer, .esriPopup .outerPointer {
	background: #01465e;
}
.esriPopup .contentPane {
	position: relative;
	max-height: 600px;
	overflow: auto;
	padding: 0px;
	background-color: #01465e;
	color: #333333;
}
.alert_content{
	height:auto;
}
.search_select {
	display: block;
	width: 35%;
	padding-left: 10px;
	background: #003548;
	color: #fff;
	border: 1px solid #005675;
	float: left;
	height: 38px;
}

.layui-input, .layui-textarea {
	display: block;
	width: 33%;
	padding-left: 10px;
	background: #003548;
	color: #fff;
	border: 1px solid #005675;
	float: left;
}

.lsgj_input{
    width:100%;
}
.layui-form-select{
position:static !important;
}
.layui-form-select dl{
background-color:#01465e;
left:0;
min-width:50%;
color:white;
}
.layui-form-select dl dd:hover{
background-color:#003548;
}
.xjwl .layui-input, .layui-textarea{
width:99%;
}
.alert_content > ul > li{
height:auto;
min-height:14px;
}
.esriScalebar{
z-index:9;
}
.ifr{
position:absolute;
padding: 30px 0 0 0;
top:0;
left:1px;
border:0;
width:100%;
height:100%;
overflow:hidden;
z-index:10;
display:none;
}
.mainLeftOnOff{
z-index:9;
}
.shade{
width:100%;
height:100%;
background-color:white;
position:absolute;
top:0;
left:0;
display:flex;
justify-content:center;
align-items:center;
z-index:10;
}
.shade img{
width: 32px;
height: 32px;
justify-content:center;
align-items:center;
}
.layout_right{
background:url(images/bodybg.jpg) repeat;
}
.tklicont{background: #01465e;color: #cecece;}
.border .z-row{border-bottom:1px dashed white; }
.border .z-row:nth-child(1){border:none;}
.border .z-row .z-col{text-align:center;}
.layui-laypage a, .layui-laypage span{border: 1px solid #01465e;background-color: #01465e;color: #fbf7f7;cursor:pointer;}
.border .z-row:nth-child(10){text-align:center;border:none;margin-top: 10px;}
.linkForMore{
border:1px solid white;
border-radius:6px;
width:200px;
height:30px; 
text-decoration: none !important;
color: white !important;
margin-left:114px;
background-color: #006f97;
line-height: 30px;
text-align: center;
}
</style>
<!-- 注意：如果你直接复制所有代码到本地，上述js路径需要改成你本地的 -->
<script type="text/javascript">
/* 	var base_url = "${applicationScope.uploadUrl}",
		uploadUrl = "${applicationScope.uploadUrl}/commander/app/sendimg";
	var basepath = "${fillpath}",
		imagePath = "${applicationScope.accessUrl}",
		uploadUrl = "${applicationScope.uploadUrl}/commander/app/sendimg",
		accessUrl = base_url,
		CallFlag = "",
		RoomId = "",
		hasRoom = false,
		ConfirmLayero = "",
		CallMode = "",
		BoxCall = false,
		BfcpFlag = false,
		INDEX = "",
		LogOut = false;
	IM.username = "${session['sessionUser'].username}";
	IM.token = "${session['sessionUser'].password}"; */
</script>
<script>
	layui.use('element', function() {
		var element = layui.element();
		element.on('nav(demo)', function(elem) {
			layer.msg(elem.text());
		});
	});
</script>
</head>
<body id="mlightbody">
	<!--top start-->
	<div class="layout_top">
		<div class="topbarcenter"></div>
		<div class="topbartext">梅陇镇安全生产成果展示</div>
	</div>
	<!--left start-->
	<div class="layout_left">
		<ul>
			<li class='qyxx'><a href="#">
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb1.png" width="40" height="30">
					</div>
					<div class="navTxt">企业信息</div>
			</a></li>

			<li class='sswz'><a href="#">
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb2.png" width="40" height="30">
					</div>
					<div class="navTxt">人员信息</div>
			</a></li>

			<li class='lsgj'><a href="#">
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb3.png" width="40" height="30">
					</div>
					<div class="navTxt">轨迹追踪</div>
			</a></li>
			<li class='gsdt'><a href="#">
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb4.png" width="40" height="30">
					</div>
					<div class="navTxt">历史记录</div>
			</a></li>
		<!-- 	<li class='aqzk'><a href="#">
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb5.png" width="40" height="30">
					</div>
					<div class="navTxt">区域安全</div>
			</a></li> -->
<!-- 
			<li class='gztc'><a href="#">
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb6.png" width="40" height="30">
					</div>
					<div class="navTxt">重点检查</div>
			</a></li> -->
			
			<!-- <li class='xxsb' id="gztj"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">工作统计</div>
			</a></li> -->
			<li class='hyaq' id="hyaq"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">行业安全</div>
			</a></li>
			<li class='lzfx' id="lzfx"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">履职分析</div>
			</a></li>
			<!-- <li class='zdfx' id="zdfx"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">重点分析</div>
			</a></li> -->
			<!-- <li class='aqxs' id="aqxs"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">安全形势</div>
			</a></li> -->
		<!-- 	<li class='qdtj' id="qdtj"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb8.png" width="40" height="30">
					</div>
					<div class="navTxt">签到统计</div>
			</a></li> -->
		<!-- 	<li class="gzpm" id="gzpm"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">工作排名</div>
			</a></li>
			<li class="ryjc" id="ryjc"><a href="#">
					<div class="newMessage"></div>
					<div class="navXtb">
						<img src="mx/public/images/gh/navxtb7.png" width="40" height="30">
					</div>
					<div class="navTxt">人员检查</div>
			</a></li> -->
		</ul>
	</div>

	<!--right start-->
	<div class="layout_right">
		<iframe id="ifr" class="ifr"  src="#" ></iframe>
		<div class="shade" id="shade">
			<img src="mx/lsxx/images/loading.gif" >
		</div>
		<div class="mainLeft">
			<div class="leftPanel1">
				<!--历史消息 start-->
				<div class="leftPanel1_Main lsxx_Panel1">
					<h3 class="lsxx_title">历史消息查询</h3>
					<div class="lsxx_search_box">
						<div class="lsxx_time_input">
							<input class="layui-input" id="starttime" style="width:100%" placeholder="开始时间"
								onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
							<span class="timeImg"><img
								src="${basePath }/mx/lsxx/images/rltb.png" width="20"
								height="20"></span>
						</div>
						<div class="lsxx_time_input">
							<input class="layui-input" id="endtime" style="width:100%" placeholder="结束时间"
								onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
							<span class="timeImg"><img
								src="${basePath }/mx/lsxx/images/rltb.png" width="20"
								height="20"></span>
						</div>
						<div class="search">
							<div class="search_input">
								<input type="text" name="number" placeholder="人名、组名"
									id="ls_conditions" class="layui-input"
									style="border-top-right-radius:0px;border-bottom-right-radius:0px;">
							</div>
							<div class="search_btn1">
								<button class="layui-btn layui-btn-normal" id="query"
									style="border-top-left-radius:0px;border-bottom-left-radius:0px;">搜索</button>
							</div>
						</div>
					</div>
					<div class="lsxx_resultCont">
						<ul id="chathistory">
						</ul>
					</div>
					<div class="lsxx_pagesbox" id="chatpage"></div>
				</div>
				<!--历史消息 end-->
				<!-- 企业信息开始 -->
				<div class="leftPanel1_Main qyxx_Panel1">
					<h3 class="lsxx_title">企业信息</h3>
					<div class="lsxx_search_box layui-form">
						<div class="search">
							<div class="search_input layui-inline ">
								<input type="text" name="number" placeholder="企业名称"
									id="ls_conditions_fx" class="layui-input"
									style="border-top-right-radius:0px;border-bottom-right-radius:0px;">
									<!-- <input type="text" name="number" placeholder="所属道路"
									id="ls_conditionsRoad_fx" class="layui-input"
									style="border-top-right-radius:0px;border-bottom-right-radius:0px;"> -->
								<div style="position: relative;display: block;float: left;width: 85px;">
									<select name="road" id="ls_conditionsRoad_fx" class="search_select" lay-verify="ls_conditionsRoad_fx" lay-search="">
								 
									</select>
								</div>
								<div style="position: relative;display: block;float: left;width: 85px;">
									<select name="city" id="fx_xiangzhen" class="search_select" lay-verify="required" lay-search="">
								 
									</select>
								</div>
								
							</div>
							<div class="search_btn1">    
								<button class="layui-btn layui-btn-normal" id="query_qyxx"
									style="border-top-left-radius:0px;border-bottom-left-radius:0px;">搜索</button>
							</div>
						</div>
					</div>
					<div class="yqxx_resultCont">
						<ul id="chathistory_qyxx">

						</ul>
					</div>
					<div class="lsxx_pagesbox" id="chatpage_qyxx"></div>
				</div>
				<!-- 企业信息结束 -->
				<!--历史轨迹 start-->
				<div class="leftPanel1_Main lsgj_Panel1">
					<h3 class="lsgi_title">历史轨迹查询</h3>
					<div class="lsgi_search_box">
						<div class="lsgi_time_input">
							<input class="layui-input lsgjlayui-input_bgtime"
								placeholder="开始时间" value=""  style="width:100%"
								onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
							<span class="timeImg"><img
								src="${basePath }/mx/lsgj/images/rltb.png" width="20"
								height="20"></span>
						</div>
						<%-- <div class="lsgi_time_jiantou">
							<img src="${basePath }/mx/lsgj/images/lsxxjt1.png" width="18"
								height="4">
						</div> --%>
						<div class="lsgi_time_input">
							<input class="layui-input lsgjlayui-input_endtime"
								value="" placeholder="结束时间"  style="width:100%"
								onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
							<span class="timeImg"><img
								src="${basePath }/mx/lsgj/images/rltb.png" width="20"
								height="20"></span>
						</div>
						<div class="search layui-form">
							<div class="search_input layui-inline">
								<input type="text" name="number" placeholder=""
									class="layui-input lsgj_input"
									style="border-top-right-radius:0px;border-bottom-right-radius:0px;">
									<!-- <select name="city" id="fx_xiangzhen_ryxx" class="search_select" lay-verify="">
								      </select>  -->
									
							</div>
							<div class="search_btn">
								<button class="layui-btn layui-btn-normal  lsgj_button"
									style="border-top-left-radius:0px;border-bottom-left-radius:0px;">搜索</button>
							</div>
						</div>



					</div>
					<form class="layui-form" action="">
						<div class="lsgi_resultCont">
							<ul class="lsgj_lu">

							</ul>
						</div>
					</form>

					<div class="gjzsBtnBox" style='display:none'>
						<div class="layui-btn" style="width:100%">轨迹展示</div>
					</div>
					<div class="lsgj_pagesbox" id='lsgj_pagesbox'></div>

				</div>
				<!--历史轨迹 end-->

				<!--警戒区域 start-->
				<div class="leftPanel1_Main aqzk_Panel1">
					<div class="layui-tab">
						<h3 class="aqzk_title">奉贤区安全状况</h3>
						<div class="layui-tab-content">
							<div class="layui-tab-item layui-show">
								<div class="jjqy_box1">
									<div>
										<span style="float:left">街道/镇</span><span style="float:right">指数</span>
									</div>
									<ul class="aqzk_contria">
									</ul>
								</div>
							</div>
							<div class="layui-tab-item">
								<div class="lsgj_pagesbox" id="jjqy_page"></div>
							</div>
						</div>
					</div>
				</div>
				<!--警戒区域 end-->

				<!--监控对象start-->
				<div class="leftPanel1_Main jkdx_Panel1">
					<h3 class="jkdx_title">监控对象分布</h3>
					<div class="jkdx_cont">
						<div class="jkdx_num">
							<span>对象总数：<strong></strong></span>
						</div>
						<div class="tj_title">类型分布</div>
						<div class="jkdx_tjtbox" id="jkdx_tjtbox"></div>
						<div class="tj_title">区域分布</div>
						<div class="jkdx_tjtbox" id="jkdx_tjtbox2"></div>
					</div>
				</div>
				<!--监控对象 end-->

				<!--跟控任务 start-->
				<div class="leftPanel1_Main gsdt_Panel1">
					<h3 class="sswz_title">历史记录回放</h3>

					<div class="popup popup-events" style="display:block">
						<div class="hd"></div>
						<div class="bd">
							<div class="scrollbar-inner">
								<ul class="timeline" style=" height: 3400px;">
								</ul>
							</div>
						</div>
					</div>


				</div>
				<!--跟控任务end-->


				<!--感知图层start-->
				<div class="leftPanel1_Main gztc_Panel1">
					<div class="layui-tab">
						<div class="layui-tab-content">
							<div class="layui-tab-item">
								<div id="gztc_box1" class="gztc_box1">
									<ul>

									</ul>
								</div>
							</div>
							<div class="layui-tab-item  layui-show">
								<form class="layui-form" action="">
									<div class="gztc_box2">
										<h3 class="lsxx_title">要素管理</h3>
										<div class="xjwl">
											<!-- 搜索 -->
											<div class="gztc__cxcont">
												<div class="gztc_cxboxTimeStart">
													<input type="text" placeholder="开始日期" class="layui-input"
														id="search_Begdate"
														onclick="layui.laydate({elem: this, istime: false, format: 'YYYY-MM-DD'})"><img
														src="mx/gkrw/images/rilixtb.png" width="20" height="20">
												</div>
												<div class="gztc_cxboxTimeLine">
													<img src="mx/gkrw/images/timejiantou.png" width="40"
														height="40">
												</div>
												<div class="gztc_cxboxTimeEnd">
													<input type="text" placeholder="结束日期" class="layui-input"
														id="search_enddate"
														onclick="layui.laydate({elem: this, istime: false, format: 'YYYY-MM-DD'})"><img
														src="mx/gkrw/images/rilixtb.png" width="20" height="20">
												</div>
											</div>
											<div class="gztc_cxcont">

												<div class="gztc_search">
													<div class="search_input" style='    width: 260px;'>
														<input type="text" id="gztc_seach_nr" name="number"
															placeholder=要素名称、内容 class="layui-input"
															style="border-top-right-radius:0px;border-bottom-right-radius:0px;">
													</div>
													<div class="gztc_search_button layui-btn">搜索</div>
												</div>

												<!-- 新建 -->
												<div class="layui-btn gztcButton">
													<i class="layui-icon" style=" font-size:20px;"></i>&nbsp;&nbsp;新建感知要素
												</div>
											</div>
										</div>
										<div id="gztc_all" class="gztc_all">
											<ul>

											</ul>
										</div>
									</div>
								</form>
								<div class="lsgj_pagesbox" id="gztc_page"></div>

							</div>
						</div>
					</div>
				</div>
				<!--感知图层 end-->

				<!--实时位置 start-->
				<div class="leftPanel1_Main sswz_Panel1">
					<h3 class="sswz_title">人员信息列表</h3>
					<div class="sswz_search_box">
						<div class="search">
							<div class="search_input">
								<input type="text" name="number" style="width: 100%;" placeholder="请输入群组名或者成员名"
									class="layui-input input_sswz"
									style="border-top-right-radius:0px;border-bottom-right-radius:0px;">
									<!-- 搜索 -->
						 
							</div>
							<div class="search_btn">
								<button class="layui-btn layui-btn-normal button_sswz"
									style="border-top-left-radius:0px;border-bottom-left-radius:0px;">搜索</button>
							</div>
						</div>
					</div>
					<div class="sswzCont">
						<div class="layui-collapse sswzCont_countent" lay-filter="test">

						</div>
					</div>
				</div>

			</div>





			<!--历史轨迹 start-->
			<div class="leftPanel2 lsgj_Panel2">
				<h3 class="lsgi_title"></h3>
				<div class="popup popup-events">
					<div class="bd">
						<div class="scrollbar-inner">
							<div id="all" style="padding: 5px 10px  0px 50px;">
								<!-- 起点处 -->
								<div class="begin" id="startPoint" style="height: 34px"></div>
								<div class="content" id="content"></div>
								<!-- 终点处 -->
								<div class="begin" id="endPoint" style="height: 34px"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="lsgj_croteller">
					<!-- <div class="bfbtn" _type="parse"><img src="mx/lsgj/images/bfxtb.png"></div>
			       <div class="resets"><img src="mx/lsgj/images/reset.png"></div> -->
					<div class="play_container">
						<div class="playbtn_container">
							<div class="playbtns">
								<div class="play_box" _type="parse"></div>
								<div class="div"></div>
								<div class="reset_box"></div>
							</div>
							<div class="range_box"></div>
						</div>
					</div>
				</div>
			</div>
			<!--历史轨迹  end-->
			<!-- 跟控任务第二栏start -->
			<div class="leftPanel2 gkrw_Panel2 leftPanel3_Main_gkrw"
				style="width:290px" id="gkrw_zrw"></div>
			<!-- 跟控任务第二栏end -->
			<!-- 跟控任务第三栏start -->
			<div class="leftPanel2  gkrw2_Panel2  leftPanel4"
				style="left:702px;width:360px">
				<h3 class="gkrwxttitle ellipsis">
					<div class="gkrwxttitleInner"></div>
				</h3>
				<div class="lsxx_detailCont">
					<ul class="gkrw_lt">

					</ul>
				</div>

				<div class="lsgj_pagesbox" id="gkrw_chat"></div>

			</div>
			<!-- 跟控任务第三栏end -->
		</div>

		<!-- 历史消息地图、视频、图片弹 框 start -->
		<div id="light" class="white_content">
			<a
				onclick="document.getElementById('imgconts').style.display='none';document.getElementById('contextxx').style.display='none';document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none';jQuery('#contextxx').attr('src','');jQuery('#imgconts').find('img').attr('src','');">
				<div class="closeme">
					<img src="${basePath }/mx/public/images/imgcolose.png" width="14"
						height="14" />
				</div>
			</a>
			<div>
				<a href="#" class="pres" id="pres"><img
					src="${basePath }/mx/public/images/imgprev.png" width="44"
					height="44" /></a> <a href="#" class="nexts" id="nexts"><img
					src="${basePath }/mx/public/images/imgnext.png" width="44"
					height="44" /></a>
			</div>
			<div style="width:100%;height:100%; overflow:hidden;">
				<iframe id="contextxx" class="iframeCont"
					style="width:100%;height:100%; overflow:hidden;border:none;">
				</iframe>
				<div class="imgconts" id="imgconts">
					<img>
				</div>
			</div>
		</div>

		<div id="fade" class="black_overlay"></div>
		<!--历史消息地图、视频、图片弹框 end-->
		<div class="mainRight">
		    
	        <div id='mymap' style="width:100%;height:100%; background: #ffffff;" ></div>
			<a href="#" class="mainLeftOnOff" id='mainLeftOnOff'><img
				sum_='2' src="mx/public/images/jiantouleft.png" width="15"
				height="15"></a>
			<div class="maptoolbarTopRight">
				<button id="add_originalTrack" _tag='NOshowOri'
					class="layui-btn layui-btn-primary layui-btn-small"
					style="display:none; margin:0px; border-radius:0px;background:#002130;opacity:1;">
					<i class="layui-icon"><img
						src="mx/public/images/hiddenpath.png" width="16" height="16"></i>
				</button>
				<button id="cjbutton" title='测距'
					class="layui-btn layui-btn-primary layui-btn-small"
					style="margin:0px; border-radius:0px;background:#002130;opacity:1;">
					<i class="layui-icon"><img src="mx/public/images/cejuxtb.png"
						width="15" height="15"></i>
				</button>
				<button title='全景' id="_fullView"
					class="layui-btn layui-btn-primary layui-btn-small"
					style="margin:0px; border-radius:0px;background:#002130;opacity:1;">
					<i class="layui-icon"><img src="mx/public/images/mapxtb.png"
						width="15" height="15"></i>
				</button>
			</div>
			<div class="villageCompanyTopRight">
				<div class="layui-collapse">
					<div class="layui-colla-item" id="villageCompanyTopRight" >
					    <h2 class="layui-colla-title" style="background:#002130;width:370px;"><i class="layui-icon layui-colla-icon rotate"></i>村公司</h2>
					    <div class="layui-colla-content layui-show" style="background:white;width:400px;padding:10px;height:180px;"><div class="villageCompany"></div></div>
					</div>
  				</div>
			</div>
			<div class="companyRoadTopRight">
				<div class="layui-collapse">
					<div class="layui-colla-item" id="companyRoadTopRight">
					    <h2 class="layui-colla-title" style="background:#002130;width:370px;"><i class="layui-icon layui-colla-icon rotate"></i>企业聚集道路</h2>
					    <div class="layui-colla-content layui-show" style="background:white;width:400px;padding:10px;height:212px;"><div class="companyRoad"></div></div>
					</div>
  				</div>
			</div>
			<div class="riskManageTopRight">
				<div class="layui-collapse">
					<div class="layui-colla-item" id="riskManageTopRight">
					    <h2 class="layui-colla-title" style="background:#002130;width:115px;"><i class="layui-icon layui-colla-icon rotate"></i>企业风险分级管控</h2>
					    <div class="layui-colla-content layui-show" style="background:white;width:145px;padding:10px;height:123px;">
					    	<div class='riskManage'>
						    	
					    	</div>
					    </div>
					</div>
  				</div>
			</div>
			<!-- http://localhost:8080/gkzh_zhd/home_home.action# -->
			<div class="maptoolbarBottomRight">
				<button class="layui-btn layui-btn-primary layui-btn-small"
					id="scal_top"
					style=" display:block; margin:0px; border-radius:0px; background:#002130;opacity:1;">
					<i class="layui-icon"><img src="mx/public/images/addxtb.png"
						width="15" height="15"></i>
				</button>
				<button class="layui-btn layui-btn-primary layui-btn-small"
					id="scal_up"
					style=" display:block; margin:0px;  border-radius:0px; background:#002130; opacity:1;">
					<i class="layui-icon"><img src="mx/public/images/jianxtb.png"
						width="15" height="15"></i>
				</button>
			</div>
			<div class="lsgjLabel" style="display: none;"></div>
			<div class="jjqyLabel" style="display: none;"></div>
		</div>
		<div id="timeslider_map"></div>
	</div>



	<!-- 统计分析所用页面 -->

	<div class="layout_right_2" style="display:none">
		<div class="tjfxbox">
			<div class="tjfxLeft">
				<div class="tjfx_box1">
					<div class="tjfxbox_title">
						<div class="tjfxbox_titleName">在侦数据</div>
					</div>
					<div class="tjfx_cont1">
						<ul>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb1.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconIng"></div>
									<div class="tjfx_zcitem_smalltxt">在侦任务数</div>
								</div>
							</li>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb2.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconIng"></div>
									<div class="tjfx_zcitem_smalltxt">在侦目标数</div>
								</div>
							</li>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb3.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconIng"></div>
									<div class="tjfx_zcitem_smalltxt">在侦小组数</div>
								</div>
							</li>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb4.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconIng"></div>
									<div class="tjfx_zcitem_smalltxt">在侦警员数</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="tjfx_box1">
					<div class="tjfxbox_title">
						<div class="tjfxbox_titleName">已结数据</div>
					</div>
					<div class="tjfx_cont1">
						<ul>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb1.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconEnd"></div>
									<div class="tjfx_zcitem_smalltxt">已结任务数</div>
								</div>
							</li>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb2.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconEnd"></div>
									<div class="tjfx_zcitem_smalltxt">已结目标数</div>
								</div>
							</li>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb5.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconEnd"></div>
									<div class="tjfx_zcitem_smalltxt">跟控总时长</div>
								</div>
							</li>
							<li>
								<div class="tjfx_zaizhenitem">
									<div class="tjfx_zcitem_tb">
										<img src="mx/tjfx/images/tjfx_xtb6.png" width="49" height="49">
									</div>
									<div class="tjfx_zcitem_bigtxt ReconEnd"></div>
									<div class="tjfx_zcitem_smalltxt">跟控总次数</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="tjfx_box3">
					<div class="tjfx_innerbox3">
						<div class="tjfx_box5">
							<div class="tjfxbox_title2">
								<div class="tjfxbox_titleName">三类人员统计</div>
							</div>
							<div class="sanlei" id="sanlei_chart"></div>
						</div>
					</div>
					<div class="tjfx_innerbox4">
						<div class="tjfx_box5">
							<div class="tjfxbox_title2">
								<div class="tjfxbox_titleName">核心区目标分布统计</div>
							</div>
							<div class="hexin"></div>
							<div class="hxqy" id="hxqy_chart"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="tjfxRight">
				<div class="tjfx_box2">
					<div class="tjfxbox_title2">
						<div class="tjfxbox_titleName">当日跟控数量统计</div>
					</div>
					<div class="gksl" id="gksl_tjfx"></div>
				</div>
				<div class="tjfx_box6">
					<div class="tjfxbox_title2">
						<div class="tjfxbox_titleName">跟控任务月度统计</div>
					</div>
					<div class='gkrwdata' id="gkrwydtj1"></div>
					<div class='gkrwdata' id="gkrwydtj2"></div>
				</div>
			</div>
		</div>
	</div>
	<!-- 统计分析所用页面 end -->




	<div class="layui-colla-item mygroup_div" style='display:none'>
		<h2 class="layui-colla-title">
			<strong class="ellipsis" title=""></strong> <span class='sumofgroup'><span>
					<i class="layui-icon layui-colla-icon"></i>
		</h2>
		<a href="#" class="layui-colla-title-right" title="群组定位"><img
			class='qzdwIcon' src="${basePath }/mx/sswz/images/dingweiGray.png"
			width="12" height="16"></a>
		<div class="layui-colla-content  sswz_qunzu">
			<ul class='mygrouplu'>
				<%--   --%>
			</ul>
		</div>
	</div>

	<li class="wxl_liForGroup">
		<div class="sswz_person_img">
			<img class='userIcon' src="${basePath }/mx/lsxx/images/tx1.png">
		</div>
		<div class="sswz_person_txt ellipsis"></div>
		<div class="sswz_person_red ellipsis">...</div>
		<div class="sswz_person_dingwei">
			<a href="#" title="单人定位"> <img
				src="${basePath }/mx/sswz/images/dingweiGray.png" class='drdwIcon'
				width="12" height="16"></a>
		</div>
	</li>

	<div class='audioPlay'></div>

	<div id="timeslider_map">
		<div id="timeSliderDiv"></div>
	</div>

	<script>
		/* 默认隐藏手风琴面板 lx */
		$("#villageCompanyTopRight").css({'display':'none'});
		$("#companyRoadTopRight").css({'display':'none'});
		$("#riskManageTopRight").css({'display':'none'});
		layui.use('laydate', function() {
			var laydate = layui.laydate;
		});
		$.ajax({
			url : "${basePath}/home_getQy_jiedao.action?time=" + new Date().getTime(),
			type : "post",
			dataType : "json",
			success : function(result) {
				var villageHtml='',roadHtml=''; //lx
				MXZH.effectController.loading(false);
				if(result.jiedao.length<0) return ;
				console.info(result);
				var html='<option value="">所属区域</option>';$("#fx_xiangzhen").html("");
				result.jiedao.map(function(item){
					html+="<option value="+item['code']+">"+item['name']+"</option>";
					if(item['name']!=="梅陇镇"){
						villageHtml+="<span class='villageCompanySpan' code="+item['code']+" tag-c='0'>"+item['name']+"</span>"; //lx
					}
				});
				$("#fx_xiangzhen").append(html);
				$("#fx_xiangzhen_ryxx").append(html);
				$('.villageCompany').append(villageHtml); //lx
				
				
				html="";
				html='<option  value="">所属街道</option>';$("#ls_conditionsRoad_fx").html("");
				result.roadArr.map(function(item){
					html+="<option value="+item['name']+">"+item['name']+"</option>";
					roadHtml+="<span class='companyRoadSpan' tag-c='0'>"+item['name']+"</span>"; //lx
				});
				$("#ls_conditionsRoad_fx").append(html);
				$('.companyRoad').append(roadHtml); //lx
				
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw ('数据请求失败！');
			}
		});
		// lx 获取分级数据
		$.ajax({
			url : "${basePath}/home_get_fenji.action?time=" + new Date().getTime(),
			type : "post",
			dataType : "json",
			success : function(result) {
				console.log(result);
				var htmlLevel = '<span class="riskManageSpan"><i class="layui-icon-location" style="color:red">A级: <span style="color:#1b1b1b">'+ result.fenjiA +'</span></i></span>'+
						    	'<span class="riskManageSpan"><i class="layui-icon-location" style="color:orange">B级: <span style="color:#1b1b1b">'+ result.fenjiB +'</span></i></span>'+
						    	'<span class="riskManageSpan"><i class="layui-icon-location" style="color:blue">C级: <span style="color:#1b1b1b">'+ result.fenjiC +'</span></i></span>'+
						    	'<span class="riskManageSpan"><i class="layui-icon-location" style="color:green">D级: <span style="color:#1b1b1b">'+ result.fenjiD +'</span></i></span>'
				$(".riskManage").append(htmlLevel);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw ('数据请求失败！');
			}
		})
		
		//手风琴控件
		layui.use('element', function(){
			/* var element = layui.element();
			element.init(); */
			
			$("#villageCompanyTopRight").click(function(){
                    if($(this).find(".layui-icon").hasClass("rotate")){ //rotate class 向下的箭头
                        $(this).find(".layui-icon").removeClass("rotate");//>
                        $(this).find(".layui-colla-content").removeClass("layui-show");//收起内容
                    }else{
                        //>箭头
                        $(this).find(".layui-icon").addClass("rotate");//向下
                        $(this).find(".layui-colla-content").addClass("layui-show"); //展开
                    } 
            })
            $("#companyRoadTopRight").click(function(){
                    if($(this).find(".layui-icon").hasClass("rotate")){ //rotate class 向下的箭头
                        $(this).find(".layui-icon").removeClass("rotate");//>
                        $(this).find(".layui-colla-content").removeClass("layui-show");//收起内容
                    }else{
                        //>箭头
                        $(this).find(".layui-icon").addClass("rotate");//向下
                        $(this).find(".layui-colla-content").addClass("layui-show"); //展开
                    }
            })
            $("#riskManageTopRight").click(function(){
                    if($(this).find(".layui-icon").hasClass("rotate")){ //rotate class 向下的箭头
                        $(this).find(".layui-icon").removeClass("rotate");//>
                        $(this).find(".layui-colla-content").removeClass("layui-show");//收起内容
                    }else{
                        //>箭头
                        $(this).find(".layui-icon").addClass("rotate");//向下
                        $(this).find(".layui-colla-content").addClass("layui-show"); //展开
                    }
            })
			$(".villageCompanySpan").unbind().click(function(e) {
				e.stopPropagation();
				var cityid = $(this).attr("code");
				/* if($(this).attr("tag-c")== 0){
					$(this).attr("tag-c","1")					
					$(".villageCompanySpan").removeClass('spanbluebg');
					$(this).addClass('spanbluebg');
					MXZH.qyxxCF.prototype.getDataOfgj(cityid,'','');
				}else {
					$(this).attr("tag-c","0")
					$(this).removeClass('spanbluebg');
					MXZH.qyxxCF.prototype.getDataOfgj();
				} */
				$(".villageCompanySpan").removeClass('spanbluebg');
				$(this).addClass('spanbluebg');
				MXZH.qyxxCF.prototype.getDataOfgj(cityid,'','');
				
			});
			$(".companyRoadSpan").unbind().click(function(e) {
				e.stopPropagation();
				var roadName = $(this).text();
				$(".companyRoadSpan").removeClass('spanbluebg');
				$(this).addClass('spanbluebg');
				MXZH.qyxxCF.prototype.getDataOfgj('','',roadName);
			}); 
			$(".riskManageSpan").unbind().click(function(e) {
				e.stopPropagation();
				$(".riskManageSpan").removeClass('spanbluebg');
				$(this).addClass('spanbluebg');		
			});  
            
            
		});
		
		
		layui.use('form', function() {
			var $ = layui.jquery,
				form = layui.form();
			//全选
			form.on('checkbox(allChoose)', function(data) {
				var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
				child.each(function(index, item) {
					item.checked = data.elem.checked;
				});
				form.render('checkbox');
				layerControlFun(data, 'allchoose');
			});
			form.on('checkbox(mychoose)', function(data) {
				layerControlFun(data);
			});
		});
	
	
		$('._goOut').hover(function() {
			$(this).find('.text_goOut').animate({
				opacity : 'show',
				height : 'show'
			}, 200);
		}, function() {
			$('.text_goOut').stop(true, true).hide();
		});
	</script>
	<script type="text/javascript">
		$("#shade").hide();
		function openNewWindow() {
			var newHref = "";
			$.ajax({
				url : "${basePath}/home_queryadminpassword.action",
				type : "post",
				async : false,
				success : function(word) {
					newHref = "/?" + Base64.encodeURI("username=admin&password=" + word + "&time=" + new Date().getTime());
					//password中可以传加密以后的值
	
				},
				error : function(error) {
					throw ('数据请求失败！');
				}
			});
			window.open(newHref, "_blank");
		}
		function sendlbs() {
			var ms = $(".single-slider").val();
			$.ajax({
				url : "${basePath}/home_sendLbs.action",
				type : "post",
				data : {
					level : ms
				},
				success : function(msg) {
					layui.layer.msg("LBS参数设置成功！");
				},
				error : function(error) {
					throw ('数据请求失败！');
				}
			});
	
		}	
		
		var ifr = document.getElementById("ifr");
		var shade = document.getElementById("shade");	
		window.onload = function(){
			//行业安全
			$("#hyaq").unbind().on("click",function(){
				getIframe($(this),"${ipPath}/jeeplus/a/counts/IndustrySafe");
			}) 
			//履职分析
			$("#lzfx").unbind().on("click",function(){
				getIframe($(this),"http://localhost:18080/jeeplus/a/counts/IndustryResum");	
				ifr.src="${ipPath}/jeeplus/a/counts/IndustryResum";				
			}) 
			//重点分析
			$("#zdfx").unbind().on("click",function(){			
				getIframe($(this),"${ipPath}/jeeplus/a/counts/SafeAnalysis/index");
			}) 
			//安全形式
			$("#aqxs").unbind().on("click",function(){
				getIframe($(this),"${ipPath}/jeeplus/a/counts/SafeSituationAnalysis");
			}) 
			//签到统计
			$("#qdtj").unbind().on("click",function(){
				getIframe($(this),"${ipPath}/jeeplus/a/counts/UserSign");
			}) 
			//工作排名
			$("#gzpm").unbind().on("click",function(){
				getIframe($(this),"${ipPath}/jeeplus/a/counts/queryarea");
			}) 
			//人员检查
			$("#ryjc").unbind().on("click",function(){
				getIframe($(this),"${ipPath}/jeeplus/a/counts/supervise");
			}) 
			//工作统计
			$("#gztj").unbind().on("click",function(){
				getIframe($(this),"${ipPath}/jeeplus/a/counts/safe");
								
			}) 
		}
		function getIframe(el,src){	
			$("#mymap_gc").html("");	
			$("#shade").show();	
			$(".mainLeft").css({'width':'0px','display':'none'});
			$(".mainRight").css({'left':'0px','display':'none'});
			el.parent().children().find("a").removeClass("navActive");
			el.find("a").eq(0).addClass("navActive");
			ifr.src=src;											
			$("#ifr").one('load',function(){							
				setTimeout(function(){
					$("#shade").hide();			
				},100);				
			})
			ifr.style.display = "block";
			
							
		}	
		$(".layout_left").find("li").each(function(item){
			if($(this).attr("id")==undefined){
				$(this).on("click",function(){
				   $("#mymap_gc").html("");
					ifr.style.display = "none";
					$(".mainRight").css({'display':'block'});
					if(item==0){
						$("#villageCompanyTopRight").css({'display':'block'});
						$("#companyRoadTopRight").css({'display':'block'});
						$("#riskManageTopRight").css({'display':'block'}); 
					}else{
						$("#villageCompanyTopRight").css({'display':'none'});
						$("#companyRoadTopRight").css({'display':'none'});
						$("#riskManageTopRight").css({'display':'none'});
					}
			})
			}
		})
		
		
	</script>

</body>
</html>