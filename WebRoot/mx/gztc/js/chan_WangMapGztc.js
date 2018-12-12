/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-27 14:25:25
 * @version $Id$
 */

jQuery(document).ready(function() {
	//全局变量申明
	var INDEX_gztc = "";
	var form = "";
	var element = "";
	var layer = "";
    var tb;
	MXZH.WangMapGztc = function() {
		this.grcLayer = new esri.layers.GraphicsLayer(); // 正常显示图层
		this.drawGrcLayer = new esri.layers.GraphicsLayer(); // 画图所用图层
	}
	MXZH.WangMapGztc.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.map = MXZH.getMap;
			this.layers = [];

			this.map.addLayers([ this.drawGrcLayer, this.grcLayer ]);
			/*	var self = this;
				dojo.connect(self.grcLayer, 'onMouseMove', function(item) {
					//当鼠标滑上去
					item.graphic.setSymbol(self.getFillsysGray());
				});
				dojo.connect(self.grcLayer, 'onMouseOut', function(item) {
					//当鼠标滑走
					item.graphic.setSymbol(self.getFillsys());
				});*/
			return this;
		},
		config : {},
		addGracsTogrcLayer : function(arrs) {
			//添加元素到正式图层
			dojo.forEach(arrs, function(item) {
				    if(!item)return
					if(item.attributes.geotype=="point"){
					var geo=new esri.geometry.Point(
							[item.geometry.x,item.geometry.y],
							new esri.SpatialReference({
								wkid : 4326
							}))
					item.geometry=MXZH.ToWebMercator(geo);
					}else{
						var p = new esri.geometry.Polyline(new esri.SpatialReference({
							wkid : 4326
						}));
						 p.paths=item.geometry.rings;
					    item.geometry=MXZH.ToWebMercator(p);
						 
					}
				this.grcLayer.add(new esri.Graphic(item));
			}, this)
		},
		drawPointFeature : function(length) {
			var self = this;
			tb && tb.deactivate();
			self.removeTemGraphics();
			dojo.require("esri.toolbars.draw");
			this.tb=tb = new esri.toolbars.Draw(self.map);
			$("#cjbutton").fadeOut(300);$("#bjbutton").fadeOut(300);
			tb.on("draw-end", addGraphic);
			tb.activate('point');

			function addGraphic(evt) {
				tb.deactivate();
				$("#cjbutton").fadeIn(300);$("#bjbutton").fadeIn(300);
				self.map.enableMapNavigation();
				var p;
				var symbol;
				var attributes;
				if (evt.geometry.type == 'point') {
					p = evt.geometry;
					//做缓冲区分析
					self.getBuffers(evt.geometry, length);
					symbol = self.getPointSymbol();
					attributes = {
						type : 'DrawFeature',
						geotype : 'point'
					};
				}
				var grc = new esri.Graphic(evt.geometry, symbol, attributes);
				self.drawGrcLayer.add(grc);
			}
		},
		centerAt : function(gra) {
			this.map.centerAndZoom(gra.geometry, 14)
		},
		getBuffers : function(evt, inLength) {
			//初始化缓冲区
			//米 9001 千米：9036
			geometryEngine = dojo.require("esri/geometry/geometryEngine");
			var polygon = geometryEngine.geodesicBuffer(evt, inLength, 9001, false);
			this.drawGrcLayer.add(new esri.Graphic(polygon, this.getFillBuffersys(0.5), {
				type : 'DrawFeature',
				geotype : 'polygon'
			}))
			MXZH.getMap.setExtent(polygon.getExtent());
		},
		getFillBuffersys : function(opcity) {
			return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
					new dojo.Color([ 253, 46, 36, 0.5 ]), 0.1), new esri.Color([ 253, 46, 36, opcity ]));
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
			return textsbol;
		},
		getPointSymbol : function() {
			var p = new esri.symbol.PictureMarkerSymbol('images/hongqi2.png', 40, 40);
			p.setOffset(10, 14);
			return p;
		},
		getLineSymbol : function() {
			return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([ 255, 0, 0 ]), 3);
		},
		getFillsys : function(opcity) {
			return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
					new dojo.Color([ 254, 195, 230, opcity ]), 2), new esri.Color([230, 230, 255 , 0.07 ]));
		},
		getFillsysGray : function(opcity) {
			return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
					new dojo.Color([ 253, 46, 36, 1 ]), 2), new esri.Color([ 115, 5, 5, 0.2 ]));
		},
		removeLayer : function() {
			var self = this;
			dojo.forEach(self.layers, function(item) {
				self.map.removeLayer(item);
			})
			this.layers = [];
		},
		removeTemGraphics : function() {
			this.drawGrcLayer && this.drawGrcLayer.clear();
		},
		clearGrcLayer : function(id) {
			var self = this;
			var clears = [];
			if (id) {
				dojo.forEach(self.grcLayer.graphics, function(item) {
					if (item.attributes['wlId'] == id) {
						clears.push(item);
					}
				});
			} else {
				dojo.forEach(self.grcLayer.graphics, function(item) {
					clears.push(item);
				});
			}
			clears.map(function(item) {
				//self.grcLayer.remove(item);
				self.grcLayer.remove(item);
			});
		}
	};
})