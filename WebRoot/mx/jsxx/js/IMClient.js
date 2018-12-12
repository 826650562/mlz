/**
 * 心跳 <br/>
 * 
 * 要求 <br/>
 * pingInterval > pongTimeout
 * 
 * 测试用例
 * 
 * <ol>
 * 	<li>ping能够正常启动</li>
 * 	<li>pong能够正常启动</li>
 * 	<li>pong异常正确启动</li>
 * 	<li>ping时异常检查正确启动</li>
 * 	<li>pong时异常检查正确启动</li>
 * 	<li>缓存ping整理时,正确整理</li>
 * 	<li>如果ping发送出错，也会计数,并且程序正常执行</li>
 * 	<li>连续第N+1次发送时,如果前N次没有响应也会报错</li>
 * 	<li>当网络出现异常时,自动心跳停止,并调用回调函数</li>
 * </ol>
 * 
 * @param pingInterval
 * 		ping时间间隔,单位ms
 * @param pongTimeout
 * 		pong超时时间,单位ms
 * @param errTimes
 * 		pong超时次数
 * @param fnPing
 *  	ping函数
 * @param fnError
 * 		错误时的回调函数
 * */
function IMHb(pingInterval, pongTimeout, errTimes, fnPing, fnError) {
	var me = this;
	var pingTask = null;
	var pings = {}; // 待确认包ID,和确认任务ID
	var pingIds = []; // 记录包顺序
	var debug = false; // 开启log

	function TimeoutTaskWithParam(param, fn, timeout) {
		var _p = param;
		var _me = this;
		var _t = null;
		this._ = function() {
			fn(_p);
		}

		this.active = function() {
			_t = window.setTimeout(_me._, timeout); // 开始记录心跳是否超时
			return _t;
		}

		this.getTaskId = function() {
			return _t;
		}
	}

	this.pongTimeoutFn = function(id) { // 响应超时
		debug && MXZH.log("pongTimeoutFn->" + id);
		var task = pings[id];
		delete pings[id];

		if (isExp(id, false)) {
			me.stop(); // 停止心跳
			fnError(); // 产生错误回调
		}
	};

	/**
	 * flag <br />
	 * true->发送时检查
	 * false->接收时检查
	 * */
	function isExp(id, isSend) { // 检查是否连续N次超时
		var i = pingIds.indexOf(id);
		if (isSend) { // 如果是发送时检查,则指针前移
			i = i - 1;
		}
		var f = true;

		for (var j = 0; j < errTimes && f; j++) {
			f = (f && pingIds[i - j]);
		}

		return f;
	}

	this.reset = function() {
		me.stop();
		me.start();
	}

	/**
	 * 开始心跳
	 * */
	this.start = function() {
		if (pingTask) {
			window.clearTimeout(pingTask); // 如果存在异常任务，则清理掉
		}

		var pingId = null;
		try {
			pingId = fnPing();
		} catch (e) {
			pingId = false;
		}

		if (!pingId) { // 发送失败,模拟发送成功,只是永远都没有响应
			pingId = new Date().getTime() + "-" + (Math.random() * 999999);
		}

		var pongTimeoutTask = new TimeoutTaskWithParam(pingId, me.pongTimeoutFn, pongTimeout);
		pings[pingId] = pongTimeoutTask.active();
		pingIds.push(pingId); // 尾插入

		if (pingIds.length > errTimes * 2) { // 规整存储空间防止内存溢出
			pingIds.shift();
		}

		debug && me.log("start");

		if (isExp(pingId, true)) {
			me.stop();
			fnError(); // 产生错误回调
		} else { // 准备下一次
			pingTask = window.setTimeout(me.start, pingInterval);
		}
	};

	this.pong = function(id) {
		id = "".concat(id);
		var task = pings[id];
		delete pings[id];

		if (task) { // 正常pong的包
			debug && MXZH.log("pong-> ok" + id);
			window.clearTimeout(task); // 清理确认任务
			var index = pingIds.indexOf(id);
			delete pingIds[index]; // 从数组中删除
		} else {
			// 异常pong包,该响应已超时,保留异常顺序;
			debug && MXZH.log("pong-> exp" + id);
		}
	}

	/**
	 * 结束心跳
	 * */
	this.stop = function() {
		me.error("stop");
		
		// 清理掉所有的任务
		if (pingTask) {
			window.clearTimeout(pingTask);
		}

		for (var i in pings) {
			window.clearTimeout(pings[i]);
		}

		// 重置所有变量
		pingTask = null;
		pings = {};
		pingIds = [];

		debug && me.log("stop");
	};

	this.debug = function(flag) {
		debug = flag;
	}

	this.log = function(method) {
		MXZH.log("fn->", method);
		MXZH.log("pingIds->", JSON.stringify(pingIds));
		MXZH.log("pings->", JSON.stringify(pings));
	}

	this.error = function(method) {
		MXZH.log("fn->", method);
		MXZH.log("pingIds->", JSON.stringify(pingIds));
		MXZH.log("pings->", JSON.stringify(pings));
	}
}

