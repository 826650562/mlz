var Chat = {};


//上传路径
/**
	 * 文件上传<br />
	 * 
	 * @param f
	 *            待上传的文件<br />
	 */
Chat.Uploader = function(_f, _sender, _receiver) {
	var f = _f,
		sender = _sender,
		receiver = _receiver,
		msg = null,
		msgVo = null,
		msgSeq = null,
		xhr = null,
		completeCallback;
	
	
	/**
	 * 获得服务器端时间
	 * */
	function getNowTime(){
		var result = -1;
		$.ajax({
			url: "home_now.action",
			dataType: "text",
			type: "post",
			async: false,
			success: function(e){
				result = parseInt(e);
			},
			error: function(er,thr,xhr){
				layui.layer.msg("服务器端异常,请重试!");
			}
		});
		
		return result;
	}
	
	function uploadProgress(evt) {
		if (evt.lengthComputable) {
			//var percent = Math.round(evt.loaded * 100 / evt.total);
			//$("#M" + msgSeq).find(".bar").css("width", percent + "%");
			//MXZH.effectController.loading(true);
		}
		//MXZH.effectController.loading(true);
	}

	function uploadComplete(evt) {
		f.value = "";
		// 待发送的消息附件
		var resp = evt.target.responseText,
			obj = null,
			attache = null;
		try {
			obj = JSON.parse(resp); // 帮助服务器端校验
			attache = Chat.toAttache(obj, msg.type);
		} catch (e) {
			attache = null;
		}

		if (attache) {
			if (msg) {
				// 发送消息
				msg["attachment"] = attache;
				msg["time"] = getNowTime();
				completeCallback && completeCallback(msg);
			}
		} else {
			// 附件上传失败
			MXZH.log(resp);
		}
	}

	function uploadFailed(evt) {
		f.value = "";
		MXZH.log(evt);
	}

	function uploadCanceled(evt) {
		MXZH.log(evt);
	}

	this.upload = function(completeCb,errorcb) {
		completeCallback = completeCb;
		
		var fd = Chat.toFormData(_f);
		if(fd){
			xhr = new XMLHttpRequest();
			xhr.addEventListener("load", uploadComplete, false);
			xhr.addEventListener("error", errorcb, false);
			xhr.addEventListener("abort", uploadCanceled, false);
			xhr.open("POST", IM.fileUploadUrl);
			xhr.send(fd);
		}
	};

	this.getReceiver = function() {
		return receiver;
	};

	this.getSender = function() {
		return sender;
	};

	
	/**
	 * 获得支撑layim的url 
	 * zlj 2017-05-18
	 * 暂不用。直接从前台拿数据。
	 */	
	Chat.getLayUrl =function(msg){
		var url = JSON.parse(msg.attachment);	
		var layUrl = '';
		if(msg.type == 1){ //img
			layUrl = IM.fileUploadUrl +  url["original"];
		}
		return layUrl;
	};
	
	
	
	/**
	 * 支持重复调用，返回结果一样<br/>
	 * sender,receiver,time,type,attachment
	 */
	this.getMsgHtml = function() {
		var d = new Date(parseInt(getNowTime()));
		if (!msg) {
			var time = d.Format("yyyy-MM-dd hh:mm:ss");
			msg = {
				sender : sender.id,
				type : Chat.getFileType(f)
			};
			var recName = receiver.id;
			msg["receiver"] = recName;
			if(receiver.type === 'friend'){
				msg["chatType"] = "0";
			}else if(receiver.type === 'group'){
				msg["chatType"] = "1";
				msg["groupId"] = recName;
			}
 		}

		if (!msgSeq) {
			msgSeq = d.getTime();
		}
 	};

/**
 * 项目内容
 */
};

/**
 * 计算当前文件类型
 
Chat.getFileType = function(f) {
	var name = f.name,
		types = {
			"image" : {
				"jpg" : "",
				"jpeg" : "",
				"png" : "",
				"gif" : "",
				"bmp" : ""
			},
			"video" : {
				"3gp" : ""
			},
			"audio" : {
				"amr" : ""
			}
		},
		type = name.substring(name.lastIndexOf('.') + 1);
	var flag = -1;
	if (types.image.hasOwnProperty(type)) {
		flag = 1;
	} else if (types.audio.hasOwnProperty(type)) {
		flag = 2;
	} else if (types.video.hasOwnProperty(type)) {
		flag = 3;
	}
	return flag;
};
*/

Chat.getFileType = function(f) {
	var name = f.name,
	types = {
		"image" : {
			"jpg" : "",
			"jpeg" : "",
			"png" : "",
			"gif" : "",
			"bmp" : ""
		},
		"video" : {
			"3gp" : ""
		},
		"audio" : {
			"amr" : ""
		}
	},
	type = name.substring(name.lastIndexOf('.') + 1);
	var flag = -1;
	if (types.image.hasOwnProperty(type)) {
		flag = 1;
	} else if (types.audio.hasOwnProperty(type)) {
		flag = 2;
	} else if (types.video.hasOwnProperty(type)) {
		flag = 3;
	}
	return flag;
}
/**
 * 将文件转换为表单数据
 */
