/*
 * 跟控任务js
 * 2017-06-12 
 */
var _gkrw_gj;
jQuery(document).ready(function() {
	MXZH.gkrwzcz = function() {};
	MXZH.gkrwzcz.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.zczgkrw.init(this.config);
			this.addeventlister();
		},
		config : {
			URL : [ "${basePath}/home_queryQzContext.action" ],
			gkrwArrays : [ ".zrw_cx", "gkrw_chat", ".gkrwxttitleInner", ".gkrw_lt", ".dt_cx" ],
		},
		addeventlister : function() {
			//注册事件
			var self = this;
			$(this.config.gkrwArrays[0]).unbind().click(function() {
				var start_time = $(this).attr("start_time");
				if (start_time != null && start_time != "") {
					MXZH.effectController.animateOfCB(3, '58%');
					MXZH.effectController.check_button(false);
					var xz_id = $(this).attr("xz_id");
					var rwname = $(this).attr("rwname");
					var end_time = $(this).attr("end_time");
					self.zczgkrw.querychat(xz_id, start_time, end_time, 1);
					self.zczgkrw.addrwmc(rwname);
				} else {
					layer.msg('子任务暂未接收！');
				}
			});
			$(this.config.gkrwArrays[4]).unbind().click(function() {
				var zz_id = $(this).attr("zz_id");
				var start_time = $(this).attr("start_time");
				var end_time = $(this).attr("end_time");
				if (start_time != null && start_time != "") {
				self.zczgkrw.queryguiji(zz_id, start_time, end_time);
				} else {
					layer.msg('子任务暂未接收！');
				}
			});
			$(".gkrw_cx").click(function() {
				self.zczgkrw.guiji.clearGuijiAndslider();
			});
		},
		zczgkrw : new MXZH.zczgkrw(),
	};
})

