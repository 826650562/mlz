
var recorder;
var audio = document.querySelector('audio');
function startRecording() {
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


function obtainRecord() {
	if (!recorder) {
		var msg_ = {0:"请先录音"};
		showError(msg_);
		return;
	}
	var record = recorder.getBlob();
	if (record.duration !== 0) {
		downloadRecord(record.blob);
	} else {
		var msg_ = {0:"请先录音"};
		showError(msg_);
	}
}
;

function downloadRecord(record) {
	var save_link = document.createElementNS('mlight', 'a')
	save_link.href = URL.createObjectURL(record);
	var now = new Date;
	save_link.download = now.Format("yyyyMMddhhmmss");
	fake_click(save_link);
}


function fake_click(obj) {
	var ev = document.createEvent('MouseEvents');
	ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	obj.dispatchEvent(ev);
}

function getStr() {
	var now = new Date;
	var str = now.toDateString();
}

function stopRecord() {
	recorder && recorder.stop();
	if (recorder) {
		recorder.clear();
	}

}
;
var msg = {};
//发送音频片段
var msgId = 1;
function send() {
	if (!recorder) {
		var msg_ = {0:"请先录音"};
		showError(msg_);
		return;
	}

	var data = recorder.getBlob();
	if (data.duration == 0) {
		var msg_ = {0:"请先录音"};
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
function showError(msg) {
	for (var p1 in msg) {
		if (msg.hasOwnProperty(p1))
			MXZH.log(p1);
			MXZH.log(msg[p1]);
	    }
}


function playRecord(blob) {
	if (!recorder) {
		var msg ={
			0:"请先录音"	
		};
		showError(msg);
		return;
	}
	recorder.play(audio, blob);
}
;

/* 视频 */
function scamera() {
	var videoElement = document.getElementById('video1');
	var canvasObj = document.getElementById('canvas1');
	var context1 = canvasObj.getContext('2d');
	context1.fillStyle = "#ffffff";
	context1.fillRect(0, 0, 320, 240);
	context1.drawImage(videoElement, 0, 0, 320, 240);
}
;

function playVideo() {
	var videoElement1 = document.getElementById('video1');
	var videoElement2 = document.getElementById('video2');
	videoElement2.setAttribute("src", videoElement1);
}
;