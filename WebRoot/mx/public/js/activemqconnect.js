$(function() {
	var Myxxsb = new MXZH.xxsb();
	Myxxsb.init();
	var tmp = 0;
	var host = mq_server;
	var port = mq_port;
	var destination = [ "xxsbtopic", /*"dzwltopic"*/ "jjyqTopic" ]; //订阅和发布信息的topic
	var totalconnect = 0;
	var clients = [null,null];
	
	var infos = [];
	var isfrirst = true;
	var activeSetInterval = null;
	$.ajax({
		url : '${basePath}/home_queryTotalxxsb.action',
		type : "post",
		success : function(wchtotal) {
			if (wchtotal > 0) {
				$(".newMessage").css("display", "block");
			}
			$(".newMessage").html('').append(parseFloat(wchtotal));
			myConnect();
		},
		error : function(error) {
			throw (error);
			layui.layer.msg("数据请求失败！");
			//throw ('数据请求失败！');
		}
	});

	function xxsbController(e) {
		$(".newMessage").css("display", "block");
		var xxsbjson = JSON.parse(e.payloadString);
		var zs = $(".newMessage").text();
		var total = parseFloat(zs) + 1; //parseFloat(xxsbjson['id']);
		var x = parseFloat(xxsbjson['x']);
		var y = parseFloat(xxsbjson['y']);
		$(".newMessage").html('').append(parseFloat(total));
		Myxxsb.addPointToMap(y, x);
	}
	function dzwlController(resJson) {
		checkoutInfo(resJson);
		if (MXZH.effectController && MXZH.effectController.ojbs && MXZH.effectController.ojbs.dealWithAppendAlarm) {
			resJson.length ? MXZH.effectController.ojbs.dealWithAppendAlarm(resJson, 'prepend', true, true) :
				MXZH.effectController.ojbs.showNothing();
		}
	}
	first_dzwlController  = function (e) {
		var resJson;
		if(e.payloadString){
			  resJson = JSON.parse(e.payloadString);
			 dzwlController(resJson);
		}else{
		   	resJson = JSON.parse(e);
			 dzwlController(resJson)	
		}
	}
	function checkoutInfo(resJson) {
		dojo.forEach(resJson, function(item) {
			if ($.inArray(item.id, infos) < 0) {
				infos.push(item.id);
				if (!isfrirst) {
					var k = new Date(parseInt(item['yjsj']));
					$(".jjqyLabel").text("通知：" + item.yonghu + "在" + k.Format("yyyy-MM-dd hh:mm:ss") + "进入" + item.jjqyName + item.jjqy_type).show();
					activeSetInterval && window.clearTimeout(activeSetInterval);
					activeSetInterval = window.setTimeout(function() {
						$(".jjqyLabel").fadeOut(500);
					}, 5000)
				}
			}

		});
		isfrirst = false;
	}
	
	function myConnect() {
		mqttconnect(first_dzwlController,1);
		mqttconnect(xxsbController,0);
	}
	
	function mqttconnect(callback, index) {
		var Mydestination = destination[index];
		var clientId = Mydestination + new Date().getTime();
		var obj = new Messaging.Client(host, Number(port), clientId);
		obj.totalconnect = 0;
		
		var cfg = {
			keepAliveInterval: 10,
			useSSL : mq_useSSL, // 是否使用WSS
			onSuccess : function() {
				obj.totalconnect = 0;
				obj.subscribe(Mydestination);
			},
			onFailure : function() {
				if (obj.totalconnect < 3) {
					obj.totalconnect++;
					obj.connect(cfg);
				} else {
					layer.msg("网络异常,请检查网络后重新登陆！");
				}
			}
		};
		
		obj.onMessageArrived = function(e) {
			callback(e);
		}
		obj.onConnectionLost = function(e) {
			if (obj.totalconnect < 3) {
				obj.totalconnect++;
				obj.connect(cfg);
			} else {
				layer.msg("网络异常,请检查网络后重新登陆！");
			}
		}
		obj.connect(cfg);
		clients[index] = obj; 
	}
});
 