MXZH.zczgkrw = function() {
	//元素图层
	this.config = {

	}
};
MXZH.zczgkrw.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	queryguiji : function(i, b, e) {
		MXZH.log(i, b, e);
		var self = this;
		$.ajax({
			url : "${basePath}/gkrw_queryLsgj.action?time=" + new Date().getTime(),
			data : {
				zz_id : i,
				start_time : b,
				end_time : e,
			},
			type : "post",
			success : function(result) {
				var res = JSON.parse(result);
				if (res.length <= 0) {
					MXZH.msgOfsswz("没有轨迹数据！");
					return;
				}
				;
				if (dojo.isObject(_gkrw_gj)) {
					_gkrw_gj.clearGuiji();
				}
				_gkrw_gj =_gkrw_gj= new MXZH.lsgj2forgk();
				_gkrw_gj.init({
					map : MXZH.mainMap.wangMap.map,
					res : res,
					//num:guijiObjects.length //判断现在已经有几个轨迹在地图上
					num : 1
				});
			},
			error : function(error) {
				throw ('数据请求失败！');
			}
		});

	},
	querychat : function(xz_id, start_time, end_time, pageNo) {
		var self = this;
		$.ajax({
			url : self.config.URL[0],
			data : {
				ls_startTime : start_time,
				ls_endTime : end_time,
				groupid : xz_id,
				pageNo : pageNo
			},
			dataType : "json",
			type : "post",
			success : function(result) {
				self.showContexts(result);
				layui.use('laypage', function() {
					var laypage = layui.laypage;
					laypage({
						cont : self.config.gkrwArrays[1],
						pages : result[0].totalPage, //总页数
						groups : 4, //连续显示分页数
						first : false,
						last : false,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								var pageNo1 = obj.curr;
								self.getQzcontextPage(xz_id, start_time, end_time, pageNo1);
							}
						}
					});
				});
				var opentk = new MXZH.opentk();
				opentk.init();
			},
			error : function(error) {
				throw ('数据请求失败！');
			}
		});
	},
	addrwmc : function(rwmc) {
		$(this.config.gkrwArrays[2]).html('');
		$(this.config.gkrwArrays[2]).append(rwmc);
	},
	//查询历史详细消息记录
	showContexts : function(contextList) {
		$(this.config.gkrwArrays[3]).html(" ");
		var totalNo = contextList[0].totalNo;
		if (contextList[0].beanList.length > 0) {
			//MXZH.effectController.animateOfCB(3, '58%');
			//MXZH.effectController.check_button(false);
			for (var i = 0; i < contextList[0].beanList.length; i++) {
				var sender_name = contextList[0].beanList[i].sendername;
				var divHtml = " ";
				var str = contextList[0].beanList[i].content;
				var reg = /\[.+?\]/g;
				str = str.replace(reg, function(a, b) {
					return face[a];
				});

				if (contextList[0].beanList[i].type == 0) { //信息
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'>" +
							"<div class='personName'>" + sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div>"
							+ "<div class='lsxxDetail_right_cont'> <div class='lsxxDetail_right_txtBox'><div class='lsxxDetail_right_txt'>" + str + "</div> <div class='qipao_right_jiantou'></div></div></div></div></li>";
					} else {
						divHtml = "<li ><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'>" +
							"<div class='personName'>" + sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'> <div class='lsxxDetail_left_txtBox'><div class='lsxxDetail_left_txt'>" + str + "</div> <div class='qipao_left_jiantou'></div></div></div></div></li>";
					}
				}
				if (contextList[0].beanList[i].type == 2) { //语音
					var amrid = "_" + contextList[0].beanList[i].id;
					var _tmp1 = eval('(' + contextList[0].beanList[i].attachment + ')');
					var amrurl = base_url + _tmp1.url;
					var mins = _tmp1.duration;
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'><div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'>  <div class='lsxxDetail_right_yuyinBox'><img id='imga" + amrid + "' src='mx/lsxx/images/historyAudioright.png' width='39' height='33' onclick='yy_player(\"" + amrid + "\",\"" + mins + "\",\"" + amrurl + "\",this);' /><img id='imgb" + amrid + "' style='display:none' src='mx/lsxx/images/historyAudioright.gif' width='39' height='33' onclick='emb_stop(\"" + amrid + "\");' />" +
							"</div><div class='historyAudioTimeRight'>" + mins + "\"</div>"
							+ "</div></li>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'><div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'>  <div class='lsxxDetail_left_yuyinBox'><img id='imga" + amrid + "' src='mx/lsxx/images/historyAudioleft.png' width='39' height='33' onclick='yy_player(\"" + amrid + "\",\"" + mins + "\",\"" + amrurl + "\",this);' /><img id='imgb" + amrid + "' style='display:none' src='mx/lsxx/images/historyAudioleft.gif' width='39' height='33' onclick='emb_stop(\"" + amrid + "\");' />" +
							"</div><div class='historyAudioTimeLeft'>" + mins + "\"</div>"
							+ "</div></li>";
					}
				}
				if (contextList[0].beanList[i].type == 4) { //显示地图
					var _tmp = eval('(' + contextList[0].beanList[i].attachment + ')');
					//var mapImgUrl = base_url + _tmp.thumbnail;
					var mapImgUrl = _tmp.thumbnail;
					var mapUrl = "mx/lsxx/dqwz.jsp?latitude=" + _tmp.latitude + "&longitude=" + _tmp.longitude;
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'><div class='lsxxDetail_right_txtBox'><div class='lsxxDetail_right_weizhi filejm' id='id_" + i + "' tplj=" + mapUrl + " wzxh='" + i + "' jslx='4' ><div class='lsxx_map'>"
							+ "<img src='" + mapImgUrl + "' width='120' height='100'></div><div class='lsxxDetail_rigth_weizhiTxt'>" + _tmp.address + "</div> <div class='qipao_right_jiantou'></div></div></div></div>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'><div class='lsxxDetail_left_txtBox'><div class='lsxxDetail_left_weizhi filejm' id='id_" + i + "' tplj=" + mapUrl + " wzxh='" + i + "' jslx='4'><div class='lsxx_map'>"
							+ "<img src='" + mapImgUrl + "' width='120' height='100'></div><div class='lsxxDetail_left_weizhiTxt'>" + _tmp.address + "</div> <div class='qipao_left_jiantou'></div></div></div></div>";
					}
				}

				if (contextList[0].beanList[i].type == 3) { //影音播放
					var tmpVideo = base_url;
					var _tmp = eval('(' + contextList[0].beanList[i].attachment + ')');
					var imgUrl = _tmp.thumbnail;
					var video = tmpVideo + _tmp.url;
					//	var videoUrl = "pages/video.jsp?url=" + video;
					if (sender_name == username) {
						divHtml = "<li> <div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'><div class='lsxxDetail_right_shipinBox filejm' id='id_" + i + "' tplj=" + video + " wzxh='" + i + "'  jslx='3'><div class='shipin_mengceng'><div class='shipin_xtb'>"
							+ "<img src='mx/lsxx/images/bofang.png' width='35' height='35' /></div></div> <div class='lsxxDetail_right_shipin'><img src='" + imgUrl + "' width='120' height='100'></div> <div class='qipao_right_jiantou'></div></div></div></div></li>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'>  <div class='lsxxDetail_left_shipinBox filejm' id='id_" + i + "' tplj=" + video + " wzxh='" + i + "'  jslx='3'><div class='shipin_mengceng'><div class='shipin_xtb'>"
							+ "<img src='mx/lsxx/images/bofang.png' width='35' height='35' /></div></div> <div class='lsxxDetail_left_shipin'><img src='" + imgUrl + "' width='120' height='100'></div> <div class='qipao_left_jiantou'></div></div></div></div></li>";
					}
				}

				if (contextList[0].beanList[i].type == 1) { //图片
					var _tmp = eval('(' + contextList[0].beanList[i].attachment + ')');
					var imgurl = _tmp.thumbnail;
					var imgMax = base_url + _tmp.original;
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'><div class='lsxxDetail_right_txtBox filejm' id='id_" + i + "' tplj=" + imgMax + " wzxh='" + i + "' jslx='1'> <div class='lsxxDetail_right_img'>"
							+ "<img src='" + imgurl + "' width='120' height='80' /></div><div class='qipao_right_jiantou'></div></div></div></div></li>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(contextList[0].beanList[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'><div class='lsxxDetail_left_txtBox filejm' id='id_" + i + "' tplj=" + imgMax + " wzxh='" + i + "' jslx='1'> <div class='lsxxDetail_left_img'>"
							+ "<img src='" + imgurl + "' width='120' height='80' /></div><div class='qipao_left_jiantou'></div></div></div></div></li>";
					}
				}

				$(this.config.gkrwArrays[3]).append(divHtml);
			}
		}else{
			layer.msg('该子任务暂无数据！');
		}
	},
	//查询群组分页对话详细信息
	getQzcontextPage : function(groupid, ls_startTime, ls_endTime, pageNo) {
		var self = this;
		$.ajax({
			url : self.config.URL[0],
			data : {
				ls_startTime : ls_startTime,
				ls_endTime : ls_endTime,
				groupid : groupid,
				pageNo : pageNo
			},
			dataType : "json",
			type : "post",
			success : function(result) {
				self.showContexts(result);
				var opentk = new MXZH.opentk();
				opentk.init();
			},
			error : function(error) {
				throw ('数据请求失败！');
			}
		});
	}
}


