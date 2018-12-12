//安全等级
/**************************安全等级控制器类*******************************************************************/
MXZH.aqzkCF = function() {
	this.MXZH_aqzk_datas = MXZH_aqzk_datas;
	PointsLayer_akqk = new esri.layers.GraphicsLayer();
}
MXZH.aqzkCF.prototype = {
	config : {
		//可用的配置
	},
	init : function() {
		MXZH.getMapParent.isTiledMap=false;
		MXZH.getMapParent.switchBaseLayer("fengxianqu");
		console.info(MXZH.getMapParent.currentBaseMap);  
		var point = new esri.geometry.Point(121.590252, 30.951969, new esri.SpatialReference({
			wkid : 4326
		}))
		MXZH.getMap.centerAndZoom(point,6);
		this.getFeatuterLayer();
		MXZH.getMap.addLayer(PointsLayer_akqk);	
	},
	getFeatuterLayer : function() {
		var html = ""; 
		var self = this;
		var featureLayer = new esri.layers.FeatureLayer(MXZH.mainMap.wangMap.baseMap[1].urls[0]+"/0",
			{
				mode : esri.layers.FeatureLayer.MODE_SNAPSHOT,
				outFields : [ "*" ]
			});

		var query = new esri.tasks.Query();
		query.where = "1=1";
		query.outSpatialReference = new esri.SpatialReference(4326);
		query.returnGeometry = true;
		query.outFields = [ "*" ];
		MXZH.effectController.loading(true);
		featureLayer.queryFeatures(query, function(e) {
			MXZH.effectController.loading(false);
			 $(".aqzk_contria").html("");
			  e.features.map(function(item){
				  var attr=item.attributes;
				 MXZH_aqzk_datas.map(function(data){
					 if(data.id==attr.FID){
						 var ds=getDj(data.dj);
						 $(".aqzk_contria").append(getHtml(attr,ds[0],ds[2]));
						 PointsLayer_akqk.add(new esri.Graphic(item.geometry,getfullSysbol(ds[1]),item.attributes,null));
						 self.addEventListener();
					 }
				 });
				 
				 //添加区域名称
				 PointsLayer_akqk.add(new esri.Graphic(item.geometry,getTextSysbol(attr.QH_NAME),{
					 type_id:"text"
				 },null));
				 
			  });
		});
		function getTextSysbol(text){
			return  new esri.symbol.TextSymbol(text).setColor(
				    new esri.Color([255,255,255])).setAlign(esri.symbol.Font.ALIGN_START).setAngle(0).setFont(
				    	    new esri.symbol.Font("11pt").setWeight(esri.symbol.Font.WEIGHT_BOLD)) ;
		}
		
		function getHtml(d,dj,_class){
            return '<li id='+d.AREA_ID+'><span class="aqzk_name">'+d.QH_NAME+'</span><span class="'+_class+'">'+dj+'</span></li>';			
		};
		
		function getDj(d){
			switch(d){
			   case 0:
				   return ['优','#05632f','aqzk_you'];
				   break;
			   case 1:
				   return ['良','#004a81','aqzk_liang'];
				   break;
			   case 2:
				   return ['中','#868130','aqzk_zhong'];
				   break;
			   case 3:
				   return ['差','#651219','aqzk_cha'];
				   break;
			} 
			
		}
		
		function getfullSysbol(color){
			return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
					new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
						new dojo.Color("#1fd8ca"), 2), new esri.Color(color));
		}
	},
	destroy : function() {
		PointsLayer_akqk.clear();
		MXZH.getMapParent.switchBaseLayer("shiliang");
	},
	getHtmlMode : function(d) {
		return '<li _id=' + d.id + '> <ul> <li><span>企业名称：</span><span>' + d.enterprise_name + '</span></li> <li><span>单位地址：</span><span>' + d.production_address + '</span></li>' +
			'<li><span>企业规模：</span><span>' + d.enterprise_scale + '人</span></li> <li><span>安全状况：</span><span>' + d.anquandj + '</span></li> </ul> </li>';
	},
	addEventListener : function() {
		//注册事件
		 $(".aqzk_contria li").unbind().mouseover(function(){
			var id= $(this).attr("id");   
			PointsLayer_akqk.graphics.map(function(item){
				var attr=item.attributes;
				if(attr.AREA_ID==id){
					item.symbol.outline.width=3;
					item.symbol.outline.color=new esri.Color("#fff");
					PointsLayer_akqk.redraw();
				}
			}); 
		 });
		 
		 $(".aqzk_contria li").mouseout(function(){
				var id= $(this).attr("id");   
				PointsLayer_akqk.graphics.map(function(item){
					var attr=item.attributes;
					if(attr.AREA_ID==id){
						item.symbol.outline.width=2;
						item.symbol.outline.color=new dojo.Color("#1fd8ca"); 
						PointsLayer_akqk.redraw();
					}
				}); 
			 });
		 
	},
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