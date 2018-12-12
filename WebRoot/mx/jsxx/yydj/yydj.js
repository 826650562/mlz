/**
 *
 * @authors Steve Chan (you@example.org)
 * @date    2017-06-08 10:09:00
 * @version $Id$
 * 
 * TODO 点击确定后创建PTT会话,优先解决主叫方问题
 */
$(function() {
	var keypress = true; //键盘是否有按键被按下
	var index = parent.layer.getFrameIndex(window.name); //得到当前iframe层的索引
	var isActive = null; // 是否为主叫方
	
	//创建会话维护map
	conferenceMap = new Map();

	window.curUserId = getCurUserId();
	
	//加载下拉列表
	if ($(".yyhj_title_mid .addMore").length) {
		$(".addMore").click(function() {
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
		$(".yyhj_title_mid").append("<div class='addMore' flag='true'><img src='images/xiala.png' width='14' height='13'></div>");
		$(".addMore").click(function() {
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
	
	//隐藏和显示抢麦按键
	if (window.parent.CallMode == "p2p") {  //点对点对讲
		MXZH.log("当前处于点对点对讲模式！");
		document.getElementById("mute").style.visibility="hidden";
		document.getElementById("ptt").style.visibility="hidden";
		document.getElementById("add_more").style.visibility = "hidden";	
		
		var obj = $($(".left-box")[0]).find(".item");
		var selectedIds = getSelectedId(obj);
		
		if (selectedIds.length != 0) {
			if (window.parent.hasRoom) {
				handlePttAdd(selectedIds);
			} else {
				AddPeople(obj);
				createPttConf(selectedIds);
			}
		}
	} else if (window.parent.CallMode == "group") {   //群组对讲
		MXZH.log("当前处于群组对讲模式！");
		document.getElementById("mute").style.visibility="visible";
		document.getElementById("ptt").style.visibility="visible";
		document.getElementById("add_more").style.visibility = "visible";
	}

	/**
	 * 初始化抢麦服务
	 */
	function BfcpClient_Init() {
		bfcpClient = new FC(bfcp_server, bfcp_port);
		MXZH.log("抢麦服务已连接！");
	}
	
	//开始计时器
	function TimerStart() {
		var cnt = 0;
		if(conferenceMap) {
			conferenceMap.forEach(function(value, key) {
				var tmpRoom = conferenceMap.get(key);
				tmpRoom.forEach(function(value, key) {
					if(tmpRoom.get(key).get("status") == "ENTER"){
						cnt ++;
					}
				},tmpRoom);
			},conferenceMap);
		}
		if(cnt == 2) {
			if (TimerFlag == false) {
				TimerFlag = true;
				myClock.resetTimer();
				myClock.startTimer();
			}
		}
	}
	
	//停止计时器
	function TimerStop() {
		var cnt = 0;
		if(conferenceMap) {
			conferenceMap.forEach(function(value, key) {
				var tmpRoom = conferenceMap.get(key);
				tmpRoom.forEach(function(value, key) {
					if(tmpRoom.get(key).get("status") == "ENTER"){
						cnt ++;
					}
				},tmpRoom);
			},conferenceMap);
		}
		if(cnt < 2) {
			TimerFlag = false;
			myClock.stopTimer();
		}
	}
	
	function RemoveValByIndex(arr, index) {
		arr.splice(index, 1);
	}

	//ifarme页面加载完毕后，向父页面发送iframe的id
	var setFrameId = {
		method : "setFrameId", // 方法名称
		param : "layui-layer-iframe" + index // 参数
	};
	postMsg(false, setFrameId);

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

	/**
	 * 根据callMsg判断是否为主叫方
	 * 判断依据：主叫方是否与当前用户ID一致
	 * */
	function setIsActive(callMsg) {
		if (isActive == null) {
			isActive = callMsg.msg.creatorId == getCurUserId();
		}
		return isActive;
	}

	//框选呼叫时，自动打开下下拉框
	if (window.parent.BoxCall) {
		if ($(".addMore").attr("flag") == "true") {
			$(".yyhj_sliddown").slideDown(100);
			$(function() {
				$('#selectTitle').initList();
			})
			$(".addMore").attr("flag", "false");
		}
	}
		
	/**
	 * 被叫方处理被叫
	 */
	function handlePassiveCall() {
		if (window.parent.CallFlag) {
			window.parent.CallFlag = false;
			MXZH.log("呼叫标志：", window.parent.CallFlag);

			RoomId = window.parent.RoomId;
			CreatorId = window.parent.CreatorId;

			var enterResponse = {
				operate : "PTT_ENTER",
				roomId : curRoomId,
				userId : curUserId
			};
			postMsg(true, wrapPttMsg(enterResponse));

			MXZH.log("接听回复：", JSON.stringify(enterResponse));

			try{
				//创建会话维护map
				conferenceMap.set(curRoomId, new Map());

				//加入创建者
				conferenceMap.get(curRoomId).set(CreatorId, new Map());
				conferenceMap.get(curRoomId).get(CreatorId).set("status", "ENTER");
				conferenceMap.get(curRoomId).get(CreatorId).set("role", "creator");

				//加入当前用户
				conferenceMap.get(curRoomId).set(curUserId, new Map());
				conferenceMap.get(curRoomId).get(curUserId).set("status", "ENTER");
				conferenceMap.get(curRoomId).get(curUserId).set("role", "user");
			}catch(err) {
				MXZH.log(err);
				return false;
			}
			MXZH.log("当前会话：", conferenceMap);
		}
	}

	//处理被叫
	handlePassiveCall(window.parent.CallFlag);

	/**
	 * 主叫方处理主叫
	 * */
	function handleActiveCall(message) {
		var roomId = message.msg.roomId;
		var creatorId = message.msg.creatorId;
		
		if(window.parent.hasRoom) {
			MXZH.log("当前会话ID：", RoomId);
			var busyRequest = {
				operate : "PTT_BUSY",
				roomId : roomId,
				userId : curUserId
			};
			postMsg(true, wrapPttMsg(busyRequest));
			MXZH.log("忙碌中：", JSON.stringify(busyRequest));
		} else {
			//语音对讲界面全局会话id
			window.RoomId = roomId;
			window.parent.RoomId = roomId;
			window.parent.hasRoom = true;
			console.log("存在会话标志：", window.parent.hasRoom);

			//语音对讲全局会话创建者
			CreatorId = creatorId;
			window.parent.CreatorId = creatorId;

			try{
				//主叫方收到呼叫通知后conferenceMap创建会话，并添加创建者，修改创建者的角色和状态
				conferenceMap.set(roomId, new Map());
				conferenceMap.get(roomId).set(creatorId, new Map());
				conferenceMap.get(roomId).get(creatorId).set("status", "ENTER");
				conferenceMap.get(roomId).get(creatorId).set("role", "creator");
			}catch(err) {
				MXZH.log("主叫方处理主叫失败！");
				MXZH.log(err);
				return false;
			}
			
			//主叫方收到呼叫通知后，直接回复PTT_ENTER消息
			var enterResponse = {
				operate : "PTT_ENTER",
				roomId : roomId,
				userId : creatorId
			};
			postMsg(true, wrapPttMsg(enterResponse));
			
			MXZH.log("待添加的会话成员：", Members);
			
			for (var i = 0; i < Members.length; i ++) {
				if(Members[i] != CreatorId) {
					conferenceMap.get(roomId).set(Members[i], new Map());
					conferenceMap.get(roomId).get(Members[i]).set("status", "CALL");
					conferenceMap.get(roomId).get(Members[i]).set("role", "user");
				}
			}
			
			MXZH.log("当前会话：", conferenceMap);
		}
	}

	/**
	 * 处理服务器端的CALL，判断是作为主叫还是被叫
	 * */
	function handlePttCall(message) {
		setIsActive(message);
		if (isActive) { // 作为主叫用户
			handleActiveCall(message);
		}
	}

	/**
	 * 有人进入会话<br/>
	 * 更新Room状态<br/>
	 * 更新ConferenceMap状态<br/>
	 * 更新人员状态<br/>
	 * 更新界面<br/>
	 * */
	function handlePttEnter(message) {
		//更新conferenceMap
		var enterUserId = message.msg.userId;
		var enterRoomId = message.msg.roomId;

		if (enterUserId == CreatorId) { //创建者进入房间， 修改状态
			try{
				if(conferenceMap.has(enterRoomId)){   //判断是否存在该会话
					if(conferenceMap.get(enterRoomId).has(enterUserId)) {   //判断是否存在该用户
						conferenceMap.get(enterRoomId).get(enterUserId).set("status", "ENTER");
						conferenceMap.get(enterRoomId).get(enterUserId).set("role", "creator");
					}
				}
				RoomId = enterRoomId;
			}catch(err) {
				MXZH.log("设置用户进入状态失败！");
				return false;
			}
			//初始化成员状态
			for (var i = 0; i < Members.length; i++) {
				if (Members[i] != CreatorId) {
					try{
						if(conferenceMap.has(enterRoomId)) {
							conferenceMap.get(enterRoomId).set(Number(Members[i]), new Map());    //创建成员
							conferenceMap.get(enterRoomId).get(Number(Members[i])).set("role", "user");
							conferenceMap.get(enterRoomId).get(Number(Members[i])).set("status", "CALL");
						}
					}catch(err) {
						MXZH.log("初始化成员状态失败！");
						MXZH.log(err);
						return false;
					}
				}
			}
			Members = "";
		} else { //普通用户进入房间，需要修改角色和状态
			try{
				if(conferenceMap.has(enterRoomId)){
					conferenceMap.get(enterRoomId).set(enterUserId, new Map());
					conferenceMap.get(enterRoomId).get(enterUserId).set("role", "user");
					conferenceMap.get(enterRoomId).get(enterUserId).set("status", "ENTER");
				}
			}catch(err) {
				MXZH.log("普通用户修改角色失败！");
				MXZH.log(err);
				return false;
			}
		}

		MXZH.log("当前会话：", conferenceMap);
		
		//判断会话中的人数，作为计时器开启标志
		TimerStart();

		setIsActive(message);

		if (isActive) { //主叫方处理
			//主叫方添加用户，排除自己
			if (enterUserId != getCurUserId()) {
				//更新用户状态
				StateChange(message);
			}
		} else { //被叫方处理
			//被叫方添加用户，排除自己
			var obj = window.parent.getUserByUid(enterUserId);
			//被叫方添加用户
			AddUser(obj);
			//加载控件
			EnterOcx(message);
		}
	}

	/**
	 * 用户被逐出，被叫方操作
	 * */
	function handlePttEnvict(message) {
		var id = message.msg.userId;
		//更新conferenceMap
		if (conferenceMap.has(message.msg.roomId)) {
			try{
				conferenceMap.get(message.msg.roomId).delete(message.msg.userId);
			}catch(err) {
				MXZH.log(" 更新conferenceMap失败！");
				MXZH.log(err);
				return false;
			}
			MXZH.log("当前会话： ", conferenceMap);
			//语音对讲界面删除被逐出的用户，并添加回下拉列表中
			$("#user_" + id).remove();
			$(".yyhj_title_mid").find("." + id).remove();
			$("." + id).remove();
			
			AddCount --;
			
			if (AddCount == 1) {
				$(".split").remove();
			}
			
			if (userMap.has(id)) {
				userMap.delete(id);
				MXZH.log("用户信息：", JSON.stringify(userMap));
			}
		}
		TimerStop();
	}

	/**
	 * 会话被释放
	 * */
	function handlePttRelease(message) {
		//清空enterMap和conferenceMap
		if (conferenceMap.has(message.msg.roomId)) {
			try{
				conferenceMap.delete(message.msg.roomId);
			}catch(err){
				MXZH.log("释放会话失败！");
				MXZH.log(err);
			}
		}

		if (window.parent.CallMode == "group") {
			//退出抢麦登录
			bfcpClient.logout(message.msg.userId, message.msg.roomId);
		}
		
		MXZH.log("当前会话：", conferenceMap);

		if (window.parent.INDEX) {
			window.parent.BfcpFlag = false;
			window.parent.hasRoom = false;
			layer.close(window.parent.INDEX); //关闭语音对讲界面
		}
	}
	
	/**
	 * 被叫 当前用户作为被叫,进入房间时,收到服务器端推送的已进入房间的人员信息
	 * */
	function handlePttEnterlist(message) {
		var roomId = message.msg.roomId;
		var members = message.msg.members;
		var videoStates = message.msg.videoStates;

		window.parent.BfcpFlag = true;
		MXZH.log("抢麦标志：", window.parent.BfcpFlag);
		
		//启动定时器
		TimerStart();
		
		//更新conferenceMap,更新普通用户的角色和状态
		for (var i = 0; i < members.length; i++) {
			var room = conferenceMap.get(roomId);
			room.forEach(function(value, user) {
				//找到当前会话中的创建者
				var creator = "";
				if (room.get(user).get("role") == "creator") {
					creator = user;
				}
				
				//修改非创建者的用户状态
				if (members[i] != creator) {
					try{
						if(conferenceMap.has(roomId)){
							conferenceMap.get(roomId).set(members[i], new Map());
							conferenceMap.get(roomId).get(members[i]).set("role", "user");
							conferenceMap.get(roomId).get(members[i]).set("status", "ENTER");
						} else {
							return false;
						}
					}catch(err) {
						MXZH.log("修改非创建者用户状态失败!");
						MXZH.log(err);
						return false;
					}
				}
			}, room);
			//添加用户到语音对讲界面
			var obj = window.parent.getUserByUid(members[i]);
			MXZH.log("添加用户：", JSON.stringify(obj));
			
			//被叫方添加用户
			AddUser(obj);
		}

		MXZH.log("当前会话：", conferenceMap);

		//加载控件
		EnterListOcx(message);
	}

	/**
	 * 用户挂断
	 */
	function handlePttHangup(message) {
		var roomId = message.msg.roomId;
		var userId = message.msg.userId;
		//更新会话维护map
		if (roomId && userId) {
			try{
				if(conferenceMap.has(roomId)){
					if(conferenceMap.get(roomId).has(userId)){
						conferenceMap.get(roomId).get(userId).set("status", "HANGUP");
					}
				}
			} catch(err) {
				MXZH.log("更新会话维护map失败！");
				MXZH.log(err);
				return false;
			}
			MXZH.log("当前会话：", conferenceMap);

			TimerStop();
			
			//修改状态
			StateChange(message);
		} else {
			return false;
		}
	}

	/**
	 * 连接超时
	 */
	function handlePttTimeOut(message) {
		var roomId = message.msg.roomId;
		var userId = message.msg.userId;
		MXZH.log("当前会话： ", conferenceMap);
		if (roomId && userId) {
			try{
				if (conferenceMap.has(roomId) ) {
					if(conferenceMap.get(roomId).has(userId)){
						conferenceMap.get(roomId).get(userId).set("status", "TIMEOUT");
						MXZH.log("当前会话： ", conferenceMap);
						StateChange(message);
					}
				}
			}catch(err) {
				MXZH.log(err);
				return false;
			}
		} else {
			return false;
		}
	}
	
	/**
	 * 用户离线
	 */
	function handlePttOffline(message) {
		var roomId = message.msg.roomId;
		var userId = message.msg.userId;
		StateChange(message);
	}
	
	/**
	 * 对方忙碌
	 */
	function handlePttBusy(message) {
		var roomId = message.msg.roomId;
		var userId = message.msg.userId;
		MXZH.log("当前会话： ", conferenceMap);
		if (roomId && userId) {
			try{
				if (conferenceMap.has(roomId)) {
					if(conferenceMap.get(roomId).has(userId)) {
						conferenceMap.get(roomId).get(userId).set("status", "BUSY");
						MXZH.log("当前会话： ", conferenceMap);
						StateChange(message);
					}
				}
			}catch(err) {
				MXZH.log(err);
				return false;
			}
		} else {
			return false;
		}
	}
	
	/**
	 * 被叫方用户挂断处理
	 */
	function handlePassivePttHangup(message) {
		var roomId = message.msg.roomId;
		var userId = message.msg.userId;

		try{
			//被叫方得会话中有某个用户退出会话后，从语音对讲界面删除该用户
			if (conferenceMap.has(roomId)) {
				if (conferenceMap.get(roomId).has(userId)) {
					conferenceMap.get(roomId).delete(userId);
					MXZH.log("当前会话：", conferenceMap);
				} else {
					return false;
				}
			} else {
				return false;
			}
		} catch(err){
			MXZH.log("语音对讲界面删除用户失败!");
			MXZH.log(err);
			return false;
		}

		//删除对应窗口
		$("#user_" + userId).remove();
		$(".yyhj_title_mid").find("." + userId).remove();
		$("." + userId).remove();
		
		AddCount --;
		
		if (AddCount == 1) {
			$(".split").remove();
		}
	}
	
	//处理视频状态
	function handleVideoSwitch(message) {
		var roomid = Number(message.msg.roomId);
		var userid = Number(window.parent.IM.userId);
		var reqid = Number(message.msg.userId);
		if (message.toUser == window.parent.IM.userId) {
			if (message.msg.videoState == 1) {   //打开摄像头
				//显示音视频插件窗口
				$("#user_"+reqid+" #ocx_video").css("opacity",1);
				//隐藏用户状态窗口
				$("#user_"+reqid+" #yyhjListimgBox").hide();
				var enterVideoRoom = "{\"function\":\"EnterVideoRoom\",\"serverip\":\"" + server + "\",\"serverport\":\"" + port_video + "\",\"roomid\":\"" + roomid + "\",\"userid\":\"" + userid + "\",\"reqid\":\"" + reqid + "\",}";
				window.document.getElementById("audioVideo_" + reqid).firstChild.postMessage(enterVideoRoom);
				MXZH.log("用户" + reqid + "进入视频房间：", enterVideoRoom);
			} else if (message.msg.videoState == 0) {   //关闭摄像头
				var exitVideoRoom = "{\"function\":\"ExitVideoRoom\",}";
				window.document.getElementById("audioVideo_" + reqid).firstChild.postMessage(exitVideoRoom);
				MXZH.log("用户" + reqid + "退出视频房间：", exitVideoRoom);
				//隐藏音视频插件窗口
				$("#user_"+reqid+" #ocx_video").css("opacity",0);
				//显示用户状态窗口
				$("#user_"+reqid+" #yyhjListimgBox").show();
			}
		}
		//修改用户小窗口样式 
		StateChange(message);
	}

	//消息监听
	window.addEventListener('message', function(e) {
		MXZH.log("yydj.jsp收到会话管理的消息：", e.data);
		MXZH.log("存在会话标志位（addEventListener）：", window.parent.hasRoom);
		if (e.source != window.parent) return;
		var msg = JSON.parse(e.data);
		var message = msg.msg;
		//回复收到消息
		defaultResp(message);
		switch (message.msg.operate) {
		case "PTT_CALL": //被呼叫
			if (message.toUser == window.parent.IM.userId) {    //判断是否呼叫自己
				if(!window.parent.hasRoom) {
					handlePttCall(message);
				} else {
					MXZH.log("存在会话标志位（PTT_CALL yydj）：", window.parent.hasRoom);
					break;
				}
			}
			break;
		case "PTT_ENTER": //有人进入会话
			if (message.msg.roomId == window.parent.RoomId) {   //判断对应房间号
				handlePttEnter(message);
			}
			break;
		case "PTT_ENVICT": //有人被移除
			if (message.msg.roomId == window.parent.RoomId) {   //判断对应房间号
				handlePttEnvict(message);
			}
			break;
		case "PTT_RELEASE": //创建者释放了会话，属于被叫操作
			if (message.toUser == window.parent.IM.userId) {    //判断是否呼叫自己
				if (message.msg.roomId == window.parent.RoomId) {   //判断对应房间号
					handlePttRelease(message);
				}
			}
			break;
		case "PTT_ENTER_LIST": //得到会话中有哪些人，属于被叫的操作
			if (message.msg.roomId == window.parent.RoomId) {   //判断对应房间号
				handlePttEnterlist(message);
			}
			break;
		case "PTT_HANGUP":
			if (message.msg.roomId == window.parent.RoomId) {   //判断对应房间号
				setIsActive(message);   //判断主叫被叫
				if (isActive) { 
					handlePttHangup(message);    //主叫方处理
				} else { 
					handlePassivePttHangup(message);    //被叫方处理
				}
			}
			break;
		case "PTT_TIMEOUT":
			setIsActive(message);
			if (isActive) {
				handlePttTimeOut(message);
			}
			break;
		case "PTT_OFFLINE":
			handlePttOffline(message);
			break;
		case "PTT_BUSY":
			setIsActive(message);
			if (isActive) {
				handlePttBusy(message);
			}
			break;
		case "PTT_VIDEO_SWITCH": //视频控件开启和关闭
			handleVideoSwitch(message);
			break;
		default:
			break;
		}
	}, false);
	
	/**
	 * 作为主叫方,创建会话
	 * */
	function createPttConf(members) {
		//创建会话
		var uid = Number(getCurUserId());
		if (members && members.length > -1) {
			//members中加入创建者
			members.push(uid);
			Members = members;
			var createMessage = {
				admin : [],
				creatorId : uid,
				members : members,
				operate : "PTT_CREATE",
				callMode : window.parent.CallMode,
				callType : "audio"
			};
			MXZH.log("创建会话：", JSON.stringify(createMessage));
			postMsg(true, wrapPttMsg(createMessage));
		}
	}

	/**
	 * 主叫方添加用户
	 */
	function handlePttAdd(members) {
		var room = "";
		if (RoomId) {
			room = conferenceMap.get(RoomId);
		}

		var newMembers = [];

		MXZH.log("已选定的用户：", JSON.stringify(members));

		//获取当前在房间中的所有人，排除自己
		var curMembers = [];
		room.forEach(function(value, key) {
			if (key != window.parent.IM.userId) {
				curMembers.push(Number(key));
			}
		}, room)

		MXZH.log("在会话中的用户：", JSON.stringify(curMembers));

		//排除已经在会话中的人
		var tmp = members.concat(curMembers);
		
		var o = {};
		
		for (var i = 0; i < tmp.length; i++) {
			(tmp[i] in o) ? o[tmp[i]]++ : o[tmp[i]] = 1;
		}
		
		for (x in o) {
			if (o[x] == 1) {
				newMembers.push(Number(x));
			}
		}
		
		if (members.length > curMembers.length) { //添加用户
			MXZH.log("待呼叫的用户：", JSON.stringify(newMembers));
			var obj = [];
			for (var i = 0; i < newMembers.length; i++) {
				var tmpObj = window.parent.getUserByUid(newMembers[i]);
				obj.push(tmpObj);
			}
			
			ActiveAddPeople(obj);

			//开始添加新用户
			for (var i = 0; i < newMembers.length; i++) {
				var addMessage = {
					operate : "PTT_ADD",
					roomId : RoomId,
					inviterId : CreatorId,
					userId : newMembers[i],
					callMode : window.parent.CallMode,
					callType : "audio"
				}
				MXZH.log("添加用户：", JSON.stringify(addMessage));
				
				postMsg(true, wrapPttMsg(addMessage));
				try{
					if(conferenceMap.has(RoomId)){
						conferenceMap.get(RoomId).set(newMembers[i], new Map());
						conferenceMap.get(RoomId).get(newMembers[i]).set("role", "user");
						conferenceMap.get(RoomId).get(newMembers[i]).set("status", "CALL");
					} else {
						return false;
					}
				}catch(err) {
					MXZH.log("添加新用户失败！");
					MXZH.log(err);
					return false;
				}
			}
			MXZH.log("当前会话：", conferenceMap);
			$(".yyhj_sliddown").slideUp(100);
		} else if (members.length < curMembers.length) {  //删除用户
			MXZH.log("待刪除的用戶：", JSON.stringify(newMembers));
			//删除标题和用户界面
			for (var i = 0; i < newMembers.length; i++) {
				var uid = newMembers[i];
				$("#yydj_title_mid").find("." + uid).remove();
				$("#user_" + uid).remove();
				AddCountCreator--;
				if (userMap.has(Number(uid))) {
					userMap.delete(Number(uid));
				}
				//发送逐出消息
				var envictMessage = {
					operate: "PTT_ENVICT",
					roomId: RoomId,
					userId: Number(uid)
				};
				MXZH.log("逐出用户" + uid + ":", JSON.stringify(envictMessage));
				postMsg(true, wrapPttMsg(envictMessage));
				if (RoomId != "") {
					try{
						if(conferenceMap.has(RoomId)){
							if (conferenceMap.get(RoomId).has(Number(uid))) {
								conferenceMap.get(RoomId).delete(Number(uid));
							}
						} else {
							return false;
						}
					}catch(err) {
						MXZH.log("逐出用户失败！");
						MXZH.log(err);
						return false;
					}
				} else {
					return false;
				}
				MXZH.log("当前会话：", conferenceMap);
			}
			$(".yyhj_sliddown").slideUp(100);
		} else if (members.length == curMembers.length){   //用戶數目相同
			MXZH.log("用户：", JSON.stringify(newMembers));
			$(".yyhj_sliddown").slideUp(100);
			return false;
		}
	}

	/**
	 * 获得当前被选中的用户ID,不包括自己
	 * */
	function getSelectedId(obj) {
		var result = [];
		for (var i = 0; i < obj.length; i++) {
			var tmpId = obj[i].getAttribute("uid");
			if (tmpId != getCurUserId()) { //排除自己
				result.push(Number(tmpId));
			}
		}
		return result;
	}

	//下拉框确定按键绑定事件，主叫方创建会话
	$("#confirm").click(function() {
		if (window.parent.CallMode == "group") {  //发起群组对讲 
			var obj = $($(".right-box")[0]).find(".item");
			var selectedIds = getSelectedId(obj);

			if (selectedIds) {
				if (window.parent.hasRoom) {
					handlePttAdd(selectedIds);
				} else {
					AddPeople(obj);
					createPttConf(selectedIds);
				}
			} else {
				//没有邀请任何人，收起下拉框
				$(".yyhj_sliddown").slideUp(100);
				return false;
			}
		}
	});

	//规定只有群组对讲时可以抢麦
	if (window.parent.CallMode == "group") {     //群组对讲且会话中人数不少于2人
		//鼠标抢麦
		$("#ptt").click(function() {
			$(this).toggleClass("ptt");
			if (RoomId != "") {
				if ($(this).is('.ptt')) { //请求话权
					//播放抢麦声效
		            var audio = document.getElementById("caller_press");
		            audio.play();
		            
		            //打开麦克风
		            var getMic = "{\"function\":\"GetMic\"}";
		            window.document.getElementById("listener").firstChild.postMessage(getMic);
				} else { //释放话权
					//按键松开声效
					var audio = document.getElementById("caller_release");
					audio.play();

					//话权释放声效
					setTimeout(function() {
						var audio = document.getElementById("caller_freed");
						audio.play();
					}, 300);
					
					//关闭麦克风
					var freeMic = "{\"function\":\"FreeMic\"}";
					window.document.getElementById("listener").firstChild.postMessage(freeMic);
				}
			} else {
				return false;
			}
		});

		//键盘抢麦请求话权
		$(document).keydown(function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 118) {
				if (keypress) {
					if (RoomId != "") {
						$('#ptt').css("background", "#111");
						$(this).toggleClass("ptt");
						keypress = false;
						
						//抢麦声效
						var audio = document.getElementById("caller_press");
						audio.play();

						//打开麦克风
						var getMic = "{\"function\":\"GetMic\"}";
						window.document.getElementById("listener").firstChild.postMessage(getMic);
					}
				}
			}
		});

		//键盘抢麦释放话权
		$(document).keyup(function(event) {
			if (event.which == 118) {
				if (RoomId != "") {
					$('#ptt').attr("style", "");
					keypress = true;
					//松开声效
					var audio = document.getElementById("caller_release");
					audio.play();

					//释放声效
					setTimeout(function() {
						var audio = document.getElementById("caller_freed");
						audio.play();
					}, 300);

					//关闭麦克风
					var freeMic = "{\"function\":\"FreeMic\"}";
					window.document.getElementById("listener").firstChild.postMessage(freeMic);
				}
			}
		});
	}
})