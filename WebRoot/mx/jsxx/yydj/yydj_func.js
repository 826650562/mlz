/**
 *
 * @authors Steve Chan (you@example.org)
 * @date    2017-06-08 10:09:00
 * @version $Id$
 */

function success(s) {
	window.stream = s;
	window.track = stream.getAudioTracks()[0];
	common.naclModule.postMessage({
		track : window.track
	});
	window.document.getElementById("listener").firstChild.postMessage({
		track : window.track
	});
}

function failure(e) {
	common.logMessage("Error: " + e);
	alert("打开话筒失败，请连接话筒后重试");
}

/**
 * 音视频插件加载完成事件
 */
function moduleDidLoad() {
	navigator.webkitGetUserMedia({
		'audio' : true
	}, success, failure);
}

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

/**
 * 根据索引，删除数组中的数据
 */
function RemoveValByIndex(arr, index) {
	arr.splice(index, 1);
}

/**
 * 
 * 将指令类信令包装成父页面可以识别的信令
 * 
 */
function wrapPost(toServer, msg) {
	return JSON.stringify({
		src : "PTTFrame",
		toServer : toServer,
		curUser : window.parent.IM.userId, // 用户ID
		msg : msg
	});
}

/**
 * 发送消息
 */
function postMsg(toServer, msg) {
	var msg = wrapPost(toServer, msg);
	MXZH.log("发送消息：" + msg);
	var parentWin = window.parent;
	parentWin.postMessage(msg, '*');
}

/**
 * 将对讲信令包装为指令类信令
 * */
function wrapPttMsg(msg) {
	var uuid = createUuid();
	return {
		id : uuid,
		srcUser : window.parent.IM.userId,
		toUnit : 0,
		ts : (new Date()).getTime(),
		msg : msg
	};
}

/**
 * 获取当前活跃的会话id
 */
function getCurRoomId() {
	var RoomId = "";
	conferenceMap.forEach(function(value, roomId) {
		if (roomId) {
			RoomId = roomId;
		} else {
			RoomId = "";
		}
	}, conferenceMap)
	return RoomId;
}

/**
 * 获取当前用户id
 */
function getCurUserId() {
	return window.parent.IM.userId;
}

/**
 * ActiveX控件加载初始化
 */
function init() {
	if (!window.ActiveXObject) {
		alert("对不起，证书登陆请使用IE浏览器！");
		return;
	}
}

/**
 * 主叫方添加用户UI 
 */
