/*
 *警戒区预警图层控制类 
 */
var tb;
var INDEX_yjqys=[];
MXZH.jjqyLayerManager = function() {};
MXZH.jjqyLayerManager.prototype = {
	config : {},
	temGraLayer : new esri.layers.GraphicsLayer(), //临时画图存储图层
	buffersOflistLayer : new esri.layers.GraphicsLayer(), //跟随列表显示buffrer图层
	//进入警戒区人的图层
	intoJJYQlayer : new esri.layers.GraphicsLayer(),
	init : function(m) {
		dojo.require("esri.geometry.normalizeUtils");
		dojo.require("esri.tasks.BufferParameters");
		this.addlayersTOmap(m);
	},
	addlayersTOmap : function(map) {
		map.addLayers([ this.buffersOflistLayer, this.intoJJYQlayer, this.temGraLayer ]);
	},
	_initDraw : function(t /*类型*/ , i, o) {
		//初始化画画
		//MXZH.log(t);
        tb && tb.deactivate();
		this.temGraLayer.clear();
		//MXZH.getMap.addLayer(this.temGraLayer);
		var self = this;
		dojo.require("esri.toolbars.draw");
		tb = new esri.toolbars.Draw(MXZH.getMap);
		tb.on("draw-end", addGraphic);
		//MXZH.getMap.disableMapNavigation();
		tb.activate(t.toLowerCase());
		$("#cjbutton").fadeOut(300);$("#bjbutton").fadeOut(300);
		function addGraphic(evt) {
			//获取缓冲区
			self._initBuffer(evt, i, o);
			var symbol;
			if (evt.geometry.type == "point") {
				symbol = self.getPointSymbol();
			} else if (evt.geometry.type == "polyline") {
				symbol = self.getLineSymbol();
			} else if (evt.geometry.type == "polygon") {
				symbol = self.getFillsysGray();
			}
			self.temGraLayer.add(new esri.Graphic(evt.geometry, symbol, {
				type : 'bufferOrigin', //临时图形
			}));
			tb.deactivate();
			 $("#cjbutton").fadeIn(300);$("#bjbutton").fadeIn(300);
		}
	},
	_initBuffer : function(evt, inLength, outLength) {
		//初始化缓冲区
		//米 9001 千米：9036
		geometryEngine = dojo.require("esri/geometry/geometryEngine");
		var polygonIn = geometryEngine.geodesicBuffer(evt.geometry, inLength, 9001, false); //外部警戒区
		this.temGraLayer.add(new esri.Graphic(polygonIn, this.getFillBuffersys(0.5), {
			type : 'bufferIn',
		}))
		var _polygonOut = geometryEngine.geodesicBuffer(polygonIn, outLength, 9001, false);
		var polygonOut = geometryEngine.difference(_polygonOut, polygonIn) //内部警戒区
		this.temGraLayer.add(new esri.Graphic(polygonOut, this.getFillBuffersys(0.3), {
			type : 'bufferOut',
		}))
		MXZH.getMap.enableMapNavigation();
	},
	getPointSymbol : function(opcity) {
	/*	return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([ 255, 0, 0 ]), opcity || 1),
			new dojo.Color([ 0, 255, 0, opcity || 0.25 ]));*/
		var p=new esri.symbol.PictureMarkerSymbol('images/hongqi.png', 40, 40);
		p.setOffset(10,  15);
		return p;
	},
	getPicOfyjdataSymbol : function(type) {
		//预警数据显示到地图上的图标
		var textsys = new esri.symbol.PictureMarkerSymbol('mx/jjqy/images/peo1_text.png', 75, 32);
		textsys.setOffset(52, 0)
		var text_heigh_sys = new esri.symbol.PictureMarkerSymbol('mx/jjqy/images/peo2_text.png', 75, 32);
		text_heigh_sys.setOffset(52, 0)

		var peo1 = [ new esri.symbol.PictureMarkerSymbol('mx/jjqy/images/peo1_peo.png', 31, 32), textsys ];
		var peo1_high = [ new esri.symbol.PictureMarkerSymbol('mx/jjqy/images/peo2_peo.png', 31, 32), text_heigh_sys ];
		if ('peo1_high' == type) return peo1_high; else return peo1;
	},
	getLineSymbol : function() {
		return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([ 255, 0, 0 ]), 3);
	},
	getFillBuffersys : function(opcity) {
		return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([ 253, 46, 36, 0.5 ]), 0.1), new esri.Color([ 253, 46, 36, opcity ]));
	},
	getFillsysGray : function(opcity) {
		return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([ 253, 46, 36, 1 ]), 2), new esri.Color([ 115, 5, 5, 0.2 ]));
	},
	addBufferLayer : function(bufferArray, id) {
		//添加从数据库中的的缓冲数据
		var self = this;
		dojo.forEach(bufferArray, function(b, index) {
			var gra = JSON.parse(b.replace(/'/g, "\""));
			gra.attributes['Layertype'] = 'list_buffer';
			gra.attributes['id'] = id;
			self.buffersOflistLayer.add(new esri.Graphic(gra));
		})
	},
	mixminLayer : function(id) {
		var self = this;
		var gs = this.temGraLayer.graphics;
		dojo.forEach(gs, function(g) {
			g.attributes['Layertype'] = 'list_buffer';
			g.attributes['id'] = id;
			self.buffersOflistLayer.add(g);
		});
		this.temGraLayer.clear();
		this.buffersOflistLayer.redraw();
	},
	dealWithRemoveLayer : function(id) {
		//从bufferLaye中删除数据
		var self = this;
		var gs = this.buffersOflistLayer.graphics;
		var _removeLyr = [];
		if (id) {
			dojo.forEach(gs, function(g) {
				if (g.attributes['id'] == id) {
					_removeLyr.push(g);
				}
			});
		} else {
			self.buffersOflistLayer.clear();
		}
		dojo.forEach(_removeLyr, function(i) {
			self.buffersOflistLayer.remove(i);
		})
	},
	checkTime : function(item) {
		//检查是不是当前运行的警戒区  假如是 重点显示，并弄到地图中
		var dt = new Date();
		var badate = new Date(item['beginDate'].replace(/-/g, '/')),
			endate = new Date(item['end_date'].replace(/-/g, '/'));
		if (dt.getTime() >= badate.getTime() && dt.getTime() <= endate.getTime()) return true;
		return false;
	},
	focusItemExent : function(item, isNewMake) {
		var gec = JSON.parse(item.bufferOut.replace(/'/g, "\""));
		var arr = [];
		dojo.forEach(gec.geometry.rings, function(r) {
			dojo.safeMixin(arr, r);
		});
		var singleRingPolygon = new esri.geometry.Polygon(arr);
		MXZH.getMap.setExtent(singleRingPolygon.getExtent());
		//判断是不是失效
		if (!this.checkTime(item) && isNewMake != 'y') {
			//失效  灰色显示
			window.glv_jjqy && MXZH.getMap.removeLayer(glv_jjqy);
			glv_jjqy = new esri.layers.GraphicsLayer();
			var ing = JSON.parse(item.bufferIn.replace(/'/g, "\""));
			//ing.symbol.color=[0,0,0,.5];
			var Origin = JSON.parse(item.bufferOrigin.replace(/'/g, "\""));
			var Out = JSON.parse(item.bufferOut.replace(/'/g, "\""));
			glv_jjqy.add(new esri.Graphic(ing));
			glv_jjqy.add(new esri.Graphic(Origin));
			glv_jjqy.add(new esri.Graphic(Out));
			
			MXZH.getMap.addLayer(glv_jjqy);
			var sets = window.setTimeout(function() {
				MXZH.getMap.removeLayer(glv_jjqy);
				window.clearTimeout(sets);
			}, 3000)
		}
	//MXZH.getMap.centerAndZoom(new esri.geometry.Point(gec.geometry.rings[0][Math.floor(gec.geometry.rings.length/2)],new esri.SpatialReference(WangConfig.constants.wkt)),7);
	},
	showBufferRangeIfclick : function() {},
	showIntoJJQYsomeOne : function(info, path) {
		// 添加预警数据到地图
		var self = this;
		var myid;
		if (path) {
			this.removeYjinfo(path[3], 'yjlistclick');
			var p__ = MXZH.bd09togcj02(path[0],path[1]);
			var point = MXZH.ToWebMercator(new esri.geometry.Point(p__[0], p__[1], new esri.SpatialReference(WangConfig.constants.wkt)));
			var attr = {
				yjid : path[3],
				_jjqyid : path[2],
				Layertype : 'yjlistclick' //每当点击一条预警信息 添加到地图
			};
			getyjxxinco(point, path[4], 'peo1_high', attr);
			myid = path[3];
		} else {
			var p2__ = MXZH.bd09togcj02(parseFloat(info['bdlon']),parseFloat(info['bdlat']));
			var point = MXZH.ToWebMercator(new esri.geometry.Point(p2__[0], p2__[1]), new esri.SpatialReference(WangConfig.constants.wkt));
			var attr = {
				Layertype : 'yjperson', //每当过来一条预警信息 添加到地图
				yjid : info.id,
				user_name : info['user_name'],
				jjqyid : info['jjqyid'],
				other : info
			}
			getyjxxinco(point, info['user_name'], 'peo1_high', attr);
			myid = info.id;
		}
		setTimeout(function() {
			self.removeYjinfo(myid);
		}, 5000); //3秒后消失

		function getyjxxinco(point, text, picType, attr) {
			//点击列表
			self.intoJJYQlayer.add(new esri.Graphic(point, self.getPicOfyjdataSymbol(picType)[0], attr))
			self.intoJJYQlayer.add(new esri.Graphic(point, self.getPicOfyjdataSymbol(picType)[1], attr))
			var name;
			if (text.length > 6)
				name = text.substr(0, 6) + ".."; else
				name = text;
			self.intoJJYQlayer.add(new esri.Graphic(point, self.getTextSybol(name, 12, '#fff'), attr))
			MXZH.getMap.centerAndZoom(point,10);
		}
	},
	//文字图标
	getTextSybol : function(text, size, color) {
		// 图标之上放文字
		var color = new dojo.Color(color);
		var _font = esri.symbol.Font;
		var font = new _font(size + "px", _font.STYLE_NORMAL,
			_font.VARIANT_NORMAL, _font.WEIGHT_NORMAL,
			"Microsoft YaHei");
		var textsbol = new esri.symbol.TextSymbol(text, font, color);
		textsbol.setOffset(52, -5);
		return textsbol;
	},
	removeYjinfo : function(id, type) {
		var self = this;
		var removeArr = [];
		dojo.forEach(this.intoJJYQlayer.graphics, function(item) {
			if (type) {
				if (item.attributes['yjid'] == id && item.attributes['Layertype'] == type)
					removeArr.push(item);
			} else {
				if (item.attributes['yjid'] == id)
					removeArr.push(item);
			}
		})
		removeArr.map(function(g) {
			self.intoJJYQlayer.remove(g);
		});
	}
}

/*
 *警戒区预警文档相关控制类 
 */
/**********************************************************************************************************************************/
var inputValuesArray = [];
MXZH.jjqyDOMManager = function(map) {};
MXZH.jjqyDOMManager.prototype = {
	config : {
		BtnArray : [ ".layui-layer-btn0" ],
	//map : MXZH.mainMap.wangMap
	},
	jjqyLayerManager : null,
	inputValues : {},
	jjqyCf:null,
	init : function(p) {
		this.jjqyLayerManager = new MXZH.jjqyLayerManager(),
		this.jjqyLayerManager.init(MXZH.getMap);
		this.dealWithEventListner();
		this.jjqyCf=p;
	},
	dealWithEventListner : function() {
		var self = this;
		this.inputValues = {};
		var iframe=$("#jjqy_open").find("iframe")
		window.INDEX_yjqy && $(iframe.contents().find(".xllx_pen_tool")).unbind().click(function() {
			//画画
			var type = iframe.contents().find('input:radio:checked').attr('_drawType');
			//获取警戒区范围宽度
			var inLength = $.trim(iframe.contents().find("option:selected").eq(1).text());
			var outLength = $.trim(iframe.contents().find("option:selected").eq(0).text());
			inLength = inLength.replace("米", '');
			outLength = outLength.replace("米", '');
			if (!inLength || !outLength) {
				MXZH.msgOfsswz("画图之前请输入警戒范围！");
				return false;
			} else if (parseInt(inLength) > parseInt(outLength)) {
				MXZH.msgOfsswz("核心警戒范围大于外围警戒范围！");
				return false;
			} else {
				self.jjqyLayerManager._initDraw(type, inLength, outLength);
			}
			self.inputValues['inLength'] = inLength, self.inputValues['outLength'] = outLength, self.inputValues['type'] = type;

		});
		$(this.config.BtnArray[0]).unbind().click(function(e) {
			//保存
			self.inputValues['jjqyName'] = iframe.contents().find('.jjqyName').val().replace(/</g,'').replace(/>/g,'');
			self.inputValues['beginDate'] = iframe.contents().find('.begin_date').val();
			self.inputValues['end_date'] = iframe.contents().find('.end_date').val();
			self.inputValues['jjqy_otherText'] = iframe.contents().find('.jjqy_otherText').val();
			self.checkJjqu();
		});
	},
	checkJjqu : function() {
		//检查数据
		if (!$.trim(this.inputValues['jjqyName'])) {
			MXZH.msgOfsswz("警戒区名称不能为空！");
			return false;
		}
		//
		if ($.trim(this.inputValues['jjqyName']).length > 10) {
			MXZH.msgOfsswz("警戒区名称不能大于10个字符！");
			return false;
		}
		if (!this.inputValues['beginDate'] && !this.inputValues['end_date']) {
			MXZH.msgOfsswz('时间不能为空！');return;
		} else if (!this.inputValues['beginDate']) {
			MXZH.msgOfsswz('开始时间不能为空！');return;
		} else if (!this.inputValues['end_date']) {
			MXZH.msgOfsswz('结束时间不能为空！');return;
		}
		//比较时间
		var d1 = new Date(this.inputValues['beginDate'].replace(/-/g, '/'));
		var d2 = new Date(this.inputValues['end_date'].replace(/-/g, '/'));
		if (Number(d1) > Number(d2)) {
			MXZH.msgOfsswz('开始时间不能大于结束时间！');
			return false;
		}
		if(this.inputValues['jjqy_otherText'].length>=200){
			MXZH.msgOfsswz('备注太长，建议200字符以内！');
			return false;
		} 
		
		this.dealWith_temp_buffer();
	},
	dealWith_temp_buffer : function() {
		var gs = this.jjqyLayerManager.temGraLayer.graphics;
		if (gs.length < 3) {
			MXZH.msgOfsswz('没有绘制警戒区或者有图形错误！');return;
		}
		var layerStrMap = {};
		dojo.forEach(gs, function(g, index) {
			g.geometry=MXZH.MercatorToGeo(g.geometry);
			var strOfLayer = JSON.stringify(g.toJson());
			var Str = strOfLayer.replace(/"/g, "'");
			if (g.attributes.type == "bufferIn") {
				layerStrMap['bufferIn'] = Str;
			}
			if (g.attributes.type == "bufferOut") {
				layerStrMap['bufferOut'] = Str;
			}
			if (g.attributes.type == "bufferOrigin") {
				layerStrMap['bufferOrigin'] = Str;
			}
		});
		dojo.mixin(this.inputValues, layerStrMap);
		this.dealWithSaveJJQY();
	},
	dealWithSaveJJQY : function() {
		var self = this;
		MXZH.effectController.loading(true);
		$.ajax({
			url : "${basePath}/home_addForjjqy.action?time=" + new Date().getTime(),
			data : this.inputValues,
			type : "post",
			success : function(msg) {
				MXZH.effectController.loading(false);
				layer.msg("保存成功！", {
					time : 1000
				});
				var idObj = JSON.parse(msg);
				//替换加入 并 删除
				self.jjqyLayerManager.mixminLayer(idObj[0]['id']);
				//layer.closeAll();
				 window.INDEX_yjqy && INDEX_yjqys.length && layer.close(INDEX_yjqys[0]);
				 INDEX_yjqys=[];
				//在列表中插入 信息
				MXZH.effectController.ojbs.dealWithQueryInfo();
				//self.insertInfoInList(idObj[0]['id']), inputValuesArray.push(self.inputValues);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw (error);
				throw ("数据保存失败！");
			}
		})
	},
	getPicOfyujing : function(type) {
		if ("POINT" == type) {
			return 'mx/jjqy/images/yujing_dot.png';
		}
		if ("POLYLINE" == type) {
			return 'mx/jjqy/images/yujing_line.png';
		}
		if ("POLYGON" == type) {
			return 'mx/jjqy/images/yujing_mian.png';
		}
	},
	insertInfoInList : function(id) {
		var self = this;
		var mudle = this.moduleLi(this.inputValues, id, '（新建）', self.getPicOfyujing(this.inputValues["type"]), 'y');
		d3.select(".jjqy_box2_ul").transition().duration(800).style("margin", "196px 0 0 0").each("end", function() {
			$(".jjqy_box2_ul").prepend($(mudle));
			d3.select(this).style("margin", "0");
		});
	},
	moduleLi : function(Values, id, str, jjquImg, ohterInfo) {
		//列表模板
		return "<li _id=" + id + " isNewMake=" + ohterInfo + " > <div class='jjqy_item_left'><img src=" + jjquImg + " width='45' height='45'> </div>" +
			"<div class='jjqy_item_right'> <div class='jjqy_peoName ellipsis'>" + Values['jjqyName'] +
			"<span style=" + "color:#fd191a " + ">" + str + "</span></div>" +
			"<div class='jjqy_item_li'>外围警戒范围：" + Values['outLength'] + "M</div>" +
			"<div class='jjqy_item_li'>核心警戒范围：" + Values['inLength'] + "M</div>" +
			"<div class='jjqy_item_li'>开始时间：" + Values['beginDate'] + "</div>" +
			"<div class='jjqy_item_li'>结束时间：" + Values['end_date'] + "</div>" +
			"<div class='jjqy_item_li'>备注：" + Values['jjqy_otherText'] + "</div>" +
			"<div class='jjqy_item_li'> <div class='xllx_caozuo'>  <span>" +
			"<i class='layui-icon' style='font-size:20px;'></i>" +
			"</span><span  onclick='deltr_jjqy(this)' class='delthis delthis_jjqy'>删除</span> </div>" +
			"</div> </div> </li>";
	},
	deleteJJQY : function(id) {
		//删除
		var self = this;
		layer.confirm("您确定要删除吗？", {
			btn : [ "确定", "取消" ]
		}, function() {
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_deleteForjjqy.action?time=" + new Date().getTime(),
				data : {
					groupid : id
				},
				type : "post",
				success : function(msg) {
					MXZH.effectController.loading(false);
					layer.msg("删除成功！", {
						time : 1000
					});
					self.jjqyLayerManager.dealWithRemoveLayer(id);
					self.listInfoAnmtion(id); //处理列表
					MXZH.effectController.ojbs.dealWithQueryInfo();
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					layer.msg('删除失败！', {
						time : 1000
					})
				}
			});
		});

	},
	isreadJJQY : function(id, event) {
		var self = this;
		/*	layer.confirm("您确定要标记这条记录吗？", {
				btn : [ "确定", "取消" ]
			}, function() {});*/
		MXZH.effectController.loading(true);
		$.ajax({
			url : "${basePath}/home_deleteForjjqyYJ.action?time=" + new Date().getTime(),
			data : {
				groupid : id
			},
			type : "post",
			success : function(msg) {
				layer.msg("标记成功！", {
					time : 1000
				});
				MXZH.effectController.loading(false);
				event.animate({
					height : '-10px',
					width : '-10px'
				}, 800, function() {
					event.remove();
					var sum = parseInt($(".newMessage_jjqy").text());
					sum--;
					$(".newMessage_jjqy").text(sum).attr("title", sum);
					self.jjqyLayerManager.removeYjinfo(id, 'yjperson');
				});
			},
			error : function(error) {
				layer.msg("抱歉出错！", {
					time : 1000
				});
				MXZH.effectController.loading(false);
			}
		})


	},
	listInfoAnmtion : function(id) {
		//删除对应id的列表
		$.each($(".jjqy_box2_ul li"), function(index, item) {
			if ($(item).attr("_id") == id) {
				d3.select($(item).get(0)).transition().duration(800).style("opacity", "0").style("height", "0px").each("end", function() {
					$(item).remove();
				});
			}
		})
	}
}
/*
 *警戒区预警控制器类 
 */
/*********************************************************************************************************************************/

MXZH.jjqyCF = function() {
	this.allRests = null;
	this.pageno = 0;
};
MXZH.jjqyCF.prototype = {
	config : {
		currentpageNo : 1,
		everyPages : 4,
	},
	init : function() {
		this._jjqyDOMManager = new MXZH.jjqyDOMManager();
		this._jjqyDOMManager.init(this);
		$.ajax({
			url : '${basePath}/home_queryYjInfo.action',
			type : "post",
			success : function(msg) {
				first_dzwlController(msg);
			},
			error : function(error) {
				throw (error);
				layui.layer.msg("数据请求失败！");
				//throw ('数据请求失败！');
			}
		});
		//创建一个定时器  20s 获取数据失败
		this.dealWithQueryInfo();
		this.bindLiOfjjyq();
		this.addPopEvent();
	},
	addPopEvent:function(){
		var self=this;
		 <!------警戒区域新建 弹出框 start------>
			layui.use('layer', function(){
			  var layer = layui.layer;
			  $('.jjqy_search').unbind().click(function(){
				  
			  INDEX_yjqy = layer.open({
			  type: 2, 
			  id:'jjqy_open',
			  shade: 0,
			  title :'新建警戒区',
			  btn: ['确定','取消'],
			  shift:-1,
			  btnAlign: 'c',
			  offset: ['80px', '450px'],
			  area: ['350px', '561px'],
			  content: ['mx/jjqy/iframe_jjqy_add.jsp', 'no'] ,
			  cancel: function(index, layero) {
				     self._jjqyDOMManager.jjqyLayerManager.temGraLayer.clear();
				     tb && tb.deactivate();
				     $("#cjbutton").fadeIn(300);$("#bjbutton").fadeIn(300);
				     layer.close(index);
				     INDEX_yjqys=[];
              }
			  ,btn2: function(index, layero){
				     self._jjqyDOMManager.jjqyLayerManager.temGraLayer.clear(); 
				     tb && tb.deactivate();
				     $("#cjbutton").fadeIn(300);$("#bjbutton").fadeIn(300);
				     layer.close(index);
				     INDEX_yjqys=[];
				   }
			    });  
			   INDEX_yjqys.push(INDEX_yjqy);
		      });
			 
		      });  
	},
	destroy : function() {
		this._jjqyDOMManager.jjqyLayerManager.temGraLayer.clear(); //临时画图存储图层
		this._jjqyDOMManager.jjqyLayerManager.buffersOflistLayer.clear(); //跟随列表显示buffrer图层
		//进入警戒区人的图层
		this._jjqyDOMManager.jjqyLayerManager.intoJJYQlayer.clear();
		 window.INDEX_yjqy && INDEX_yjqys.length && layer.close(INDEX_yjqys[0]);
		 INDEX_yjqys=[];
		 if(tb){
			 $("#cjbutton").fadeIn(300);$("#bjbutton").fadeIn(300);
			 tb.deactivate();
		 }  
	},
	showNothing : function() {
		$(".jjqy_box1 ul").find(".loading_yjqy").text("暂无数据！").fadeIn(400);
	},
	dealWithAppendAlarm : function(array) {
		//新增预警信息
		var self = this;
		$(".loading_yjqy").remove();
		var ul = $(".jjqy_box1").find("ul");
		ul.find(".jjqy_data_loading").remove();
		var isfirst = false; //是否是空的
		dojo.forEach(array, function(item) {
			var sum = parseInt($(".newMessage_jjqy").show().text());
			var is_inside = false;
			var html = self.yjinfoMudle(item);
			if (!isfirst && ul.children().length >= 1) {
				$.each(ul.children(), function(index, li) {
					var yjinfo_id = $(li).attr("_id");
					if (yjinfo_id == item.id)
						is_inside = true;
				})
				if (!is_inside) {
					d3.select(".jjqy_box1 ul").transition().duration(800).style("margin", "196px 0 0 0").each("end", function() {
						ul.prepend($(html)), d3.select(this).style("margin", "0"), sum++;
						$(".newMessage_jjqy").text(sum).attr("title", sum);
						//在地图上有所作为
						self.showIconOnMap(item);
					 });
				}
			} else {
				isfirst = true;
				ul.prepend($(html))
				sum++
				$(".newMessage_jjqy").text(sum).attr("title", sum);
			}
		});
		if (!$.trim($(".morejjqyInfo").text())) {
			ul.append("<div class='morejjqyInfo'  style='text-align: center;'><a href='javasrcipt:;'></a></div>");
		}
		$(".jjqy_box1 ul").find("li").unbind().click(function() {
			var id = $(this).attr("_id");
			var path = $(this).attr("p");
			var _jjqyid = $(this).attr("_jjqyid");
			var name = $(this).find(".peodingwei").text();
			var point = path.split(",");
			self._jjqyDOMManager.jjqyLayerManager.showIntoJJQYsomeOne(id, [ parseFloat(point[0]), parseFloat(point[1]), _jjqyid, id, name ]);
		});
		$(".morejjqyInfo").unbind().click("click", function() {
			MXZH.effectController.loading(true);
			var that = this;
			$.ajax({
				url : "${basePath}/home_getMoreInfoOfjjqy.action?time=" + new Date().getTime(),
				data : {
					yyqy_pageNO : self.pageno + 1
				},
				success : function(msg) {
					MXZH.effectController.loading(false);
					var info = JSON.parse(msg);
					$(that).remove();
					self.dealWithAppendAlarm2(info);
					if (msg.length > 0) self.pageno++;
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					layer.msg('数据查询失败！', {
						time : 1000
					})
				}
			});
		})
	},
	dealWithAppendAlarm2 : function(info) {
		MXZH.log(info);
		var is_inside = false;
		var ul = $(".jjqy_box1").find("ul");
		dojo.forEach(array, function(item) {
			$.each(ul.children(), function(index, li) {
				var yjinfo_id = $(li).attr("_id");
				if (yjinfo_id == item.id)
					is_inside = true;
			})
			if (!is_inside) {
				$(html).insertBefore($(".morejjqyInfo"));
			}

		})
	},
	showIconOnMap : function(item) {
		//用一个
		this._jjqyDOMManager.jjqyLayerManager.showIntoJJQYsomeOne(item);
	},
	yjinfoMudle : function(info) {
		var k = new Date(parseInt(info['yjsj']));
		return "<li _id=" + info.id + " p=" + info['bdlon'] + "," + info['bdlat'] + " _jjqyid=" + info['jjqyid'] + "><div class='jjqy_item_left'><img src=" + this._jjqyDOMManager.getPicOfyujing(info['type']) + " width='45' height='45'> </div>" +
			"<div class='jjqy_item_right'>" +
			"<div class='jjqy_peoName ellipsis'>" + info.jjqyName + "</div>" +
			"<div class='jjqy_item_li'>跟控人员：" +
			"<span class='peodingwei' onclick=positionPerson(this)>" + info.yonghu + "<i class='peodingweixtb'><img src='mx/jjqy/images/dingwei.png' width='15' height='14'></i></span>" +
			"进入" + info.jjqy_type + "</div>" +
			"<div class='jjqy_item_li'>" + k.Format("yyyy-MM-dd hh:mm:ss") + "</div>" +
			"<div class='jjqy_item_li'>  <div class='xllx_caozuo'>" +
			"<span><i class='layui-icon' style='font-size:20px;'><img src='mx/jjqy/images/bainji.png' width='15' height='14'></i></span><span class='delthis'  onclick='isread_jjqy(this)'>标注为已读</span>" +
			"</div></div> </div></li>"
	},
	_jjqyDOMManager : null,
	bindLiOfjjyq : function() {
		var self = this;
		$(".jjqy_box2_ul li").unbind().mouseover(function() {
			var id = $(this).attr("_id");
		});
		$(".jjqy_box2_ul li").unbind().mouseout(function() {
			var id = $(this).attr("_id");
		});
		$(".jjqy_box2_ul").on("click", 'li', function() {
			//警戒区管理点击
			var id = $(this).attr("_id"),
				isNewMake = $(this).attr("isNewMake");
			isNewMake == 'y' ? dojo.forEach(inputValuesArray, function(item) {
				self._jjqyDOMManager.jjqyLayerManager.focusItemExent(item, isNewMake);
			}) :
				dojo.forEach(self.allRests, function(item, index) {
					item.id && item.id == id && self._jjqyDOMManager.jjqyLayerManager.focusItemExent(item);
				});
		})
	},
	dealWithQueryInfo : function() {
		var self = this;
		MXZH.effectController.loading(true);
		$.ajax({
			url : "${basePath}/home_queryForjjqy.action?time=" + new Date().getTime(),
			data : {
				currentpageNo : self.config.currentpageNo,
				everyPages : self.config.everyPages,
			},
			success : function(msg) {
				MXZH.effectController.loading(false);
				var info = JSON.parse(msg);
				layui.use([ 'laypage' ], function() {
					var laypage = layui.laypage;
					laypage({
						cont : 'jjqy_page',
						pages : Math.ceil(info[0].totalPage / self.config.everyPages),
						groups : 4,
						curr : info[0].currentpageNo,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								self.config.currentpageNo = obj.curr;
								self.dealWithQueryInfo();
							}else{
								self.config.currentpageNo = 1;
							}
						}
					});
				});
				self.dealWithAppendjjqyToList(info[0].res);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				layer.msg('数据查询失败！', {
					time : 1000
				})
			}
		});
	},
	dealWithAppendjjqyToList : function(i) {
		//参数 info
		this.allRests = i, i.length && $(".jjqy_box2_ul").empty();
		var self = this;
		self._jjqyDOMManager.jjqyLayerManager.buffersOflistLayer.clear();
		dojo.forEach(i, function(item) {
			if (self.checkoutBufferStrs(item)) {
				//选中显示
				var li = self._jjqyDOMManager.moduleLi(item, item['id'], "（使用中）", self._jjqyDOMManager.getPicOfyujing && self._jjqyDOMManager.getPicOfyujing(item['type']));
				$(".jjqy_box2_ul").append($(li).css("background", "#f0f3f8"));
				//判断时间 并显示到地图中
				self._jjqyDOMManager.jjqyLayerManager.addBufferLayer([ item["bufferIn"], item["bufferOut"], item["bufferOrigin"] ], item['id']);
			} else {
				var li = self._jjqyDOMManager.moduleLi(item, item['id'], '（未使用）', 'mx/jjqy/images/yj_gray.png');
				$(".jjqy_box2_ul").append($(li));
				$(".jjqy_box2_ul").find(".jjqy_useing").text(" ");
			}
		});
		deltr_jjqy = function(t) {
			var id = $(t).parents("li").attr("_id");
			self._jjqyDOMManager.deleteJJQY(id);
		}
		isread_jjqy = function(t) {
			var id = $(t).parents("li").attr("_id");
			self._jjqyDOMManager.isreadJJQY(id, $(t).parents("li"));
		}
		positionPerson = function(t) {
			//MXZH.msgOfsswz("该功能暂未开放！");
			return false;
		}
	},
	checkoutBufferStrs : function(item) {
		//检查是不是当前运行的警戒区  假如是 重点显示，并弄到地图中
		var dt = new Date()
		var badate = new Date(item['beginDate'].replace(/-/g, '/')),
			endate = new Date(item['end_date'].replace(/-/g, '/'));
		if (dt.getTime() >= badate.getTime() && dt.getTime() <= endate.getTime()) return true;
		return false;
	}
//需要删除_jjqyDOMManage
}