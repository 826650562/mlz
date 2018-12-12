/*
 * 监控对象js
 * 2017-06-12 
 */
var overla=null;
MXZH.jkdxCF = function() {};
MXZH.jkdxCF.prototype = {
	person_sum : 55, //临界值  大于该值 用水波纹效果显示	
	linerFun : function(val) {
		if (val >= 0 && val <= 10) {
			return 8;
		} else if (val > 10 && val <= 50) {
			return 15;
		} else if (val > 50 && val <= 100) {
			return 30;
		} else if (val > 100 && val <= 200) {
			return 40;
		} else {
			return 50;
		}
	},
	init : function() {
		this.destroy();
		this.getDataOfMonitor(this.applyDatas, this);
	},
	destroy : function() {
		window.overlay && overlay.removeLayer();
	},
	simple : function(arr) {
		dojo.require("esri.layers.EchartsLayer");
		overlay  = new esri.layers.EchartsLayer(MXZH.mainMap.wangMap.map, echarts);
		var chartsContainer = overlay.getEchartsContainer();
		var myChart = overlay.initECharts(chartsContainer);
		// option = {};
		// 使用刚指定的配置项和数据显示图表。
		this.mapOption.series = arr;
		overlay.setOption(this.mapOption);
	},
	mapOption : {
		tooltip : {
			trigger : 'item'
		},
		geo : {
			map : '',
			label : {
				emphasis : {
					show : false
				}
			},
			roam : true,
			itemStyle : {
				normal : {
					areaColor : '#323c48',
					borderColor : '#111'
				},
				emphasis : {
					areaColor : '#2a333d'
				}
			}
		},
		series : []
	},
	applyDatas : function(msg, s) {
		 
		var res = JSON.parse(msg);
		if(res.length<=0){
			MXZH.msgOfsswz('无数据！');
			return;
		}
		//分类
		var bigperson = [],
			normalperson = [];
		var xs = [],
			ys = [];
		dojo.forEach(res, function(item) {
			//大于55人
			xs.push(item.lon), ys.push(item.lat);
			if (item.person_number > s.person_sum) bigperson.push(item);
			else normalperson.push(item);
		})
		
		s.setperson_type(res);
		s.setperson_area(res);
		var seriesArr1 = s.setsers(bigperson, s.top5);
		var seriesArr2 = s.setsers(normalperson, s.normal);
		s.simple(seriesArr1.concat(seriesArr2));

		var Maxx = Math.max.apply(Math, xs)+0.09;
		var Maxy = Math.max.apply(Math, ys)+0.09;

		var Minx = Math.min.apply(Math, xs)-0.09;
		var Miny = Math.min.apply(Math, ys)-0.09;
		
		MXZH.getMap.setExtent(new esri.geometry.Extent(Minx, Miny, Maxx, Maxy, new esri.SpatialReference({ wkid:3857 })));
	},
	normal : function(color, self) {
		return {
			name : '监控对象分布',
			type : 'scatter',
			coordinateSystem : 'geo',
			data : null,
			symbolSize : function(val) {
				return self.linerFun(val[2]);
			},
			 tooltip : {
			        trigger: 'item',
			        formatter: '{b}'
			    },
			itemStyle : {
				normal : {
					color : color,
					opacity : 0.8
				}
			}
		}
	},
	top5 : function(color, self) {
		return {
			name : '监控对象分布',
			type : 'effectScatter',
			coordinateSystem : 'geo',
			data : null,
			symbolSize : function(val) {
				return self.linerFun(val[2]);
			},
			 tooltip : {
			        trigger: 'item',
			        formatter: '{b}'
			    },
			showEffectOn : 'render',
			rippleEffect : {
				brushType : 'stroke'
			},
			hoverAnimation : true,
			itemStyle : {
				normal : {
					color : color,  
					shadowBlur : 10,
					shadowColor : '#333',
					opacity : 0.8
				}
			},
			zlevel : 1
		}
	},
	setsers : function(filerAll, setfunc) {
		var seriesArray = [];
		var rmres = ['#2EC7C9']; // A类人员居住地
		var rqres = [ '#FFB980' ]; // A类人员聚集地 '#ffad80 '
		var sdres = [ '#8D98B3' ]; // B类人员居住地
		var hdcres = [ '#B6A2DE' ]; // B类人员聚集地
		var ccres = [ '#D87A80' ]; // C类人员居住地
		var fnres = [ '#5AB1EF' ]; // C类人员聚集地
		var self = this;
		filerAll.map(function(val) {
			if (val.lon && val.lat) {
				switch (val.personnel_type + val.live_type) {
				case 'A居住地':
					rmres.push({
						name : "名称：" + val.personnel_type+val.live_type + "    人数：" + val.person_number,
						value : [ val.lon, val.lat, val.person_number ]
					});
					break;
				case 'A聚集地':
					rqres.push({
						name : "名称：" + val.personnel_type+val.live_type  + "    人数：" + val.person_number,
						value : [ val.lon, val.lat, val.person_number ]
					});
					break;
				case 'B居住地':
					sdres.push({
						name : "名称：" + val.personnel_type+val.live_type  + "    人数：" + val.person_number,
						value : [ val.lon, val.lat, val.person_number ]
					});
					break;
				case 'B聚集地':
					hdcres.push({
						name : "名称：" + val.personnel_type+val.live_type  + "    人数：" + val.person_number,
						value : [ val.lon, val.lat, val.person_number ]
					});
					break;
				case 'C居住地':
					ccres.push({
						name : "名称：" + val.personnel_type+val.live_type  + "    人数：" + val.person_number,
						value : [ val.lon, val.lat, val.person_number ]
					});
					break;
				case 'C聚集地':
					fnres.push({
						name : "名称：" + val.personnel_type+val.live_type  + "    人数：" + val.person_number,
						value : [ val.lon, val.lat, val.person_number ]
					});
					break;
				}
			}
		});
		var allArr = [ rmres, rqres, sdres, hdcres, ccres, fnres ];
		allArr.map(function(val) {
			if (val.length > 1) {
				var s = setfunc(val[0], self);
				val.shift();
				s.data = val;
				seriesArray.push(s);
			}
		});
		return seriesArray;
	},
	setOption_personType : function() {
		//app.title = '环形图';
		return {
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				x : 'left',
				y : 50,
				orient : 'vertical',
				data : []
			},
			calculable : true,
			series : [
				{
					name : '类型分布',
					type : 'pie',
					radius : [ '24%', '60%' ],
					center : [ '65%', '50%' ],
					roseType : 'area',
					x : '50%', // for funnel
					max : 40, // for funnel
					sort : 'ascending', // for funnel
					label : {
						normal : {
							show : false,
							position : 'center'
						},
						emphasis : {
							show : false,
							position : 'center',
							textStyle : {
								fontSize : '14',
								fontWeight : 'bold'
							}
						}
					},
					itemStyle : {
						normal : {
							label : {
								show : false
							},
							labelLine : {
								show : false
							}
						},
						emphasis : {
							label : {
								show : true,
								position : 'center',
								textStyle : {
									fontSize : '16',
									fontWeight : 'bold'
								}
							}
						}
					},
					data : []
				}
			]
		};
	},
	setOption_personArea : function() {
		//app.title = '环形图';
		return {
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				y : 20,
				data : []
			},
			calculable : true,
			series : [
				{
					name : '区域分布',
					type : 'pie',
					radius : [ '35%', '55%' ],
					center : [ '65%', '50%' ],
					label : {
						normal : {
							show : false,
							position : 'center'
						},
						emphasis : {
							show : false,
							position : 'center',
							textStyle : {
								fontSize : '14',
								fontWeight : 'bold'
							}
						}
					},
					itemStyle : {
						normal : {
							label : {
								show : false
							},
							labelLine : {
								show : false
							}
						},
						emphasis : {
							label : {
								show : true,
								position : 'center',
								textStyle : {
									fontSize : '16',
									fontWeight : 'bold'
								}
							}
						}
					},
					data : []
				}
			]
		};
	},
	setperson_type : function(res) {
		var dom = document.getElementById("jkdx_tjtbox");
		var myChart = echarts.init(dom, "macarons");

		var circle_option = this.setOption_personType();
		var d =  {};
		var sumOfperson = 0;
		dojo.forEach(res, function(item) {
			if (item.live_type && item.personnel_type) {
				//过滤错误数据
				sumOfperson += item.person_number
				var type = item.personnel_type + item.live_type;
				if (!d[type]) {
					d[type] = {
						value : item.person_number || 0,
						name : item.personnel_type + item.live_type
					}
				} else {
					d[type].value = parseInt(d[type].value) + parseInt(item.person_number);
				}
			}
		});
		var datas = [];
		var legend = [];
		for (var obj in d) {
			legend.push(obj)
			d[obj] && datas.push(d[obj]);
		}
		circle_option.legend.data = legend;
		circle_option.series[0].data = datas;
		myChart.setOption(circle_option);
		$(".jkdx_num").find("strong").text(sumOfperson);
	},
	setperson_area : function(res) {
		var dom = document.getElementById("jkdx_tjtbox2");
		var myChart = echarts.init(dom, "macarons");
		var area_option = this.setOption_personArea();
		var d = {};
		dojo.forEach(res, function(item) {
			if (item.live_type && item.personnel_type && item.area) {
				//过滤错误数据
				var type = item.area;
				if (!d[type]) {
					d[type] = {
						value : item.person_number || 0,
						name : item.area
					}
				} else {
					d[type].value = parseInt(d[type].value) + parseInt(item.person_number);
				}
			}
		});
		var datas = [];
		var legend = [];
		for (var obj in d) {
			legend.push(obj)
			d[obj] && datas.push(d[obj]);
		}
		area_option.legend.data = legend;
		area_option.series[0].data = datas;
		myChart.setOption(area_option);
	},
	getDataOfMonitor : function(callback, s) {
		//获取所有的数据
		var self = this;
		MXZH.effectController.loading(true);
		$.ajax({
			url : "${basePath}/home_queryForMonitor.action?time=" + new Date().getTime(),
			data : {},
			type : "post",
			success : function(msg) {
				MXZH.effectController.loading(false);
				callback(msg, s);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				layer.msg('数据查询失败！', {
					time : 1000
				})
			}
		});

	}
};