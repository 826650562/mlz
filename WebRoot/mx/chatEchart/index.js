
MXZH.chatLayer = function() {};
MXZH.chatLayer.prototype = {
	setOptions : function() {
		return options = {
			tooltip : {
				trigger : 'item',
				formatter : function(vl) {
					var content = vl.name.substring(vl.name
							.indexOf("-") + 1);
					return content;
				}
			},
			series : []
		};
	},
	getSeriesOfLines : function() {
		return {
			name : '连线',
			type : 'map',
			mapType : 'none',
			data : [],
			markLine : {
				symbol : [ 'circle', 'circle' ],
				// symbol: ['circle', 'arrow'],
				symbolSize : 1,
				smooth : true,
				effect : {
					/*	show : false,
						scaleSize : 1,
						period : 15, // 运动周期，无单位，值越大越慢
						color : '#fff',
						// shadowColor:
						// 'rgba(220,220,220,0.4)',
						shadowBlur : 20,
						loop: false,*/
				},
				itemStyle : {
					normal : {
						borderWidth : 1,
						borderColor : '#414e82', // color:
						// ['#ff3333',
						// 'orange',
						// 'yellow','lime','aqua'],
						lineStyle : {
							type : 'solid',
							// type: 'dashed',
							shadowBlur : 20,
							width : 2
						}
					}
				},
				data : []
			}
		}
	},
	getSeriesOfPoints : function() {
		return {
			name : '光晕效果',
			type : 'map',
			mapType : 'none',
			data : [],
			markPoint : {
				symbol : 'emptyCircle',
				symbolSize : function(v) {
					return 10 + v / 10
				},
				effect : {
					show : true,
					shadowBlur : 20,
					loop : false,
					period : 2,
					type : 'bounce',
					bounceDistance : 3,
					color : '#414e82',
					shadowColor : '#414e82'
				},
				itemStyle : {
					normal : {
						label : {
							show : false
						}
					},
					emphasis : {
						label : {
							position : 'top'
						}
					}
				},
				data : []
			},
		}


	},
}


/*
 * 控制器
 */
MXZH.chatLayerCF = function() {};
MXZH.chatLayerCF.prototype = {
	init : function() {
		//构造函数
		this.addEventLinster();
		this.echartlayer = new MXZH.chatLayer();
	},
	addEventLinster : function() {
		$(".sdchart").unbind().click(this, function(evet) {
			evet.data.setPoint();
		});
		$("#thchart").unbind().click(this, function(evet) {
			//连线
			dojo.require("esri.layers.layerTest")

			//dojo.require("esri.layers.layerTest");
			var lyr = new esri.layers.GraphicsLayer({
				id : 'd3GraphicsLayer'
			});
			MXZH.mainMap.wangMap.map.addLayer(lyr);
			var d3AnnoLayer = new esri.layers.layerTest(MXZH.mainMap.wangMap.map, lyr, {});
			d3AnnoLayer.init();
		 	
	    	var point = new esri.geometry.Point(121.4, 31.2 , new esri.SpatialReference(4326));
			var symbol = new esri.symbol.SimpleMarkerSymbol('circle');
			var g = new esri.Graphic(point, symbol, {
				stcd : 'aaa',
				stnm : 'bbb'
			});
			lyr.add(g); 


			


		/*	dojo.Mymap = MXZH.mainMap.wangMap.map;
			var p = [ [ 121.4, 31.5 ], [ 121.4, 31.2 ] ];

			function getPoint(x, y) {
				return new esri.geometry.Point(x, y, new esri.SpatialReference({
					wkid : WangConfig.constants.wkt
				}));
			}


			var opts1 = evet.data.initData([ [ getPoint(p[0][0], p[0][1]), getPoint(p[1][0], p[1][1]) ] ], evet.data.echartlayer.getSeriesOfLines, 'markLine');
			var el = new esri.layers.EchartLayer(opts1);
			//	dojo.Mymap.addLayer(el);
			var t1 = window.setTimeout(addEl2, 1000);
			function addEl2() {
				var opts2 = evet.data.initData([ getPoint(p[1][0], p[1][1]) ], evet.data.echartlayer.getSeriesOfPoints, 'markPoint');
				el2 = new esri.layers.EchartLayer(opts2);
				dojo.Mymap.addLayer(el2);
				window.setTimeout(clearEl, 1500);
			}
			function clearEl() {
				dojo.Mymap.removeLayer(el);dojo.Mymap.removeLayer(el2);
			}
*/
		});

	},
	initData : function(data, cb, type) {
		//设置数据
		var series = cb();
		series[type].data = data;
		opts = this.echartlayer.setOptions();
		opts.series.push(series);
		return opts;
	},
	setPoint : function() {
		var p = [ [ 121.5, 31.2 ], [ 121.4, 31.2 ] ];
		var gra = new esri.layers.GraphicsLayer({
			className : 'sswzOfLayer',
		});

		var gra2 = new esri.layers.GraphicsLayer({
			className : 'sswzOfLayer22',
		});


		point1 = new esri.geometry.Point(p[0][0], p[0][1], new esri.SpatialReference({
			wkid : WangConfig.constants.wkt
		}));
		point2 = new esri.geometry.Point(p[1][0], p[1][1], new esri.SpatialReference({
			wkid : WangConfig.constants.wkt
		}));
		MXZH.mainMap.addLayer(gra);
		MXZH.mainMap.addLayer(gra2);

		gra.add(new esri.Graphic(point1, this.getYjPicSys()));

		gra2.add(new esri.Graphic(point2, this.getYjPicSys2()));

		//gra.add(new esri.Graphic(point2, this.getYjPicSys()));
		gra.hide();
		dojo.connect(dojo.byId('thchart'), 'click', function() {
			gra.show();
			$(".sswzOfLayer").find("image").attr('class', "tooltip222");
			setTimeout(function() {
				$(".sswzOfLayer").find("image").attr('class', "");
			}, 3000);
		})
	},
	getYjPointSys : function() {
		return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 20,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new esri.Color([ 255, 0, 0 ]), 1),
			new esri.Color([ 143, 188, 143, 1 ]));
	},
	getYjPicSys : function() {
		return new esri.symbol.PictureMarkerSymbol('images/shipin.png', 43, 52);
		// return new esri.symbol.PictureMarkerSymbol('http://www.17sucai.com/preview/11/2015-01-19/svg-loader/svg-loaders/rings.svg', 60, 60);

	},
	getYjPicSys2 : function() {
		//return new esri.symbol.PictureMarkerSymbol('images/yyhjdefaulthead.png', 89, 110);
		return new esri.symbol.PictureMarkerSymbol('images/233.swf', 50, 50);

	},
	getYjMarkeSys : function() {
		var d = "M7.065,7.067C13.462,10.339,15,19.137,15,19.137V0H0C0,0,1.865,4.407,7.065,7.067z";
		var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
		markerSymbol.setPath(path);
		markerSymbol.setColor(new dojo.Color('#333'));
		markerSymbol.setOutline(null);
		return markerSymbol;
	},
}