/**
 * 即时消息客户端
 * */
function IMClient(opt) {
	/**
	 * 消息类型
	 * */
	IMClient.MsgType = {
		MESSAGE : 0,
		REPLY : 1,
		REQUEST : 2,
		RESPONSE : 3,
		PING : 4,
		PONG : 5
	};

	/**
	 * 多媒体消息类型
	 * */
	IMClient.MsgChatType = {
		MSG_TYPE_TEXT : 0,
		MSG_TYPE_IMAGE : 1,
		MSG_TYPE_AUDIO : 2,
		MSG_TYPE_VIDEO : 3,
		MSG_TYPE_LOCATION : 4,
		MSG_TYPE_CARD : 5,
		MSG_TYPE_ATTENDANCE : 6,
		MSG_TYPE_NOTICE : 7
	};

	IMClient.IDKEY = "id";
	IMClient.STATUSKEY = "status_code";
	IMClient.TYPEKEY = "type";
	IMClient.FROMKEY = "from";
	IMClient.TOKEY = "to";
	IMClient.BEGINKEY = "begin";
	IMClient.OPERATEKEY = "operate";
	IMClient.BODYKEY = "body";
	IMClient._BODYKEY = "_body";
	IMClient.PARAMFIELDKEY = "paramField";
	IMClient.TOIDKEY = "toId";
	IMClient.MESSAGEKEY = "message";
	IMClient.MSGKEY = "msg";
	IMClient._MESSAGEKEY = "_message";
	IMClient.CONTENTKEY = "content";
	IMClient.SENDERKEY = "sender";

	IMClient.CHATTYPEKEY = "chatType";

	// 消息子类型
	IMClient.TYPE_P2PCHAT_VAL = "chat";
	IMClient.TYPE_GROUPCHAT_VAL = "groupchat";
	IMClient.TYPE_INSTRUCTION_VAL = "instructions";
	IMClient.TYPE_INSTRUCTION_ONOFF_VAL = "instructions_user_offline";
	IMClient.TYPE_INSTRUCTION_VIDEO_VAL = "instructions_video_way";
	IMClient.TYPE_INSTRUCTION_UPDATE_USER_VAL = "instructions_update_user";

	IMClient.STATUS_SUC = "200";

	var MsgType = IMClient.MsgType;
	var MsgChatType = IMClient.MsgChatType;

	/**
	 * 收到后需要响应的消息类型
	 * */
	IMClient.MsgTypeReply = [ MsgType.MESSAGE ];

	var MsgTypeReply = IMClient.MsgTypeReply;

	/**
	 * 判断该类型消息是否需要Reply<br/>
	 * @return true,需要reply; false 不需要Reply
	 * */
	IMClient.needReply = function(_type) {
		return (MsgTypeReply.indexOf(_type) >= 0);
	};

	/**
	 * 判断paramField中是否存在该字段，如果存在则返回value，不存在则返回undefined
	 * */
	IMClient.hasField = function(paramField, key) {
		var value = null;

		if (paramField && key) {
			for (var i = 0, len = paramField.length; i < len; i++) {
				var cur = paramField[i];
				if (cur.name == key) {
					value = cur.value;
				}
			}
		}

		return value;
	}

	var _cfg = opt;

	/**
	 * 连接状态
	 * */
	var _state = {
		OPEN : 0,
		CLOSED : 1
	};

	/**
	 * socket对象
	 * */
	var _socket = null;

	/**
	 * 连接状态
	 * */
	var _me = this;

	var connectCallback = null; // 连接成功回调函数
	var receiveCallback = null; // 收到消息时回调函数 
	var errorCallback = null; // 错误时回调
	var closeCallback = null; // 关闭时回调

	var guid = new GUID();
	var hbTask = null; // 心跳任务
	var reconnectTask = null; // 重连任务

	_me.ping = function() {
		var _id = guid.newGUID();

		var _ping = {
			body : "",
			paramField : [
				{
					"name" : "id",
					"value" : _id
				}
			],
			type : IMClient.MsgType.PING
		}


		_me.send(_ping);

		return _id;
	}

	_me.pong = function(_id) {
		var _pong = {
			body : "",
			paramField : [
				{
					"name" : "id",
					"value" : _id
				}
			],
			type : MsgType.PONG
		}

		_me.send(_pong);

		return _id;
	}

	/**
	 * 当通道打开时
	 * */
	function onopen(e) {
		reconnectTask = null;
		if (!hbTask) {
			hbTask = new IMHb(_cfg.idleTimeout, _cfg.pongTimeout, 3, _me.ping, errorCallback);
		}
		hbTask.start(); // 开始心跳
		if (connectCallback) {
			connectCallback(_me);
		}
	}

	/**
	 * 当收到服务器端数据时的处理<br/>
	 * 一级消息分发
	 * */
	function onmessage(e) {
		var obj = null;
		try {
			obj = _cfg.codec.decode(e.data);
		} catch (err) {
			MXZH.errorLog("消息解析失败!");
			return; // 当收到不正确的消息时丢弃
		}
		if (obj) {
			var type = obj.type;
			if (type == MsgType.PONG) {
				var msgId = IMClient.hasField(obj.paramField, IMClient.IDKEY);
				if (msgId) {
					hbTask.pong(msgId) // 直接丢给心跳任务处理
				}
			} else if (type == MsgType.PING) {
				var msgId = IMClient.hasField(obj.paramField, IMClient.IDKEY);
				if (msgId) {
					_me.pong(msgId) // 响应服务器端的PING
				}
			} else {
				if (receiveCallback) {
					receiveCallback(obj);
				}
			}
		}
	}

	/**
	 * 连接错误
	 * */
	function onerror(e) {
		if (errorCallback) {
			errorCallback(e);
		}
	}

	/**
	 * 连接关闭时
	 * */
	function onclose(e) {
		if (closeCallback) {
			closeCallback(e);
		}
	}

	/**
	 * 将对象转换为ParamField
	 * */
	function toParamFieldArray(tmpObj) {
		var array = [];
		for (var i in tmpObj) {
			array.push({
				name : i,
				value : tmpObj[i] + ""
			});
		}

		return array;

	}

	IMClient.toParamFieldArray = toParamFieldArray;
	_me.error = function(callback) {
		errorCallback = callback;
	}

	_me.close = function(callback) {
		closeCallback = callback;
	}

	/**
	 * 初始化
	 * */
	_me.connect = function(callback) {
		_socket = new WebSocket(_cfg.url);
		_socket.binaryType = "arraybuffer";
		_socket.onopen = onopen;
		_socket.onmessage = onmessage;
		_socket.onerror = onerror;
		_socket.onclose = onclose;

		if (callback) {
			connectCallback = callback;
		}
	}

	/**
	 * 重新连接
	 * */
	_me.reconnect = function() {
		// 清理掉原始的指针
		_socket.onopen = null;
		_socket.onmessage = null;
		_socket.onerror = null;
		_socket.onclose = null;
		try {
			_socket.close(); // 释放掉原有资源
		} catch (e) {}


		// 创建新的绑定
		_socket = new WebSocket(_cfg.url);
		_socket.binaryType = "arraybuffer";
		_socket.onopen = onopen;
		_socket.onmessage = onmessage;
		_socket.onerror = onerror;
		_socket.onclose = onclose;
	}

	/**
	 * 延迟重连
	 * */
	_me.delayConnect = function() {
		if (!reconnectTask) {
			layui.layer.msg("您的即时消息已离线,3秒后系统尝试恢复!");
			reconnectTask = window.setTimeout(_me.reconnect, 3000);
		}
	}

	/**
	 * 发送消息
	 * */
	_me.send = function(obj) {
		if (obj.type == 1) {
			MXZH.log("->" + JSON.stringify(obj));
		}

		var _id = IMClient.hasField(obj.paramField, "id");
		if (!_id) {
			MXZH.errorLog("msg without id");
		} else {
			var array = _cfg.codec.encode(obj);
			try {
				_socket.send(array);
			} catch (err) {
				errorCallback(); // 只有一种可能，连接被关闭触发错误回调
			} finally {}
		}
	};

	/**
	 * 接收消息
	 * */
	_me.receive = function(callback) {
		receiveCallback = callback;
	};

	/**
	 * 登陆<br/>
	 * 返回登陆信令的id
	 * */
	_me.login = function(username, password) {
		var _id = new GUID().newGUID();
		var _uid = new GUID().newGUID();
		_uid = _uid.replace(/-/g, "");

		var tmpObj = {
			id : _id,
			uri : "/user/login",
			username : username,
			password : password,
			uid : _uid,
			begin : getDateString()
		};

		var array = toParamFieldArray(tmpObj);

		var _login = {
			body : "",
			paramField : array,
			type : MsgType.REQUEST,
			uri : "/user/login"
		};

		_me.send(_login);

		return [ _id, _uid ];
	}

	_me.getStatus = function() {
		return _socket.readyState;
	};


	_me.getAddressBook = function() {
		var _id = guid.newGUID();

		var _getAddressBook = {
			body : "",
			paramField : [
				{
					"name" : "uri",
					"value" : "/user/list"
				},
				{
					"name" : "id",
					"value" : _id
				},
				{
					"name" : "updateTime",
					"value" : "1450000000000"
				},
				{
					"name" : "begin",
					"value" : getDateString()
				}

			],
			type : MsgType.REQUEST
		};

		_me.send(_getAddressBook);
	}

	/**
	 * 同步消息
	 * */
	_me.sync = function() {
		var _id = guid.newGUID();

		var _syncMessage = {
			body : "",
			paramField : [
				{
					"name" : "uri",
					"value" : "/message/sync"
				},
				{
					"name" : "id",
					"value" : _id
				},
				{
					"name" : "begin",
					"value" : getDateString()
				}

			],
			type : MsgType.REQUEST
		};

		_me.send(_syncMessage);

		return _id;
	}

	/**
	 * 发送响应消息
	 * */
	_me.reply = function(_id) {
		var _replyMsg = {
			body : "",
			paramField : [
				{
					"name" : "id",
					"value" : _id
				}
			],
			type : MsgType.REPLY
		};

		_me.send(_replyMsg);
	};

	/**
	 * 断开连接
	 * */
	_me.disconnect = function() {
		try {
			_socket.close();
		} catch (e) {}
	};

	/**
	 * 处理心跳消息
	 * */
	_me.handleHeartBeat = function(msg) {};

	function getNormalParamField(_id, _sender, _receiver, _type) {
		var paramObj = {};
		paramObj[IMClient.IDKEY] = _id;
		paramObj[IMClient.FROMKEY] = _sender;
		paramObj[IMClient.TOKEY] = _receiver;
		paramObj[IMClient.TYPEKEY] = _type;

		return paramObj;
	}

	/**
	 * 生成对应的chatMsg
	 * */
	_me.getChatMsg = function(obj) {
		var chatType = null,
			id = guid.newGUID();
		var paramField;
		var bodyObj,
			attachment = obj["attachment"];
		switch (obj[IMClient.CHATTYPEKEY]) {
		case "0": // 点对点消息
			chatType = IMClient.TYPE_P2PCHAT_VAL;
			paramField = getNormalParamField(id, obj.sender, obj.receiver, chatType);
			bodyObj = { // 复制构造消息,不要直接使用原obj
				chatType : chatType,
				type : obj.type,
				content : obj.content,
				sender : obj.sender,
				time : obj.time,
				receiver : obj.receiver,
				attachment : null
			};
			break;
		case "1": // 群组消息
			chatType = IMClient.TYPE_GROUPCHAT_VAL;
			paramField = getNormalParamField(id, obj.sender, obj.groupId, chatType);
			bodyObj = { // 复制构造消息,不要直接使用原obj
				chatType : chatType,
				type : obj.type,
				content : obj.content,
				sender : obj.sender,
				time : obj.time,
				groupId : obj.groupId,
				attachment : null
			};
			break;
		}

		if (attachment) { // 对附件的处理
			bodyObj.attachment = attachment;
		} else {
			delete bodyObj.attachment;
		}

		var imMsg = {
			body : JSON.stringify(bodyObj), // sender,receiver,chatType,type,content,time
			paramField : toParamFieldArray(paramField),
			type : MsgType.MESSAGE
		};

		return [ id, imMsg ];
	}

	/**
	 * 获得群组消息
	 * */
	_me.getGroupInfo = function(id) {
		var msgId = guid.newGUID();
		var msg = {
			type : MsgType.REQUEST,
			paramField : toParamFieldArray({
				groupId : id,
				id : msgId,
				uri : "/group/info"
			}),
			body : ""
		};

		_me.send(msg);

		return msgId;
	};
}

