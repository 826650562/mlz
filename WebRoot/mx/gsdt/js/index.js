//故事地图
var PointsLayer_gsdt = null;
var top_ = 10;
var timeExtent;
var timeSlider;
var items;


/**************************企业信息控制器类*******************************************************************/
MXZH.gsdtCF = function() {
	this.MXZH_data_gsdt = MXZH_data_gsdt;
	PointsLayer_gsdt = new esri.layers.GraphicsLayer();
}
MXZH.gsdtCF.prototype = {
	config : {
		//可用的配置#25A162
	},
	init : function() {
		$("#timeSliderDiv").fadeIn(300);
		MXZH.getMapParent.switchBaseLayer("shiliang");
		MXZH.getMap.addLayer(PointsLayer_gsdt);
		this.fullHtmlList();
	},
	fullHtmlList : function() {
		var html = "";
		var self = this;
        $(".popup-events .timeline").html("");
        top_=0;
        var yh= ['无','有'];
       
    	$.ajax({
			url : "${basePath}/home_queryGSDT.action?time=" + new Date().getTime(),
			dataType : "json",
			success : function(msg) {
				MXZH.effectController.loading(false);
				if(msg.length<=0){
					return false;
				}
				msg.map(function(val){
					var html = "<li  _date='" + val['create_dateStr']  + "' class='right' style='top:" + top_ + "px'> <span class='dot'>" +
							"</span> <span class='date' style='margin-left: -120px;margin-top: 10px;float: left;'>" + val['create_dateStr'].substr(0,10) +"<br>"+val['create_dateStr'].substr(10,6)+ "</span> " +
									"<strong class='title' style='width: 195px;'>" + val['bjxqy'] + "安监检查</strong> <img class='img'>" +
					"<p class='summary'><b>企业名称:</b>"+val['bjxqy']+"<br> <b>企业地址：</b>"+val['qydz']+" <br> <b>检查人员：</b>"+val['zfry1']+","+val['zfry2']+"<br> <b>时间:</b>"+val['create_dateStr']+"<br>有无隐患：</b>"+yh[val['isyh']]+" </p></li>";
				$(html).appendTo(".popup-events .timeline");
				top_ += 250;
				})
				
				items = $(".popup-events li").get();
				//$(items.shift()).addClass("active");
				
				if (!timeSlider) {
					$("#timeslider_map").remove("#timeSliderDiv");
					var timeslider_map = dojo.byId('timeslider_map');
					timeslider_map.style.display = 'block';
					var divn = dojo.place("<div id='timeSliderDiv'></div>", timeslider_map);
					dojo.require("esri.dijit.TimeSlider");
					try {
						 timeSlider = timeSlider = new esri.dijit.TimeSlider({
							style : "width: 100%;"
						}, divn);
					} catch (e) {
						MXZH.effectController.loading(false);
						MXZH.errorLog('提示：时间轴没有初始化成功！');
					}
				} else {
					$("#timeSliderDiv").fadeIn(400);
					 timeSlider = timeSlider;
				}

				timeExtent = new esri.TimeExtent();
				timeExtent.startTime =new Date( msg[0]['create_dateStr']);
				timeExtent.endTime = new Date( msg[msg.length-1]['create_dateStr']);  
				featureLayerLoaded();
				// 时间轴播放，要素图层与时间轴绑定。
				function featureLayerLoaded() {
					timeSlider.setThumbCount(1);
					timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, esri.layers.TimeInfo.UNIT_HOURS);
					timeSlider.setThumbIndexes([ 0 ]);
					timeSlider.on("time-extent-change", displayTimeInfo);
					timeSlider.setThumbMovingRate(1700);
					timeSlider.startup();
					//timeSlider.play();
					var labels = [];
					dojo.forEach(timeSlider.timeStops, function(timeStop, i) {
						if (timeStop.getMonth() == '1')
							labels.push(timeStop.getFullYear());
					});
					timeSlider.setLabels(labels);
					MXZH.getMap.setTimeSlider(timeSlider);
					$("#timeSliderDiv").css("width", "80%");
				}

				function displayTimeInfo(item) {
					// 显示信息框
					showdsj(item.endTime); //新闻内容及左侧动画
					showInfowindow(item.endTime);
				}
				function filterGraphs() {
					MXZH.getMap.infoWindow.hide();
					PointsLayer_gsdt.clear();
				}
				function showInfowindow(info_times) {
					filterGraphs();
					msg.map(function(val) {
						var date = val['create_dateStr'].substr(0, 10) + val['create_dateStr'].substr(10, 3);
						if (info_times.Format("yyyy-MM-dd hh") == date) {
							//获取 相应的线路id
							var xy = MXZH.bd09togcj02(parseFloat(val.location_x), parseFloat(val.location_y))
							var mkt = MXZH.ToWebMercator2(xy[0], xy[1]);
							var point = new esri.geometry.Point(mkt[0], mkt[1], new esri.SpatialReference({
								wkid : 3857
							}))
							PointsLayer_gsdt.add(new esri.Graphic(point, self.getPointsSysbol("mx/gsdt/images/dot.png"), val, null));
							MXZH.getMap.infoWindow.setTitle(val.title);
							MXZH.getMap.infoWindow.setContent(getHtml(val));
							MXZH.getMap.infoWindow.show(point);
							MXZH.getMap.centerAt(point);
						}
					});

					function getHtml(val) {
						return '<div class="z-row marT5 tklicont">' +
							'<div class="z-col"> ' +
							'<div class="z-row"><div class="z-col qiyeimg"><img width="248px" src="mx/gsdt/images/qiyeimg1.jpg"></div></div>'+
							'<div class="z-row"><div></div><div class="z-col"><b>企业名称:</b>'+val['bjxqy']+'<br> <b>企业地址：</b>'+val['qydz']+' <br>'+
							'<b>检查人员：</b>'+val['zfry1']+','+val["zfry2"]+'<br> <b>时间:</b>'+val['create_dateStr']+'<br>有无隐患：</b>'+yh[val['isyh']]+ '</div></div>' +
							' <div class="z-row">' +
							'</div> </div> </div>';
					}
				}

				function tranTimes(intime) {
					var year = intime.getFullYear();
					var mon = intime.getMonth() + 1;
					if (mon < 10) {
						mon = '0' + mon;
					}
					var day = intime.getDate();
					if (day < 10) {
						day = '0' + day;
					}
					return (year + '' + mon + '' + day);
				}

				function showdsj(info_times) {
					// 判断是否要显示出来infoWin
					dojo.forEach(items, function(e) { 
						var date = $(e).attr('_date');
						date=date.substr(0, 10) + date.substr(10, 3)
						if (date == info_times.Format("yyyy-MM-dd hh")) {
							$(".popup-events .active").removeClass("active");
							$(e).addClass("active");
							$(".popup-events .scrollbar-inner").animate({
								scrollTop : $(e).position().top - 240
							}, 600);
						}
					});
				}
				
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				layer.msg('数据查询失败！', {
					time : 1000
				})
			}
		})
		
	},


	destroy : function() {
		MXZH.getMap.infoWindow.hide();
		
		window.timeSlider && timeSlider.pause();
		MXZH.mainMap.wangMap.map.removeLayer(PointsLayer_gsdt);
		$("#timeSliderDiv").css("display", 'none');
		$(".lsgjLabel").css("display", 'none');
		PointsLayer_gsdt.clear();
	},
	getHtmlMode : function(d) {
		return '<li _id=' + d.id + '> <ul> <li><span>企业名称：</span><span>' + d.enterprise_name + '</span></li> <li><span>单位地址：</span><span>' + d.production_address + '</span></li>' +
			'<li><span>企业规模：</span><span>' + d.enterprise_scale + '人</span></li> <li><span>安全状况：</span><span>' + d.anquandj + '</span></li> </ul> </li>';
	},
	addEventListener : function() {},
	getPointsSysbol : function(imgName) {
		var picsybol = new esri.symbol.PictureMarkerSymbol(imgName, 30, 30);
		return picsybol;
	},
	fullPointsToMap : function() {},
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
	}
}