function AddPeople(obj) {
	var length = obj.length;

	$("#test").html('');
	$(".yyhj_title_mid").html('');

	//添加用户状态图标
	for (var i = 0; i < length; i++) {
		layui.yydj_status({
			"uid" : obj[i].getAttribute("uid"),
			"name" : obj[i].getAttribute("username"),
			"type" : "creator",
			"id" : obj[i].getAttribute("id")
		});

		var userInfo = {
			uid : obj[i].getAttribute("uid"),
			name : obj[i].getAttribute("username"),
			id : obj[i].getAttribute("id")
		};

		userMap.set(Number(userInfo.uid), userInfo);
		MXZH.log("用户信息： ", JSON.stringify(userMap));
		var tmp = userMap.get(Number(userInfo.uid));
		MXZH.log("用户id: ", tmp.uid);

		//限制语音对讲名称长度
		if (AddCountCreator <= 3) {
			if (AddCountCreator > 0) {
				$(".yyhj_title_mid").prepend("<span class=split>、</span>")
			}
			
			$(".yyhj_title_mid").prepend("<span id=" + tmp.uid + " class=" + tmp.uid + ">" + tmp.name + "</span>");
		}
		
		AddCountCreator++;
		
		if ($(".yyhj_title_mid").width() > 350) {
			var w_size = $(".yyhj_sliddown").width();
			var w_s = w_size / 4 - 40;
			$(".yyhjListTitle").width(w_s + "px");
			$(".yyhjListMain").width(w_s + "px");
			$(".yyhjListMain").height("250px");
			$(".yyhjListBottomGray").width(w_s + "px");
			$(".yyhjListBottomBlue").width(w_s + "px");
			$(".yyhjBoxListItem").width(w_s - 2 + "px");
			$(".yyhjBoxListItem").height("274px");
			$(".nacl_module").attr('width', w_s);
			$(".nacl_module").attr('height', 250);
			$(".yyhjBox").width(w_size + "px");
			$(".yyhjBox ul").width(w_size - 34 + "px");
			$(".yyhjBox").height((w_size - 140) + "px");
			$(".yyhjGrayBgName").width(0.93 * w_s + "px");
		}
		//绑定用户删除事件
		$(".yyhjListTitleClose").unbind().click(function() {
			if (window.parent.CallMode == "p2p") {
				window.parent.hasRoom = false;
			}

			var id = $(this).attr("del"); //UI操作  
			var uname = $(this).attr("uname");
			var uid = $(this).attr("id"); //数据操作

			$("#yydj_title_mid").find("." + uid).remove();
			$("#user_" + uid).remove();
			$("." + uid).remove();
			$($(".right-box")[0]).find("#" + id).remove();
			$(".left-box").append("<span class='item' uid='" + uid + "' id='" + id + "' avatar='" + avatar + "' username='" + uname + "' >" + uname + "</span>");
			$(this).parent().parent().parent().remove();

			AddCountCreator--;
			MXZH.log("AddCountCreator(AddPeople): ", AddCountCreator);
			
			if (AddCountCreator == 1) {
				$(".split").remove();
			}

			if (userMap.get(Number(uid))) {
				userMap.delete(Number(uid));
				MXZH.log("用户信息：", JSON.stringify(userMap));
			}

			//标题处理
			var cnt = 0;
			if (AddCountCreator < 3) {
				userMap.forEach(function(value, key) {
					cnt++;
					if (cnt == 3) {
						var tmp = userMap.get(Number(key));
						
						if (AddCountCreator > 0) {
							$(".yyhj_title_mid").prepend("<span class=split>、</span>");
						}
						
						$(".yyhj_title_mid").prepend("<span id=" + tmp.uid + " class=" + tmp.uid + ">" + tmp.name + "</span>");
						
						AddCountCreator++;
					}
				}, userMap)
			}

			//发送逐出消息
			var envictMessage = {
				operate : "PTT_ENVICT",
				roomId : RoomId,
				userId : Number(uid)
			};
			var tmpMessage = wrapPttMsg(envictMessage);
			MXZH.log("逐出用户" + uid + ":", JSON.stringify(tmpMessage));
			postMsg(true, wrapPttMsg(envictMessage));

			//处理会话管理map对象
			if (RoomId != "") {
				if (conferenceMap.has(RoomId)) {
					try {
						if (conferenceMap.get(RoomId).has(Number(uid))) {
							conferenceMap.get(RoomId).delete(Number(uid));
						}
					} catch (err) {
						return false;
					}
				}
			}
			MXZH.log("当前会话：", JSON.stringify(conferenceMap));
		});
	}

	$(".yyhj_sliddown").slideUp(100);

	if ($(".yyhj_title_mid .addMore").length) {
		$(".addMore").unbind().click(function() {
			if ($(".addMore").attr("flag") == "true") {
				$(".yyhj_sliddown").slideDown(100);
				$(function() {
					$('#selectTitle').initList();
				})
				$(".addMore").attr("flag", "false");
			} else {
				$(".yyhj_sliddown").slideUp(100);
				$(".addMore").attr("flag", "true");
			}
		});
	} else {
		$(".yyhj_title_mid").append("<span class='addMore' flag='true'><img src='images/xiala.png' width='14' height='13'></span>");
		$(".addMore").unbind().click(function() {
			if ($(".addMore").attr("flag") == "true") {
				$(".yyhj_sliddown").slideDown(100);
				$(function() {
					$('#selectTitle').initList();
				})
				$(".addMore").attr("flag", "false");
			} else {
				$(".yyhj_sliddown").slideUp(100);
				$(".addMore").attr("flag", "true");
			}
		});
	}
}

/**
 * 主叫方添加用户UI 
 */
