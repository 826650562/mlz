function IMClientPortal(client) {
	var _client = client; // 用于访问实例方法
	var CLIENT = IMClient; // 用于访问静态方法
	var pttClient = new PTTClient(client); // PTT对讲客户端
	var me = this;
	var layim = null;
	var checker = null; // 消息发送检查

	var LoginStateEnum = {
			UNLOGIN : 0, // 未登陆
			LOGINSUC : 1, // 登陆成功
			LOGINFAIL : 2, // 登陆失败
		},
		SyncStateEnum = {
			SYNCED : 0, // 同步成功
			UNSYNCED : 1 // 同步失败
		},
		session = {
			loginId : null, // 登陆信令的ID
			uid : null, // 用户UID
			loginState : LoginStateEnum.UNLOGIN, // 参见 LoginStateEnum
			syncState : SyncStateEnum.UNSYNCED, // 参见  SyncStateEnum
		};

	/**
	 * 记录所有的request信令ID，已经对应的Resposne Handler
	 * */
	var responseHandlers = {
		"id" : function(msg) { // 请求ID，对应的处理函数

		}
	};
	function addRespHandler(id, fun) {
		responseHandlers[id] = fun;
	}
	function getRespHandler(id) {
		return responseHandlers[id];
	}
	function delRespHandler(id) {
		delete responseHandlers[id];
	}

	/**
	 * 登陆请求响应的处理
	 * */
	function loginRespHandler(msg) {
		var param = msg.paramField;
		var flag = false;
		for (var i = 0; i < param.length; i++) {
			var obj = param[i];
			if (obj.name == CLIENT.STATUSKEY && obj.value == CLIENT.STATUS_SUC) {
				session.loginId = null; // 设置为空
				session.loginState = LoginStateEnum.LOGINSUC; // 设置为登陆成功
				flag = true;
				me.logined();
			}
		}

		if (!flag) {
			layui.layer.msg("即时消息登陆失败,请重试!");
		}
	}

	/**
	 * 同步请求响应处理
	 * */
	function syncRespHandler(msg) {
		var param = msg.paramField;
		if (param[CLIENT.STATUSKEY] == CLIENT.STATUS_SUC) {
			session.syncState = SyncStateEnum.synced; // 设置为同步成功
		}
	}

	/**
	 * 是否已登录<br/>
	 * 如果已登录，则可以发送消息!
	 * */
	me.isLogin = function() {
		return (session.loginState == LoginStateEnum.LOGINSUC);
	}

	/**
	 * 处理响应
	 * */
	me.handleResp = function(msg) {
		//console.debug("<-" + JSON.stringify(msg));
		var param = msg.paramField;
		var id = CLIENT.hasField(param, CLIENT.IDKEY);
		var handler = getRespHandler(id);
		if (handler) {
			handler(msg); // 执行消息处理
		}
		delRespHandler(id); // 删除对应的handler
	};

	/**
	 * 处理请求
	 * */
	me.handleReq = function(msg) {
		MXZH.log("RESP<-" + JSON.stringify(msg));
	};

	/**
	 * 处理即时消息相关内容
	 * */
	me.handleChatMsg = function(msg) {
		var bodyStr = msg[IMClient.BODYKEY];
		if (bodyStr) {
			var bodyObj = JSON.parse(bodyStr);
			// "{\"chatType\":\"chat\",\"content\":\"你好\",\"receiver\":\"danglei2\",\"sender\":\"lvyiming2\",\"time\":1497937247617,\"type\":0,\"x\":31.245556,\"y\":121.33647}"

			var layImMsg = toLayImMsg(bodyObj);
			if (layImMsg && layim) {
				layim.getMessage(layImMsg);
			}

			MXZH.log("chat<-" + JSON.stringify(msg));
		}
	};

	/**
	 * 从layIm的消息组装为本地消息<br/>
	 * 发送消息使用,仅支持图片，文字，语音消息的发送<br/>
	 * */
	me.fromLayImMsg = function(data) {
		var Mine = data.mine;
		var To = data.to;
		var seq = Mine.timestamp;
		var d = new Date(seq);
		var time = d.Format("yyyy-MM-dd hh:mm:ss");

		//定义时间
		var jsonstr = {
			"sender" : Mine.id,
			"type" : Mine.msgType, // 默认文字消息
			"content" : Mine.content, //内容
			"time" : seq,
			"t" : time,
			"receiver" : To.id
		};

		if (To.type === 'friend') {
			jsonstr["chatType"] = "0";
		} else if (To.type === 'group') {
			jsonstr["chatType"] = "1";
			jsonstr["groupId"] = To.id;
			delete jsonstr["receiver"];
		}

		var content = Mine.content;
		switch (Mine.msgType) {
		case IMClient.MsgChatType.MSG_TYPE_TEXT:
			break;
		case IMClient.MsgChatType.MSG_TYPE_IMAGE:
		case IMClient.MsgChatType.MSG_TYPE_AUDIO:
		case IMClient.MsgChatType.MSG_TYPE_VIDEO:
			jsonstr["attachment"] = content;
			delete jsonstr.content;
			break;
		}

		return jsonstr;
	}

	/*
	 * 根据用户id 获取 username和头像
	 * zlj
	 */
	function getUserXX(userid) {
		if (!layim) {
			return null;
		}

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
	 * 基于用户名获得对应的userid
	 * */
	function getUserByUsername(username) {
		if (!layim) {
			return null;
		}

		var all = layim.getAllList(); // 自定义的方法
		var id = null;
		for (var i = 0; i < all.length && (id == null); i++) {
			var obj = all[i].list;
			for (var key in obj) {
				if (obj[key].username == username) {
					id = obj[key].userid;
					break;
				}
			}
		}
		return id;
	}

	/**
	 * 获得群组是否存在
	 * */
	function isExistGroup(groupId) {
		if (!layim) {
			return null;
		}

		var all = layim.getAllList(); // 自定义的方法
		var id = null;
		for (var i = 0; i < all.length && (id == null); i++) {
			var obj = all[i].list;
			for (var key in obj) {
				if (obj[key].username == username) {
					id = obj[key].userid;
					break;
				}
			}
		}
		return id;
	}

	/**
	 * 根据传入的路径，实现对图片、语音、视频的解密，生成解密路径
	 * zlj	
	 * */
	function getJmPath(file_url, file_type) {
		var jmresult = "";
		jQuery.ajax({
			url : IM.decryptPath,
			data : {
				yy_url : file_url,
				ypid : file_type
			},
			type : "post",
			async : false,
			dataType : "text",
			success : function(result) {
				jmresult = result;
			},
			error : function(error) {
				jmresult = "";
			}
		});
		return jmresult;
	}

	IMClientPortal.getJmPath = getJmPath;
	/**
	 * 将消息转换为layIm格式的消息<br/>
	 * {
		  username: "纸飞机" //消息来源用户名
		  ,avatar: "http://tp1.sinaimg.cn/1571889140/180/40030060651/1" //消息来源用户头像
		  ,id: "100000" //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
		  ,type: "friend" //聊天窗口来源类型，从发送消息传递的to里面获取
		  ,content: "嗨，你好！本消息系离线消息。" //消息内容
		  ,cid: 0 //消息id，可不传。除非你要对消息进行一些操作（如撤回）
		  ,mine: false //是否我发送的消息，如果为true，则会显示在右方
		  ,fromid: "100000" //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
		  ,timestamp: 1467475443306 //服务端动态时间戳
		}			 
	* */
	var systemMsg = { // 用于暂存通知类消息
		group : {
			"id" : [ {} ]
		},
		friend : {
			"id" : []
		}
	};

	function putCache(msg) {
		systemMsg[msg.type][msg.id] = msg;
	}

	function delCache(msg) {
		delete systemMsg[msg.type][msg.id];
	}

	/**
	 * 根据类型(群组or个人)和id(userid or groupId)获得对应的通知消息
	 * */
	function clearCache(type, objId) {
		var array = systemMsg[type][objId];
		delete systemMsg[type][objId];
		return array;
	}
	
	// 仅在渲染时使用
	function toLayImContent(msgType, attache) {
		var result = ""
		if(msgType === -1){
			return;
		}
		
		switch (msgType) {
		case IMClient.MsgChatType.MSG_TYPE_TEXT:
			result = attache;
			break;
		case IMClient.MsgChatType.MSG_TYPE_IMAGE:
			result = $.extend({},attache);
			var jmresult = getJmPath(attache.original, "");
			result.decrypt = jmresult;
			break;
		case IMClient.MsgChatType.MSG_TYPE_AUDIO:
			result = $.extend({},attache);
			var url = attache.url;
			result.decrypt = getJmPath(url, "");
			break;
		case IMClient.MsgChatType.MSG_TYPE_VIDEO:
			result = $.extend({},attache);
			var url = attache.url;
			result.decrypt = getJmPath(url, "1").substring(3);
			break;
		case IMClient.MsgChatType.MSG_TYPE_LOCATION:
			result = $.extend({},attache);
			result.baseUrl = IM.openLocationUrl;
			break;
		}
		
		return result;
	}

	IMClientPortal.toLayImContent = toLayImContent;
	function toLayImMsg(bodyObj) {
		var imUsername = bodyObj[IMClient.SENDERKEY];
		var user = getUserXX(imUsername);
		var usermsg="";
		if(user.username === ""){
			jQuery.ajax({
				url : "${basePath}/chat_getFriend.action",
				data : {
					username : imUsername
				},
				type : "post",
				async : false,
				dataType : "json",
				success : function(result) {
					usermsg = result;
				},
				error : function(error) {
					usermsg = "";
				}
			});
			
			user = usermsg;
			var groupId = user.groupId;
			var groupname = user.groupname;
			delete user.groupId;
			delete user.groupname;
			layim.addFriend(user,groupId,groupname);
		}
		
		
		var bodyType = bodyObj[IMClient.TYPEKEY];
		var msg = {
			username : user.username, //消息来源用户名
			avatar : user.avatar, //消息来源用户头像
			id : bodyObj.sender, //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
			content : bodyObj.content, //消息内容
			mine : (bodyObj.sender == user.userid), //是否我发送的消息，如果为true，则会显示在右方
			fromid : bodyObj.sender, //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
			timestamp : bodyObj.time, //服务端动态时间戳		
			msgType : bodyType // chat的消息类型,如文字，图片等 基于类型的渲染@2017.10.20
		};

		//判断是 一对一 friend 还是  群组group
		if (bodyObj[IMClient.CHATTYPEKEY] == IMClient.TYPE_P2PCHAT_VAL) {
			msg["type"] = "friend";
			msg["id"] = bodyObj.sender;
		} else if (bodyObj.chatType == IMClient.TYPE_GROUPCHAT_VAL) {
			msg["type"] = "group";
			msg["id"] = bodyObj.groupId;
		}

		//具体内容
		switch (bodyType) {
		case IMClient.MsgChatType.MSG_TYPE_TEXT:
			msg["content"] = toLayImContent(bodyType, bodyObj["content"]);
			break;
		case IMClient.MsgChatType.MSG_TYPE_IMAGE:
		case IMClient.MsgChatType.MSG_TYPE_AUDIO:
		case IMClient.MsgChatType.MSG_TYPE_VIDEO:
		case IMClient.MsgChatType.MSG_TYPE_LOCATION:
			msg["content"] = toLayImContent(bodyType, bodyObj["attachment"]);
			break;
		case IMClient.MsgChatType.MSG_TYPE_NOTICE: // 系统消息
			if (layim) {
				msg["system"] = true;
				msg["content"] = bodyObj.content;

				if (msg["type"] == "group") { // 群组系统消息
					var groupId = bodyObj.groupId;
					msg["id"] = groupId;

					var groups = layim.cache().group,
						group = null;
					for (var i = 0; i < groups.length; i++) {
						if (groups[i].id == groupId) {
							group = groups[i];
							break;
						}
					}

					if (group == null) { // 如果群组不存在,则新建群组
						msg = {
							system : true, //系统消息
							id : groupId, //聊天窗口ID
							type : "group", //聊天窗口类型
							content : bodyObj["content"]
						};
						putCache(msg); // 放入通知类消息缓存中
						me.getGroupInfo(groupId, addGroup); // 此处需要查询获得群组信息,并添加
					} else if (group != null) {
						// 如果群组存在，则对原有群组更新

					}
				} else if (msg["type"] == "friend") { // P2P系统消息

				}
			}
			msg = null;
			break;
		default:
			msg = null;
			layui.layer.msg("收到不支持的消息,消息被丢弃!");
			break;
		}
		return msg;
	}

	function addGroup(msg) {
		var bodyObj = null;
		try {
			bodyObj = JSON.parse(msg.body);
			var detail = bodyObj.data;
			layim.addList({ // 新群组消息
				type : "group", //列表类型，只支持friend和group两种
				avatar : "mx/lsxx/images/qztx1.png", //群组头像
				groupname : detail.name, //群组名称
				id : detail.id //群组id
			});

			// 清理对应的通知消息
			var systemMsg = clearCache("group", detail.id),
				len = systemMsg.length;
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					layim.getMessage(systemMsg[i]);
				}
			}
		} catch (e) {
			layui.layer.msg("收到不支持的消息,消息被丢弃!");
		}
	}
	/**
	 * 3级消息分发
	 * */
	me.handleMsg = function(msg) {
		var param = msg.paramField;
		var id = CLIENT.hasField(param, CLIENT.IDKEY);
		if (id) {
			// 处理消息,处理成功后发送确认消息
			//MXZH.log("MSG<-" + JSON.stringify(msg));
			var paramType = CLIENT.hasField(param, CLIENT.TYPEKEY);
			switch (paramType) {
			case CLIENT.TYPE_P2PCHAT_VAL:
			case CLIENT.TYPE_GROUPCHAT_VAL:
				me.handleChatMsg(msg);
				break;
			case CLIENT.TYPE_INSTRUCTION_VAL: // 4级消息分发
				var body = JSON.parse(msg[CLIENT.BODYKEY]);
				msg[CLIENT._BODYKEY] = body; // 解析一次避免重复解析
				var bodyType = body[CLIENT.TYPEKEY]; // body 的 type
				switch (bodyType) {
				case CLIENT.TYPE_INSTRUCTION_ONOFF_VAL: // 上下线通知
					MXZH.log("on off line<-" + msg);
					break;
				case CLIENT.TYPE_INSTRUCTION_VIDEO_VAL: // 视频相关
					var bodyMsg = body[CLIENT.MESSAGEKEY];
					if (bodyMsg) {
						try {
							body[CLIENT._MESSAGEKEY] = JSON.parse(bodyMsg);
							var oper = body[CLIENT._MESSAGEKEY][CLIENT.MSGKEY][CLIENT.OPERATEKEY];
							if (pttClient.isMyMsg(oper)) {
								pttClient.inBoundhandle(msg);
							}
						} catch (e) {
							MXZH.errorLog(e);
						}
					}
					break;
				case CLIENT.TYPE_INSTRUCTION_UPDATE_USER_VAL: // 用户更新
					var bodyMsg = body[CLIENT.MESSAGEKEY];
					if (bodyMsg) {
						try {
							var _msg = JSON.parse(bodyMsg);
							body[CLIENT._MESSAGEKEY] = _msg;
							if (_msg["deleted"] == 1) {
								// 删除用户

							} else {
								// 更新用户信息
							}
						} catch (e) {
							MXZH.errorLog(e);
						}
					}
					break;
				}
				/* 针对其他操作的消息处理
				else if(){
				}
				*/
				break;
			}

			_client.reply(id); // 发送确认消息
		}
	};

	/**
	 * 二级消息分发
	 * */
	me.receive = function(obj) {
		switch (obj.type) {
		case CLIENT.MsgType.RESPONSE:
			me.handleResp(obj);
			break;
		case CLIENT.MsgType.MESSAGE:
			me.handleMsg(obj); // 处理指令类消息
			break;
		case CLIENT.MsgType.REQUEST:
			me.handleReq(obj);
			break;
		case CLIENT.MsgType.REPLY:
			checker.handleReply(obj);
			break;
		}
	};

	// 关闭标志位
	me.errorOrCloseFlag = false;

	// 重置
	me.reset = function() {
		me.errorOrCloseFlag = false;
	}

	me.errorCallback = function(e) {
		var f = me.errorOrCloseFlag;
		if (!f) {
			me.errorOrCloseFlag = !f;
			// 禁止发送消息
			layui.layer.msg("即时消息已离线!");
			//清除现场 by stevechan
			clearAll();
		}

		// 设置为离线
		layim.setMineStatus("hide");
	}

	me.closeCallback = me.errorCallback;

	me.connected = function() {
		me.errorOrCloseFlag = false;
		// 设置消息收到后的callback
		_client.receive(me.receive);
		// 登录并记录ID
		var ids = _client.login(IM.username, IM.token);
		session.loginId = ids[0];
		session.uid = ids[1];
		addRespHandler(ids[0], loginRespHandler);
	}

	me.logined = function() {
		// 登陆成功后发送消息同步请求
		var id = _client.sync();
		addRespHandler(id, syncRespHandler);
	}

	/**
	 * 渲染通讯录
	 * */
	me.renderAddress = function(obj) {
		var _addresses = JSON.parse(obj.body);
		//通讯录内容
		//MXZH.log(_addresses);
		status = 2;
	}

	/**
	 * 设置layim
	 * */
	me.setLayIm = function(_layim) {
		layim = _layim;
		checker = new SendChecker(layim, me);
	}

	/**
	 * 获得群组信息
	 * */
	me.getGroupInfo = function(groupId, cb) {
		var msgId = _client.getGroupInfo(groupId);
		addRespHandler(msgId, cb);
	}

	/**
	 * 完成消息发送
	 * */
	me.sendMsg = function(obj) {
		if (me.isLogin()) { // 用户已登录
			var chatMsg = _client.getChatMsg(obj); // 发送消息
			var msgId = chatMsg[0];
			var msg = chatMsg[1];
			_client.send(msg);
			checker.addMsg(msgId, msg);
			// 加入响应跟踪
			addRespHandler(msgId, checker.handleReply);
		} else {
			layui.layer.msg("当前用户已离线,消息发送失败!");
		}
	};

	/**
	 * 重新发送消息
	 * */
	me.resendMsg = function(mMsgId) {
		var _msg = checker.getMsg(mMsgId);
		if (_msg) {
			if (me.isLogin()) { // 用户已登录
				_client.send(_msg);
				checker.addMsg(mMsgId, _msg);
				addRespHandler(mMsgId, checker.handleReply); // 加入响应跟踪
			} else {
				layui.layer.msg("当前用户已离线,消息发送失败!");
			}
		}
	}
}

