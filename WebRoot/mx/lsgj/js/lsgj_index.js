//新的历史轨迹
/*
 * 新增
 * 1.根据速度去除噪点
 * 2.改为按点播放
 */
var mydage;
var indexOfPoint = 0;
var timeOut1 = 600;
var timer_handle; 
var timer_lsgj;
var now_date=0;
var guijiLayer=null;
var ispalyimg=false;
var pictimes=[];
MXZH.lsgjBF = function() {};
MXZH.lsgjBF.prototype = {
	restults : {},
	infos : {},
	from : function(data) {
		this.restults = data;
		this.infos = this.restults.res;
		this.map = this.restults.map;
	},
	init : function(opts) {
		var stripe_width = 0;
		indexOfPoint=0;
		timeOut1=600;
		pictimes=[];
		this.setPostion('0%','0','7');//把播放点初始化到开始
		this.pause();
		this.replacePics('play',false);//替换播放图标  并不播放
		$(".titlebar").text(0);
		$(".timebarbox").css('display',"block");
		$(".stripe").css("width", "" + stripe_width + "%");
		MXZH.effectController.loading(false);
		this.from(opts);
		if(window.guijiLayer){
			guijiLayer.clear();
		}else{
			guijiLayer = new esri.layers.GraphicsLayer();
		}
		this.map.addLayer(guijiLayer);
		this.addEventlister();
	},
	addEventlister : function() {
		var self = this;
		$(".bfbtn").unbind().click(function() {
			//点击
			var type =$(this).attr("_type");
			
			self.replacePics(type,true);
		});

		$(".resets").unbind().click(function() {
			//回到原始状态
			self.reset();
			ispalyimg=false;
		});
		$(".beisu").hover(function(){
			$(this).css({
				'top':'-114px',
				'height':'149px',
			}).find("li").show();
		},function(){
			$(this).css({
				'top':'0px',
				'height':'35px',
			}).find("li").hide();
		});
		$(".beisu").find('li').unbind().click(function(){
			var sd= parseInt($(this).attr("sd"));
			timeOut1=600/sd;
			$(".beisu").css({
				'top':'0px',
				'height':'35px',
			}).find("li").hide();
		});
	},
	replacePics:function(type,isgo){
		if (type == 'play') {
			//假如是play 则暂停
			$(".bfbtn").attr("_type", 'parse');
			$(".bfbtn").find("img").attr("src", 'mx/lsgj/images/bfxtb.png');
			!isgo || this.pause();
			ispalyimg=false;

		} else if (!type || type == 'parse') {
			$(".bfbtn").attr("_type", 'play');
			$(".bfbtn").find("img").attr("src", 'mx/lsgj/images/parse.png');
			!isgo || this.play();
			ispalyimg=true;
		}
	},
	checkPics : function(date) {
		//检查图片 并滑动到该图片
		if(date){
			var d = date.Format('hh:mm');
			if(dojo.indexOf(pictimes,d)>=0){
				return ;
			}else{
		    pictimes.push(d);
			var self = this;
			var items = $(".popup-events").find('.timeline_lsgj ul').get();
			var tops = [];
			dojo.forEach(items, function(item, index) {
				if (d == $(item).attr("date_")) {
					$(".popup-events .active").removeClass("active");
					$(item).find('li').addClass("active");
					tops.push($(item).find('li').position().top);
				}
			})
			tops.length && $(".popup-events .scrollbar-inner").animate({
				scrollTop : tops[tops.length - 1] - 240
			}, 600);
		   }
		}
	},
	setPointTomap : function(r) {
		//将点撒到地图上
		if(!window.guijiLayer) return ;
		guijiLayer.clear();
		var point = new esri.geometry.Point(r.lon, r.lat, new esri.SpatialReference({
			wkt : 4326
		}));
		var picsybol = new esri.symbol.PictureMarkerSymbol('images/ljpeo.png', 32, 40);
		picsybol.setOffset(0, 16);
		guijiLayer.visible = true;
		guijiLayer.add(new esri.Graphic(point, picsybol, null, null));
	},
	play : function() {
		var self = this;
		if (indexOfPoint >= 0) {
			//显示点坐标
			this.infos[indexOfPoint] && this.setPointTomap(this.infos[indexOfPoint]);
		}
		//   this.shikeSpeed2(timeOut1);
		if (indexOfPoint < this.infos.length) {
			window.timer_handle && clearTimeout(timer_handle);
			//控制播放
			timer_handle = window.setTimeout(function(indexOfPoint) {
				self.play(indexOfPoint);
			}, timeOut1);
		} else {
			$(".bfbtn").find("img").attr("src", 'mx/lsgj/images/bfxtb.png');
			clearTimeout(timer_handle);
		}
		//设置 播放周位置
	    if(this.infos[indexOfPoint] && this.infos[indexOfPoint].standard_time ){
	    	var d=new Date(this.infos[indexOfPoint].standard_time.time);
			now_date=d.Format("hh:mm:ss");
			var num = (indexOfPoint / (this.infos.length-1)).toFixed(5);
			var jd= num * 100 + "%";
			var w=parseInt($(".dragdealer").width());
			this.setPostion(jd,now_date, num *w);
	    }
	    this.checkPics(d);
		indexOfPoint++;
		
	},
	pause:function(){
		//暂停
		window.timer_handle && clearTimeout(timer_handle);
	},
	reset:function () {
		indexOfPoint=0;
		timeOut1=600;
		pictimes=[];
		window.guijiLayer && guijiLayer.clear();
		//设置 播放周位置
		this.setPostion('0%','0','7');//把播放点初始化到开始
		this.pause();
		this.replacePics('play',false);
	},
	setPostion:function(jd,now_date,lf){
		$(".stripe").css("width",  jd); 
		$(".titlebar").text(now_date);
		$(".handle").css("left", parseInt(lf)-12+"px");
	},
	toRad : function(d) {
		return d * Math.PI / 180;
	},
	getDisance : function(lat1, lng1, lat2, lng2) {
		var dis = 0;
		var radLat1 = this.toRad(lat1);
		var radLat2 = this.toRad(lat2);
		var deltaLat = radLat1 - radLat2;
		var deltaLng = this.toRad(lng1) - this.toRad(lng2);
		var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
		return dis * 6378137;
	}
};