function ActiveAddPeople(obj) {
	var length = obj.length;

	//添加用户状态图标
	for (var i = 0; i < length; i++) {
		layui.yydj_status({
			"uid" : obj[i].uid,
			"name" : obj[i].username,
			"type" : "creator",
			"id" : obj[i].id
		});

		var userInfo = {
			uid : obj[i].uid,
			name : obj[i].username,
			id : obj[i].id
		};

		try {
			userMap.set(Number(userInfo.uid), userInfo);
		} catch (err) {
			return false;
		}

		MXZH.log("用户信息： ", JSON.stringify(userMap));
		var tmp = userMap.get(Number(userInfo.uid));
		MXZH.log("用户id: ", tmp.uid);

		//限制语音对讲名称长度
		if (AddCountCreator <= 3) {
			if (AddCountCreator > 0) {
				$(".yyhj_title_mid").prepend("<span class=split>、</span>");
			}
			
			$(".yyhj_title_mid").prepend("<span id=" + tmp.uid + " class=" + tmp.uid + ">" + tmp.name + "</span>");
		}
		
		AddCountCreator++;
		
		if ($(".yyhj_title_mid").width() > 350) {
			var w_size = $(".yyhj_sliddown").width();
			var w_s = w_size / 4 - 40;
			$(".yyhjListTitle").width(w_s + "px");
			$(".yyhjListMain").width(w_s + "px");
			$(".yyhjListMain").height("250px");
			$(".yyhjListBottomGray").width(w_s + "px");
			$(".yyhjListBottomBlue").width(w_s + "px");
			$(".yyhjBoxListItem").width(w_s - 2 + "px");
			$(".yyhjBoxListItem").height("274px");
			$(".nacl_module").attr('width', w_s);
			$(".nacl_module").attr('height', 250);
			$(".yyhjBox").width(w_size + "px");
			$(".yyhjBox ul").width(w_size - 34 + "px");
			$(".yyhjBox").height((w_size - 140) + "px");
			$(".yyhjGrayBgName").width(0.93 * w_s + "px");
		}
		//绑定用户删除事件
		$(".yyhjListTitleClose").unbind().click(function() {
			var id = $(this).attr("del"); //UI操作  
			var uname = $(this).attr("uname");
			var uid = $(this).attr("id"); //数据操作

			$("#yydj_title_mid").find("." + uid).remove();
			$("#user_" + uid).remove();
			$("." + uid).remove();
			$($(".right-box")[0]).find("#" + id).remove();
			$(".left-box").append("<span class='item' uid='" + uid + "' id='" + id + "' avatar='" + avatar + "' username='" + uname + "' >" + uname + "</span>");
			$(this).parent().parent().parent().remove();

			AddCountCreator--;
			MXZH.log("AddCountCreator(ActiveAddPeople): ", AddCountCreator);
			
			//只有一个用户的情况下删除顿号
			if (AddCountCreator == 1) {
				$('.split').remove();
			}

			if (userMap.has(Number(uid))) {
				userMap.delete(Number(uid));
				MXZH.log("用户信息：", JSON.stringify(userMap));
			}

			var cnt = 0;
			if (AddCountCreator < 3) {
				userMap.forEach(function(value, key) {
					cnt++;
					if (cnt == 3) {
						
						var tmp = userMap.get(Number(key));
						
						if (AddCountCreator > 0) {
							$(".yyhj_title_mid").prepend("<span class=split>、</span>");
						}
						
						$(".yyhj_title_mid").prepend("<span id=" + tmp.uid + " class=" + tmp.uid + ">" + tmp.name + "</span>");
						
						AddCountCreator++;
					}
				}, userMap)
			}

			//发送逐出消息
			var envictMessage = {
				operate : "PTT_ENVICT",
				roomId : RoomId,
				userId : Number(uid)
			};
			var tmpMessage = wrapPttMsg(envictMessage);
			MXZH.log("逐出用户" + uid + ":", JSON.stringify(tmpMessage));
			postMsg(true, wrapPttMsg(envictMessage));

			if (RoomId != "") {
				try {
					if (conferenceMap.get(RoomId).has(Number(uid))) {
						conferenceMap.get(RoomId).delete(Number(uid));
					}
				} catch (err) {
					return false;
				}
			}

			MXZH.log("当前会话：", JSON.stringify(conferenceMap));
		});
	}

	$(".yyhj_sliddown").slideUp(100);

	if ($(".yyhj_title_mid .addMore").length) {
		$(".addMore").unbind().click(function() {
			if ($(".addMore").attr("flag") == "true") {
				$(".yyhj_sliddown").slideDown(100);
				$(function() {
					$('#selectTitle').initList();
				})
				$(".addMore").attr("flag", "false");
			} else {
				$(".yyhj_sliddown").slideUp(100);
				$(".addMore").attr("flag", "true");
			}
		});
	} else {
		$(".yyhj_title_mid").append("<span class='addMore' flag='true'><img src='images/xiala.png' width='14' height='13'></span>");
		$(".addMore").unbind().click(function() {
			if ($(".addMore").attr("flag") == "true") {
				$(".yyhj_sliddown").slideDown(100);
				$(function() {
					$('#selectTitle').initList();
				})
				$(".addMore").attr("flag", "false");
			} else {
				$(".yyhj_sliddown").slideUp(100);
				$(".addMore").attr("flag", "true");
			}
		});
	}
}

