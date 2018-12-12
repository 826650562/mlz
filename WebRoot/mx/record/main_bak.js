
var recorder;
var audio = document.querySelector('audio');
var startRecording = function() {
	if (recorder) {
		recorder.start();
		return;
	}

	HZRecorder.get(function(rec) {
		recorder = rec;
		recorder.start();
	}, {
		error : showError
	});
}


var obtainRecord = function() {
	if (!recorder) {
		var msg_ = {
			0 : "请先录音"
		};
		showError(msg_);
		return;
	}
	var record = recorder.getBlob();
	if (record.duration !== 0) {
		downloadRecord(record.blob);
	} else {
		var msg_ = {
			0 : "请先录音"
		};
		showError(msg_);
	}
};

var downloadRecord = function(record) {
	var save_link = document.createElementNS('mlight', 'a')
	save_link.href = URL.createObjectURL(record);
	var now = new Date;
	save_link.download = now.Format("yyyyMMddhhmmss");
	fake_click(save_link);
}


var fake_click = function(obj) {
	var ev = document.createEvent('MouseEvents');
	ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	obj.dispatchEvent(ev);
}

var getStr = function() {
	var now = new Date;
	var str = now.toDateString();
}

var stopRecord = function() {
	recorder && recorder.stop();
	if (recorder) {
		recorder.clear();
	}

};
var msg = {};
//发送音频片段
var msgId = 1;
var send = function() {
	if (!recorder) {
		var msg_ = {
			0 : "请先录音"
		};
		showError(msg_);
		return;
	}

	var data = recorder.getBlob();
	if (data.duration == 0) {
		var msg_ = {
			0 : "请先录音"
		};
		showError(msg_);
		return;
	}
	var formd = new FormData();
	formd.append("file", data.blob);
	jQuery.ajax({
		url : "../app/update",
		data : formd,
		type : "post",
		processData : false, //  告诉jquery不要处理发送的数据
		contentType : false
	});
	msg[msgId] = data;
	recorder.clear();
	var dur = data.duration / 10;
	var str = "<div class='warper'><div id=" + msgId + " class='voiceItem'>" + dur + "s</div></div>"
	$(".messages").append(str);
	msgId++;
}

$(document).on("click", ".voiceItem", function() {
	var id = $(this)[0].id;
	var data = msg[id];
	playRecord(data.blob);
})

var ct;
var showError = function(msg) {
	for (var p1 in msg) {
		if (msg.hasOwnProperty(p1))
			MXZH.log(p1);
		MXZH.log(msg[p1]);
	}
}


var playRecord = function(blob) {
	if (!recorder) {
		var msg = {
			0 : "请先录音"
		};
		showError(msg);
		return;
	}
	recorder.play(audio, blob);
};
var playVideo =function() {
	var videoElement1 = document.getElementById('video1');
	var videoElement2 = document.getElementById('video2');
	videoElement2.setAttribute("src", videoElement1);
}
;