/**
 * 获取当前日期的字符串
 */
function getDateString() {
	return new Date().getTime() + "";
}

/*
 * 功能：生成一个GUID码，其中GUID以14个以下的日期时间及18个以上的16进制随机数组成，GUID存在一定的重复概率，
 * 但重复概率极低，理论上重复概率为每10ms有1/(16^18)，即16的18次方分之1，重复概率低至可忽略不计
 */
function GUID() {
	this.date = new Date();

	/* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
	if (typeof this.newGUID != 'function') {

		/* 生成GUID码 */
		GUID.prototype.newGUID = function() {
			this.date = new Date();
			var guidStr = '';
			sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
			sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
			for (var i = 0; i < 9; i++) {
				guidStr += Math.floor(Math.random() * 16).toString(16);
			}
			guidStr += sexadecimalDate;
			guidStr += sexadecimalTime;
			while (guidStr.length < 32) {
				guidStr += Math.floor(Math.random() * 16).toString(16);
			}
			return this.formatGUID(guidStr);
		}

		/*
		 * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
		 * 返回值：返回GUID日期格式的字条串
		 */
		GUID.prototype.getGUIDDate = function() {
			return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
		}

		/*
		 * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
		 * 返回值：返回GUID日期格式的字条串
		 */
		GUID.prototype.getGUIDTime = function() {
			return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
		}

		/*
		* 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
		 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
		 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
		 */
		GUID.prototype.addZero = function(num) {
			if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
				return '0' + Math.floor(num);
			} else {
				return num.toString();
			}
		}

		/* 
		 * 功能：将y进制的数值，转换为x进制的数值
		 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
		 * 返回值：返回转换后的字符串
		 */
		GUID.prototype.hexadecimal = function(num, x, y) {
			if (y != undefined) {
				return parseInt(num.toString(), y).toString(x);
			} else {
				return parseInt(num.toString()).toString(x);
			}
		}

		/*
		 * 功能：格式化32位的字符串为GUID模式的字符串
		 * 参数：第1个参数表示32位的字符串
		 * 返回值：标准GUID格式的字符串
		 */
		GUID.prototype.formatGUID = function(guidStr) {
			var str1 = guidStr.slice(0, 8) + '-',
				str2 = guidStr.slice(8, 12) + '-',
				str3 = guidStr.slice(12, 16) + '-',
				str4 = guidStr.slice(16, 20) + '-',
				str5 = guidStr.slice(20);
			return str1 + str2 + str3 + str4 + str5;
		}
	}
}