/**
 * 被叫方添加用户UI
 */
function AddUser(obj) {
	//添加用户状态图标
	layui.yydj_status({
		"uid" : obj.uid,
		"name" : obj.username,
		"type" : "user",
		"id" : obj.id
	});

	var userInfo = {
		uid : obj.uid,
		name : obj.username,
		id : obj.id
	};

	try {
		userMap.set(Number(userInfo.uid), JSON.stringify(userInfo));
		MXZH.log("用户信息： ", JSON.stringify(userMap));
		MXZH.log(JSON.stringify(userMap.get(Number(userInfo.uid))));
	} catch (err) {
		MXZH.log(err);
		return false;
	}
	
	if (AddCount <= 3) {
		if (AddCount > 0) {
			$(".yyhj_title_mid").prepend("<span class=split>、</span>");
		}
		
		$(".yyhj_title_mid").prepend("<span id=" + obj.uid + " class=" + obj.uid + ">" + obj.username + "</span>");
	}
	
	AddCount++;
	
	if ($(".yyhj_title_mid").width() > 350) {
		var w_size = $(".yyhj_sliddown").width();
		var w_s = w_size / 4 - 40;
		$(".yyhjListTitle").width(w_s + "px");
		$(".yyhjListMain").width(w_s + "px");
		$(".yyhjListMain").height("250px");
		$(".yyhjListBottomGray").width(w_s + "px");
		$(".yyhjListBottomBlue").width(w_s + "px");
		$(".yyhjBoxListItem").width(w_s - 2 + "px");
		$(".yyhjBoxListItem").height("274px");
		$(".nacl_module").attr('width', w_s);
		$(".nacl_module").attr('height', 250);
		$(".yyhjBox").width(w_size + "px");
		$(".yyhjBox ul").width(w_size - 34 + "px");
		$(".yyhjBox").height((w_size - 140) + "px");
		$(".yyhjGrayBgName").width(0.93 * w_s + "px");
	}
}

/**
 * 
 */
function enterState(usrDiv, message) {
	//界面修改
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxGreen');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("<span>通话中</span><img src='images/yy2.gif' width='25' height='20'>");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgGreen');

	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();

	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomGray');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjGrayBgName');

	var roomid = Number(message.msg.roomId);
	var userid = Number(window.parent.IM.userId);
	var reqid = Number(message.msg.userId);
	var server = window.parent.av_server;
	var port_video = window.parent.v_port; //视频端口
	var port_audio = window.parent.a_port; //音频端口

	if (window.parent.CallMode == "p2p") { //点对点模式默认打开麦克风
		//打开麦克风
		var getMic = "{\"function\":\"GetMic\"}";
		window.document.getElementById("listener").firstChild.postMessage(getMic);
	} else if (window.parent.CallMode == "group") { //群组对讲模式默认关闭麦克风
		//关闭麦克风
		var freeMic = "{\"function\":\"FreeMic\"}";
		window.document.getElementById("listener").firstChild.postMessage(freeMic);
	}

	//进入音频房间
	var audioVideo = "listener";
	var enterAudioRoom = "{\"function\":\"EnterAudioRoom\",\"serverip\":\"" + server + "\",\"serverport\":\"" + port_audio + "\",\"roomid\":\" " + roomid + " \",\"userid\":\"" + userid + "\",}";
	document.getElementById(audioVideo).firstChild.postMessage(enterAudioRoom);
	MXZH.log("用户" + userid + "进入音频房间：", enterAudioRoom);
}

