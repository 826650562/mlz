var Active = null;
var isActive = null;
var call_msg = "";
var DispClose = true;

window.jsxx = {
	_members : null
};

/**
 * 创建uuid 
 */
function createUuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid;
}

//即时消息断线清除现场
function clearAll(){
	handleCloseEvent();
}

/**
 * 获得服务器端时间
 * */
function getNowTime() {
	var result = -1;
	$.ajax({
		url : "home_now.action",
		dataType : "text",
		type : "post",
		async : false,
		success : function(e) {
			result = parseInt(e);
		},
		error : function(er, thr, xhr) {
			layui.layer.msg("时间获取失败,请重试!");
		}
	});
	return result;
}

/**
 * 将消息包装为可转发消息
 * */
function wrapPost(toServer, msg) {
	return JSON.stringify({
		src : "PTTFrame",
		toServer : toServer,
		curUser : IM.userId, // 用户ID
		msg : msg
	});
}

/**
 * 转发消息到父级窗口
 * */
function postMsg(toServer, msg) {
	var msg = wrapPost(toServer, msg);
	MXZH.log("PTTFrame->" + msg);
	window.postMessage(msg, '*');
}

/**
 * 
 * 将对讲信令包装为指令类信令
 * 
 * */
function wrapPttMsg(msg) {
	var uuid = createUuid();
	return {
		id : uuid,
		srcUser : IM.userId,
		toUnit : 0,
		ts : (new Date()).getTime(),
		msg : msg
	};
}

/**
 * 获取当前用户id
 */
function getCurUserId() {
	return IM.userId;
}

/**
 * 根据callMsg判断是否为主叫方<br/>
 * 判断依据：主叫方是否与当前用户ID一致
 * */
function setIsActive(callMsg) {
	if (isActive == null) {
		isActive = callMsg.msg.creatorId == getCurUserId();
	}
	return isActive;
}

/**
 * 处理关闭页面和浏览器刷新以及推出系统等操作
 */
function handleCloseEvent() {
	MXZH.log(INDEX);
	if (INDEX != null) {
		var tmpId = ""
		var conferenceMap = ""
		var roomId = ""
		var creatorId = ""
		var bfcpClient = ""
		var userId = ""
		try{
			tmpId = 'layui-layer-iframe' + INDEX;
			conferenceMap = window.frames[tmpId].conferenceMap;
			roomId = window.frames[tmpId].RoomId;
			creatorId = window.frames[tmpId].CreatorId;
			bfcpClient = window.frames[tmpId].bfcpClient;
			userId = IM.userId;
		}catch(err) {
			MXZH.log(err);
			MXZH.log("语音对讲页面不存在！");
			return false;
		}

		LogOut = false;

		MXZH.log("当前会话类型：", CallMode);

		//判断主叫被叫
		if (conferenceMap && roomId) {
			if (conferenceMap.has(roomId)) {
				conferenceMap.forEach(function(value, key) {
					if (conferenceMap.get(key).get(IM.userId).get("role") == "creator") { //判断为主叫
						Active = true;
					} else { //判断为被叫
						Active = false;
					}
				}, conferenceMap)

				if (Active) { //管理员或者创建者关闭语音对讲则释放会话
					var releaseRequest = {
						operate : 'PTT_RELEASE',
						userId : userId,
						roomId : roomId
					};
					MXZH.log("释放会话！", JSON.stringify(releaseRequest));
					postMsg(true, wrapPttMsg(releaseRequest));

					RoomId = "";
					hasRoom = false;
					BfcpFlag = false;
					if (BoxCall && BoxCall == true) {
						BoxCall = false;
					}
				} else { //普通用户则退出会话
					if (CallMode == "group") { //群众挂断会话
						var hangupRequest = {
							operate : "PTT_HANGUP",
							roomId : roomId,
							userId : userId
						};
						postMsg(true, wrapPttMsg(hangupRequest));
						MXZH.log("用户挂断会话：", JSON.stringify(hangupRequest));
					} else if (CallMode == "p2p") { //点对点释放会话
						var releaseRequest = {
							operate : "PTT_RELEASE",
							roomId : roomId,
							userId : userId
						};
						postMsg(true, wrapPttMsg(releaseRequest));
						MXZH.log("用户释放会话：", JSON.stringify(releaseRequest));
					}

					RoomId = "";
					hasRoom = false;
					BfcpFlag = false;
					if (BoxCall && BoxCall == true) {
						BoxCall = false;
					}
				}
				//关闭语音对讲界面
				layer.close(INDEX);
				INDEX = "";
				return "onbeforeunload is work";
			} else {
				RoomId = "";
				hasRoom = false;
				BfcpFlag = false;
				if (BoxCall && BoxCall == true) {
					BoxCall = false;
				}

				layer.msg('不存在该会话！', {
					icon : 1
				});
				layer.close(INDEX);
				INDEX = "";
				return "onbeforeunload is work";
			}
		} else {
			RoomId = "";
			hasRoom = false;
			BfcpFlag = false;
			if (BoxCall && BoxCall == true) {
				BoxCall = false;
			}

			layer.msg('您没有创建任何会话！', {
				icon : 1
			});
			layer.close(INDEX);
			INDEX = "";
			return "onbeforeunload is work";
		}
	} else {
		return false;
	}
}

