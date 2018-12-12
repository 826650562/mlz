//新的历史轨迹
/*
 * 新增
 * 1.根据速度去除噪点
 * 2.改为按点播放
 */
var guijiLayer = null;
var ispalyimg = false;
var axis;
var typeOfPoint = [];
var fristPoint;
MXZH.lsgjBF = function() {};
MXZH.lsgjBF.prototype = {
	restults : {},
	infos : {},
	from : function(data) {
		this.restults = data;
		this.infos = this.restults.res;
		this.map = this.restults.map;
		this.lsgjclass = data.lsgjClass;
	},
	init : function(opts) {
		var stripe_width = 0;
		if (window.axis) {
			axis.clear();
		}
		MXZH.effectController.loading(false);
		this.from(opts);
		//初始化播放轴
		this.getPicsformChart();
		this.addEventlister();
	},
	getPicsformChart : function() {
		_lsgjPicsName && $(".lsgj_Panel2").find('.lsgi_title').text(_lsgjPicsName);
		//绘制播放轴
		MXZH.effectController.check_panl2(2);
		$(".timebarbox").css("width", '48.5%');
		axis = new DrawAxis();
		var offset = $("#all").offset(),
			height = $("#all").parent(".scrollbar-inner").height();
		axis.setInitPosition(offset.top + 36, offset.left + 154, height - 10);
		axis.initAxis(this.infos);
		axis.moveMouse();
		this.setPostion();
		//设置速度
		this.setSpeed(50);
	},
	getPicforMove : function(imgName) {
		var picsybol = new esri.symbol.PictureMarkerSymbol(imgName, 36, 51);
		picsybol.setOffset(0, 20);
		return picsybol;
	},
	addEventlister : function() {
		var self = this;
		$(".play_box").unbind().click(function() {
			//点击
			var type = $(this).attr("_type");
			self.replacePics(type, true);
		});

		$(".reset_box").unbind().click(function() {
			//回到原始状态
			self.reset();
			ispalyimg = false;
		});
		$(".range_box").html("<div class='range'> <span class='range_text'>0</span><input type='range' min='0' max='100' step='1' ><span class='range_text'>100</span></div>");
		var sliderRange = $('.range input');
		sliderRange.on("change", function(e) {
			self.setSpeed(e.target.value);
		})
		sliderRange.on("mousemove", function(e) {
			var val = e.target.value;
			$(this).css('background-image',
				'-webkit-gradient(linear, left top, right top, '
				+ 'color-stop(' + val + '%, #0774ea), '
				+ 'color-stop(' + val + '%, #C5C5C5)'
				+ ')'
			);
		});
		
	},
	replacePics : function(type, isgo) {
		if (type == 'play') {
			//假如是play 则暂停
			$(".play_box").attr("_type", 'parse');
			$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");
			!isgo || this.pause();
			ispalyimg = false;

		} else if (!type || type == 'parse') {
			$(".play_box").attr("_type", 'play');
			$(".play_box").css("background", "url(./mx/lsgj/images/pausebtn.png)");
			!isgo || this.play();
			ispalyimg = true;
		}
	},
	setPointTomap : function(type, pt, indexInOrigin) {
		//将点撒到地图上
		if (pt.x && pt.y) {
			var picName;
			var tag;
			var sysbol;
			guijiLayer.clear();
			var point = new esri.geometry.Point(pt.x, pt.y, new esri.SpatialReference({
				wkid : 3857
			}));
			this.converExent(point);
			if (type == 1 || type == 2) {
				//正常轨迹
				type == 1 ? picName = "mx/lsgj/images/walk.png" : picName = "mx/lsgj/images/stop.png";
				tag = "anmition_" + indexInOrigin;
				sysbol = this.lsgjclass.anmitionSysbol;
			} else {
				//离线点
				picName = "mx/lsgj/images/offline.png";
				tag = "lixian_" + indexInOrigin;
				sysbol = this.lsgjclass.LostLineSymbolOfgq;
			}
			var gra = new esri.Graphic(point, this.getPicforMove(picName), null, null);
			guijiLayer.add(gra);
			if (!fristPoint) {
				fristPoint = gra;
			}
			this.lsgjclass.fillAnmitionLayer(tag, pt, sysbol);
		}
	},
	//变换范围
	converExent:function(geo){
		var extent=this.map.extent;
		if(!extent.contains(geo)){
			this.map.centerAt(geo); 
		};
	},
	play : function() {
		axis.getPointer().play();
	},
	pause : function() {
		//暂停
		axis.getPointer().pause();
	},
	reset : function() {
		axis.getPointer().reset();
		$(".play_box").attr("_type", 'parse');
		$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");
		//清空填充
		this.lsgjclass.clearAnmitionLayers();
		guijiLayer.clear();
		if (fristPoint) {
			guijiLayer.add(fristPoint);
		}
	},
	setPostion : function() {
		var that = this;
		axis.getPointer().onNext(function(type, pt, indexInOrigin) {
			that.setPointTomap(type, pt, indexInOrigin);
		});
		
		axis.getPointer().onFinish(function() {
			$(".play_box").attr("_type", 'parse');
			$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");
		})
	},
	setSpeed : function(value) {
		var v = (100 - parseInt(value)) * 6;
		axis.getPointer().speedUp(v, ispalyimg);
		$('.range input').css('background-image',
			'-webkit-gradient(linear, left top, right top, '
			+ 'color-stop(' + value + '%, #0774ea), '
			+ 'color-stop(' + value + '%, #C5C5C5)'
			+ ')');
		$('.range input').attr("value", value);
	}
};