/**
 * 用户挂断状态改变
 */
function hangupState(usrDiv, message) {
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxRed');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("连接断开");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgRed');
	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();
	usrDiv.find('#yyhjListBottom').append("<div id='yyhjBgXtb' class='yyhjBlueBgXtb' title='再次连接'><img src='images/clxtb.png' width='38' height='30'></div>");
	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomBlue');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjBlueBgName');
	if ($(".yyhj_title_mid").width() > 350) { 
		$('.yyhjBlueBgXtb').css("margin-left", "-40px");
	}
}

/**
 * 呼叫用户超时状态改变
 */
function timeoutState(usrDiv, message) {
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxRed');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("呼叫超时");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgRed');

	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();
	usrDiv.find('#yyhjListBottom').append("<div id='yyhjBgXtb' class='yyhjBlueBgXtb' title='再次连接'><img src='images/clxtb.png' width='38' height='30'></div>");
	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomBlue');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjBlueBgName');
	if ($(".yyhj_title_mid").width() > 350) { 
		$('.yyhjBlueBgXtb').css("margin-left", "-40px");
	}
}

/*
 * 用户离线状态处理
 */
function offlineState(usrDiv, message) {
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxRed');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("用户离线");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgRed');

	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();
	usrDiv.find('#yyhjListBottom').append("<div id='yyhjBgXtb' class='yyhjBlueBgXtb' title='再次连接'><img src='images/clxtb.png' width='38' height='30'></div>");
	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomBlue');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjBlueBgName');
	if ($(".yyhj_title_mid").width() > 350) { 
		$('.yyhjBlueBgXtb').css("margin-left", "-40px");
	}
}


/**
 * 呼叫用户忙碌状态改变
 */
function busyState(usrDiv, message) {
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxRed');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("忙碌中");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgRed');

	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();
	usrDiv.find('#yyhjListBottom').append("<div id='yyhjBgXtb' class='yyhjBlueBgXtb' title='再次连接'><img src='images/clxtb.png' width='38' height='30'></div>");
	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomBlue');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjBlueBgName');
	if ($(".yyhj_title_mid").width() > 350) { 
		$('.yyhjBlueBgXtb').css("margin-left", "-40px");
	}
}

/**
 * 
 */
function hangonState(usrDiv, message) {
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxGreen');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("呼叫保持");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgGreen');

	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();

	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomGray');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjGrayBgName');
	if ($(".yyhj_title_mid").width() > 350) { 
		$('.yyhjBlueBgXtb').css("margin-left", "-40px");
	}
}

/**
 * 
 */
function callState(usrDiv, message) {
	usrDiv.find('#yyhjListimgBox').attr('class', '');
	usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxGreen');

	usrDiv.find('#yyhjListNameBg').empty();
	usrDiv.find('#yyhjListNameBg').append("正在连接");
	usrDiv.find('#yyhjListNameBg').attr('class', '');
	usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgBlue');

	usrDiv.find('#yyhjListBottom').attr('class', '');
	usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();

	usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomGray');

	usrDiv.find('#yyhjBgName').attr('class', '');
	usrDiv.find('#yyhjBgName').addClass('yyhjGrayBgName');
}

/**
 * 
 */
function switchVideoState(usrDiv, message) {
	if (message.msg.videoStates == 1) {
		usrDiv.find('#yyhjListimgBox').css('display', 'none');
	} else if (message.msg.videoStates == 0) {
		usrDiv.find('#yyhjListimgBox').css('display', 'block');
	}
}

