/*
 *这里是地图的加载主文件
 *wxl 2017-04-14整理
 *使用方法  调用MXZH.mainMap 
 * */
$(function() {
	
	MXZH.mainMap = function() { };
	MXZH.mainMap.prototype = {
		init : function() {
			var mapOption = {
				'zoom' : WangConfig.services.MapService.zoom,
				'center' : WangConfig.services.MapService.center,
			}
			this.wangMap = new Wang.Map("mymap", mapOption);
			this.wangMap.baseMap = [
				{
					name : 'map1',
					//外网秦皇岛地图 
					urls : [ WangConfig.services.MapService.mapUrl ]
				} 
			];
			//this.wangMap.initBaseMapName = "shiliang";
			this.wangMap.initMap(this.afterMapLoad, this);
		 
			//缩小放大按钮
			this.bindLayerEvent(dojo.byId('scal_top'), 'click', function(e) {
				this.wangMap.scaleForMap('top');
			})
			this.bindLayerEvent(dojo.byId('scal_up'), 'click', function(e) {
				this.wangMap.scaleForMap('up');
			})
			$(".shiliang").unbind().click(this, function(e) {
				//切换为矢量地图
				if (e.data.wangMap.initBaseMapName != 'shiliang') {
					e.data.wangMap.switchBaseLayer('shiliang');
					e.data.wangMap.initBaseMapName = 'shiliang'
				}

			});
			$(".weixing").unbind().click(this, function(e) {
				//切换为矢量地图
				if (e.data.wangMap.initBaseMapName != 'weixing') {
					e.data.wangMap.switchBaseLayer('weixing');
					e.data.wangMap.initBaseMapName = 'weixing'
				}

			});
			var self = this;
			//注册测距事件
			this.bindLayerEvent(dojo.byId('cjbutton'), 'click', function(e) {
				var ranger = new Wang.Map.range({
					map : self.wangMap.map
				});
				ranger.initDraw();
			})
			//全景事件
			this.bindLayerEvent(dojo.byId('_fullView'), 'click', function(e) {
				self.wangMap.map.setZoom(mapOption.zoom);
				self.wangMap.map.centerAt(mapOption.center);
			})
			//标记事件
			this.bindLayerEvent(dojo.byId('bjbutton'), 'click', function(e) {
				var mark = new Wang.Map.mark({
					map : self.wangMap.map
				});
			})
		},
		afterMapLoad : function(map, self) {
			//地图加载之后的回调函数
			//self.getData(map);
			//return self;
			//添加村镇地图  
			WangConfig.isAddcunzhenMap && map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer(WangConfig.services.BjURL));
			WangConfig.isAddcunzhenMap && map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer(WangConfig.services.cunzhenURL,{
				opacity:0.6
			}));
			MXZH.log('地图正确加载完毕wxl');
		},
		bindLayerEvent : function(layer, event, callback) {
			return dojo.connect(layer, event, this, callback);
		},
		addLayer : function(layer) {
			this.wangMap.addLayer(layer);
		}
	}
	
	
	
	MXZH.mainMap = new MXZH.mainMap();
	MXZH.mainMap.init();
	MXZH.getMapParent = MXZH.mainMap.wangMap;
	MXZH.getMap = MXZH.mainMap.wangMap.map;
})