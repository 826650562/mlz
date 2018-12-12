/**
 * 变量设置
 * @type {[number,number,number,number]}
 */
var ids = ["1",'2','3','4'];
var operate = ["FC-LOGIN","FC-LOGOUT","FC-GET","FC-RELEASE"];

/**
 * 检测浏览器对WebSocket兼容性
 */
function checkBrowser(){
    if(window.WebSocket) {
        return true;
    }else {
        return false;
    }
}

/**
 * 抢麦客户端及时消息测试
 */
function FC(ip,port) {
    //点击登陆事件
    var _m = this;
    
    /**
     * 客户端对象
     * @type {null}
     */
    var client = null;

    /**
     * 返回出去的服务器信息
     * @type {null}
     */
    var FC_DATA_LOGIN = null;
    var FC_DATA_FLOOR = null;

    /**
     * 登录、登出标志
     * @type {boolean}
     */
    var flag = false;

    /**
     * 抢麦、释放标志
     * @type {boolean}
     */
    var fc_flag = false;

    /**
     * 连接服务器成功的回调函数
     * @param e
     */
    function connectCallback(e) {
        MXZH.log("连接成功!");
    }

    /**
     * 关闭与服务器连接时的回调函数
     * @param e
     */
    function closeCallback(e) {
        MXZH.log("连接已关闭!");
    }

    /**
     * 连接服务器出错时的回调函数
     * @param e
     */
    function errorCallback(e) {
        MXZH.log(e);
    }

    /**
     * 登录退出的回调函数
     * @param e
     */
    function receiveCallback(e) {
        var data = e.paramField[0].value;
        var net_data = net_state(data);
        FC_DATA_LOGIN = net_data;
    }

    /**
     * 抢麦和释放回调函数
     * @param e
     */
    function receiveCallbackMic(e) {
        var data = e.paramField[0].value;
        var mic_data = mic_state(data);
        FC_DATA_FLOOR = mic_data;
        return mic_data;
    }

    /**
     * 处理net端的返回数据
     * net_state :
     * 连接中 ：2
     * 已连接 ：3
     * 正在断开：0
     * 已断开：1
     *
     * @param data
     * @return {[null,null]}
     */
    function net_state(data) {
        var state = null;
        var userid = null;
        //防止心跳信息干扰
        if (data != "pong") {
            var json = JSON.parse(data);
            state = json.state;
            userid = json.userid;
        }
        
        switch(state) {
        	case 0:
        		MXZH.log("用户" + userid + "正在断开......");
        		break;
        	case 1:
        		MXZH.log("用户" + userid + "已断开连接！");
        		break;
        	case 2:
        		MXZH.log("用户" + userid + "正在连接中......");
        		break;
        	case 3:
        		MXZH.log("用户" + userid + "登录成功");
        		break;
        	default:
        		break;
        }
        //return [state, userid];
    }

    /**
     * 处理抢麦和释放的服务器数据处理
     *
     * mac_state:
     * 等待中：1
     * 获得授权：2
     * 已获得授权：3
     * 拒绝：4
     * 取消：5
     * 释放：6
     * 话权空闲：7
     * @param data
     * @return {[null,null,null]}
     */
    function mic_state(data) {
        var userid = null;
        var reqid = null;
        var response = null;
        
        //防止心跳信息干扰
        if (data != "pong") {
            var json = JSON.parse(data);
            userid = json.userid;
            reqid = json.reqid;
            response = json.response;
        }

        switch(response) {
	        case 1:
	        	MXZH.log("用户" + reqid + "正在等待中......");
	        	break;
	        case 2:
	        	MXZH.log("用户" + reqid + "获得授权");
	        	break;
	        case 3:
	        	MXZH.log("用户" + reqid + "已获得授权");
	        	//播放接听音效
				var audio = document.getElementById("called_answer");
				audio.play();
	       
				MXZH.log(RoomId);
				MXZH.log(conferenceMap);
				
	        	//进入音频房间
				if (conferenceMap.has(RoomId)) {
					var curRoom = conferenceMap.get(RoomId);
					curRoom.forEach(function(member, userId) {
						if (curRoom.get(userId).status = "ENTER") {
							var enterAudioRoom = "{\"function\":\"EnterAudioRoom\",\"serverip\":\"" + server + "\",\"serverport\":\"" + port_audio + "\",\"roomid\":\"" +  + "\",\"userid\":\"" + userId + "\",}";
							var module = window.document.getElementById("audioVideo_" + userId)
							if (module != "undefined") {
								module.firstChild.postMessage(enterAudioRoom);
								MXZH.log("用户" + userId + "进入音频房间：", enterAudioRoom);
							}
						}
					}, curRoom);
				}
	        	break;
	        case 4:
	        	MXZH.log("用户" + reqid + "抢麦被拒绝！");
	        	//占线标志
	            busy = true;
	            //播放占线声效
	            var audio = document.getElementById("busy");
	            audio.play();
	        	break;
	        case 5:
	        	MXZH.log("用户" + reqid + "取消抢麦！");
	        	break;
	        case 6:
	        	MXZH.log("用户" + reqid + "释放麦克风，请重新开始抢麦！");
	        	
	        	MXZH.log(RoomId);
	        	MXZH.log(conferenceMap);
	        	
	        	//退出音频房间
	        	if (conferenceMap.has(RoomId)) {
	        		var curRoom = conferenceMap.get(RoomId);
					curRoom.forEach(function(member, userId) {
						if (curRoom.get(userId).status = "ENTER") {
							var exitAudioRoom = "{\"function\":\"ExitVideoRoom\",}";
							var module = window.document.getElementById("audioVideo_" + userId);
							if (module != "undefined") {
								module.firstChild.postMessage(exitAudioRoom);
								MXZH.log("用户" + userId + "退出音频房间：", exitAudioRoom);
							}
						}
					}, curRoom);
	        	}
	        	break;
	        case 7:
	        	MXZH.log("用户" + reqid + "话权空闲！");
	        	//清除占线标志位
	        	busy = false;
	        	//播放释放话权音效
				var audio = document.getElementById("listen_freed");
				audio.play();
				//按键状态修改
				$(".ptt").removeClass("ptt");
	        	break;
	        default:
	        	break;
        }
        //return [userid, reqid, response];
        //return response;
    }

    /**
     * 连接到netty-websocket的服务器
     * @param ip
     * @param port
     */
    var path = "js/Message.proto";
    var wsUrl = "wss://" + ip + ":" + port + "/im";

    new IMCodec(path, function (_codec) {
        client = new IMClient({
            url: wsUrl,
            codec: _codec
        });
        client.receive(receiveCallback);
        client.error(errorCallback);
        client.close(closeCallback);
        client.connect(connectCallback);
    });

    /**
     * 用户登陆创建的会话房间
     * @param userid
     * @param roomid
     * @return {*}
     */
    _m.login = function(userid,roomid) {
        if(flag == false) {
            client.send({
                body: JSON.stringify({'id': ids[0], 'userid': userid, 'roomid': roomid, 'operate': operate[0]}),
                paramField: [
                    {
                        "name": "id",
                        "value": "" + ids[0]
                    }
                ],
                type: IMClient.MsgType.MESSAGE
            });
            client.receive(receiveCallback);
            flag = true;
            if (FC_DATA_LOGIN != null) {
                return FC_DATA_LOGIN;
            } else {
                return false;
            }
        }else {
            MXZH.log("用户不能重复进行登录！");
        }
    }

    /**
     * 用户登出会话房间
     * @param userid
     * @param roomid
     * @return {*}
     */
    _m.disconnect = function (userid,roomid) {
        if (flag)  {
            client.send({
                body: JSON.stringify({'id': ids[1], 'userid': userid, 'roomid': roomid, 'operate': operate[1]}),
                paramField: [
                    {
                        "name": "id",
                        "value": "" + ids[1]
                    }
                ],
                type: IMClient.MsgType.MESSAGE
            });
            client.receive(receiveCallback);
            flag = false;

            if (FC_DATA_LOGIN != null) {
                return FC_DATA_LOGIN;
            } else {
                return false;
            }
        }else {
            MXZH.log("未登录时不能logout！");
        }
    }


    /**
     * 抢麦事件
     * @param userid
     * @param roomid
     * @return {*}
     */
    _m.grabWheat = function(userid,roomid) {
        if (flag) {
            client.send({
                body: JSON.stringify({'id': ids[2], 'userid': userid, 'roomid': roomid, 'operate': operate[2]}),
                paramField: [
                    {
                        "name": "id",
                        "value": "" + ids[2]
                    }
                ],
                type: IMClient.MsgType.MESSAGE
            });
            client.receive(receiveCallbackMic);
            fc_flag = true;
            if (FC_DATA_FLOOR != null) {
                return FC_DATA_FLOOR;
            } else {
                return false;
            }
        }else {
            MXZH.log("未释放时用户不能重复抢麦！");
        }
    }


    /**
     * 释放按钮
     * @param userid
     * @param roomid
     * @return {*}
     */
    _m.release = function(userid,roomid) {
        if (fc_flag) {
            client.send({
                body : JSON.stringify({'id':ids[3] , 'userid':userid , 'roomid': roomid , 'operate':operate[3]}),
                paramField : [
                    {
                        "name" : "id",
                        "value" : ""+ids[3]
                    }
                ],
                type : IMClient.MsgType.MESSAGE
            });
            client.receive(receiveCallbackMic);
            fc_flag = false;
            if (FC_DATA_FLOOR != null) {
                return FC_DATA_FLOOR;
            }else {
                return false;
            }
        }else {
            MXZH.log("麦克风已释放，请勿重复该操作！");
        }
    }
}