/**
 * 用户UI状态改变
 */
function StateChange(message) {
	var usrDiv = $('#test').find("#user_" + message.msg.userId);
	switch (message.msg.operate) {
	case "PTT_ENTER":
		enterState(usrDiv, message);
		break;
	case "PTT_HANGON":
		hangonState(usrDiv, message);
		break;
	case "PTT_HANGUP":
		hangupState(usrDiv, message);
		//重新呼叫
		$("#user_" + message.msg.userId).find("#yyhjBgXtb").unbind().click(function() {
			var uid = $(this).parent().parent().attr("uid");
			var addMessage = {
				operate : "PTT_ADD",
				userId : Number(uid),
				roomId : RoomId,
				inviterId : CreatorId,
				callMode : window.parent.CallMode,
				callType : "audio"
			};
			postMsg(true, wrapPttMsg(addMessage));
			MXZH.log("重新呼叫用户：", JSON.stringify(addMessage));
			//修改语音对讲界面，正在连接
			callState(usrDiv, message);
		})
		break;
	case "PTT_VIDEO_SWITCH":
		switchVideoState(usrDiv, message);
		break;
	case "PTT_TIMEOUT":
		timeoutState(usrDiv, message);
		$("#user_" + message.msg.userId).find("#yyhjBgXtb").unbind().click(function() {
			var uid = $(this).parent().parent().attr("uid");
			var addMessage = {
				operate : "PTT_ADD",
				userId : Number(uid),
				roomId : RoomId,
				inviterId : CreatorId,
				callMode : window.parent.CallMode,
				callType : "audio"
			};
			postMsg(true, wrapPttMsg(addMessage));
			MXZH.log("重新呼叫用户：", JSON.stringify(addMessage));
			callState(usrDiv, message);
		})
		break;
	case "PTT_BUSY":
		busyState(usrDiv, message);
		$("#user_" + message.msg.userId).find("#yyhjBgXtb").unbind().click(function() {
			var uid = $(this).parent().parent().attr("uid");
			var addMessage = {
				operate : "PTT_ADD",
				userId : Number(uid),
				roomId : RoomId,
				inviterId : CreatorId,
				callMode : window.parent.CallMode,
				callType : "audio"
			};
			postMsg(true, wrapPttMsg(addMessage));
			MXZH.log("重新呼叫用户：", JSON.stringify(addMessage));
			callState(usrDiv, message);
		});
		break;
	case "PTT_OFFLINE":
		offlineState(usrDiv, message);
		$("#user_" + message.msg.userId).find("#yyhjBgXtb").unbind().click(function() {
			var uid = $(this).parent().parent().attr("uid");
			var addMessage = {
				operate : "PTT_ADD",
				userId : Number(uid),
				roomId : RoomId,
				inviterId : CreatorId,
				callMode : window.parent.CallMode,
				callType : "audio"
			};
			postMsg(true, wrapPttMsg(addMessage));
			MXZH.log("重新呼叫用户：", JSON.stringify(addMessage));
			callState(usrDiv, message);
		});
		break;
	default:
		break;
	}
}

/**
 * 被叫方初始情况下，处理enterlist
 */