/**************************历史轨迹业务逻辑类*******************************************************************/
MXZH.lsgj = function(bofangClass) {
	this._map = null;
	this._res = null;
	this.onepoint = null, //放第一个图标
	this.thisLayer = new esri.layers.GraphicsLayer();
	this.heatLayer = [];
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
	this.jiantoupoint = null;
	//动画图层
	this.anmitionLayers = [];

	//箭头图层
	this.iconLayers = [];


	//开始结束图标
	this.beginAndendiconLayers = [];
	// [[252,158, 203, 1],[0,0,0,0.8]],
	this.colors = [
		[ [ 253, 137, 22, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 240, 102, 87, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 139, 66, 249, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 64, 164, 42, 1 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 172, 197, 218, 1 ], [ 236, 236, 236, 1 ] ]
	];
	this.bofang = bofangClass;
	/*	this.xmin_max = [ 118, 130 ];
		this.ymin_max = [ 25, 45 ];*/

	this.xmin_max = [ 1, 1400000 ];
	this.ymin_max = [ 1, 1400000 ];
	var num = 4; //使用第几个颜色
	this.lineSysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][0]), 6);
	this.lineSysbol2 = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][0]), 6);
	this.jiantou_Sysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][1]), 2);
	this.pointSysbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 11,
		new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([ 65, 122, 225, 1 ]), 1),
		new dojo.Color([ 255, 255, 255, 1 ]));
	//STYLE_SHORTDASHDOT
	this.LostLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT,
		new dojo.Color(this.colors[num][0]), 6);
	this.LostLineSymbolOfgq = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT,
		new dojo.Color([ 65, 122, 225 ]), 6);
	this.anmitionSysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([ 65, 122, 225 ]), 6);

}
MXZH.lsgj.prototype = {
	config : {
		//可用的配置
	},
	//构造函数
	init : function(options, callback) {
	    //this.clearGuiji();
		this.clearGuijiAndslider(true);
		this._map = options.map;
		this._res = [];
		this.startAndEndPoint = [];
		var self = this;
		self._res = options.res; 
		if (this._res.listMyTrac.length <= 2) {
			MXZH.msgOfsswz('有效轨迹数据不足！');
			MXZH.effectController.loading(false);
			this.clearGuijiAndslider();
			return false;
		}
		this.compileData();
		if(this.thisLayer){
			this._map.removeLayer(this.thisLayer);
		}else{
			this.thisLayer=new esri.layers.GraphicsLayer();
		}
		this._map.addLayer(this.thisLayer);
		var listMyTrac = self._res.listMyTrac;
		var Extentpoints = [];
		for (var index = 0; index < listMyTrac.length; index++) {
			Extentpoints = Extentpoints.concat(listMyTrac[index].showPt);
		}
		this.getBeginAndEndPoints(listMyTrac);
		var lostBegin = null,
			lostEnd = null;
		showTRC = function() {
			var lx_idnex = 0;
			var p2 = new esri.geometry.Polyline(new esri.SpatialReference({
				wkid : 3857
			}));
			for (var index = 0; index < listMyTrac.length; index++) {
				if (!self.isFilled('anmition_' + index)) {
					var g = new esri.layers.GraphicsLayer({
						className:"guiji_tc"
					});
					g.add(new esri.Graphic(p2, self.anmitionSysbol, {
						type : 'anmition_' + index
					}, null));

					typeOfPoint.push({
						['anmition_' + index] : []
					});
					self._map.addLayer(g);
					self.anmitionLayers.push(g);
				}
			}
			
			for (var index = 0; index < listMyTrac.length; index++) {
				var showPts = listMyTrac[index].showPt;
				self.analysisManPoints(showPts, index);

				if (index < listMyTrac.length - 1) {
					lostBegin = listMyTrac[index].showPt[listMyTrac[index].showPt.length - 1];
					lostEnd = listMyTrac[index + 1].showPt[0];
				}

				if (lostBegin && lostEnd) {
					//假如满足条件 则铺设一条信号丢失线路
					var Lostp = new esri.geometry.Polyline(new esri.SpatialReference({
						wkid : 3857
					}));
					var Lostp2 = new esri.geometry.Polyline(new esri.SpatialReference({
						wkid : 3857
					}));
					var paths = [];
					paths.push(new esri.geometry.Point(lostBegin.x, lostBegin.y, new esri.SpatialReference({
						wkid : 3857
					})))
					paths.push(new esri.geometry.Point(lostEnd.x, lostEnd.y, new esri.SpatialReference({
						wkid : 3857
					})))
					Lostp.addPath(paths);
					self.thisLayer.add(new esri.Graphic(Lostp, self.LostLineSymbol));
					lx_idnex++;
					//动画
				/*	if (!self.isFilled('lixian_' + lx_idnex)) {
						var g = new esri.layers.GraphicsLayer();
						g.add(new esri.Graphic(Lostp2, self.LostLineSymbolOfgq, {
							type : 'lixian_' + lx_idnex
						}, null));
						typeOfPoint.push({
							['lixian_' + lx_idnex] : []
						});
						self._map.addLayer(g);
						self.anmitionLayers.push(g);
					}*/
				}
				//加载热力图
				if (listMyTrac[index].stopPt.length >= 0) {
					var layer = self.retLayer(listMyTrac[index].stopPt);
					layer.setRenderer(self.getRander());
					self._map.addLayer(layer);
					self.heatLayer.push(layer);
				}
			}
			self.setBeginAndEndToMap();
		}
		//监听
		//this.mapExtenthandle = dojo.connect(this._map, 'onZoomEnd', showTRC);
		showTRC();
		//分析地图的范围
		this.init_extent(Extentpoints);
		this.addEventListening();
		callback(this._res)
	},
	getBeginAndEndPoints : function(listMyTrac) {

		for (var index = 0; index < listMyTrac.length; index++) {
			if (listMyTrac[index].showPt.length) {
				if (!this.startAndEndPoint[0]) {
					this.startAndEndPoint[0] = listMyTrac[index].showPt[0];
					break;
				}
			}
		}

		for (var index = listMyTrac.length - 1; index >= 0; index--) {
			if (listMyTrac[index].showPt.length) {
				if (!this.startAndEndPoint[1]) {
					this.startAndEndPoint[1] = listMyTrac[index].showPt[listMyTrac[index].showPt.length - 1];
					break;
				}
			}
		}
	},
	setBeginAndEndToMap : function() {
		var _s = this;
		var endp = this.startAndEndPoint[this.startAndEndPoint.length - 1];
		var g = new esri.layers.GraphicsLayer();
		this._map.addLayer(g);
		this.beginAndendiconLayers.push(g);

		addCircle(endp);
		//添加终点
		this.addIconToMap(endp, 'mx/lsgj/images/end.png', [ 0, 22 ], [ 36, 45 ], 'end', false, g);
		this.addIconToMap(endp, 'images/icon/close10.gif', [ 23, 0 ], [ 12, 14 ], 'close');
		//添加起点图标
		var startp = this.startAndEndPoint[0];
		addCircle(startp);
		this.addIconToMap(startp, 'mx/lsgj/images/start.png', [ 0, 22 ], [ 36, 45 ], 'start', false, g);

		function addCircle(p) {
			//添加小圆圈
			var pos = new esri.geometry.Point(p["x"], p["y"], new esri.SpatialReference({
				wkid : 3857
			}));
			g.add(new esri.Graphic(pos, _s.pointSysbol, {
				name : 'smileCircle'
			}, null));
		}

		if (window.guijiLayer) {
			this._map.removeLayer(guijiLayer);
		} else {
			guijiLayer = new esri.layers.GraphicsLayer();
		}
		this._map.addLayer(guijiLayer);
	},
	//预处理处理数据
	compileData : function() {
		var listMyTrac = this._res.listMyTrac;
		for (var index = 0; index < listMyTrac.length; index++) {
			var res_points = listMyTrac[index].showPt;
			for (var k = 0; k < res_points.length; k++) {
				//var xy = MXZH.bd09togcj02(res_points[k].x, res_points[k].y)
				var mkt = MXZH.ToWebMercator2(res_points[k].x, res_points[k].y);
				res_points[k].x = mkt[0];
				res_points[k].y = mkt[1];
			}
			this._res.listMyTrac[index].showPt = res_points;
		}
	},
	init_extent : function(Extentpoints, func) {
		var points_x = [];
		var points_y = [];
		dojo.forEach(Extentpoints, function(item) {
			points_x.push(item.x);
			points_y.push(item.y);
		})
		var maxX = Math.max.apply(null, points_x);
		var maxY = Math.max.apply(null, points_y);
		var minX = Math.min.apply(null, points_x);
		var minY = Math.min.apply(null, points_y);
		var extent = new esri.geometry.Extent(minX, minY, maxX, maxY, new esri.SpatialReference({
			wkid : 3857
		}));
		this._map.setExtent(extent);
	},
	getRander : function() {
		var heatmapRenderer = new esri.renderer.HeatmapRenderer({
			field : "sudu",
			colors : [ "rgba(195,247,98, 0)", "rgb(245, 221, 62)",
				"rgb(241, 122, 30)", "rgb(241, 84, 12)" ],
			blurRadius : 6,
			maxPixelIntensity : 600,
			minPixelIntensity : 10
		});
		return heatmapRenderer;
	},
	retLayer : function(res) {
		//根据点坐标生成热力图
		var layerDefinition = {
			"geometryType" : "esriGeometryPoint",
			"fields" : [ {
				"name" : "sudu",
				"type" : "esriFieldTypeInteger"
			} ]
		}
		var featureCollection = {
			layerDefinition : layerDefinition,
			featureSet : null
		};
		var featureLayer = new esri.layers.FeatureLayer(featureCollection, {
			mode : esri.layers.FeatureLayer.MODE_AUTO,
			className : "layer_heatmap"
		});

		for (var i = 0; i < res.length; i++) {
			for (var k = 0; k < res[i].length; k++) {
				var p = res[i][k];
				//var xy = MXZH.bd09togcj02(p.x, p.y)
				var mkt = MXZH.ToWebMercator2(p.x, p.y);
				featureLayer.add(new esri.Graphic(new esri.geometry.Point(mkt[0], mkt[1], new esri.SpatialReference({
					wkid : 3857
				})), null, {
					"sudu" : Math.random() * 50
				}, null));
			}
		}
		return featureLayer
	},
	analysisManPoints : function(res_points, sy) {
		//分析获取的点
		this.angleArray = [];
		this.lengths = []; //每组的长度
		this.lengths_fenduan = [];
		this.polylineArray = [];
		if (!res_points || res_points.length <= 0) return false;
		var polylineOfBack = new esri.geometry.Polyline(new esri.SpatialReference({
			wkid : 3857
		}));
		var p2 = new esri.geometry.Polyline(new esri.SpatialReference({
			wkid : 3857
		}));
		var pathsPointOfBack = [];
		for (var i = 1; i < res_points.length; i++) {
			var p = new esri.geometry.Polyline(new esri.SpatialReference({
				wkid : 3857
			}));

			var path = [ new esri.geometry.Point([ res_points[i - 1]["x"], res_points[i - 1]["y"] ]), new esri.geometry.Point([ res_points[i]["x"], res_points[i]["y"] ]) ]
			p.addPath(path);
			pathsPointOfBack.push(path[0], path[1]);
			this.polylineArray.push(p);
			//将每个点转化为屏幕坐标
			var pa1 = this.MapToscreenPoint([ res_points[i]["x"], res_points[i]["y"] ]);
			var pa2 = this.MapToscreenPoint([ res_points[i - 1]["x"], res_points[i - 1]["y"] ]);
			var len = this.getLength(pa1, pa2);
			this.lengths.push(len);
			this.lengths_fenduan.push(Math.floor(len / this.fenduanWidth));
			this.angleArray.push(this.getAngleOfTwoPoint(pa1, pa2));
			if (i != res_points.length - 1) {
				var p = new esri.geometry.Point(res_points[i]["x"], res_points[i]["y"]);
				this.middlePoint.push(p);
			}
		}
		polylineOfBack.addPath(pathsPointOfBack);
		this.thisLayer.add(new esri.Graphic(polylineOfBack, this.lineSysbol2, null, null));
	/*	//动画
		if (!this.isFilled('anmition_' + sy)) {
			var g = new esri.layers.GraphicsLayer({
				className:"guiji_tc"
			});
			g.add(new esri.Graphic(p2, this.anmitionSysbol, {
				type : 'anmition_' + sy
			}, null));

			typeOfPoint.push({
				['anmition_' + sy] : []
			});
			this._map.addLayer(g);
			this.anmitionLayers.push(g);
		}*/
		this.animationOfguiji(res_points, this.polylineArray);
	},
	isFilled : function(key) {
		var in_ = false;
		dojo.forEach(typeOfPoint, function(item, index) {
			if (dojo.isArray(item[key])) {
				in_ = true;
			}
		});
		return in_;
	},
	//判断是不是存在
	isinTypeOfPoint : function(array, arr) {
		var i = -1;
		var listPoints = [];
		if (arr && dojo.isArray(arr)) {
			dojo.forEach(array, function(item, index) {
				if (item['x'] == arr[0] && item['y'] == arr[1] && item['scj'] == arr[2]) {
					i = index;
				}
			})
			if (i >= 0) {
				for (var index = 0; index <= array.length - 1; index++) {
					if (index <= i) {
						listPoints.push([ array[index].x, array[index].y ])
					}
				}
			}
		}else{
			for (var index = 0; index <= array.length - 1; index++) {
				listPoints.push([ array[index].x, array[index].y ]);
			}
		}
		return listPoints
	},
	//填充动画
	fillAnmitionLayer : function(tag, point, sysbol) {
		//参数 第几个轨迹  点对象
		var self = this;
		var array;
		var num = tag.split("_")[1];
		if (!num) return;
		for (var i = 0; i < typeOfPoint.length; i++) {
			var tagArray = typeOfPoint[i][tag];
			if (tagArray) {
				var thisList = self._res.listMyTrac[num].showPt;
				if (dojo.isArray(tagArray)) {
					var myindex = self.isinTypeOfPoint(thisList, [ point.x, point.y, point.scj ])
					if (myindex.length > 0) {
						//先清空
						tagArray = myindex;
					}
					array = tagArray;
				}
			}
		}
		var polyline = new esri.geometry.Polyline(new esri.SpatialReference({
			wkid : 3857
		}));
		if (array && array.length) {
			dojo.forEach(this.anmitionLayers, function(item, index) {
				//先清空 大于当前位置的数据
				if (item.graphics[0]) {
					var attr = item.graphics[0].attributes;
					var type = attr.type;
					var _num = parseInt(type.split("_")[1]);
					//num当前类型  
					if (_num <= parseInt(num)) {
						if (item.graphics[0].attributes.type == tag) {
							item.clear();
							polyline.addPath(array);
							item.add(new esri.Graphic(polyline, sysbol, attr, null));
						} else {
							//重新填充
							var thisList = self._res.listMyTrac[_num].showPt;
							if (thisList.length) {
								var myindex = self.isinTypeOfPoint(thisList, null)
								item.clear();
								polyline.addPath(myindex);
								item.add(new esri.Graphic(polyline, sysbol, attr, null));
							}
						}
					} else {
						item.clear();
						polyline.addPath([]);
						item.add(new esri.Graphic(polyline, sysbol, attr, null));
					}

				}
			});
		}
	},
	animationOfguiji : function(res, polylineArray) {
		var g = new esri.layers.GraphicsLayer({
			className:"guiji_jt"
		});
		this._map.addLayer(g);
		this.iconLayers.push(g);
		for (var i = 0; i < polylineArray.length; i++) {
			var pathArr = polylineArray[i].paths[0][1];
			res[i] && this.drawArrows(res, i, g);
		}
	},
	drawArrows : function(res, i, layer) {
		//画线上的箭头
		if (this.angleArray[i]) {
			var screenPoint = this.MapToscreenPoint([ res[i]["x"], res[i]["y"] ]);
			var a = this.angleArray[i] + 90;
			var psa = this.polar2cartesian(this.pointAndPointWidth, a);
			var leftpoint = [ screenPoint[0] + psa[0], screenPoint[1] + psa[1] ];
			var leftAllpoint = this.getPointsOfEveryLine(leftpoint, this.angleArray[i], this.lengths[i], i);

			var b = this.angleArray[i] - 90;
			var psb = this.polar2cartesian(this.pointAndPointWidth, b);
			var rightPoint = [ screenPoint[0] + psb[0], screenPoint[1] + psb[1] ];
			var rightAllpoint = this.getPointsOfEveryLine(rightPoint, this.angleArray[i], this.lengths[i], i);

			var c = this.angleArray[i];
			var ps = this.polar2cartesian(this.pointAndPointWidth - 2, c);
			var middlePoint = [ screenPoint[0] + ps[0], screenPoint[1] + ps[1] ]; // 中间往上的一点
			var middleAllpoint = this.getPointsOfEveryLine(middlePoint, this.angleArray[i], this.lengths[i], i);


			var p3 = new esri.geometry.Polyline(new esri.SpatialReference({
				wkid : 3857
			}));

			var point1 = this.screenPointToMap(new esri.geometry.ScreenPoint(leftpoint[0], leftpoint[1]));
			var point2 = this.screenPointToMap(new esri.geometry.ScreenPoint(middlePoint[0], middlePoint[1]))
			var point3 = this.screenPointToMap(new esri.geometry.ScreenPoint(rightPoint[0], rightPoint[1]))

			p3.addPath([ point1, point2, point3 ]);
			if (!this.jiantoupoint) {
				this.jiantoupoint = point2;
			}
			if (leftAllpoint.length) {
				for (var j = 0; j < leftAllpoint.length; j++) {
					var p = new esri.geometry.Polyline(new esri.SpatialReference({
						wkid : 3857
					}));
					var subpoint1 = this.screenPointToMap(new esri.geometry.ScreenPoint(leftAllpoint[j][0], leftAllpoint[j][1]));
					var subpoint2 = this.screenPointToMap(new esri.geometry.ScreenPoint(middleAllpoint[j][0], middleAllpoint[j][1]))
					var subpoint3 = this.screenPointToMap(new esri.geometry.ScreenPoint(rightAllpoint[j][0], rightAllpoint[j][1]))

					p.addPath([ subpoint1, subpoint2, subpoint3 ]);
					if (this.getLength([ this.jiantoupoint.x, this.jiantoupoint.y ], [ subpoint2.x, subpoint2.y ]) >= this.fenduanWidth) {
						//画到地图上
						layer.add(new esri.Graphic(p, this.jiantou_Sysbol), null, null);
						this.jiantoupoint = subpoint2
					}
				}
			} else {
				if (this.getLength([ this.jiantoupoint.x, this.jiantoupoint.y ], [ point2.x, point2.y ]) >= this.fenduanWidth) {
					//画到地图上
					layer.add(new esri.Graphic(p3, this.jiantou_Sysbol), null, null);
					this.jiantoupoint = point2
				}
			}

		}
	},
	getPointsOfEveryLine : function(pointa, angle, lengths, i) {
		//起点  角度   长度   位数
		var AllPoint = [];
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
			wkid : 102100
		})));
		return [ screenPoint.x, screenPoint.y ];
	},
	screenPointToMap : function(screenPoint) {
		var mapPoint = this._map.toMap(screenPoint);
		return mapPoint;
	},
	addIconToMap : function(point, img, offset, imgsize, IconName, notputtomap, layer) {
		var pos = new esri.geometry.Point(point["x"], point["y"], new esri.SpatialReference({
			wkid : 3857
		}));
		var sys = new esri.symbol.PictureMarkerSymbol(img, imgsize[0], imgsize[1]);
		offset && sys.setOffset(offset[0], offset[1]);
		if (notputtomap) {
			this.onepoint = new esri.Graphic(pos, sys, {
				name : IconName
			}, null);
		} else if (layer) {
			layer.add(new esri.Graphic(pos, sys, {
				name : IconName
			}, null));
		} else {
			this.thisLayer.add(new esri.Graphic(pos, sys, {
				name : IconName
			}, null));
		}
	},
	//小删除
	clearGuiji : function(isDis) {
		//清除轨迹
		this.thisLayer.clear();
		ispalyimg = false;
		//暂停
		if (window.axis) {
			axis.getPointer().pause();
		}
		//清除箭头图层
		for (var i = 0; i < this.iconLayers.length; i++) {
			MXZH.mainMap.wangMap.map.removeLayer(this.iconLayers[i]);
		}
		for (var i = 0; i < this.beginAndendiconLayers.length; i++) {
			MXZH.mainMap.wangMap.map.removeLayer(this.beginAndendiconLayers[i]);
		}
		$(".play_box").attr("_type", 'parse');
		$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");
		this.angleArray = [];
		this.lengths = []; //每组的长度
		this.lengths_fenduan = [];
		if (!isDis) {
			dojo.disconnect(this.mapExtenthandle);
		}
		this.iconLayers=this.beginAndendiconLayers=[];
	},
	clearGuijiAndslider : function(isShowSlider) {
		ispalyimg = false;
		fristPoint = null;
		for (var i = 0; i < this.iconLayers.length; i++) {
			MXZH.mainMap.wangMap.map.removeLayer(this.iconLayers[i]);
		}
		for (var i = 0; i < this.beginAndendiconLayers.length; i++) {
			MXZH.mainMap.wangMap.map.removeLayer(this.beginAndendiconLayers[i]);
		}
		this.iconLayers=this.beginAndendiconLayers=[];
		//暂停
		if (window.axis) {
			axis.getPointer().pause();
			axis.clear();
		}
		this.clearHeatMap();
		MXZH.mainMap.wangMap.map.removeLayer(this.thisLayer);
		this.thisLayer.clear();
		$(".timebarbox").fadeOut(300);
		isShowSlider || MXZH.effectController.check_panl2(1);
		if (window.guijiLayer) {
			MXZH.mainMap.wangMap.map.removeLayer(window.guijiLayer);
			guijiLayer = null;
		}
		$(".play_box").attr("_type", 'parse');
		$(".play_box").css("background", "url(./mx/lsgj/images/playbtn.png)");
		dojo.disconnect(this.mapExtenthandle);
		MXZH.originalLsgj.clearguiji();
	},
	clearHeatMap : function() {
		if (this.heatLayer.length) {
			for (var i = 0; i < this.heatLayer.length; i++) {
				this._map.removeLayer(this.heatLayer[i]);
			}
		}
		this.heatLayer = [];
		this.removeAnmitionLayers();
	},
	removeAnmitionLayers : function() {
		//清除layer
		if (this.anmitionLayers.length) {
			for (var i = 0; i < this.anmitionLayers.length; i++) {
				this._map.removeLayer(this.anmitionLayers[i]);
			}
		}
		this.anmitionLayers = [];
		//清除数组
		typeOfPoint = [];
	},
	clearAnmitionLayers : function() {
		//重置的时候 清除
		if (this.anmitionLayers.length) {
			for (var i = 0; i < this.anmitionLayers.length; i++) {
				this.anmitionLayers[i].graphics[0].setGeometry(null);
			}
		}
		for (var o in typeOfPoint) {
			if (dojo.isObject(typeOfPoint[o])) {
				for (var key in typeOfPoint[o]) {
					if (key.indexOf("anmition_") >= 0) {
						typeOfPoint[o][key] = [];
					}
				}
			}
		}
	},
	startMapExtent : function() {
		//监听
		var self = this;
		this.mapExtenthandle = dojo.connect(this._map, 'onZoomEnd', _mapExtentChange);
		function _mapExtentChange(e) {
			self.clearGuiji(true);
			showTRC();
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
				pic.setOffset(23, 0);
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
				pic.setOffset(23, 0);
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

/*****************************原始轨迹****************************************************************/

MXZH.originalLsgj = {
	data : {},
	originalLayer : null,
	init : function(res) {
		this._setData(res);
		this.addBindeEvent();
		this.guiji();
	},
	addBindeEvent : function() {
		var self = this;
		$("#add_originalTrack").css("display","inline");
		$("#add_originalTrack").unbind().click(function() {
			if ($(this).attr("_tag") == 'NOshowOri') {
				//展示原始轨迹
				$(this).attr("_tag", '');
				$(this).find("img").attr('src',"mx/public/images/path.png");
				self.show();
			} else {
				//关闭原始轨迹
				$(this).attr("_tag", 'NOshowOri');
				$(this).find("img").attr('src',"mx/public/images/hiddenpath.png");
				self.hide();
			}
		});
	},
	_setData : function(res) {
		this.data = res;
	},
	show : function() {
		this.originalLayer.show();
	},
	hide : function() {
		this.originalLayer.hide();
	},
	clearguiji : function() {
		this.originalLayer && this._getMap().removeLayer(this.originalLayer);
		$("#add_originalTrack").fadeOut(300);
	},
	AddResToMap : function() {
		var paths = [];
		dojo.forEach(this.data, function(item) {
			//var xy = MXZH.bd09togcj02(item.bdlon, item.bdlat)
			var mkt = MXZH.ToWebMercator2(item.bdlon, item.bdlat);
			paths.push(new esri.geometry.Point(mkt[0], mkt[1], new esri.SpatialReference({
				wkid : 3827
			})))
		});
		return paths;
	},
	getLineSysbol : function() {
		return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([253,126,41,1]), 4);
	},
	_getMap : function() {
		return MXZH.mainMap.wangMap.map;
	},
	guiji : function() {
		this.originalLayer = new esri.layers.GraphicsLayer();
		var p = new esri.geometry.Polyline(new esri.SpatialReference({
			wkid : 3857
		}));
		this._getMap().addLayer(this.originalLayer);
		var paths = this.AddResToMap();
		p.addPath(paths);
		this.originalLayer.add(new esri.Graphic(p, this.getLineSysbol()));
		this.originalLayer.hide();
	},
};




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
		everyPageNo : 4, //每页的天数
		checkListArray : '',
		searchInfo : [],
	},
	init : function() {
		MXZH.getMapParent.switchBaseLayer("shiliang");
		if (MXZH.effectController.ojbs instanceof MXZH.lsgjCF) {
			MXZH.effectController.ojbs.destroy();

		}
		this.config.checkListArray = '';
		this.config.searchInfo = [];
		this.lsgjbf = new MXZH.lsgjBF();
		this.lsgj = new MXZH.lsgj(this.lsgjbf);
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
		var quyu = $.trim($("#fx_xiangzhen").val());//所属企业
		this.config.searchInfo = [ text, beginTime, endTime,quyu ];
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
				quyu:array[3],
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
					+ "<div class='lsgj_txt'> <span>隶属：</span><span>"+objs.ssdw+"</span> </div>"
					+ "<div class='lsgj_txt2 ellipsis'> <span>行程数：</span><span>" + objs.length + "</span><span>km</span> </div>  </div>"
					+ "<div class='lsgj_txt'> <div class='lsgj_txt2 ellipsis'> <span>平均速度：</span><span>" + objs.averge_speed + "</span><span>km/h</span> </div>"
					+ "</div> </li>";
				$(lihtml).appendTo(".lsgj_lu");
			}
		}
		$(".lsgj_check").unbind().click(function() {
			$(".lsgj_check").removeClass("layui-form-checked");
			$(this).toggleClass("layui-form-checked");
			if ($(this).hasClass("layui-form-checked")) {
				self.config.checkListArray = $(this).attr('usename');
				_lsgjPicsName = $(this).prev().attr("title");
			} else
				self.config.checkListArray = '';
		});
		$("#lsgj_pagesbox").show();
	},
	showGJ : function(event) {
		var self = event.data;
		ispalyimg = false;
		//轨迹展示
		//var uniqeChecked = _.uniq(self.config.checkListArray); //去重后的选中列表
		if (self.config.checkListArray == '') {
			self.msgOfsswz('至少选择一个用户！');
			MXZH.effectController.loading(false);
			return;
		}
		MXZH.effectController.loading(true);
		self.addGJToMap(self.config.checkListArray);
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
			success : function(res) {
				var resoults = res[1][0];
				if (!resoults || resoults.listMyTrac.length <= 0) {
					MXZH.msgOfsswz("有效轨迹点不足！");
					MXZH.effectController.loading(false);
					return false;
				}
				self.lsgj.init({
					map : MXZH.mainMap.wangMap.map,
					res : resoults,
				}, function(rs) {
					self.dotimerslider(name, rs);
				});
				MXZH.originalLsgj.init(res[0]);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw ('数据请求失败！');
			}
		});
	},
	dotimerslider : function(clickName, res) {
		//开始执行 时间轴
		this.lsgjbf.init({
			map : MXZH.mainMap.wangMap.map,
			res : res,
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