/**
 * 检查消息发送情况
 * */
function SendChecker(layim, portal) {
	var me = this,
		msgs = {},
		tasks = {};
	var _layim = layim;
	var _portal = portal;
	var timeout = 300;

	/**
	 * 从消息日志中找到对应的消息
	 * */
	function getLayimMsgIndex(mlightMsgId) {
		var mlightMsg = msgs[mlightMsgId];
		var bodyObj = JSON.parse(mlightMsg[IMClient.BODYKEY]);
		var to,
			time = bodyObj.time,
			type = null;
		switch (bodyObj[IMClient.CHATTYPEKEY]) {
		case IMClient.TYPE_P2PCHAT_VAL:
			to = bodyObj.receiver;
			type = "friend";
			break;
		case IMClient.TYPE_GROUPCHAT_VAL:
			to = bodyObj.groupId;
			type = "group";
			break;
		}
		return [ type, to, time, mlightMsgId ];
	}

	function Checker(id) {
		var _id = id;

		/**
		 * 如果该函数运行,则说明发送失败;
		 * */
		this.run = function() {
			delete tasks[_id]; // 清理任务
			if (msgs[_id]) {
				var msgIndex = getLayimMsgIndex(_id);
				_layim.setMsgSendFail(msgIndex); // 设置为发送失败
			}
			delete msgs[_id]; // 清理消息
		}
	}

	me.getMsg = function(id) {
		return msgs[id];
	};

	/**
	 * 记录待跟踪消息,启动检查任务<br/>
	 * 不需要考虑被覆盖的情况
	 * */
	me.addMsg = function(id, msg) {
		msgs[id] = msg;
		var task = new Checker(id);
		tasks[id] = window.setTimeout(task.run, timeout);
	};

	var clearTask = function(_id) {
		var theTask = tasks[_id];
		if (theTask) {
			window.clearTimeout(theTask); // 取消任务
			delete tasks[_id]; // 清理任务
		}
	};

	/**
	 * 处理发送消息响应
	 * */
	me.handleReply = function(msg) {
		var paramField = msg.paramField;
		var _id = null;
		try {
			_id = IMClient.hasField(paramField, "id");
		} catch (e) {
			layui.layer.msg("收到不支持的消息,消息被丢弃!");
		}

		if (_id) {
			clearTask(_id); // 清理任务

			var theMsg = msgs[_id];
			if (msgs[_id]) {
				if (msg.type == IMClient.MsgType.REPLY) { // 常规消息
					var msgIndex = getLayimMsgIndex(_id);
					_layim.setMsgSendSuc(msgIndex); // 设置为发送成功
				}
				delete msgs[_id]; // 清理消息
			}
		}
	}
}