/**
 * 页面关闭前的操作
 */
function CloseEvent() {
	if (DispClose) {
		//处理页面关闭和刷新以及退出系统
		handleCloseEvent();
		//return "是否离开当前页面！";
		if (LogOut) { //用户退出系统时的提醒
			alert("您已退出系统！");
		} else { //用户关闭页面或者刷新页面时的提醒
			alert("页面已经关闭！");
		}
	}
}

/**
 * 页面关闭标志位控制
 */
function UnLoadEvent() {
	DispClose = false;
}

/**
 * 作为被叫方，收到服务器端呼叫时的处理
 * */
function handlePassiveCall(message) {
	var roomId = message.msg.roomId;
	var creatorId = message.msg.creatorId;
	var userId = message.toUser;
	CallMode = message.msg.callMode;
	console.log("房间标志位：", hasRoom);
	console.log("存在会话标志位：", hasRoom);
 
	
	if (hasRoom) { 
		if (message.msg.callMode == "group") {   //群组对讲下通知用户挂断
			var hangupRequest = {
				operate : "PTT_BUSY",
				roomId : roomId,
				userId : userId
			};
			postMsg(true, wrapPttMsg(hangupRequest));
			MXZH.log("存在房间，挂断会话：", JSON.stringify(hangupRequest));
		} else if (message.msg.callMode == "p2p") {    //点对点对讲下通知用户释放会话
			var releaseRequest = {
				operate : "PTT_RELEASE",
				roomId : roomId,
				userId : userId
			};
			postMsg(true, wrapPttMsg(releaseRequest));
			MXZH.log("存在房间，释放会话: ", JSON.stringify(releaseRequest));
		}
		return false;
	} else {
		RoomId = roomId;
		hasRoom = true;
		CreatorId = creatorId;
		ConfirmLayero = layer.confirm('收到会话邀请', {
			id : 'layui-yydj-confirm',
			offset : 'rb', //右下角弹出询问框
			btn : [ '同意', '拒绝' ], //按钮
			cancel: function() {   //关闭对话框关闭按钮，挂断或释放会话
				if (message.msg.callMode == "group") {
					var hangupRequest = {
						operate : "PTT_HANGUP",
						roomId : message.msg.roomId,
						userId : userId
					};
					postMsg(true, wrapPttMsg(hangupRequest));
					MXZH.log("挂断会话：", JSON.stringify(hangupRequest));
				} else if (message.msg.callMode == "p2p") {
					var releaseRequest = {
						operate : "PTT_RELEASE",
						roomId : message.msg.roomId,
						userId : userId
					};
					postMsg(true, wrapPttMsg(releaseRequest));
					MXZH.log("释放会话: ", JSON.stringify(releaseRequest));
				}
				layer.msg('您已经挂断会话！', {
					icon : 1
				});
				RoomId = "";
				hasRoom = false;
				BfcpFlag = false;
				
				CallMode = "";

				if (BoxCall && BoxCall == true) {
					BoxCall = false;
				}
			}
		}, function(index, layero) { //同意会话
			CallFlag = true;
			hasRoom = true;
			ConfirmLayero = index;
			MXZH.log("弹出框索引：", ConfirmLayero);
			layer.msg('稍等，即将打开语音对讲界面', {
				icon : 1,
				time : 1000
			});
			
			//打开语音对讲界面
			layer.open({
				type : 2,
				id : 'layui-yydj',
				shade : 0,
				shift : -1,
				maxmin : true,
				btnAlign : 'c',
				area : [ '750px', '553px' ],
				content : [ 'mx/jsxx/yydj/yydj.jsp', 'no' ],
				success : function(index, layero) {
					window.tmpId = 'layui-layer-iframe' + layero;
					INDEX = layero;
					window.frames[tmpId].focus();
				},
				cancel : function(index, layero) { //关闭语音对讲界面，同时请求会话管理服务释放会话
					if (confirm('确定要关闭吗')) {
						var tmpId = 'layui-layer-iframe' + index;
						var conferenceMap = window.frames[tmpId].conferenceMap;
						var roomId = window.frames[tmpId].RoomId;
						var creatorId = window.frames[tmpId].CreatorId;
						MXZH.log("当前会话类型：", CallMode);

						//判断主叫被叫
						if (conferenceMap && roomId) {
							if (conferenceMap.has(roomId)) {
								conferenceMap.forEach(function(value, key) {
									if (conferenceMap.get(key).get(IM.userId).get("role") == "creator") { //判断为主叫
										Active = true;
									} else { //判断为被叫
										Active = false;
									}
								}, conferenceMap)

								if (Active) { //管理员或者创建者关闭语音对讲则释放会话
									var releaseRequest = {
										operate : 'PTT_RELEASE',
										userId : userId,
										roomId : roomId
									};
									MXZH.log("释放会话！", JSON.stringify(releaseRequest));
									postMsg(true, wrapPttMsg(releaseRequest));

									MXZH.log("抢麦客户端删除与会成员:", JSON.stringify(pttDestroyConf));
									RoomId = "";
									hasRoom = false;
									BfcpFlag = false;
									
									if (BoxCall && BoxCall == true) {
										BoxCall = false;
									}
									
									CallMode = "";
									
									layer.close(index);
									INDEX = "";
								} else { //普通用户则退出会话
									if (CallMode == "group") { //群众挂断会话
										var hangupRequest = {
											operate : "PTT_HANGUP",
											roomId : roomId,
											userId : userId
										};
										postMsg(true, wrapPttMsg(hangupRequest));
										MXZH.log("用户挂断会话：", JSON.stringify(hangupRequest));
									} else if (CallMode == "p2p") { //点对点释放会话
										var releaseRequest = {
											operate : "PTT_RELEASE",
											roomId : roomId,
											userId : userId
										};
										postMsg(true, wrapPttMsg(releaseRequest));
										MXZH.log("用户释放会话：", JSON.stringify(releaseRequest));
									}

									RoomId = "";
									hasRoom = false;
									BfcpFlag = false;
									if (BoxCall && BoxCall == true) {
										BoxCall = false;
									}
									
									CallMode = "";
									
									layer.close(index);
									INDEX = "";
								}
								//关闭语音对讲界面
								layer.close(index);
							} else {
								RoomId = "";
								hasRoom = false;
								BfcpFlag = false;
								if (BoxCall && BoxCall == true) {
									BoxCall = false;
								}
								
								CallMode = "";

								layer.msg('不存在该会话！', {
									icon : 1
								});
								layer.close(index);
								INDEX = "";
							}
						} else {
							RoomId = "";
							hasRoom = false;
							BfcpFlag = false;
							if (BoxCall && BoxCall == true) {
								BoxCall = false;
							}

							CallMode = "";
							
							layer.msg('您没有创建任何会话！', {
								icon : 1
							});
							layer.close(index);
							INDEX = "";
						}
					}
					return false;
				},
				full : function() { //语音对讲界面最大化
					var tmpId = 'layui-layer-iframe' + INDEX;
					var ifm = document.getElementById(tmpId);
					ifm.height = document.documentElement.clientHeight;
					ifm.width = document.documentElement.clientWidth;
					
					//语音对讲窗口缩放放大
					var w_s = ifm.width/4 -40;
					$("#"+tmpId).contents().find(".yyhj_title").width(ifm.width+"px");
					$("#"+tmpId).contents().find(".yyhj_cont").width(ifm.width+"px");
					$("#"+tmpId).contents().find(".yyhj_sliddown").width(ifm.width+"px");
					$("#"+tmpId).contents().find(".yyhj_cont").height((ifm.height-140)+"px");
					$("#"+tmpId).contents().find(".yyhj_bottom").width(ifm.width+"px");  
					$("#"+tmpId).contents().find(".bottomanniu").css("margin", "0 "+0.144*ifm.width+"px");
					$("#"+tmpId).contents().find(".yyhj_title_left").width((4*ifm.width/15)+"px");
					$("#"+tmpId).contents().find(".yyhj_title_mid").width((7*ifm.width/15)+"px");
					$("#"+tmpId).contents().find(".yyhj_title_right").width((4*ifm.width/15)+"px");
					$("#"+tmpId).contents().find(".yyhjListTitle").width(w_s +"px");
					$("#"+tmpId).contents().find(".yyhjListMain").width(w_s +"px");
					$("#"+tmpId).contents().find(".yyhjListMain").height("250px");
					$("#"+tmpId).contents().find(".yyhjListBottomGray").width(w_s+"px");
					$("#"+tmpId).contents().find(".yyhjBoxListItem").width(w_s-2+"px");
					$("#"+tmpId).contents().find(".yyhjBoxListItem").height("274px");
					$("#"+tmpId).contents().find(".yyhjListBottomBlue").width(w_s+"px");
					$("#"+tmpId).contents().find(".yyhjBlueBgName").css("margin-left",0.35*w_s+"px");
					//$("#"+tmpId).contents().find(".yyhjBlueBgXtb").css("margin-left","134px");
					$("#"+tmpId).contents().find(".nacl_module").attr('width',w_s);
					$("#"+tmpId).contents().find(".nacl_module").attr('height',250);
					$("#"+tmpId).contents().find(".yyhjBox").width(ifm.width+"px");
					$("#"+tmpId).contents().find(".yyhjBox ul").width(ifm.width-34+"px");
					$("#"+tmpId).contents().find(".yyhjBox").height((ifm.height-140)+"px");
					$("#"+tmpId).contents().find(".yyhjGrayBgName").width(0.93*w_s+"px");
					
					$('#' + tmpId).contents().find("#ptt").find(".bottomline").addClass("bottomline-full");
					$('#' + tmpId).contents().find("#ptt").find(".anniutxt").addClass("anniutxt-full");
					$('#' + tmpId).contents().find("#anniutb").addClass("anniutb-full");
				},
				min : function() { //语音对讲界面最小化
				},
				restore : function() { //窗口还原后重新获得焦点
					var tmpId = 'layui-layer-iframe' + INDEX;
					window.frames[tmpId].focus();
					
					//缩放还原 
					$("#"+tmpId).contents().find(".yyhj_title").width("750px");
					$("#"+tmpId).contents().find(".yyhj_cont").width("750px");
					$("#"+tmpId).contents().find(".yyhj_sliddown").width("750px");
					$("#"+tmpId).contents().find(".yyhj_cont").height("420px");
					$("#"+tmpId).contents().find(".yyhj_bottom").width("750px");
					$("#"+tmpId).contents().find(".bottomanniu").css('margin', '0 77px');
					$("#"+tmpId).contents().find(".yyhj_title_left").width("200px");
					$("#"+tmpId).contents().find(".yyhj_title_mid").width("350px");
					$("#"+tmpId).contents().find(".yyhj_title_right").width("200px");
					$("#"+tmpId).contents().find(".yyhjListTitle").width("148px");
					$("#"+tmpId).contents().find(".yyhjListMain").width("148px");
					$("#"+tmpId).contents().find(".yyhjListMain").height("110px");
					$("#"+tmpId).contents().find(".yyhjListBottomGray").width("148px");
					$("#"+tmpId).contents().find(".yyhjListBottomBlue").width("148px");
					$("#"+tmpId).contents().find(".yyhjBlueBgName").css({"margin-left":"8px","width":"90px"});
					$("#"+tmpId).contents().find(".yyhjGrayBgName").width("138px");
					$("#"+tmpId).contents().find(".yyhjBoxListItem").width("148px");
					$("#"+tmpId).contents().find(".yyhjBoxListItem").height("164px");
					$("#"+tmpId).contents().find(".nacl_module").attr('width',148);
					$("#"+tmpId).contents().find(".nacl_module").attr('height',110);
					$("#"+tmpId).contents().find(".yyhjBox").width("750px");
					$("#"+tmpId).contents().find(".yyhjBox ul").width("716px");
					$("#"+tmpId).contents().find(".yyhjBox").height("360px");
					$("#"+tmpId).contents().find(".yyhjBlueBgXtb").css("margin-left","-23px");
					
					$('#' + tmpId).contents().find("#ptt").find(".bottomline").removeClass("bottomline-full");
					$('#' + tmpId).contents().find("#ptt").find(".anniutxt").removeClass("anniutxt-full");
					$('#' + tmpId).contents().find("#anniutb").removeClass("anniutb-full");
				}
			});
		}, function(index) { //拒绝
			if (message.msg.callMode == "group") {
				var hangupRequest = {
					operate : "PTT_HANGUP",
					roomId : message.msg.roomId,
					userId : userId
				};
				postMsg(true, wrapPttMsg(hangupRequest));
				MXZH.log("挂断会话：", JSON.stringify(hangupRequest));
			} else if (message.msg.callMode == "p2p") {
				var releaseRequest = {
					operate : "PTT_RELEASE",
					roomId : message.msg.roomId,
					userId : userId
				};
				postMsg(true, wrapPttMsg(releaseRequest));
				MXZH.log("释放会话: ", JSON.stringify(releaseRequest));
			}
			layer.msg('您已经挂断会话！', {
				icon : 1
			});
			RoomId = "";
			hasRoom = false;
			BfcpFlag = false;
			
			CallMode = "";

			if (BoxCall && BoxCall == true) {
				BoxCall = false;
			}
		});
	}
}

