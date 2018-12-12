dojo.declare("Wang.Map", null, {//地图基本构件
	//可修改参数
	defaultMapInitOptions:{displayGraphicsOnPan:!dojo.isIE,logo:false,fadeOnZoom:true,infoWindow:null},//默认地图初始化参数
	defaultOvMapOptions:{attachTo:"bottom-right",height:200,width:200,opacity:0.5,color:"#FF0000",visible:true},
	defaultMapSr:4326,
	defaultMearsureSr:32651,
	defaultBufferSr:32662,
	//切片底图设置
	baseMap:[
		//{name:'shanghai',urls:[]}//多个url可以用逗号分隔
	],
	initBaseMapName:"",//初始化底图名称
	baseDMSUrls:[{servicename:"",url:""}],//基础动态地图REST
	gsvcUrl:"",//空间服务REST
	isShowOv:false,//是否加载鹰眼
	isShowScalebar:true,//是否加载比例尺
	isPopUpTip:true,
	isTDMap:false,//是否使用全国天地图
	isTiledMap:true,
	//------------------------
	//构造函数
	constructor: function(container,options){
		if(typeof initTrimanGraphic=="function") initTrimanGraphic();
    	dojo.require("esri.map");
    	dojo.require("esri.dijit.Scalebar");
		this.mapcontainer=container;
		this.mapoptions=this.defaultMapInitOptions;
		this.ovmapoptions=this.defaultOvMapOptions;
		if(typeof options!="undefined"){
			dojo.safeMixin(this.mapoptions,options);
		}
		//设置代理
	    esriConfig.defaults.io.proxyUrl = WangConfig.proxyURL;
	    esriConfig.defaults.io.alwaysUseProxy = false;
    },
    //地图初始化
    initMap:function(callback,self){
        //初始化地图
    	this.map = new esri.Map(this.mapcontainer,this.mapoptions);
		this.switchBaseLayer(null);//添加底图
		if(this.baseMap[0].urls.length==0){//没有底图
			this.initBaseDMSLayerInfo("baseDMSUrls",0.8);
			this.addLayer(this.baseDMSLayers["baseDMSUrls"]);
		}
		
	
        this.onloadEventHandler = dojo.connect(this.map, "onLoad", this,
        	function(map){
        		dojo.disconnect(this.onloadEventHandler);
        		//初始化工具栏
				//this.maptoolbars=new Wang.Map.Toolbars(this);
				//设置坐标系
		        this.mapsr=this.map.spatialReference==null?
		        	(new esri.SpatialReference({wkid:this.defaultMapSr})):this.map.spatialReference;
		        //对于自定义的坐标系统，使用defaultMearsureSr
		        if(this.map.spatialReference.wkid==null){
		        	this.mapsr=new esri.SpatialReference({wkid: this.defaultMearsureSr});
		        }
				this.mearsuresr=new esri.SpatialReference({wkid: this.defaultMearsureSr});
				this.buffersr=new esri.SpatialReference({wkid: this.defaultBufferSr});
				//地图其他组件
				if(this.isShowOv){this.loadOVMap();}
				if(this.isShowScalebar){this.loadScalebar();}
				//调整popup的一些样式
				if(this.isPopUpTip){
					if(dojo.query(".maximize").length>0) dojo.style(dojo.query(".maximize")[0], "display", "none");//隐藏最大化按钮
       	 			//if(dojo.query("a.action.zoomTo")>0) 
       	 			dojo.style(dojo.query("a.action.zoomTo")[0], "display", "none");//隐藏缩放至
       	 		}
				//地图初始化结束后,调用返回函数
				if(typeof callback=="function") callback(this.map,self);
        	}
        );
       	dojo.connect(this.map.infoWindow,"onHide",function(){
       		if(this.map.infoWindow.clearFeatures) this.map.infoWindow.clearFeatures();
       	});
        dojo.connect(this.map.infoWindow,"onShow",function(){});
	    //esri.config.defaults.map.slider={left:"100px",top:"30px",width:null,height:"500px"};
    },
    //----------------
    //不允许手动修改的属性
	map:null, //esri.Map
	mapcontainer:null,//地图所在容器
	mapoptions:null,//地图初始化参数
	ovmapoptions:null,//鹰眼地图参数
	mapsr:null,//地图底图坐标系
	mearsuresr:null,//量算坐标系
	buffersr:null,//缓冲坐标系
	maptoolbars:null,//地图工具栏集合
	overviewMapDijit:null,//鹰眼控件对象
	scaleBarDijit:null,//比例尺控件对象
	popup:null,//地图TIP对象
	currentBaseMapName:"",//当前地图名称
	currentBaseMap:null,
	currentBaseMapLayers:[],//当前底图对象数组
	baseDMSLayers:[],//动态地图layer对象map
	baseDMSLayersInfo:[],//动态地图layerinfo对象map
	//鹰眼
	setOvMapOptions:function(options){
		if(typeof options!="undefined"){dojo.safeMixin(this.ovmapoptions,options);}
	},
	loadOVMap:function(){
    	if(this.overviewMapDijit){this.overviewMapDijit.destroy();}
    	if(typeof esri.dijit.OverviewMap!="undefined"){
	    	this.overviewMapDijit = new esri.dijit.OverviewMap({
			  map: this.map,
			  attachTo:this.ovmapoptions.attachTo,
			  height:this.ovmapoptions.height,
			  width:this.ovmapoptions.width,
			  visible:this.ovmapoptions.visible,
			  opacity:this.ovmapoptions.opacity,
			  color:this.ovmapoptions.color
			});
	        this.overviewMapDijit.startup();
        }
    },
    //比例尺
    loadScalebar:function(){
    	this.scaleBarDijit = new esri.dijit.Scalebar({
            map: this.map,
            scalebarUnit: "metric",
            attachTo:"bottom-left"
        });
    },
    //切换底图
    switchBaseLayer:function(name){
   		if(this.currentBaseMapName!=name){
	   		dojo.forEach(this.baseMap,function(basemap){
    			//移除当前的底图
    			dojo.forEach(this.currentBaseMapLayers, 
		        	function(layer) {
		        		this.map.removeLayer(layer);
		        	}
	        	,this);
    			this.currentBaseMapLayers=[];
    			//加载新的底图
				for(var i=0,il=basemap.urls.length;i<il;i=i+1){
					var tmplayer=null;
					tmplayer=new esri.layers.ArcGISTiledMapServiceLayer(basemap.urls[i],{id:basemap.name+"_"+i});
    				this.currentBaseMapLayers[this.currentBaseMapLayers.length]=tmplayer;
    				this.currentBaseMap=tmplayer;
	        		this.map.addLayer(tmplayer,i);
	        		if(i==il-1&&this.currentBaseMapName!=""){//重新加载鹰眼
	        			dojo.connect(tmplayer,"onLoad",this,function(){
	        				if(this.isShowOv) this.loadOVMap();
	        			});
	        		}
				}
	    	},this);
			this.currentBaseMapName=name;
   		}
    },
    //初始化动态地图服务信息
    initBaseDMSLayerInfo:function(servicename,opacity){
    	if(typeof this.baseDMSLayers[servicename]=="undefined"){
    		dojo.forEach(this.baseDMSUrls, 
	        	function(url) {
	        		if(servicename==url.servicename){
	        			var tmplayer=new esri.layers.ArcGISDynamicMapServiceLayer(url.url);
	        			if(typeof opacity != "undefined") tmplayer.setOpacity(opacity); 
	        			this.baseDMSLayers[servicename]=tmplayer;
	        			dojo.connect(tmplayer,"onLoad",this,function(layer){
	        				var tmplayerinfos=new Array();
	        				for(var i=0,il=layer.layerInfos.length;i<il;i=i+1){
	        					tmplayerinfos[layer.layerInfos[i].name]=layer.layerInfos[i];
	        				}
	        				this.baseDMSLayersInfo[servicename]=tmplayerinfos;
		        		});
	        		}
	        	}
		    ,this);
	    }
    },
    //获取动态地图图层对象
    getBaseDMSLayer:function(servicename){
    	if(typeof this.baseDMSLayers[servicename]!="undefined"){
    		return this.baseDMSLayers[servicename];
    	}else{
    		//alert("getBaseDMSLayer 错误提示：先调用initBaseDMSLayerInfo初始化图层");
    	}
    },
    //获取地图服务中图层ID
    getBaseDMSLayerId:function(servicename,layernames){
    	if(typeof this.baseDMSLayersInfo[servicename]!="undefined"){
	    	var layerids=[];
	   		dojo.forEach(layernames, function(layername){
	    		layerids.push(this.baseDMSLayersInfo[servicename][layername].id);
	    	}
	    	,this);
	   		return layerids;
   		}else{
   			//alert("getBaseDMSLayerId 错误提示：先调用initBaseDMSLayerInfo初始化图层");
   		}
    },
	//根据名称添加动态地图服务，必须在baseDMSUrls中已定义
	addLayerByName:function(name){
		dojo.forEach(this.baseDMSUrls, 
        	function(url) {
        		if(name==url.servicename){
        			this.addLayerByUrl("dynamic",url.url,url.servicename);
        			return;
        		}
        	}
        ,this);
	},
	//基本图层控制、底图切换
	//根据url添加地图服务
	addLayerByUrl:function(mapType,mapUrl,serviceName){
        var layer=null;
    	switch (mapType) {
            case "dynamic":
                layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapUrl);
        		if(typeof serviceName!=="undefined"&&serviceName!==""){this.baseDMSLayers[serviceName]=layer;}
                break;
            case "tiled":
                layer = new esri.layers.ArcGISTiledMapServiceLayer(mapUrl);
                break;
            default:
        }
        if(layer!=null) this.addLayer(layer);
    },
    addLayer:function(layer){
        this.map.addLayer(layer);
        this.map.hideZoomSlider();
        this.map.showZoomSlider();
    },
    //根据layerid移除图层
    removeLayerById:function(layerid){
    	if(this.map.getLayer(layerid)!=null){
			this.map.removeLayer(this.map.getLayer(layerid));
		}
    },
    resizeMap:function(){
    	this.map.reposition();
    	this.map.resize();
    },
    centerAndZoom:function(op){
       //地图放大缩小 定位
    	if(op.zoom && op.center){
    	  this.map.centerAndZoom(op.center, op.zoom)
    	  return this;
    	}
        if(op.zoom){
          this.map.setZoom(op.zoom)
    	  return this;
        }
    	if(op.center){
          this.map.centerAt(op.center);
    	  return this;
        }
    },
    scaleForMap:function(activity){
    	//地图缩放
    	var self=this;
    	if(!activity) return;
    	var currentScale= this.map.getZoom();
    	var minZoom=this.map.getMinZoom();
    	var maxZoom=this.map.getMaxZoom();
    	
    	switch(activity){
    	  case "top":
    		  currentScale++;
    		  setZoom();
    		  break;
    	  case "up":
    		  currentScale--;
    		  setZoom();
    		  break;  
    	}
    	function setZoom(){
    		 if(currentScale<=maxZoom && currentScale>=minZoom ){
    			 self.map.setZoom(currentScale);  
   		     }
    	}
    },
    //---------------------------
	//地图事件
	//onload
	onloadEventHandler:null,
	bindOnLoadEvent:function(callback){
		this.onloadEventHandler = dojo.connect(this.map, "onLoad", this, 
        	function(){
        		dojo.disconnect(this.onloadEventHandler);
				callback(this.map);
        	}
        );
	},
	bindChangeMouseModuleEvent:function(obj,m1,m2){
	   //更换鼠标样式 wangxl
		if(!obj) return;
		this.ChangeMouseModuleHandler1 = dojo.connect(obj, "onMouseMove", this, 
        	function(){
			    this.map.setMapCursor(m1);
        	}
        );
		this.ChangeMouseModuleHandler2 = dojo.connect(obj, "onMouseOut", this, 
        	function(){
				this.map.setMapCursor(m2);
        	}
        );
	}
});