/**************************历史轨迹业务逻辑类*******************************************************************/
MXZH.lsgj = function(bofangClass) {
	this._map = null;
	this._res = null;
	this.onepoint = null, //放第一个图标
	this.thisLayer = new esri.layers.GraphicsLayer();
	this.lineSysbol = null;
	this.pointSysbol = null;
	this.jiantou_Sysbol = null;
	// lineWidth:8,//底线宽度
	this.angleArray = []; //角度数组
	this.lengths = []; //每组的长度
	this.lengths_fenduan = []; //
	this.polylineArray = []; //线段
	this.middlePoint = []; //线段中间的点
	this.fenduanWidth = 12; // 像素
	this.pointAndPointWidth = 3;
	this.shengyu_length = 0; //剩余长度
	// [[252,158, 203, 1],[0,0,0,0.8]],
	this.colors = [
		[ [ 253, 137, 22, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 240, 102, 87, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 139, 66, 249, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 64, 164, 42, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 82, 152, 255, 1 ], [ 236, 236, 236, 0.8 ] ]
	];
	this.bofang = bofangClass;
	/*	this.xmin_max = [ 118, 130 ];
		this.ymin_max = [ 25, 45 ];*/

	this.xmin_max = [ 72, 140 ];
	this.ymin_max = [ 17, 54 ];
}
MXZH.lsgj.prototype = {
	config : {
		//可用的配置
	},
	//构造函数
	init : function(options, callback) {
		this.clearGuiji();
		this._map = options.map;
		this._res = [];
		var self = this;
		dojo.forEach(options.res, function(item) {
			if (item.lat >= self.ymin_max[0] && item.lat <= self.ymin_max[1] &&
				item.lon >= self.xmin_max[0] && item.lon <= self.xmin_max[1]
			) {
				self._res.push(item);
			}
		});
		//this._res = this.checkoutDatas(rss);
		 if (this._res.length <= 2) {
				MXZH.msgOfsswz('有效轨迹数据不足！');
				this.clearGuijiAndslider();
				return false;
			} 
		var num = 4;
		this.lineSysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][0]), 6);
		this.lineSysbol2 = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([ 156, 155, 158, 0.4 ]), 8);
		this.jiantou_Sysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][1]), 2);
		this.pointSysbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 6,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([ 156, 155, 158, 0.4 ]), 1),
			new dojo.Color(this.colors[num][0]));
		this._map.addLayer(this.thisLayer);
		this.analysisManPoints();
		//分析地图的范围
		this.init_extent();
		this.addEventListening();
		callback(this._res)
	},
	/*checkoutDatas : function(rss) {
		//检查数据：超过预定范围1.小于0 或者其他非数字   2. 噪点：误差过于大的点
		var res = [];
		for (var i = 1; i < rss.length - 1; i++) {
			var distence = this.getDisance(rss[i].lat, rss[i].lon, rss[i - 1].lat, rss[i - 1].lon) / 1000; //单位米
			var time = Math.abs(rss[i].standard_time.time - rss[i - 1].standard_time.time) / 1000 / 60 / 60;
			var v = distence / time
			if (v < 90 && v > 0) {
				res.push(rss[i]);
			}
		}
		return res;
	},*/
	init_extent : function() {
		var points_x = [];
		var points_y = [];
		dojo.forEach(this._res, function(item) {
			points_x.push(item.lon);
			points_y.push(item.lat);
		})
		var maxX = Math.max.apply(null, points_x);
		var maxY = Math.max.apply(null, points_y);
		var minX = Math.min.apply(null, points_x);
		var minY = Math.min.apply(null, points_y);

		var extent = new esri.geometry.Extent(minX, minY, maxX, maxY, new esri.SpatialReference({
			wkid : 4326
		}));
		this._map.setExtent(extent);
	},
	analysisManPoints : function() {
		//分析获取的点
		this.angleArray = [];
		this.lengths = []; //每组的长度
		this.lengths_fenduan = []; //
		this.polylineArray = [];

		for (var i = 1; i < this._res.length; i++) {
			var p = new esri.geometry.Polyline(new esri.SpatialReference({
				wkid : 4326
			}));
			p.addPath([ new esri.geometry.Point(this._res[i - 1]["lon"], this._res[i - 1]["lat"]), new esri.geometry.Point(this._res[i]["lon"], this._res[i]["lat"]) ]);
			this.polylineArray.push(p);
			//将每个点转化为屏幕坐标
			var pa1 = this.MapToscreenPoint([ this._res[i]["lon"], this._res[i]["lat"] ]);
			var pa2 = this.MapToscreenPoint([ this._res[i - 1]["lon"], this._res[i - 1]["lat"] ]);
			var len = this.getLength(pa1, pa2);
			this.lengths.push(len);
			this.lengths_fenduan.push(Math.floor(len / this.fenduanWidth));
			this.angleArray.push(this.getAngleOfTwoPoint(pa1, pa2));
			if (i != this._res.length - 1) {
				this.middlePoint.push(new esri.geometry.Point([ this._res[i]["lon"], this._res[i]["lat"] ]));
			}
		}
		this.animationOfguiji(this._res, this.polylineArray, this.middlePoint);
	},
	animationOfguiji : function(res, polylineArray, middlePoint) {
		for (var i = 0; i < polylineArray.length; i++) {
			if (i == polylineArray.length - 1) {
				this.thisLayer.add(this.onepoint);
				//添加终点
				this.addIconToMap(res[res.length - 1], 'images/icon/end.png', [ 0, 12 ], [ 23, 40 ], 'end');
				this.addIconToMap(res[res.length - 1], 'images/icon/close10.gif', [ 10, 45 ], [ 12, 14 ], 'close');

			} else if (i == 0) {
					//添加起点图标
					this.addIconToMap(res[0], 'images/icon/start.png', [ 0, 12 ], [ 23, 40 ], 'start', true);
				}
			if (!res[i] || (!res[i]["lon"] || !res[i]["lat"])) return;
			var pathArr=polylineArray[i].paths[0][1];
			var point =new esri.geometry.Point(pathArr[0], pathArr[1], new esri.SpatialReference({
				wkid : 4326
			}))
			this.thisLayer.add(new esri.Graphic(point, this.pointSysbol), null, null);
			this.thisLayer.add(new esri.Graphic(polylineArray[i], this.lineSysbol2), null, null);
			this.thisLayer.add(new esri.Graphic(polylineArray[i], this.lineSysbol), null, null);
			res[i] && this.drawArrows(res, i);
		}
		
	},
	drawArrows : function(res, i) {
		//画线上的箭头
		var screenPoint = this.MapToscreenPoint([ res[i]["lon"], res[i]["lat"] ]);

		var a = this.angleArray[i] + 90;
		var psa = this.polar2cartesian(this.pointAndPointWidth, a);
		var leftpoint = [ screenPoint[0] + psa[0], screenPoint[1] + psa[1] ];
		var leftAllpoint = this.getPointsOfEveryLine(leftpoint, this.angleArray[i], this.lengths[i], i);

		var b = this.angleArray[i] - 90;
		var psb = this.polar2cartesian(this.pointAndPointWidth, b);
		var rightPoint = [ screenPoint[0] + psb[0], screenPoint[1] + psb[1] ];
		var rightAllpoint = this.getPointsOfEveryLine(rightPoint, this.angleArray[i], this.lengths[i], i);

		var c = this.angleArray[i];
		var ps = this.polar2cartesian(this.pointAndPointWidth - 1, c);
		var middlePoint = [ screenPoint[0] + ps[0], screenPoint[1] + ps[1] ]; // 中间往上的一点
		var middleAllpoint = this.getPointsOfEveryLine(middlePoint, this.angleArray[i], this.lengths[i], i);

		for (var j = 0; j < leftAllpoint.length; j++) {
			var p = new esri.geometry.Polyline(new esri.SpatialReference({
				wkid : 4326
			}));
			p.addPath([ this.screenPointToMap(new esri.geometry.ScreenPoint(leftAllpoint[j][0], leftAllpoint[j][1])),
				this.screenPointToMap(new esri.geometry.ScreenPoint(middleAllpoint[j][0], middleAllpoint[j][1])),
				this.screenPointToMap(new esri.geometry.ScreenPoint(rightAllpoint[j][0], rightAllpoint[j][1]))
			]);
			//画到地图上
			this.thisLayer.add(new esri.Graphic(p, this.jiantou_Sysbol), null, null);
		}
	},
	getPointsOfEveryLine : function(pointa, angle, lengths, i) {
		//起点  角度   长度   位数
		var AllPoint = [];
		var countlen = this.shengyu_length > 0 ? this.shengyu_length : this.fenduanWidth;
		var countlen = this.fenduanWidth;
		for (var j = 0; j < this.lengths_fenduan[i]; j++) {
			if (countlen <= lengths) {
				AllPoint.push(this.getTruePoints(angle, countlen, pointa));
				countlen += this.fenduanWidth;
			}
		}
		return AllPoint;
	},
	MapToscreenPoint : function(mapPoint) {
		var screenPoint = this._map.toScreen(new esri.geometry.Point(mapPoint[0], mapPoint[1], new esri.SpatialReference({
			wkid : 4326
		})));
		return [ screenPoint.x, screenPoint.y ];
	},
	screenPointToMap : function(screenPoint) {
		var mapPoint = this._map.toMap(screenPoint);
		//MXZH.log(mapPoint);
		return mapPoint;
	},
	addIconToMap : function(point, img, offset, imgsize, IconName, notputtomap) {
		var pos = new esri.geometry.Point(point["lon"], point["lat"], new esri.SpatialReference({
			wkid : 4326
		}));
		var sys = new esri.symbol.PictureMarkerSymbol(img, imgsize[0], imgsize[1]);
		offset && sys.setOffset(offset[0], offset[1]);
		if (notputtomap) {
			this.onepoint = new esri.Graphic(pos, sys, {
				name : IconName
			}, null);
		} else
			this.thisLayer.add(new esri.Graphic(pos, sys, {
				name : IconName
			}, null));
	},

	clearGuiji : function(isDis) {
		//清除轨迹
		this.thisLayer.clear();
		this.angleArray = [];
		this.lengths = []; //每组的长度
		this.lengths_fenduan = []; //
		if (!isDis) dojo.disconnect(this.mapExtenthandle);
	},
	clearGuijiAndslider : function() {
		isplay = false;
		indexOfPoint=0;
		window.timer_handle && clearTimeout(timer_handle);
		MXZH.mainMap.wangMap.map.removeLayer(this.thisLayer);
		$(".timebarbox").fadeOut(300);
		MXZH.effectController.check_panl2(1);
		window.guijiLayer && MXZH.mainMap.wangMap.map.removeLayer(window.guijiLayer);
	},
	startMapExtent : function() {
		//监听
		var self = this;
		this.mapExtenthandle = dojo.connect(this._map, 'onZoomEnd', _mapExtentChange);
		function _mapExtentChange(e) {
			self.clearGuiji(true);
			self.analysisManPoints();
		}
	},
	endMapExtent : function() {
		dojo.disconnect(this.mapExtenthandle);
	},
	addEventListening : function() {
		var self = this;
		dojo.connect(this.thisLayer, 'onClick', function(e) {
			try {
				var name = e.graphic.attributes.name;
			} catch (e) {
				MXZH.log('错误：' + e.toString());
			}
			if (name === 'close') {
				//关闭轨迹路线
				self.clearGuijiAndslider();
				self.endMapExtent();
			}
		});
		dojo.connect(this.thisLayer, 'onMouseOver', function(e) {
			if (!e.graphic.attributes) return;
			try {
				var name = e.graphic.attributes.name;
			} catch (e) {
				MXZH.log('错误：' + e.toString());
			}
			if (name === 'close') {
				//换鼠标
				self._map.setMapCursor("pointer");
				var pic = new esri.symbol.PictureMarkerSymbol('images/icon/close10_hover.png', 12, 14);
				pic.setOffset(10, 45);
				e.graphic.symbol = pic;
				self.thisLayer.redraw();
			}
		});
		dojo.connect(this.thisLayer, 'onMouseOut', function(e) {
			if (!e.graphic.attributes) return;
			try {
				var name = e.graphic.attributes.name;
			} catch (e) {
				MXZH.log('错误：' + e.toString());
			}
			if (name === 'close') {
				//换鼠标
				self._map.setMapCursor("default");
				var pic = new esri.symbol.PictureMarkerSymbol('images/icon/close10.gif', 12, 14);
				pic.setOffset(10, 45);
				e.graphic.symbol = pic;
				self.thisLayer.redraw();
			}

		});

		this.startMapExtent();

	},

	/*
	 * 以下是通用算法 与具体业务无关
	 * wxl
	 */
	/*
	      极坐标转笛卡尔坐标
	 */
	polar2cartesian : function(R, theta) {
		var x = R * Math.cos(theta);
		var y = R * Math.sin(theta);
		return [ x, y ];
	},

	/*
	                          根据两个点， 获取长度
	 */
	getLength : function(A, B) {
		return Math.sqrt((A[0] - B[0]) * (A[0] - B[0]) + (A[1] - B[1])
			* (A[1] - B[1]));
	},
	getTruePoints : function(theta, R, P) {
		//角度  长度   原位置
		return [ this.polar2cartesian(R, theta)[0] + P[0], this.polar2cartesian(R, theta)[1] + P[1] ];
	},
	//获取两个点 与坐标系之间的角度
	getAngleOfTwoPoint : function(p1, p2) {
		return Math.atan2(p1[1] - p2[1], p1[0] - p2[0]);
	},
	//求距离
	toRad : function(d) {
		return d * Math.PI / 180;
	},
	getDisance : function(lat1, lng1, lat2, lng2) {
		var dis = 0;
		var radLat1 = this.toRad(lat1);
		var radLat2 = this.toRad(lat2);
		var deltaLat = radLat1 - radLat2;
		var deltaLng = this.toRad(lng1) - this.toRad(lng2);
		var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
		return dis * 6378137;
	}
}