/**
 * 处理服务器端的CALL
 * */
function handlePttCall(message) {
	setIsActive(message);
	if (!isActive) {
		handlePassiveCall(message);
	}
}

/**
 * 默认的数据响应
 * */
function defaultResp(msg) {
	var responseMessage = {
		operate : 'PTT_RESPONSE',
		code : 0,
		toId : msg.id,
		roomId: msg.msg.roomId
	};
	postMsg(true, wrapPttMsg(responseMessage));
}


$(function() {
	/*
	 * 初始化录音函数  王新亮
	 * */
	/*Recorder && Recorder.initialize({
		"swfSrc" : "mx/jsxx/MLGITHrecord/recorder.swf?" + Math.random(),
		initialized : function() {
			MXZH.log("录音就绪!");
			return true;
		}
	});*/

	//绑定登出事件
	$("#logOut").click(function() {
		LogOut = true;
	})

	//消息监听
	window.addEventListener('message', function(e) {
		var msg = JSON.parse(e.data);
		var message = msg.msg;
		MXZH.log("home.jsp收到会话管理服务端的消息：", JSON.stringify(message));
		if (message.ts - new Date().getTime() <= 30 * 1000) { //过滤掉过时消息
			if (message.src != "PTTFrame") { //过滤掉从语音对讲界面发过来的消息
				if ("srcUnit" in message) {
					if (message.srcUnit == "0") { //判断是否是从服务端发送过来的消息
						//回复收到消息
						defaultResp(message);
						switch (message.msg.operate) {
						case "PTT_CALL":
							call_msg = message;
							//判断是否呼叫自己
							if (message.toUser == IM.userId) {
								if (message.msg.creatorId != IM.userId) {    //判断会话创建者是否是自己
									MXZH.log("存在会话标志位（PTT_CALL）：", hasRoom);
									//if(!hasRoom) {
									handlePttCall(message);
									//	message = null;
//									} else {
//										MXZH.log("存在会话！！！！！");
//										break;
//									}
								}
							}
							break;
						case "PTT_RELEASE":
							if (message.toUser == IM.userId) {    //判断是否呼叫自己
								if (message.msg.roomId == RoomId) {    //判断是否是该会话
									hasRoom = false;
									MXZH.log("存在会话标志位（PTT_RELEASE）：", hasRoom);
									layer.close(ConfirmLayero);
									if (message.toUser != message.msg.userId) {
										var tmpId = 'layui-layer-iframe' + INDEX;
										
										MXZH.log("会话类型(jsxx)：", CallMode);

										//关闭语音对讲界面
										if (layer.index) {
											CallMode = "";
											layer.close(INDEX);
											INDEX = "";
										}

										MXZH.log("会话已被释放！");

										RoomId = "";
										hasRoom = false;
										BfcpFlag = false;

										if (BoxCall && BoxCall == true) {
											BoxCall = false;
										}
									}
								}
							}
							break;
						case "PTT_ENVICT":
							if (message.msg.userId == IM.userId) { //如果移出对象是自己，则退出会话
								if (message.msg.roomId == RoomId) {    //判断是否是该会话
									var tmpId = 'layui-layer-iframe' + INDEX;
									
									CallMode = "";
									
									layer.close(INDEX);
									INDEX = "";
	
									RoomId = "";
									hasRoom = false;
									BfcpFlag = false;
	
									if (BoxCall) {
										BoxCall = false;
									}
									
									layer.msg('您已被移出会话！', {
										icon : 1
									});
								}
							}
							break;
//						case "PTT_HANGUP":
//							if (message.msg.roomId == RoomId) {
//								MXZH.log("收到挂断请求",JSON.stringify(message));
//								hasRoom = false;
//							}
//							break;
						case "PTT_TIMEOUT":
							if (message.msg.roomId == RoomId) {
								MXZH.log("呼叫超时！");
								layer.close(ConfirmLayero);   //关闭
								hasRoom = false;
								console.log("超时清除会话标志：", hasRoom);
							}
							break;
						default:
							break;
						}
					}
				}
			}
		}

	})

	layui.use('layim', function(layim) {
		var layim = layim,
			client = null,
			portal = null;
		var inited = false;
		$('.jsxx').on('click', function() {
			jsxxMian();
		});
		jsxxMian();
		function jsxxMian() {
			if (!inited) {
				inited = true;
			} else {
				return;
			}

			//链接信息
			new IMCodec(IM.protoPath, function(_codec) {
				client = new IMClient({
					url : IM.wsUrl,
					codec : _codec,
					idleTimeout : IM.wsTimeout,
					pongTimeout : IM.pongTimeout
				});

				portal = new IMClientPortal(client);
				portal.setLayIm(layim);
				client.error(portal.errorCallback);
				client.close(portal.closeCallback);
				client.connect(portal.connected);
			});


			/**
			 * 根据用户id 获取 username和头像
			 * zlj
			 */
			function getUserXX(userid) {
				var all = layim.getAllList(); // 自定义的方法
				var user = {
					username : "",
					avatar : ""
				};
				for (var i = 0; i < all.length; i++) {
					var obj = all[i].list;
					for (var key in obj) {
						if (obj[key].id == userid) {
							user["username"] = obj[key].username;
							user["avatar"] = obj[key].avatar;
						}
					}
				}
				return user;
			}

			/**
			 * 根据用户id 获取 username和头像
			 * zlj
			 */
			function getUserByUid(uid) {
				var all = layim.getAllList(); // 自定义的方法
				var user = {
					id : "",
					username : "",
					avatar : "",
					uid : ""
				};
				for (var i = 0; i < all.length; i++) {
					var obj = all[i].list;
					for (var key in obj) {
						if (obj[key].uid == uid) {
							user["id"] = obj[key].id;
							user["username"] = obj[key].username;
							user["avatar"] = obj[key].avatar;
							user["uid"] = obj[key].uid;
						}
					}
				}
				MXZH.log(JSON.stringify(user));
				return user;
			}

			window.getUserByUid = getUserByUid;
			/**
			 * 根据传入的路径，实现对图片、语音、视频的解密，生成解密路径
			 * zlj	
			 * */
			function getJmPath(file_url, file_type) {
				var jmresult = "";
				jQuery.ajax({
					url : "${basePath}/home_yyPlayer.action?time=" + new Date().getTime(),
					data : {
						yy_url : file_url,
						ypid : file_type
					},
					type : "post",
					async : false,
					success : function(result) {
						jmresult = result;
					},
					error : function(error) {
						throw (error);
						throw ('数据请求失败！');
					}
				});
				return jmresult;
			}

			//基础配置
			layim.config({
				//初始化接口
				init : {
					url : IM.userInitUrl,
					data : {}
				}, //查看群员接口
				members : {
					url : IM.memberInitUrl,
					data : {}
				}, //上传图片接口
				uploadImage : {
					url : '', //（返回的数据格式见下文）
					m_upload : function(input, type, mine, to) {
						var f = input.files[0];
						var type = Chat.getFileType(f);
						if (type != 1) {
							layui.use('layer', function() {
								var layer = layui.layer;
								layer.open({
									title : "文件格式错误",
									type : 0,
									content : "系统仅支持jpg,jpeg,png,gif,bmp等格式图片!"
								});
							});

							return false;
						}

						//上传图片文件
						var uploader = new Chat.Uploader(input.files[0], mine, to);
						uploader.getMsgHtml();
						uploader.upload(client.sendMsg);
						return true; // 必须写上
					}
				},
				tool : [ {
					alias : 'yydj', //工具别名
					title : '语音对讲', //工具名称
					icon : '&#xe63a;' //工具图标，参考图标文档
				} ], //上传文件接口
				uploadFile : {
					url : IM.uploadUrl, //（返回的数据格式见下文）
				}, //,brief: true //是否简约模式（若开启则不显示主面板）     //,title: 'WebIM' //自定义主面板最小化时的标题 //,right: '100px' //主面板相对浏览器右侧距离 //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离 //,initSkin: '3.jpg' //1-5 设置初始背景 //,skin: ['aaa.jpg'] //新增皮肤 //,isfriend: false //是否开启好友 //,isgroup: false //是否开启群组 //,min: true //是否始终最小化主面板，默认false
				notice : true,
				voice: "come.mp3", //声音提醒，默认开启，声音文件为：default.wav
				isVideo : true,
				isAudio : true, //,msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可 //,find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可 //,chatLog: layui.cache.dir + 'css/modules/layim/html/chatLog.html' //聊天记录页面地址，若不开启，剔除该项即可
				copyright : true
			});

			function getMembers(groupid) {
				var result = null;
				$.ajax({
					url : IM.memberInitUrl,
					data : {
						id : groupid
					},
					type : "post",
					dataType : "json",
					async : false,
					success : function(res) {
						result = res.data.list ;
					},
					error : function(e) {
						alert("群组成员数据查询失败！");
					}
				});
				return result;
			}

			//监听自定义工具栏点击，以添加代码为例
			layim.on('tool(yydj)', function(insert, send, obj) { //事件中的tool为固定字符，而code则为过滤器，对应的是工具别名（alias）
				var to = obj.data;
				var members;
				
				console.log("语音对讲模式：", to.type);
				
				//判断是个人还是群组
				if (to.type === 'friend') { //个人
					CallMode = "p2p";
					members = {
						members : [ {
							id : to.id,
							avatar : to.avatar,
							username : to.username || to.name,
							uid : to.uid
						} ]
					};
				} else if (to.type === 'group') { //群组
					CallMode = "group";
					var groupid = to.id;
					var result = getMembers(groupid);
					members = {
						members : result
					}
				}

				var info = JSON.stringify(members);
				window.jsxx["_members"] = info;
				
				//打开语音对讲界面
				INDEX = layer.open({
					type : 2,
					id : 'layui-yydj',
					shade : 0,
					title : [ to.groupname || to.username, 'font-size:14px;color:blue' ],
					shift : -1,
					maxmin : true,
					btnAlign : 'c',
					area : [ '750px', '553px' ],
					content : [ IM.yydjPageUrl, 'no' ],
					success : function(index, layero) { //语音对讲窗口打开后获取焦点
						var tmpId = 'layui-layer-iframe' + layero;
						INDEX = layero;
						window.frames[tmpId].focus();
					},
					cancel : function(index, layero) { //关闭语音对讲界面，同时请求会话管理服务释放会话
						var tmpId = 'layui-layer-iframe' + index;
						var conferenceMap = window.frames[tmpId].conferenceMap;
						console.log("语音对讲界面会话成员状态：", conferenceMap);
						if (confirm('确定要关闭吗')) {
							var roomId = window.frames[tmpId].RoomId;
							var creatorId = window.frames[tmpId].CreatorId;
							var topicJsToCpp = window.frames[tmpId].topicJsCpp;
							var bfcpClient = window.frames[tmpId].bfcpClient;
							var ocx_audios = window.frames[tmpId].ocx_audios;
							var ocx_videos = window.frames[tmpId].ocx_videos;
							
							if (roomId && conferenceMap) { //判断是否建立了会话
								if (conferenceMap.has(roomId)) {
									if (conferenceMap.get(roomId).get(IM.userId).get("role") == "creator") { //判断为主叫
										Active = true;
									} else {
										Active = false;
									}
								}

								if (Active) { //管理员或者创建者关闭语音对讲则释放会话
									var releaseRequest = {
										operate : 'PTT_RELEASE',
										userId : IM.userId,
										roomId : roomId
									};
									MXZH.log("释放会话！", JSON.stringify(releaseRequest));
									postMsg(true, wrapPttMsg(releaseRequest));
									if (conferenceMap.has(roomId)) {
										conferenceMap.delete(roomId);
									}
									MXZH.log("当前会话：", conferenceMap);
									
									roomId = "";
									RoomId = "";
									hasRoom = false;
									BfcpFlag = false;
									if (BoxCall && BoxCall == true) {
										BoxCall = false;
									}
									
									CallMode = "";
									
									layer.close(index);
									INDEX = "";
								} else { //普通用户则退出会话
									var hangupRequest = {
										operate : 'PTT_HANGUP',
										userId : IM.userId,
										roomId : roomId
									};
									MXZH.log("退出会话！", JSON.stringify(hangupRequest));
									postMsg(true, wrapPttMsg(hangupRequest));
									if (conferenceMap.has(roomId)) {
										conferenceMap.delete(roomId);
									}
									MXZH.log("当前会话：", conferenceMap);
									
									roomId = "";
									RoomId = "";
									hasRoom = false;
									if (BoxCall && BoxCall == true) {
										BoxCall = false;
									}
									
									CallMode = "";
									
									layer.close(index);
									INDEX = "";
								}
								RoomId = "";
								hasRoom = false;
								BfcpFlag = false;
								if (BoxCall && BoxCall == true) {
									BoxCall = false;
								}
								
								CallMode = "";

								layer.close(index);
								INDEX = "";
							} else { //没有建立任何会话，直接删除界面
								RoomId = "";
								hasRoom = false;
								BfcpFlag = false;
								if (BoxCall && BoxCall == true) {
									BoxCall = false;
								}
								
								CallMode = "";

								layer.close(index);
								INDEX = "";
							}
						}
						return false;
					},
					full : function() { //语音对讲窗口最大化
						console.log("最大化");
						var tmpId = 'layui-layer-iframe' + INDEX;
						var ifm = document.getElementById(tmpId);
						ifm.height = document.documentElement.clientHeight;
						ifm.width = document.documentElement.clientWidth;
						
						//缩放放大
						var w_s = ifm.width/4 -40;
						$("#"+tmpId).contents().find(".yyhj_title").width(ifm.width+"px");
						$("#"+tmpId).contents().find(".yyhj_cont").width(ifm.width+"px");
						$("#"+tmpId).contents().find(".yyhj_sliddown").width(ifm.width+"px");
						$("#"+tmpId).contents().find(".yyhj_cont").height((ifm.height-140)+"px");
						$("#"+tmpId).contents().find(".yyhj_bottom").width(ifm.width+"px");  
						$("#"+tmpId).contents().find(".bottomanniu").css("margin", "0 "+0.144*ifm.width+"px");
						$("#"+tmpId).contents().find(".yyhj_title_left").width((4*ifm.width/15)+"px");
						$("#"+tmpId).contents().find(".yyhj_title_mid").width((7*ifm.width/15)+"px");
						$("#"+tmpId).contents().find(".yyhj_title_right").width((4*ifm.width/15)+"px");
						$("#"+tmpId).contents().find(".yyhjListTitle").width(w_s +"px");
						$("#"+tmpId).contents().find(".yyhjListMain").width(w_s +"px");
						$("#"+tmpId).contents().find(".yyhjListMain").height("250px");
						$("#"+tmpId).contents().find(".yyhjListBottomGray").width(w_s+"px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").width(w_s-2+"px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").height("274px");
						$("#"+tmpId).contents().find(".yyhjListBottomBlue").width(w_s+"px");
						$("#"+tmpId).contents().find(".yyhjBlueBgName").css("margin-left",0.35*w_s+"px");
						//$("#"+tmpId).contents().find(".yyhjBlueBgXtb").css("margin-left","134px");
						$("#"+tmpId).contents().find(".nacl_module").attr('width',w_s);
						$("#"+tmpId).contents().find(".nacl_module").attr('height',250);
						$("#"+tmpId).contents().find(".yyhjBox").width(ifm.width+"px");
						$("#"+tmpId).contents().find(".yyhjBox ul").width(ifm.width-34+"px");
						$("#"+tmpId).contents().find(".yyhjBox").height((ifm.height-140)+"px");
						$("#"+tmpId).contents().find(".yyhjGrayBgName").width(0.93*w_s+"px");
						
						$('#' + tmpId).contents().find("#ptt").find(".bottomline").addClass("bottomline-full");
						$('#' + tmpId).contents().find("#ptt").find(".anniutxt").addClass("anniutxt-full");
						$('#' + tmpId).contents().find("#anniutb").addClass("anniutb-full");
					},
					min : function() { //语音对讲窗口最小化
						console.log("最小化");
					},
					restore : function() { //窗口还原后重新获得焦点
						var tmpId = 'layui-layer-iframe' + INDEX;
						window.frames[tmpId].focus();
						
						//缩放还原
						$("#"+tmpId).contents().find(".yyhj_title").width("750px");
						$("#"+tmpId).contents().find(".yyhj_cont").width("750px");
						$("#"+tmpId).contents().find(".yyhj_sliddown").width("750px");
						$("#"+tmpId).contents().find(".yyhj_cont").height("420px");
						$("#"+tmpId).contents().find(".yyhj_bottom").width("750px");
						$("#"+tmpId).contents().find(".bottomanniu").css('margin', '0 77px');
						$("#"+tmpId).contents().find(".yyhj_title_left").width("200px");
						$("#"+tmpId).contents().find(".yyhj_title_mid").width("350px");
						$("#"+tmpId).contents().find(".yyhj_title_right").width("200px");
						$("#"+tmpId).contents().find(".yyhjListTitle").width("148px");
						$("#"+tmpId).contents().find(".yyhjListMain").width("148px");
						$("#"+tmpId).contents().find(".yyhjListMain").height("110px");
						$("#"+tmpId).contents().find(".yyhjListBottomGray").width("148px");
						$("#"+tmpId).contents().find(".yyhjListBottomBlue").width("148px");
						$("#"+tmpId).contents().find(".yyhjBlueBgName").css({"margin-left":"8px","width":"90px"});
						$("#"+tmpId).contents().find(".yyhjGrayBgName").width("138px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").width("148px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").height("164px");
						$("#"+tmpId).contents().find(".nacl_module").attr('width',148);
						$("#"+tmpId).contents().find(".nacl_module").attr('height',110);
						$("#"+tmpId).contents().find(".yyhjBox").width("750px");
						$("#"+tmpId).contents().find(".yyhjBox ul").width("716px");
						$("#"+tmpId).contents().find(".yyhjBox").height("360px");
						$("#"+tmpId).contents().find(".yyhjBlueBgXtb").css("margin-left","-23px");
						
						$('#' + tmpId).contents().find("#ptt").find(".bottomline").removeClass("bottomline-full");
						$('#' + tmpId).contents().find("#ptt").find(".anniutxt").removeClass("anniutxt-full");
						$('#' + tmpId).contents().find("#anniutb").removeClass("anniutb-full");
					}
				});
			});

			//监听layim建立就绪
			layim.on('ready', function(res) {
				layim.msgbox(5); //模拟消息盒子有新消息，实际使用时，一般是动态获得
			});

			//监听发送消息
			layim.on('sendMessage', function(data) {
				var imMsg = portal.fromLayImMsg(data);
				portal.sendMsg(imMsg); // 发送
			});

			// 监听重发事件
			layim.on("resendMessage", function(data) {
				var imMsg = portal.fromLayImMsg(data);
				portal.sendMsg(imMsg);
			});

			// 用户手动触发上线下线
			layim.on('online', function(status) {
				switch (status) {
					case "online":
						portal.reset();
						client.reconnect();
						break;
					case "hide":
						portal.reset();
						client.disconnect();
						break;
				}
			});
		}
	})
})