/**************************历史轨迹业务逻辑类*******************************************************************/
MXZH.lsgj2forgk = function(bofangClass) {
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
		[ [ 253, 137, 22, 0.8 ], [ 0, 0, 0, 0.8 ] ],
		[ [ 240, 102, 87, 0.8 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 139, 66, 249, 0.8 ], [ 255, 255, 255, 0.8 ] ],
		[ [ 64, 164, 42, 0.8 ], [ 255, 255, 255, 0.8 ] ],
	];
	this.bofang = bofangClass;
	this.xmin_max = [ 118, 130 ];
	this.ymin_max = [ 25, 45 ];
}
MXZH.lsgj2forgk.prototype = {
	config : {
		//可用的配置
	},
	//构造函数
	init : function(options) {
		this.clearGuiji();
		this._map = options.map;
		var rss = [];
		var self = this;
		dojo.forEach(options.res, function(item) {
			if (item.lat >= self.ymin_max[0] && item.lat <= self.ymin_max[1] &&
				item.lon >= self.xmin_max[0] && item.lon <= self.xmin_max[1]
			) {
				rss.push(item);
			}
		});
		this._res = rss;
		var num = options.num;
		this.lineSysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[0][0]), 6);
		this.lineSysbol2 = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([ 156, 155, 158, 0.4 ]), 8);
		this.jiantou_Sysbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][1]), 2);
		this.pointSysbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 6,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([ 64, 164, 42, 0.4 ]), 1),
			new dojo.Color(this.colors[0][0]));
		this._map.addLayer(this.thisLayer);
		this.analysisManPoints();
		//分析地图的范围
		this.init_extent();
		this.addEventListening();
	},
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
				this.addIconToMap(res[i], 'images/icon/end.png', [ 0, 12 ], [ 23, 40 ], 'end');
				this.addIconToMap(res[i], 'images/icon/close10.gif', [ 10, 45 ], [ 12, 14 ], 'close');

			} else {
				if (!res[i] || (!res[i]["lon"] || !res[i]["lat"])) return;
				this.thisLayer.add(new esri.Graphic(middlePoint[i], this.pointSysbol), null, null);
				this.thisLayer.add(new esri.Graphic(polylineArray[i], this.lineSysbol2), null, null);
				this.thisLayer.add(new esri.Graphic(polylineArray[i], this.lineSysbol), null, null);
				res[i] && this.drawArrows(res, i);
				if (i == 0) {
					//添加起点图标
					this.addIconToMap(res[0], 'images/icon/start.png', [ 0, 12 ], [ 23, 40 ], 'start', true);
				}
			}
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
		$(".lsgjLabel").remove();
	},
	clearGuijiAndslider : function() {
		//this.bofang.timeSlider && this.bofang.timeSlider.destroy();
		this.clearGuiji();
		$("#timeSliderDiv").fadeOut(300);
	//MXZH.effectController.check_panl2(2);
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
	}
}