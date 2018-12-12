/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-07-27 09:42:25
 * @version $Id$
 */

jQuery(document).ready(function() {
	MXZH.boxCall = function () {};
	MXZH.boxCall.prototype = {
		init: function(opts) {
			opts && dojo.safeMixin(this.config, opts);
		},
		config: {},
		handleBoxCall: function() {
			//打开语音对讲界面
			layer.open({
				type : 2,
				id : 'layui-yydj',
				shade : 0,
				shift : -1,
				maxmin : true,
				btnAlign : 'c',
				area : [ '750px', '553px' ],
				content : [ IM.yydjPageUrl + "?v=" + new Date().getTime(), 'no' ],
				success : function(index, layero) { //语音对讲窗口打开后获取焦点
					var tmpId = 'layui-layer-iframe' + layero;
					window.frames[tmpId].focus();
				},
				cancel : function(index, layero) { //关闭语音对讲界面，同时请求会话管理服务释放会话
					if (confirm('确定要关闭吗')) {
						var tmpId = 'layui-layer-iframe' + index;
						var conferenceMap = window.frames[tmpId].conferenceMap;
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
								MXZH.log("当前会话：", JSON.stringify(conferenceMap));

								//退出抢麦
								var pttDestroyConf = {
									command : "DestroyParticipate",
									floor : "FloorIsIdle",
									client : "Disconnected",
									transaction : 0,
									conference : roomId,
									user : IM.userId
								};
								var msg = JSON.stringify(pttDestroyConf);
								bfcpClient.sendMsg(msg);
								roomId = "";
								RoomId = "";
								hasRoom = false;
								BoxCall = false;
								window.frames[tmpId].AddCount = 0;
								window.frames[tmpId].AddCountCreator = 0;
								layer.close(index);
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
								MXZH.log("当前会话：", JSON.stringify(conferenceMap));

								//退出抢麦
								var pttDestroyConf = {
									command : "DestroyParticipate",
									floor : "FloorIsIdle",
									client : "Disconnected",
									transaction : 0,
									conference : roomId,
									user : IM.userId
								};
								var msg = JSON.stringify(pttDestroyConf);
								roomId = "";
								RoomId = "";
								hasRoom = false;
								BoxCall = false;
								window.frames[tmpId].AddCount = 0;
								window.frames[tmpId].AddCountCreator = 0;
								layer.close(index);
							}
							//关闭语音对讲界面
							RoomId = "";
							hasRoom = false;
							BoxCall = false;
							window.frames[tmpId].AddCount = 0;
							window.frames[tmpId].AddCountCreator = 0;
							layer.close(index);
						} else { //没有建立任何会话，直接删除界面
							//关闭语音对讲界面
							RoomId = "";
							hasRoom = false;
							BoxCall = false;
							window.frames[tmpId].AddCount = 0;
							window.frames[tmpId].AddCountCreator = 0;
							layer.close(index);
						}
					}
					return false;
				},
				full : function(index, layero) { //语音对讲窗口最大化
					//TODO  需要调整语音对讲界面的布局
				},
				min : function(index, layero) { //语音对讲窗口最小化
					//TODO 需要调整语音对讲界面的布局
				},
				restore : function(index, layero) { //窗口还原后重新获得焦点
					var tmpId = 'layui-layer-iframe' + layer.index;
					window.frames[tmpId].focus();
				}
			});
		}
	}
})