Chat.toFormData = function(_f) {
	var f = _f,
		type = Chat.getFileType(f);
	function toImgData() {
		var fd = new FormData();
		fd.append("file", f);
		fd.append("type", "image");
		fd.append("width", 120);
		fd.append("height", 120);
		fd.append("isEncrypt", 1);
		return fd;
	}

	function toAudioData() {
		var fd = new FormData();
		fd.append("file", f);
		fd.append("type", "voice");
		return fd;
	}

	function toVideoData() {
		var fd = new FormData();
		fd.append("file", f);
		fd.append("type", "video");
		return fd;
	}

	var funs = [ null, toImgData, toAudioData, toVideoData ],
		result = null;
	if(type == 1){
		if (funs[type]) {
			result = funs[type]();
		}
	}else{
		result = null;
	}
	
	return result;
};

Chat.toAttache = function(obj, type) {
	function toImgAttache() {
		return {
			thumbnail : obj.newAddress,
			thumbWidth : obj.smallWidth,
			thumbHeight : obj.smallHeight,
			original : obj.oldAddress,
			originalWidth : obj.bigWidth,
			originalHeight : obj.bigHeight,
			imageType : "0"
		};
	}

	function toAudioAttache() {
		var _d = 0;
		try {
			_d = parseFloat(obj.bigWidth / 1000).toFixed(1);
		} catch (e) {
			_d = 6.6;
		}

		return {
			url : obj.oldAddress,
			duration : _d
		};
	}

	function toVideoAttache() {
		return {
			url : obj.videoUrl,
			thumbnail : obj.firstFrameUrl,
			duration : 88
		};
	}

	var funs = [ null, toImgAttache, toAudioAttache, toVideoAttache ], result = null;
	if (funs[type]) {
		result = funs[type]();
	}
	return result;
};



/**
 * 发送消息
 * 
 * @param msg
 *            消息发送必填内容<br/>
 * @param msgVo
 *            在消息内容基础上扩展的包含部分辅助显示的字段<br/>
 */
Chat.sendMsg = function(_msg, _msgVo) {
	var msg = _msg, msgVo = _msgVo;
	//Chat.trigger(Chat.events.msgSend, msgVo);

	$.ajax({
		url : Chat.sendUrl,
		jsonpCallback : 'sendSuc',
		data : msg,
		type : "post",
		dataType : "jsonp",
		error : sendErr
		//success : sendSuc
	});

	function sendSuc(r) {
		//Chat.trigger(Chat.events.msgSendSuc, msgVo);
		//appendCache(msgVo);
	}

	function sendErr(r) {
		//Chat.trigger(Chat.events.msgSendErr, msgVo);
		alert("发送失败："+ r);
	}
};



Chat.toAttache = function(obj, type) {
	function toImgAttache() {
		return {
			thumbnail : obj.newAddress,
			thumbWidth : obj.smallWidth,
			thumbHeight : obj.smallHeight,
			original : obj.oldAddress,
			originalWidth : obj.bigWidth,
			originalHeight : obj.bigHeight,
			imageType : "0"
		};
	}

	function toAudioAttache() {
		var _d = 0;
		try {
			_d = parseFloat(obj.bigWidth / 1000).toFixed(1);
		} catch (e) {
			_d = 6.6;
		}

		return {
			url : obj.oldAddress,
			duration : _d
		};
	}

	function toVideoAttache() {
		return {
			url : obj.videoUrl,
			thumbnail : obj.firstFrameUrl,
			duration : 88
		};
	}

	var funs = [ null, toImgAttache, toAudioAttache, toVideoAttache ], result = null;
	if (funs[type]) {
		result = funs[type]();
	}
	return result;
};

/**
 * 将给定消息转换为元素
 */
Chat.toMessageHtml = function(msg, seq) {
	var textTempl = $.templates("#sendTextTempl");
	var imgTempl = $.templates("#sendImgTempl");
	var audioTempl = $.templates("#sendAudioTempl");
	var videoTempl = $.templates("#sendVideoTempl");
	var locationTempl = $.templates("#recLocationTempl");

	function toTextMessage(msg) {
		return textTempl.render(msg);
	}

	function toImageMessage(msg) {
		return imgTempl.render(msg);
	}

	function toAudioMessage(msg) {
		return audioTempl.render(msg);
	}

	function toVideoMessage(msg) {
		return videoTempl.render(msg);
	}

	function toLocationMessage(msg){
		return locationTempl.render(msg);
	}
	var funs = [ toTextMessage, toImageMessage, toAudioMessage,
			toVideoMessage,toLocationMessage ], r;
	if (msg && msg.type && funs[msg.type]) {
		r = funs[msg.type](msg);
		if (!seq) {
			seq = new Date().getTime();
		}
		r = $(r).prop("id", "M" + seq)[0];
	} else {
		r = null;
	}
	return r;
};

