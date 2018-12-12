/**
 * 处理集群对讲相关逻辑
 * 
PTTIFRAME -> HOME.jsp
{
	src: "PTTFrame",
	curUser: 12, // 用户ID
	toServer: true // 如果需要发送给服务器端
	data: {}, // PTT对讲协议中需要的数据
}

{
	src: "PTTFrame",
	curUser: 12, // 用户ID
	toServer: false	// 不需要发送给服务器 
	data: {
		method: "setFrameId", // 方法名称
		param: "id"  // 参数
	}
}

PTTAgent -> PTTClient
{
	src: "PTTAgent",
	data: {
		
	}
}
 */
function PTTClient(client) {
	var _client = client; // 用于访问实例方法
	var CLIENT = IMClient; // 用于访问静态方法
	var guid = new GUID();
	var me = this;
	var frameId = null; // 接收传递消息的iframe id
	var frameName = "PTTFrame"; // 消息发送方的名称
	var myName = "PTTAgent"; // 当前模块的名称

	var Operate = { // 所有的操作类型,kv名称必须一致
		PTT_CREATE : "PTT_CREATE",
		PTT_RESPONSE : "PTT_RESPONSE",
		PTT_CALL : "PTT_CALL",
		PTT_ENTER : "PTT_ENTER",
		PTT_HANGUP : "PTT_HANGUP",
		PTT_TIMEOUT : "PTT_TIMEOUT",
		PTT_BUSY : "PTT_BUSY",
		PTT_ADD : "PTT_ADD",
		PTT_ENVICT : "PTT_ENVICT",
		PTT_RELEASE : "PTT_RELEASE",
		PTT_ENTER_LIST: "PTT_ENTER_LIST",
		PTT_VIDEO_SWITCH: "PTT_VIDEO_SWITCH",
		PTT_OFFLINE: "PTT_OFFLINE"
	};

	var Key = {
		postSrc : "src", // 发送模块
		postData : "msg", // 实际待处理的数据
		postUserId : "curUser", // 当前用户ID
		postToServer : "toServer", // 是否需要发送给服务器
		postMethod : "method", // 当消息不需要发送给服务器仅调用本地方法时的方法名称
		postParam : "param" // 当消息不需要发送给服务器仅调用方法时的参数
	};

	/**
	 * 发送消息给目标Frame
	 * */
	function sendToFrame(msg) {
		var data = {};
		data[Key.postSrc] = frameName;
		data[Key.postData] = msg;
		
		//发送消息给父页面
		window.postMessage(JSON.stringify(data),"*");
		
		//发送消息给子页面
		var el = document.getElementById(frameId);
		if(el){
			var elWin = el.contentWindow;
			elWin.postMessage(JSON.stringify(data), "*");
		}
	}

	/**
	 * 给定PTT协议需要的对象,返回可以在IM通道上使用的对象
	 * */
	function wrap(msgId, curId, objStr) {
		return {
			"type" : CLIENT.MsgType.MESSAGE,
			"paramField" : [ {
				"name" : CLIENT.TYPEKEY,
				"value" : CLIENT.TYPE_INSTRUCTION_VAL
			}, {
				"name" : CLIENT.IDKEY,
				"value" : msgId
			}, {
				"name" : CLIENT.BEGINKEY,
				"value" : ""+(new Date().getTime())
			} ],
			"body" : objStr
		};
	}

	/**
	 * 对接收到的服务器端消息的处理<br/>
	 * 4级消息分发
	 * */
	me.inBoundhandle = function(msg) {
		var paramField = msg[CLIENT.PARAMFIELDKEY];
		var _body = msg[CLIENT._BODYKEY];
		var _bodyMsg = _body[CLIENT._MESSAGEKEY][CLIENT.MSGKEY];	
		var _Msg = _body[CLIENT._MESSAGEKEY];
		sendToFrame(_Msg); // 发送至目标位置
	};

	/**
	 * 是否为PTT消息
	 * */
	me.isMyMsg = function(oper) {
		return Operate[oper];
	}

	/**
	 * 设置目标对象的Id
	 * */
	me.setFrameId = function(id) {
		frameId = id;
	}

	/**
	 * 向服务器端发送消息
	 * */
	me.outBoundHandle = function(e) {
		var d = e.data;
		try {
			var obj = JSON.parse(d);
			if (obj["src"] == frameName) {
				var id = guid.newGUID();
				var toServer = obj[Key.postToServer];
				if (toServer) { // 需要转发给服务器
					var msg = wrap(id, obj[Key.postUserId], JSON.stringify(obj[Key.postData])); // 生成可发送消息
					_client.send(msg); // 发送消息
				} else { // 仅父页面使用
					var data = obj[Key.postData];
					var methodName = data[Key.postMethod];
					var methodParam = data[Key.postParam];
					var method = me[methodName];
					if (method) {
						method(methodParam); // 调用函数
					}
				}
			}
		} catch (error) {}
	}

	var fun = window.addEventListener; // 非IE浏览器使用 
	if (!fun) {
		fun = window.attachEvent;
	}

	if (fun) {
		fun("message", me.outBoundHandle);
	}
}