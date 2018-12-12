/**
 * 即时消息中的编解码器
 * @author danglei@2017.05.30 17:00
 * */
function IMCodec(url, callback) {
	var _url = url;
	/**
	 * 用于收发消息的编解码器
	 * */
	var Message = null;
	var ParamFieldEntry = null;
	var me = this;

	function initCodec(err, root) {
		if (err)
			throw err;

		Message = root.lookupType("com.mlight.chat.protobuf.Message");
		ParamFieldEntry = root.lookupType("com.mlight.chat.protobuf.Message.ParamFieldEntry");

		if (callback) {
			callback(me);
		}
	}

	/**
	 * 完成消息编码<br/>
	 * 将待发送的JS对象编码为二进制字节
	 * */
	this.encode = function(jsObj) {
		var buffer = null;
		var errMsg = Message.verify(jsObj);
		if (errMsg) {
			throw errMsg;
		} else {
			var message = Message.create(jsObj);
			/**
			 * 浏览器环境： Uint8Array <br/> 
			 * Node环境： Buffer
			 * */
			buffer = Message.encode(message).finish();
		}

		return buffer;
	}

	/**
	 * 完成消息解码<br/>
	 * 将二进制数据转换为普通的JS对象
	 * */
	this.decode = function(data) {
		var buffer = new Uint8Array(data);
		var message = Message.decode(buffer);
		var object = Message.toObject(message, {
			//	enums : String, // enums as string names
			// longs : String, // longs as strings (requires long.js)
			// bytes : String, // bytes as base64 encoded strings
			defaults : true, // includes default values
			arrays : true, // populates empty arrays (repeated fields) even if defaults=false
			objects : true, // populates empty objects (map fields) even if defaults=false
			oneofs : true
		});

		return object;
	}

	protobuf.load(_url, initCodec);
}