/**************************历史轨迹控制器类*******************************************************************/
MXZH.lsgjCF = function() {
	this.extent = MXZH.mainMap.wangMap.map.extent;
}
MXZH.lsgjCF.prototype = {
	config : {
		//可用的配置
		lsgj_button : '.lsgj_button',
		lsgj_input : '.lsgj_input',
		gjzsBtnBox : '.gjzsBtnBox',
		lsgjDataURL : 'sds',
		currentpageNo : 1, //当前页码数
		everyPageNo : 3, //每页的天数
		checkListArray : '',
		searchInfo : [],
	},
	init : function() {
		if(MXZH.effectController.ojbs instanceof MXZH.lsgjCF){
			MXZH.effectController.ojbs.destroy();
			
		}
		this.config.checkListArray = '';
		this.config.searchInfo=[];
		this.lsgjbf = new MXZH.lsgjBF();
		this.lsgj = new MXZH.lsgj(this.lsgjbf);
		this.bigPic = new MXZH.opentPics();
		this.bigPic.init();
		this.addEventListener();
	},
	destroy : function() {
		this.lsgj.clearGuijiAndslider();
		MXZH.effectController.animateOfCB(1);
		$(".lsgj_lu").html("");$(".gjzsBtnBox").hide();
		$("#lsgj_pagesbox").hide();
	},
	addEventListener : function() {
		//注册事件
		dojo.query(this.config.lsgj_button).onclick(this, this.beginSeach);
		//dojo.query(this.config.gjzsBtnBox).onclick(this, this.showGJ);
		$(this.config.gjzsBtnBox).unbind().click(this, this.showGJ);
	},
	beginSeach : function() {
		//获取搜索内容 假如没有，就不添加搜索条件
		var text = $.trim($(this.config.lsgj_input).val());
		var beginTime = $.trim($(".lsgjlayui-input_bgtime").val());
		var endTime = $.trim($(".lsgjlayui-input_endtime").val());
		this.config.searchInfo = [ text, beginTime, endTime ];
		this.config.currentpageNo = 1;
		this.checkData(this.config.searchInfo);
	},
	getDataOfgj : function(array) {
		//获取历史轨迹的数据
		var self = this;
		MXZH.effectController.loading(true);
		// 参数：开始时间、结束时间、搜索词、页数、每页条数
		$.ajax({
			url : "${basePath}/map_GetTrajUsers.action?time=" + new Date().getTime(),
			type : "post",
			data : {
				lsgj_startTime : array[1],
				lsgj_endTime : array[2],
				lsgj_condition : array[0],
				pageNo : self.config.currentpageNo,
				pageSize : self.config.everyPageNo
			},
			dataType : "json",
			success : function(result) {
				MXZH.effectController.loading(false);
				layui.use([ 'laypage' ], function() {
					var laypage = layui.laypage;
					laypage({
						cont : 'lsgj_pagesbox',
						pages : result[0].totalPage,
						groups : 4,
						curr : self.config.currentpageNo, //result[0].pageNo,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								self.config.checkListArray = '';
								self.config.currentpageNo = obj.curr;
								self.getDataOfgj(self.config.searchInfo);
							}
						}
					});
				});
				self.showlsgjGyxx(result);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw ('数据请求失败！');
			}
		});
	},
	checkData : function(array) {
		if (!array[1] && !array[2]) {
			this.msgOfsswz('查询时间不能为空！');return;
		} else if (!array[1]) {
			this.msgOfsswz('开始时间不能为空！');return;
		} else if (!array[2]) {
			this.msgOfsswz('结束时间不能为空！');return;
		}
		//比较时间
		var d1 = new Date(array[1].replace(/-/g, '\/'));
		var d2 = new Date(array[2].replace(/-/g, '\/'));
		var date3 = d2.getTime() - d1.getTime(); //时间差的毫秒数
		var days = date3 / (24 * 3600 * 1000); //计算天数后剩余的 天数
		var hours = days * 24;
		if (hours > 8) {
			this.msgOfsswz('日期间隔不能大于8小时！');
			return;
		}
		//比较时间选择
		if (Number(d1) > Number(d2)) {
			this.msgOfsswz('开始时间不能大于结束时间！');
			return false;
		}
		this.getDataOfgj(array);
	},
	showlsgjGyxx : function(gyxxList) {

		if (!gyxxList[0] || gyxxList[0].beanList.length <= 0) {
			this.msgOfsswz('时间段内无轨迹数据！');
			$(".lsgj_lu").text('暂无结果！');
			$(".gjzsBtnBox").hide();
			return;
		}
		$(".gjzsBtnBox").fadeIn(300);
		var totalNo = gyxxList[0].totalNo;
		var totalPage = gyxxList[0].totalPage; //lsgj_pagesbox
		var self = this;
		$(".lsgj_lu").html(" ");
		totalPage > 1 ? $(".gjzsBtnBox").css('bottom', '50px') : $(".gjzsBtnBox").css('bottom', '0px');
		if (gyxxList[0].beanList.length > 0) {
			for (var i = 0; i < gyxxList[0].beanList.length; i++) {
				var objs = gyxxList[0].beanList[i];
				var isAddClass = '';
				//self.config.checkListArray == objs.user_name ? isAddClass = " layui-form-checked" : isAddClass = "";
				var trHtml = " ";
				var lihtml = "<li class='lsgj_li'> <div class='lsgj_txt_title'><input type='checkbox' lay-skin='primary' title=" + objs.name + ">" +
					"<div class='layui-unselect layui-form-checkbox lsgj_check " + isAddClass + " ' lay-skin='primary' usename=" + objs.user_name + "><span>" + objs.name + "</span><i class='layui-icon'></i></div></div>"
					+ "<div class='lsgj_txt'> <span>开始时间：</span><span>" + objs.start_time + "</span> </div>"
					+ "<div class='lsgj_txt'> <span>结束时间：</span><span>" + objs.end_time + "</span> </div>"
					+ "<div class='lsgj_txt'> <div class='lsgj_txt2 ellipsis'> <span>采样点数：</span><span>" + objs.trj_num + "</span><span>(个)</span> </div>"
					+ "<div class='lsgj_txt2 ellipsis'> <span>里程：</span><span>" + objs.length + "</span><span>km</span> </div>  </div>"
					+ "<div class='lsgj_txt'> <div class='lsgj_txt2 ellipsis'> <span>平均速度：</span><span>" + objs.averge_speed + "</span><span>km/h</span> </div>"
					+ "<div class='lsgj_txt2 ellipsis'> <span>耗时：</span><span>" + objs.take_times + "</span> </div> </div> </li>";
				$(lihtml).appendTo(".lsgj_lu");
			}
		}
		$(".lsgj_check").unbind().click(function() {
			$(".lsgj_check").removeClass("layui-form-checked");
			$(this).toggleClass("layui-form-checked");
			if ($(this).hasClass("layui-form-checked")) {
				self.config.checkListArray = $(this).attr('usename');
				_lsgjPicsName=$(this).prev().attr("title"); 
			} else
				self.config.checkListArray = '';

		});
		$("#lsgj_pagesbox").show();
	},
	showGJ : function(event) {
		var self = event.data;
		//轨迹展示
		//var uniqeChecked = _.uniq(self.config.checkListArray); //去重后的选中列表
		if (self.config.checkListArray == '') {
			self.msgOfsswz('至少选择一个用户！');
			MXZH.effectController.loading(false);
			return;
		}
		MXZH.effectController.loading(true);
		self.addGJToMap(self.config.checkListArray);
		//查询这段时间内的所有 图片 来源 聊天数据
		var querySting = "'" + self.config.checkListArray + "',";
		self.getPicsformChart(querySting.substr(0, querySting.length - 1));
	},
	getPicsformChart : function(names) {
		var self = this;
		_lsgjPicsName && $(".lsgj_Panel2").find('.lsgi_title').text(_lsgjPicsName);
		$.ajax({
			url : "${basePath}/map_GetpicsByUserid.action?time=" + new Date().getTime(),
			type : "post",
			data : {
				lsgj_startTime : self.config.searchInfo[1],
				lsgj_endTime : self.config.searchInfo[2],
				lsgj_condition : names
			},
			dataType : "json",
			async : false,
			success : function(result) {
				MXZH.effectController.loading(false);
				if (result.length > 0) {
					MXZH.effectController.check_panl2(2);
					$(".timebarbox").css("width", '48.5%');
					//$(".lsgj_Panel2").show();
					self.fillPicForhtml(result);
				} else {
					//MXZH.effectController.animateOfCB(1);
					MXZH.effectController.check_panl2(1);
					$(".timebarbox").css("width", '60%');
				}
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw ('数据请求失败！');
			}
		});
	},
	fillPicForhtml : function(result) {
		$(".timeline_lsgj").html("");
		var html = " ";
		var top = 0;
		var self = this;
		var img_time={};
		var img_attr={}; 
		dojo.forEach(result, function(item) {
			var mydate = new Date(item.create_time.time);
			var dfs=mydate.Format('MM/dd')+','+mydate.Format('hh:mm');
			var att = eval('(' + item.attachment + ')');
			var imgMax = base_url + att.original;
	        if(img_time[dfs]){
	        	img_time[dfs] += ","+imgMax;
	        }else{
	        	img_time[dfs]  =  imgMax;
	        }
	    	img_attr[dfs] =att
		});
		for(var o in img_time){
			var att =img_attr[o];
			var imgMax=img_time[o];
			var dt=o.split(',');
			html += "<ul date_=" + dt[1] + "><li class='left' style='top:" + top + "px'><span class='dot'></span><div class='gsdt_left'>" +
				"<div class='gsdt_left_date'>" + dt[0] + "</div><div class='gsdt_left_time'>" +dt[1]+ "</div></div></li>" +
				"<li class='right' style='top:" + top + "px;padding: 1px;'><a href='#'>" +
				"<div class='gsdt_imgBox' tplj=" + imgMax + "><img src='" + att.thumbnail + "'></div></a></li></ul>";
			top += parseInt(att.thumbHeight) + 85;
		
		}
		$(".timeline_lsgj").append(html).css('height', top + 'px');
		$(".scrollbar-inner").scrollbar();
		$(".gsdt_imgBox").unbind().click(function(e) {
			//点击查看大图
			self.showBigPics($(this));
		});
	},
	showBigPics : function(event) {
		//解密
		this.bigPic.setPicArray(event.attr('tplj'));
	},
	addGJToMap : function(name) {
		var self = this;
		$.ajax({
			url : "${basePath}/map_GetLsgjByUserid.action?time=" + new Date().getTime(),
			type : "post",
			data : {
				lsgj_startTime : self.config.searchInfo[1],
				lsgj_endTime : self.config.searchInfo[2],
				lsgj_condition : name
			},
			dataType : "json",
			async : false,
			success : function(result) {
				//去重复
				var times=[];
				var newres=[];
				for(var i=0;i<result.length;i++){
					if(dojo.indexOf(times,result[i].standard_time.time)<0){
						times.push(result[i].standard_time.time);
						newres.push(result[i]);
					}
				}
				
				//对result进行排序
				var res = newres.sort(function(a, b) {
					return a.standard_time.time - b.standard_time.time;
				});
				

				self.lsgj.init({
					map : MXZH.mainMap.wangMap.map,
					res : res,
					num : 1
				}, function(rs) {
					self.dotimerslider(name, rs);
				});

			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw ('数据请求失败！');
			}
		});
	},
	dotimerslider : function(clickName, res) {
		//开始执行 时间轴
		var maxDate = res[res.length - 1].bdtime.time;
		var mindate = res[0].bdtime.time;
		this.lsgjbf.init({
			map : MXZH.mainMap.wangMap.map,
			res : res,
			maxDate : maxDate,
			mindate : mindate,
			lsgjClass : this.lsgj
		});
		this.lsgjbf.isLoaded = this.isLoaded = true;
	},
	msgOfsswz : function(msg) {
		var self = this;
		layui.use('layer', function() {
			var layer = layui.layer;
			layer.msg(msg || self.msg, {
				area : [ '240px', '50px' ],
				time : 3000 //1秒关闭（如果不配置，默认是3秒）
			}, function() {
				//do something
			});
		});
	},
}