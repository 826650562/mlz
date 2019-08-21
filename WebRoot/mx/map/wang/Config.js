dojo.declare("Wang.Config", null, {
	constructor : function() {},
	/*
	 * 其他配置项
	 * */
	isAddcunzhenMap:true,
	services : {
		//地图路径配置
		MapService : {
			 zoom : 3,
			 center : [121.414274,31.115661 ],
			 mapUrl : 'http://116.236.96.150:16080/arcgis/rest/services/ml_map1/MapServer',
			 mapUrl2 : 'http://116.236.96.150:16080/arcgis/rest/services/ml_map2/MapServer', 
			/*mapUrl:'http://116.236.96.146:6080/arcgis/rest/services/shanghai/MapServer'*/
		},
		BjURL:"http://116.236.96.150:16080/arcgis/rest/services/mlbj/MapServer",
		cunzhenURL:"http://116.236.96.150:16080/arcgis/rest/services/czyq/MapServer",
		/*
		 * 资源图层控制配置项 
		 * */
		layerControler : {
			//是否显示右上角的按钮
			buttonVisible : false,
			services : {
				//图层服务地址  需要自己配置
				/*xq: ['辖区','polygon','http://192.168.2.131:6080/arcgis/rest/services/xq/MapServer/0'],
				pcs:['派出所','point','http://192.168.2.131:6080/arcgis/rest/services/pcs/MapServer/0']*/
			}
		}
	// 'GeometryServer' : 'http://139.196.31.82:6080/arcgis/rest/services/Geometry/GeometryServer'
	},
	IMG : {
		range_ceju : Ourname + "/mx/map/wang/Map/extras/images/dis_box_01.gif",
		range_close : Ourname + "/mx/map/wang/Map/extras/images/close.gif",
		range_cur : Ourname + "/mx/map/wang/Map/extras/images/Hand_Hnd.cur",
		dzwl : Ourname + "/mx/dzwl/images/mangrove.png",
		sswzFill : Ourname + "/mx/sswz/images/black15.png",
		sswz_mapPeoXtbFour : Ourname + '/mx/sswz/images/peonormal.png',
		sswz_mapPeoXtb : Ourname + '/mx/sswz/images/peonormallHover.png',
		peonameBlue : Ourname + '/mx/sswz/images/peonameBlue.png',
		peonameGreen : Ourname + '/mx/sswz/images/peonameGreen.png',

		sswz_mapPeoXtbFour2 : Ourname + '/mx/jjqy/images/peo1_peo_red.png',
		sswz_mapPeoXtb2 : Ourname + '/mx/jjqy/images/peo2_peo.png',
		peonameBlue2 : Ourname + '/mx/jjqy/images/peo1_text_red.png', //长方形
		peonameGreen2 : Ourname + '/mx/jjqy/images/peo2_text.png', //长方形

		xxsbicon : Ourname + '/images/xxsbicon.gif',
	},
	//以下为常量
	constants : {
		wkt : 3857,
		url : Ourname + "/mx",
	}
});
var WangConfig = new Wang.Config();
var webMercatorUtils = dojo.require("esri.geometry.webMercatorUtils");
//设置命名空间避免冲突
var MXZH = {
    showLog:false, //不设置 或者默认是不显示打印信息
	classes : {},
	classFactory : function(obj, className) {
		if (dojo.isObject(obj)) {
			this.classes[className] = new obj();
			this.classes[className].init();
			return this.classes[className];

		}
		else
			MXZH.errorLog("参数不是一个正确的js类");
	},
	msgOfsswz : function(msg) {
		layui.use('layer', function() {
			var layer = layui.layer;
			layer.msg(msg, {
				area : [ '260px', '50px' ],
				time : 3500 //1秒关闭（如果不配置，默认是3秒）
			}, function() {
				//do something
			});
		});
	},
	stopPropagation : function(e) {
		e = e || window.event;
		if (e.stopPropagation) { //W3C阻止冒泡方法  
			e.stopPropagation();
		} else {
			e.cancelBubble = true; //IE阻止冒泡方法  
		}
	},
	ToWebMercator : function(geometry) {
		return webMercatorUtils.geographicToWebMercator(geometry);
	},
	MercatorToGeo : function(geometry) {
		return webMercatorUtils.webMercatorToGeographic(geometry);
	},
	ToWebMercator2 : function(long, lat) {
		return webMercatorUtils.lngLatToXY(long, lat);
	},
	bd09togcj02 : function bd09togcj02(bd_lon, bd_lat) {
		var bd_lon = +bd_lon;
		var bd_lat = +bd_lat;
		var x = bd_lon - 0.0065;
		var y = bd_lat - 0.006;
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
		var gg_lng = z * Math.cos(theta);
		var gg_lat = z * Math.sin(theta);
		return [ gg_lng, gg_lat ]
	},
	wgs84togcj02 : function wgs84togcj02(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		if (out_of_china(lng, lat)) {
			return [ lng, lat ]
		} else {
			var dlat = transformlat(lng - 105.0, lat - 35.0);
			var dlng = transformlng(lng - 105.0, lat - 35.0);
			var radlat = lat / 180.0 * PI;
			var magic = Math.sin(radlat);
			magic = 1 - ee * magic * magic;
			var sqrtmagic = Math.sqrt(magic);
			dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
			dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
			var mglat = lat + dlat;
			var mglng = lng + dlng;
			return [ mglng, mglat ]
		}
	},
	log:function(info1, info2){
		if(this.showLog){
			var info1 = info1 || "";
			var info2 = info2 || "";
			console.log(info1, info2);
		}
	},
	errorLog:function(errorInfo){
		if(!this.showLog){
			console.error(errorInfo);
		}
	},
};
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;

mercatorTolonlat = function(mercator) {
	var lonlat = {
		x : 0,
		y : 0
	};
	var x = mercator[0] / 20037508.34 * 180;
	var y = mercator[1] / 20037508.34 * 180;
	y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
	return [ x, y ];
}




var av_server = '192.168.2.170',
	a_port = 35469,
	v_port = 35470; // 音视频服务IP、端口
var mq_server = "192.168.2.172",
	mq_useSSL = true,
	mq_port = 61619; // MQ服务IP、端口
var bfcp_server = "192.168.2.170",
	bfcp_port = 7890; // 抢麦服务IP、端口
var IM = {
	wsUrl : "wss://192.168.2.172:10889/im", // 即时消息服务端位置 
	wsTimeout : 8 * 1000, // 心跳间隔时间
	pongTimeout : 5 * 1000, // 心跳响应超时时间
	protoPath : "mx/jsxx/js/Message.proto", // 即时消息编解码器路径
	userInitUrl : "chat_getAllUserOrGroup.action", // 获得当前用户的群组和好友页面
	memberInitUrl : "chat_getMembers.action", // 群组成员初始化页面
	uploadUrl : "upload/file", // IM中文件上传页面
	yydjPageUrl : "mx/jsxx/yydj/yydj.jsp", // 语音对讲页面
	decryptPath : "home_yyPlayer.action",
	wavUploadUrl : "home_Recorder_file.action", // .wav声音文件上传地址
	openLocationUrl : "mx/lsxx/dqwz.jsp", // 打开位置
	accessUrl : "https://192.168.2.172:8888", // 文件上传位置
	fileUploadUrl : "https://192.168.2.172:8888/upload/app/upload",
	userId : Number(userid)
};