function EnterListOcx(message) {
	members = message.msg.members;
	var tmpMembers = message.msg.members;
	var videoStates = message.msg.videoStates;

	var server = window.parent.av_server;
	var port_video = window.parent.v_port;
	var port_audio = window.parent.a_port;

	var roomid = Number(message.msg.roomId);
	var userid = Number(window.parent.IM.userId);
	
	//进入音频房间
	var audioVideo = "listener";
	var enterAudioRoom = "{\"function\":\"EnterAudioRoom\",\"serverip\":\"" + server + "\",\"serverport\":\"" + port_audio + "\",\"roomid\":\"" + roomid + "\",\"userid\":\"" + userid + "\",}"; 
	document.getElementById(audioVideo).firstChild.postMessage(enterAudioRoom);
	MXZH.log("用户" + userid + "进入音频房间：", enterAudioRoom);

	if (window.parent.CallMode == "p2p") {
		//点对点默认打开麦克风
		var getMic = "{\"function\":\"GetMic\"}";
		window.document.getElementById("listener").firstChild.postMessage(getMic);
	} else if (window.parent.CallMode == "group") {
		//群组对讲默认关闭麦克风
		var freeMic = "{\"function\":\"FreeMic\"}";
		window.document.getElementById("listener").firstChild.postMessage(freeMic);
	}
	
	//打开视频
	for (var i = 0; i < members.length; i++) {
		if (members[i] != getCurUserId()) {
			var usrDiv = $('#test').find("#user_" + members[i]);

			//界面修改
			usrDiv.find('#yyhjListimgBox').attr('class', '');
			usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxGreen');

			usrDiv.find('#yyhjListNameBg').empty();
			usrDiv.find('#yyhjListNameBg').append("<span>通话中</span><img src='images/yy2.gif' width='25' height='20'>");
			usrDiv.find('#yyhjListNameBg').attr('class', '');
			usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgGreen');

			usrDiv.find('#yyhjListBottom').attr('class', '');
			usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();

			usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomGray');

			usrDiv.find('#yyhjBgName').attr('class', '');
			usrDiv.find('#yyhjBgName').addClass('yyhjGrayBgName');
		}
	}
	
	//处理已经进入音视频房间的用户
	for (var i = 0; i < videoStates.length; i++ ) {
		var audioVideo = "audioVideo_" + videoStates[i];
		//进入视频房间
		var enterVideoRoom = "{\"function\":\"EnterVideoRoom\",\"serverip\":\"" + server + "\",\"serverport\":\"" + port_video + "\",\"roomid\":\" " + roomid + " \",\"userid\":\"" + userid + "\",\"reqid\":\"" + videoStates[i] + "\",}";
		document.getElementById(audioVideo).firstChild.postMessage(enterVideoRoom);
		MXZH.log("用户" + videoStates[i] + "进入视频房间：", enterVideoRoom);
	}
}

/**
 * 被叫方有新用户加入时处理
 */
function EnterOcx(message) {
	var userId = message.msg.userId;
	var roomId = message.msg.roomId;
	var curUserId = window.parent.IM.userId;

	if (userId != getCurUserId) {
		var usrDiv = $('#test').find("#user_" + userId);

		//界面修改
		usrDiv.find('#yyhjListimgBox').attr('class', '');
		usrDiv.find('#yyhjListimgBox').addClass('yyhjListimgBoxGreen');

		usrDiv.find('#yyhjListNameBg').empty();
		usrDiv.find('#yyhjListNameBg').append("<span>通话中</span><img src='images/yy2.gif' width='25' height='20'>");
		usrDiv.find('#yyhjListNameBg').attr('class', '');
		usrDiv.find('#yyhjListNameBg').addClass('yyhjListNameBgGreen');

		usrDiv.find('#yyhjListBottom').attr('class', '');
		usrDiv.find('#yyhjListBottom').find('#yyhjBgXtb').remove();

		usrDiv.find('#yyhjListBottom').addClass('yyhjListBottomGray');

		usrDiv.find('#yyhjBgName').attr('class', '');
		usrDiv.find('#yyhjBgName').addClass('yyhjGrayBgName');

		var roomid = Number(roomId);
		var userid = Number(window.parent.IM.userId);
		var reqid = Number(userId);
		var server = window.parent.av_server;
		var port_video = window.parent.v_port; //视频端口
		var port_audio = window.parent.a_port; //音频端口

		//进入音频房间
		var audioVideo = "listener";
		var enterAudioRoom = "{\"function\":\"EnterAudioRoom\",\"serverip\":\"" + server + "\",\"serverport\":\"" + port_audio + "\",\"roomid\":\" " + roomid + " \",\"userid\":\"" + userid + "\",}";
		document.getElementById(audioVideo).firstChild.postMessage(enterAudioRoom);
		MXZH.log("用户" + userid + "进入音频房间：", enterAudioRoom);
	}
}