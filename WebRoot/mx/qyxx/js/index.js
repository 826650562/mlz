//企业信息
var PointsLayer_qyxx = null;
/**************************企业信息控制器类*******************************************************************/
MXZH.qyxxCF = function() {

}
MXZH.qyxxCF.prototype = {
	config : {
		//可用的配置
		currentpageNo:0,
		everyPageNo:100
	},
	init : function() {
		MXZH.getMapParent.switchBaseLayer("shiliang");
		PointsLayer_qyxx = new esri.layers.GraphicsLayer();
		MXZH.getMap.addLayer(PointsLayer_qyxx);
		//获取街道名称
		this.getDataOfgj();
		
	},
	getDataOfgj:function(city,gsName,rodaName){
		var self=this;
		MXZH.effectController.loading(true);
		//从数据库查询所有的企业 不在使用示例数据   此处需要分页 
        // 参数：开始时间、结束时间、搜索词、页数、每页条数
			$.ajax({
				url : "${basePath}/home_getQyinfo.action?time=" + new Date().getTime(),
				type : "post",
				data : {
					_gsName:gsName,
					_city:city,
					_rodaName:rodaName,
					pageNo : self.config.currentpageNo,
					pageSize : self.config.everyPageNo
				},
				dataType : "json",
				success : function(result) {
					MXZH.effectController.loading(false);
					layui.use([ 'laypage' ], function() {
						var laypage = layui.laypage;
						laypage({
							cont : 'chatpage_qyxx',
							pages : result[0],
							layout:['prev', 'page', 'next','last'],
							groups : 3,
							curr : self.config.currentpageNo, //result[0].pageNo,
							jump : function(obj, first) { //触发分页后的回调
								if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
									self.config.currentpageNo = obj.curr;
									self.getDataOfgj(city,gsName);
								}
							}
						});
					});
					self.MXZH_data_qyxx = result[1];
					self.fullHtmlList();
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					throw ('数据请求失败！');
				}
			});
	},
	fullHtmlList : function() {
		var html = "";
		var self = this;
		PointsLayer_qyxx.clear();
		PointsLayer_qyxx.redraw();
		MXZH.mainMap.wangMap.map.infoWindow.hide();	
		
		this.MXZH_data_qyxx.map(function(item) {
			setHtmlTolist(self, item);
		});
		function setHtmlTolist(self, item) {
			html += self.getHtmlMode(item);
			if(item.wzjd && item.wzwd){
				//撒点
				var xy = MXZH.bd09togcj02(parseFloat(item.wzjd), parseFloat(item.wzwd));
				var _x=parseFloat(xy[0]),_y= parseFloat(xy[1]);
				if(_x && _y){
					var point = new esri.geometry.Point(_x, _y, new esri.SpatialReference({
						wkid : 3857
					}))
					var mkt = MXZH.ToWebMercator(point);
					/*
					
					var point = new esri.geometry.Point(mkt[0], mkt[1], new esri.SpatialReference({
						wkid : 3857
					}))*/
					
					PointsLayer_qyxx.add(new esri.Graphic(mkt, self.getPointsSysbol("mx/qyxx/images/qybluextb.png"), item, null));
				}
			}
		}
		$("#chathistory_qyxx").html(html);
		this.addEventListener();
	},
	destroy : function() {
		PointsLayer_qyxx.clear();
		MXZH.mainMap.wangMap.map.infoWindow.hide();
		MXZH.mainMap.wangMap.map.removeLayer(PointsLayer_qyxx);
	},
	getHtmlMode : function(d) {
		return '<li _id=' + d.id + '> <div class="qyxx_ol"> <div class="qyxx_li"><span>企业名称：</span><span>' + d.dwmc + '</span></div> <div  class="qyxx_li"><span>单位地址：</span><span>' + d.xxdz + '</span></div>' +
			'<div  class="qyxx_li"><span>企业规模：</span><span>' + d.gm + '</span></div> <div  class="qyxx_li"><span>区域名称：</span><span>' + d.szd + '</span></div> </div> </li>';
	},
	addEventListener : function() {
		var self = this;
		//注册事件
		dojo.connect(PointsLayer_qyxx, 'onClick', function(item) {
			var attr = item.graphic.attributes;
			var infoTemplate = new esri.InfoTemplate();
			infoTemplate.setTitle(attr.dwmc);
			var html = "";
			getHtml(attr,function(html){
				infoTemplate.setContent(html);
				item.graphic.infoTemplate = infoTemplate;
				//弹框
				MXZH.getMap.infoWindow.setTitle(attr.dwmc);
				MXZH.getMap.infoWindow.setContent(getHtml(attr));
				MXZH.getMap.infoWindow.show(item.graphic.geometry);
				MXZH.getMap.centerAt(item.graphic.geometry);
				self._attr=attr;
			})
		
		});

		dojo.connect(PointsLayer_qyxx, 'onMouseMove', function(item) {
			var sysbol = item.graphic.symbol;
			sysbol.height = 38;
			sysbol.width = 30;
			PointsLayer_qyxx.redraw();
			MXZH.getMap.setMapCursor("pointer");
		});

		dojo.connect(PointsLayer_qyxx, 'onMouseOut', function(item) {
			var sysbol = item.graphic.symbol;
			sysbol.height = 32;
			sysbol.width = 25;
			PointsLayer_qyxx.redraw();
			MXZH.getMap.setMapCursor("default");
		});

		$("#chathistory_qyxx li").unbind().click(function() {
			var id = $(this).attr("_id");
			if (id) {
				PointsLayer_qyxx.graphics.map(function(item) {
					var attr = item.attributes;
					if (attr.id == id) {
						//弹框
						MXZH.getMap.infoWindow.setTitle(attr.dwmc);
						getHtml(attr,function(html){
							MXZH.getMap.infoWindow.setContent(html);
							MXZH.getMap.infoWindow.show(item.geometry);
							self._attr=attr;
							MXZH.getMap.centerAt(item.geometry);
						})
						
					}
				});
			}
		});

		getMoreInfo=function () {
			//当点击更多按钮时 获取更多信息
			//更换infoWindow里面的内容
			MXZH.getMap.infoWindow.setContent(getHtml2(self._attr));
		}

		$("#query_qyxx").unbind().click(function() {
			var cityId = $("#fx_xiangzhen").val();
			var gsName = $("#ls_conditions_fx").val();
			var roadName = $.trim($("#ls_conditionsRoad_fx").val());
			self.config.currentpageNo = 0;
			if(roadName.length){
				self.getDataOfgj('','',roadName);
			}else
				self.getDataOfgj(cityId, gsName);
		});

		function getHtml(attr,fn) {
			var html='';
			$.ajax({
				url : "${basePath}/home_queryAQJCFCS.action?time=" + new Date().getTime(),
				type : "post",
				data:{typeId:attr.id},
				dataType : "json",
				success : function(result) {
					html+= '<div class="z-row marT5 tklicont">' +
					'<div class="z-col">' +
					'<div class="z-row"><div>法定代表人：</div><div class="z-col">' + attr.fddbr + '</div></div>' +
					'<div class="z-row"><div>安全负责人：</div><div class="z-col">' + attr.aqfzr + '</div></div>' +
					'<div class="z-row"><div>联系电话：</div><div class="z-col">' + attr.zysjh + '</div></div>' +
					'<div class="z-row"><div>安全检查次数：</div><div class="z-col"><a  target="_blank" href="#?bjcqyid='+attr.id+'">'+0+'</a></div></div>' +
					'<div class="z-row"><div>复查数：</div><div class="z-col"><a  target="_blank" href="#?bjcqyid='+attr.id+'">'+0+'</a></div></div>' +
					'<div class="z-row">' +
					'<div class="z-col"> </div>' +
					'<div class="padT10"> <button class="ckgdbtn" onClick=getMoreInfo() >查看更多<i class="fa fa-caret-right fa-fw"></i></button> </div>' +
					'<div class="z-col"> </div>' +
					'</div> </div> </div>';
					fn && fn(html);
				}
			})
		}

		function getHtml2(attr) {
			//根据数据 返回html
			var date;
			attr.establish_date?date=new Date(attr.establish_date.time).Format('yyyy-MM-dd'):date="无数据";
			return '<div class="z-row marT5 tklicont border">' +
			'<div class="z-col"> ' +
			'<div class="z-row"><div class="z-col qiyeimg"><img width="450px" src="mx/gsdt/images/qiyeimg1.jpg"></div></div>' +
			'<div class="z-row"><div>所在区域：</div><div class="z-col">'+attr.szd+'</div></div>' +
			'<div class="z-row"><div>生产经营地址：</div><div class="z-col">'+attr.xxdz+'</div></div>' +
			/*'<div class="z-row"><div>企业成立日期：</div><div class="z-col">'+date+'</div></div>' +*/
			/*'<div class="z-row"><div>注册资本金：</div><div class="z-col">'+attr.registered_capital+'</div></div>' +*/
			'<div class="z-row"><div>经济类型：</div><div class="z-col">'+attr.jjlx+'</div></div>' +
			'<div class="z-row"><div>年营业收入：</div><div class="z-col">'+attr.nyysr+'</div></div>' +
			'<div class="z-row"><div>行业类别：</div><div class="z-col">'+attr.hylb+'</div></div>' +
			'<div class="z-row"><div>企业规模：</div><div class="z-col">'+attr.gm+'</div></div>' +
			'<div class="z-row"><a class="linkForMore" class="z-col" target="_blank" href="#id='
			+attr.id +'">详情</a></div>'
			'<div class="z-row">' +
			'<div class="z-col"> </div>' +
			'<div class="z-col"> </div></div> </div> </div>';
		}


	},
	getPointsSysbol : function(imgName) {
		var picsybol = new esri.symbol.PictureMarkerSymbol(imgName, 25, 35);
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