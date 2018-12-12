/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-27 14:25:25
 * @version $Id$
 */

jQuery(document).ready(function() {
	//全局变量申明
	var INDEX_dzwl = "";
	var form = "";
	var element = "";
	var layer = "";
	//var myGraphicsLayer = new esri.layers.GraphicsLayer();

	MXZH.WangMapDzwl = function() {
		this.grcLayer = new esri.layers.GraphicsLayer(); // 正常显示图层
		this.drawGrcLayer = new esri.layers.GraphicsLayer(); // 画图所用图层
		this.tempLayer = new esri.layers.GraphicsLayer(); // 围栏预警临时围栏显示图层
		this.tempPointLayer = new esri.layers.GraphicsLayer(); // 临时预警点显示图层
	}
	MXZH.WangMapDzwl.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.map = opts.map.map;
			this.layers = [];
		
			this.map.addLayers([ this.drawGrcLayer, this.grcLayer, this.tempLayer, this.tempPointLayer ]);
			this.graphicsLayer = [];
			var self = this;
			this.autoClearLayer();
			dojo.connect(self.grcLayer, 'onMouseMove', function(item) {
				//当鼠标滑上去
				if(item.graphic.attributes.type=='fillLine') 
				item.graphic.setSymbol(self.getFillsysGray());
			});
			dojo.connect(self.grcLayer, 'onMouseOut', function(item) {
				//当鼠标滑走
				if(item.graphic.attributes.type=='fillLine') 
				item.graphic.setSymbol(self.getFillsys());
			});
			dojo.connect(this.map, 'onZoomEnd', function(event) {
				self.grcLayer && self.grcLayer.graphics.map(function(item) {
					if (item.attributes && item.attributes.type && item.attributes.type == 'text') {

						var size = self.map.getZoom() * 3.5;
						var color;
						if (item.attributes.big) {
							size += 1;
							color = "#fff";
						} else
							color = '#DC143C';
						item.setSymbol(self.getTextSybol(item.symbol.text, size, color));
					}
				});
			});
		},
		config : {},
		clearTempLayer:function(){
			this.drawGrcLayer.clear();
		},
		drawFence : function(id) {
			var self = this;
			/*this.layers.push(this.grcLayer); //临时线路 集合
			this.map.addLayer(this.grcLayer);*/
			dojo.require("esri.toolbars.draw");
			tb = new esri.toolbars.Draw(self.map);
			tb.on("draw-end", addGraphic);
			self.map.disableMapNavigation();
			tb.activate("freehandpolygon");

			function addGraphic(evt) {
				tb.deactivate();
				self.map.enableMapNavigation();
				var symbol = self.getFillsys();
				var grc = new esri.Graphic(evt.geometry, symbol, {
					type : 'fillLine',
				});
				var p = evt.geometry.getExtent().getCenter();
				self.drawGrcLayer.add(grc);
				self.textFillToQY(p, self.drawGrcLayer, self, null, null);
			}
		},
		textFillToQY : function(point, layer, self, attr, name) {
			//填充文字
			if (name)
				name += "区域";else
				name = '';
			var size = self.map.getZoom() * 3.5;
			var grc = new esri.Graphic(point, self.getTextSybol(name, size + 1, '#fff'), dojo.safeMixin({
				type : 'text',
				big : true
			}, attr));
			var grc2 = new esri.Graphic(point, self.getTextSybol(name, size, '#DC143C'), dojo.safeMixin({
				type : 'text',
				big : false
			}, attr));
			layer.add(grc);  layer.add(grc2);
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
		getLineSymbol : function() {
			return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([ 255, 0, 0 ]), 3);
		},
		getFillsys : function(opcity) {
			return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
					new dojo.Color([ 253, 46, 36, opcity ]), 2), new esri.Color([ 253, 46, 36, 0.07 ]));
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
		showZTmpLayer : function(geoInfo) {
			//将预警信息展示到地图
			//假如没有则添加  对比围栏编号
		//	MXZH.log(this.tempLayer);
			var wlId = geoInfo['fence_id'];
			var gras = this.tempLayer.graphics;
			var ishas = false;
			for (var i = 0; i < gras.length; i++) {
				if (wlId == gras[i].attributes.wlId) {
					ishas = true;
				}
			}
			if (!ishas) {
				//假如已经存在 就不在加载
				var date = Number(new Date());
				var pathObj = JSON.parse(geoInfo['path'].replace(/'/g, "\""));
				var grc = new esri.Graphic(pathObj); //面
				grc.attributes['wlId'] = wlId;
				grc.attributes['date'] = date;
				var polygon = new esri.geometry.Polygon();
				polygon.addRing(pathObj['geometry'].rings[0]);
				var p = polygon.getExtent().getCenter();
				this.tempLayer.add(grc);
				this.textFillToQY(p, this.tempLayer, this, {
					date : date
				}, geoInfo['wlname'] + ":" + geoInfo['type']);

				//显示位置
				var point = new esri.geometry.Point([ geoInfo['lon'], geoInfo['lat'] ], new esri.SpatialReference({
					wkid : WangConfig.constants.wkt
				}));

				this.tempPointLayer.add(new esri.Graphic(point, this.getYjPointSys(), {
					YjId : wlId,
					date : date
				}));
			}


		},
		autoClearLayer : function() {
			var self = this;
			function myclear() {
				if (self.tempPointLayer.graphics.length > 0 || self.tempLayer.graphics.length > 0) {
					var d = new Date().getTime();
					self.tempPointLayer.graphics.map(function(g) {
						if ((d - g.attributes.date) >= 3000) {
							self.tempPointLayer.remove(g);
						}
					});
					self.tempLayer.graphics.map(function(g) {
						if ((d - g.attributes.date) >= 3000) {
							self.tempLayer.remove(g);
						}
					});

				}
				self.timeout = setTimeout(myclear, 1000);
			}
			myclear();
		},
		getYjPointSys : function() {
			//获取预警位置点样式
			return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 20,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
					new esri.Color([ 255, 0, 0 ]), 1),
				new esri.Color([ 143, 188, 143, 1 ]));
		},
		checkoutGrcLayer : function(id) {
			//围栏管理点击围栏的时候检测 地图上是否已经存在相对layer
			var isIn = false;
			dojo.forEach(this.grcLayer.graphics, function(item) {
				if (item.attributes['wlId'] == id) {
					isIn = true;
				}
			})
			return isIn;
		},
		clearGrcLayer : function(id) {
			var self = this;
			var clears = [];
			dojo.forEach(self.grcLayer.graphics, function(item) {
				if (item.attributes['wlId'] == id) {
					clears.push(item);
				}
			});
			clears.map(function(item) {
				//self.grcLayer.remove(item);
				self.grcLayer.remove(item);
			});
			this.anctiveIcon(id);

		},
		activeIconBylayer:function(){
			dojo.forEach(this.grcLayer.graphics, function(item) {
//				if (item.attributes['wlId'] == id) {
//				//	clears.push(item);
//				}
				item.attributes['wlId'] && this.activeIcon(item.attributes['wlId']);
			},this);
		},
		activeIcon : function(id) {
			//激活清除图标
			$.map($(".clearthis"), function(item) {
				if ($(item).attr('id') == id) {
					$(item).css("cursor", "pointer");
					$(item).parents(".dzwl_caozuo").css("color", "#417bdc");
				}
			});
		},
		anctiveIcon : function(id) {
			$.map($(".clearthis"), function(item) {
				if ($(item).attr('id') == id) {
					$(item).css("cursor", "not-allowed");
					$(item).parents(".dzwl_caozuo").css("color", "#333");
				}
			});
		},

		showFence : function(fenceStr, infoArr) {

			var self = this;
			var resizeInterval1,
				resizeInterval2;
			var resizeTimer,
				resizeTime = 800;
			var fenceObj = JSON.parse(fenceStr);
			if (!fenceObj || fenceObj.length <= 0) return;
			var lineExtent = [];
			var resultUnionExtent;
			var tempUnionExtent;

			for (var i = 0; i < fenceObj.length; i++) {
				var gra = new esri.Graphic(fenceObj[i]);
				gra.attributes['wlId'] = infoArr[0];
				lineExtent[i] = gra.geometry.getExtent();
				if (i == 0) {
					tempUnionExtent = gra.geometry.getExtent();
				}
				if (!this.checkoutGrcLayer(infoArr[0])) {
					this.grcLayer.add(gra);
					var point = gra.geometry.getExtent().getCenter();
					this.textFillToQY(point, self.grcLayer, this, {
						wlId : infoArr[0]
					}, infoArr[1] + ":" + infoArr[2]);
					//id
					self.activeIcon(infoArr[0]);
				}
				resultUnionExtent = tempUnionExtent.union(lineExtent[i]);
			}
			this.map.setExtent(resultUnionExtent.expand(1.5));

			clearTimeout(resizeTimer);
			resizeInterval1 = setInterval(function() {
				for (var i = 0; i < self.grcLayer.graphics.length; i++) {
					if (self.grcLayer.graphics[i].attributes && self.grcLayer.graphics[i].attributes.type == 'fillLine'
						&& self.grcLayer.graphics[i].attributes['wlId'] == infoArr[0]) {
						self.grcLayer.graphics[i].setSymbol(self.getFillsys(0.6));
					}

				}
			}, 200);
			resizeInterval2 = setInterval(function() {
				for (var i = 0; i < self.grcLayer.graphics.length; i++) {
					if (self.grcLayer.graphics[i].attributes && self.grcLayer.graphics[i].attributes.type == 'fillLine'
						&& self.grcLayer.graphics[i].attributes['wlId'] == infoArr[0]) {
						self.grcLayer.graphics[i].setSymbol(self.getFillsys(0));
					}
				}
			}, 220);
			resizeTimer = setTimeout(function() {
				clearInterval(resizeInterval1);
				clearInterval(resizeInterval2);
				for (var i = 0; i < self.grcLayer.graphics.length; i++) {
					if (self.grcLayer.graphics[i].attributes && self.grcLayer.graphics[i].attributes.type == 'fillLine'
						&& self.grcLayer.graphics[i].attributes['wlId'] == infoArr[0]) {
						self.grcLayer.graphics[i].setSymbol(self.getFillsys(0.6));
					}
				}
			}, resizeTime);



		}
	};
})