dojo.declare("Triman.Map.AdvancedLayerCtrl", null, {//地图高级图层控制功能构件
	//构造函数
	constructor: function(trimanmap){
		//内部参数定义
		this.trimanmap=trimanmap;//Triman.Map
    	this._ctrlLy=null;//图层对象
    	this._ctrlHighlightLy=null;//高亮图层
		this._ctrlHighlightLyId="ctrlHighlightlayer_"+Math.ceil(Math.random()*10000);
		this._lp=null;//参数
		this._layerinfos=null;//来自地图服务的图层信息
		this._layeroptions=null;//图层自定义参数
		this._layerdefs=null;//图层属性过滤条件
		this._curshowlayerids=[];//当前显示的图层
		this._curquerylayerids=[];//当前查询的图层
		this._onMapMouseMoveHandler=null;//地图鼠标移动事件
		this._onMapClickHandler=null;//地图鼠标点击事件
		this._onHightLightMouseOverHandler=null;//高亮图形鼠标悬停事件
		this._onHightLightMouseOutHandler=null;//高亮图形鼠标离开事件
		this._onHightLightMouseClickHandler=null;
		this._onTipHideHandler=null;//关闭TIP窗口事件
		this._highlightgraphic=null;//高亮Graphic
		this._labelDivId="layerctl_label_div";
		this._labelOffsetX=0;
		this._labelOffsetY=-30;
		this._curMouseEventX = 0;
		this._curMouseEventY = 0;
		this._flashGra=null;
		this._flashCount=0;//闪烁计数器
		//内部函数定义
		this._flashGraphic=function(){//闪烁定位图形
			var _self=this;//很重要，解决变量作用范围问题
			if(this._flashCount%2==0) this._ctrlHighlightLy.add(this._flashGra);
			else this._ctrlHighlightLy.remove(this._flashGra);
			this._flashCount++;
			if(this._flashCount<=this._lp.flashTimes*2) window.setTimeout(function(){_self._flashGraphic();},this._lp.flashFrequency/2);
			else{
				this._flashCount=0;
				if(this._lp.isClickHighlight){//闪烁后保留highlight
					this._ctrlHighlightLy.add(this._flashGra);
					this._bindTipHide();
				}
			}
		}
		//绑定鼠标事件
    	this._bindMouseEvent=function(){
	    	if(this._lp.tipType=="hover"){
		    	//悬停查询
		    	try{setTimeout(this._bindMapMouseMoveEvent(),1000);}catch(e){}
	    	}else if(this._lp.tipType=="click"){
	    		this._bindMapMouseClickEvent();//点击查询
	    	}
	    },
	    //绑定地图鼠标移动事件
	    this._bindMapMouseMoveEvent=function(){
	    	this._onMapMouseMoveHandler=dojo.connect(this.trimanmap.map,"onMouseMove",this,this._queryByEvent);
	    },
	    //绑定地图鼠标点击事件
	    this._bindMapMouseClickEvent=function(){
	    	this._onMapClickHandler=dojo.connect(this.trimanmap.map,"onClick",this,this._queryByEvent);
	    },
	    //取消鼠标事件
	    this._cancelMouseEvent=function(){
	    	if(this._lp.tipType=="hover"){
	    		dojo.disconnect(this._onMapMouseMoveHandler);
	    	}else if(this._lp.tipType=="click"){
	    		dojo.disconnect(this._onMapClickHandler);
	    	}
	    },
	    //根据鼠标事件查询数据
	    this._queryByEvent=function(e){
	    	this._removeLabelDiv();
	    	this._resetCurQueryLayerIds();
	    	if(this._curquerylayerids.length>0){
	    		this._cancelMouseEvent();
	    		this._curMouseEventX = e.clientX;
				this._curMouseEventY = e.clientY;
	    		var mapPoint=new esri.geometry.Point(e.mapPoint.x,e.mapPoint.y,this.trimanmap.map.spatialReference);
	    		this._query(mapPoint);
	    	}
	    },
	    //查询关键方法
	    this._query=function(mapPoint){
	    	var identifyParams = new esri.tasks.IdentifyParameters();
	    	if(this._lp.customlayer!=null) identifyParams.dynamicLayerInfos = this._ctrlLy.dynamicLayerInfos;
			identifyParams.layerIds=this._curquerylayerids;
			identifyParams.geometry=mapPoint;
			identifyParams.height=this.trimanmap.map.height;
			identifyParams.width=this.trimanmap.map.width;
			identifyParams.mapExtent=this.trimanmap.map.extent;
			identifyParams.returnGeometry=true;
			identifyParams.tolerance=this._lp.tolerance;
			identifyParams.layerOption=esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
			identifyParams.layerDefinitions=this._layerdefs;//只在ArcGIS10及以后版本有效
			var identify=new esri.tasks.IdentifyTask(this._lp.layerServiceUrl);
			identify.execute(identifyParams);
			dojo.connect(identify, "onError",this,function(e){
				//alert(e.message());
			});
	        dojo.connect(identify, "onComplete",this, function(identifyResults){
				if (identifyResults.length>0) {
					var tmpgraphic,tmplabelgraphic;
					var r=identifyResults[0];
	        	 	var f=r.feature.attributes;
	        	 	var g=r.feature.geometry;
	        	 	var fs=[],titles=[],contents=[],tmpgraphics=[];
	        	 	//遍历结果
	        	 	dojo.forEach(identifyResults,function(r){
	        	 		var dfield=this._getDisplayfield(r.layerName),dfieldname=[];
	        	 		fs[fs.length]=r.feature;
	        	 		if(dfield!=""){
	        	 			fs[fs.length-1].attributes=this._transAttr(dfield,fs[fs.length-1].attributes);
	        	 			dfieldname=this._getFieldalias(r.layerName);
	        	 		}
	        	 		titles[titles.length]=Triman.Map.Util.attachTemplateToData(this._getTitle(r.layerName),[fs[fs.length-1].attributes],dfieldname);
	        	 		contents[contents.length]=Triman.Map.Util.attachTemplateToData(this._getContent(r.layerName),[fs[fs.length-1].attributes],dfieldname) + this._getAppendContent(r.layerName);
	        	 		tmpgraphics[tmpgraphics.length]=new esri.Graphic(r.feature.geometry,this._getHighLightSymbol(r.layerName),fs[fs.length-1].attributes,new esri.InfoTemplate(titles[titles.length-1], contents[contents.length-1]));
						if(!this._lp.isMultiFeatures) return false;
					},this);
	        	 	//生成高亮图形
	        	 	tmpgraphic=new esri.Graphic(g,this._getHighLightSymbol(r.layerName,g.type),fs[0],new esri.InfoTemplate(titles[0], contents[0]));
	       	 		this._ctrlHighlightLy.remove(this._flashGra);
	        	 	this._flashGra=new esri.Graphic(g,this._getFlashSymbol(r.layerName,g.type),fs,new esri.InfoTemplate(titles[0], contents[0]));
	        	 	if(this._lp.tipType=="hover"){//悬停时
	        	 		if(this._lp.isHoverLabel){
		        	 		var left=this._curMouseEventX+this._labelOffsetX;
		        	 		var top=this._curMouseEventY+this._labelOffsetY;
		        	 		if(g.type=="point"){
		        	 			var labelpoint= this.trimanmap.map.toScreen(g);
		        	 			left=labelpoint.x+this._labelOffsetX;
		        	 			top=labelpoint.y+this._labelOffsetY;
		        	 		}
		        	 		this._addLabelDiv("&nbsp;"+this._getLabelText(r.layerName,f)+"&nbsp;",left,top);
						}
						if(this._lp.isHoverHighlight) this._addHighlight(tmpgraphic);
	        	 	}else if(this._lp.tipType=="click"){//点击时
	        	 		var tipPoint=new esri.geometry.ScreenPoint(this._curMouseEventX,this._curMouseEventY);
	        	 		tipPoint=this.trimanmap.map.toMap(tipPoint);
	        	 		this._clickCallBack(tipPoint);
	        	 		if(this.trimanmap.map.infoWindow.clearFeatures)this.trimanmap.map.infoWindow.clearFeatures();
	        	 		//是否要显示多条信息
	        	 		if(this._lp.isMultiFeatures&&identifyResults.length>1){
	        	 			if(trimanmap.isPopUpTip){
	        	 				this.trimanmap.map.infoWindow.setFeatures(tmpgraphics);
	        	 			}else {
	        	 				this.trimanmap.map.infoWindow.setContent(tmpgraphics[0].infoTemplate.content);
	        	 				this.trimanmap.map.infoWindow.setTitle(tmpgraphics[0].infoTemplate.title);
	        	 			}
	        	 		}else{
	        	 			if(trimanmap.isPopUpTip) this.trimanmap.map.infoWindow.setFeatures(tmpgraphics);
	        	 			else this.trimanmap.map.infoWindow.setContent(tmpgraphics[0].infoTemplate.content);
	        	 			this.trimanmap.map.infoWindow.setTitle(titles[0]);
	        	 		}
	        	 		this.trimanmap.map.infoWindow.show(g.type=="point"?g:tipPoint);
	        	 		if(this._lp.isClickHighlight&&!this._lp.isClickFlash) this._addHighlight(tmpgraphic);
	        	 		if(this._lp.isClickFlash){
							this.trimanmap.map.reorderLayer(this._ctrlHighlightLy,99);
		        	 		this._flashGraphic();
		        	 	}
		    		}
				}else{
					this._ctrlHighlightLy.remove(this._highlightgraphic);
					this._ctrlHighlightLy.remove(this._flashGra);
					this._removeLabelDiv();
				}
				this._bindMouseEvent();
	        });
	    },
	    this._addLabelDiv=function(labeltext,left,top){
	    	Triman.Map.Util.createNode("div",
				{id:this._labelDivId,
					style:{
						position:"absolute",top:top+"px",left:left+"px","zIndex":9999,
						height:"20px","lineHeight":"20px",width:"auto",
						"background":"#FFFFE0",border:"solid 1px gray",filter:"alpha(opacity=100)",
						"fontFamily":'Microsoft YaHei',"fontSize":"14px","fontColor":"gray"
					}
			},this.trimanmap.map.root,"",labeltext);
	    },
	    this._removeLabelDiv=function(){
	    	var el=document.getElementById(this._labelDivId);
	    	if(el) this.trimanmap.map.root.removeChild(el);
	    },
	    this._addHighlight=function(gra){
			this.trimanmap.map.reorderLayer(this._ctrlHighlightLy,99);
	    	this._ctrlHighlightLy.add(gra);
       	 	this._ctrlHighlightLy.remove(this._highlightgraphic);
       	 	this._highlightgraphic=gra;
       	 	this._bindTipHide();
	    },
	    this._bindTipHide=function(){
	    	//关闭tip时隐藏各类信息
    		this._onTipHideHandler=dojo.connect(this.trimanmap.map.infoWindow,"onHide",this,function(){
	       		dojo.disconnect(this._onTipHideHandler);
	       		this._ctrlHighlightLy.remove(this._highlightgraphic);
	       		this._ctrlHighlightLy.remove(this._flashGra);
	       	});
	    },
	    this._getLabelText=function(name,f){
	    	if(this._layeroptions[name]!=null){
	    		return Triman.Map.Util.attachTemplateToData(this._layeroptions[name].label,[f]);
	    	}
	    	return "";
	   	},
	    this._getTitle=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].title!=null){
	    		return this._layeroptions[name].title;
	    	}
	    	return "信息";
	   	},
	    this._getContent=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].content!=null){
	    		return this._layeroptions[name].content;
	    	}
	    	return "${*}";
	   	},
	   	this._getAppendContent=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].append!=null){
	    		return this._layeroptions[name].append;
	    	}
	    	return "";
	   	},
	   	this._getWhere=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].where!=null){
	    		return this._layeroptions[name].where;
	    	}
	    	return " 1=1 ";
	   	},
	   	this._getDisplayfield=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].displayfield!=null){
	    		return this._layeroptions[name].displayfield;
	    	}
	    	return "";
	   	},
	   	this._getFieldalias=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].fieldalias!=null
	    		&&this._layeroptions[name].displayfield!=null){
	    		var fnames=this._layeroptions[name].fieldalias.split(",");
	    		var fields=this._layeroptions[name].displayfield.split(",");
	    		if(fnames.length>0){
	   				var newf=[];
		   			for(var i=0;i<fnames.length;i=i+1){
		   				newf[fields[i]]=fnames[i];
		   			}
	   				return newf;
	   			}
	    	}
	    	return [];
	   	},
	   	this._getHighLightSymbol=function(name,type){
	   		var op=this._layeroptions[name];
	   		if(type=="point"){
		   		if(op!=null&&op.imgUrl!=null&&op.imgUrl!=""){
		   			return new esri.symbol.PictureMarkerSymbol(op.imgUrl
		   				,(op.imgWidth==null||op.imgWidth==0)?24:op.imgWidth
		   				,(op.imgHeight==null||op.imgHeight==0)?24:op.imgHeight);
		   		}else{
		   			return Triman.Map.Graphic.defaultHighLightSymbol;
		   		}
	   		}else if (type=="polygon"||type=="extent"){
				return Triman.Map.Graphic.defaultHighLightFillSymbol;
			}else if(type=="polyline"){
				return Triman.Map.Graphic.defaultHighLightLineSymbol; 
			}
	   	},
	   	this._getFlashSymbol=function(name,type){
	   		var op=this._layeroptions[name];
	   		if(type=="point"){
		   		if(op!=null&&op.imgUrl!=null&&op.imgUrl!=""){
		   			return new esri.symbol.PictureMarkerSymbol(op.imgUrl
		   				,(op.imgWidth==null||op.imgWidth==0)?24:op.imgWidth
		   				,(op.imgHeight==null||op.imgHeight==0)?24:op.imgHeight);
		   		}else{
		   			return Triman.Map.Graphic.defaultFlashSymbol;
		   		}
	   		}else if (type=="polygon"||type=="extent"){
				return Triman.Map.Graphic.defaultFlashFillSymbol;
			}else if(type=="polyline"){
				return Triman.Map.Graphic.defaultFlashLineSymbol; 
			}
	   	},
	   	this._transAttr=function(field,f){
	   		var fields=field.split(",");
	   		if(fields.length>0){
	   			var newf=[];
	   			dojo.forEach(fields,function(fname){
	   				newf[fname.toUpperCase()]=f[fname.toUpperCase()];
		    	},this);
	   			return newf;
	   		}
	   		return f;
	   	},
	   	//设置自定义参数,不会刷新地图
	    this._setLayerOption=function(layeroption){
	    	if(layeroption!=null){
				if(typeof this._layerinfos[layeroption.name]!="undefined"){
	    			this._layeroptions[layeroption.name]=layeroption;
					this._layerdefs[this._layerinfos[layeroption.name].id]=this._getWhere(layeroption.name);
				}
	    	}
	    },
	    //重新设置需要空间查询的图层,根据地图级别
	   	this._resetCurQueryLayerIds=function(){
	   		this._curquerylayerids=[];
	   		var level=this.trimanmap.map.getLevel();
    		for(name in this._layeroptions){
    			var isshow=false;
    			for(var i=0;i<this._curshowlayerids.length;i=i+1){
    				if(this._layerinfos[name]&&this._layerinfos[name].id===this._curshowlayerids[i]){
    					isshow=true;
    					break;
    				}
    			}
    			if(!isshow) continue;
    			var layeroption=this._layeroptions[name];
    			var isquery=true;
   				if(typeof layeroption.isquery!="undefined"){
   					if(typeof layeroption.isquery=="boolean"){
   						isquery=layeroption.isquery;
   					}else if(layeroption.isquery[level]==null){
   						isquery=false;
   					}else{
		   				isquery=layeroption.isquery[level];
		   			}
				}
				if(isquery) this._curquerylayerids.push(this._layerinfos[layeroption.name].id);
   			}
	   	},
	   	this._clickCallBack=function(mapPoint){
	   		if(typeof this._lp.clickCallBack=="function") this._lp.clickCallBack(mapPoint);
	   	},
	   	this._init=function(){
	   		//初始化地图服务信息
	   		if(this._lp.customlayer!=null){
		   		dojo.forEach(this._ctrlLy.dynamicLayerInfos,function(layerinfo){
		   			this._layerinfos[layerinfo.name]=layerinfo;
		   		},this);
	   		}else{
	   			dojo.forEach(this._ctrlLy.layerInfos,function(layerinfo){
	   				this._layerinfos[layerinfo.name]=layerinfo;
	   			},this);
	   		}
	   		//初始化显示的图层
	   		if(this._lp.initShowLayerNames.length>0){
	   			dojo.forEach(this._lp.initShowLayerNames,function(name){
	   				if(typeof this._layerinfos[name]!="undefined"){
	    				this._lp.initShowLayerIds.push(this._layerinfos[name].id);
	    				this._curshowlayerids.push(this._layerinfos[name].id);
	   				}
	   			},this);
	   		}
	   		//初始化图层自定义参数
	   		if(this._lp.layerOptions.length>0){
	   			dojo.forEach(this._lp.layerOptions,function(layeroption){
	   				this._setLayerOption(layeroption);
	   			},this);
	   		}
	   		this._resetCurQueryLayerIds();
	   		if(this._curshowlayerids.length === 0){
				this._ctrlLy.setVisibleLayers([-1]);
			}else{
	    		this._ctrlLy.setVisibleLayers(this._curshowlayerids);
			}
	   		this._ctrlLy.setLayerDefinitions(this._layerdefs,true);
	   		this._ctrlLy.setDisableClientCaching(true);
	   		this._bindMouseEvent();
	   		this._ctrlLy.show();
	   	}
	},
	//外部方法定义
	//初始化图层控制
    initLayerCtrl:function(lp){
    	this._lp=lp;
    	this._layerinfos={};
    	this._layeroptions={};
    	this._layerdefs=[];
		if(this.trimanmap.map.getLayer(this._ctrlHighlightLyId)==null){
			this._ctrlHighlightLy=new esri.layers.GraphicsLayer({id:this._ctrlHighlightLyId,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._ctrlHighlightLy);
	       	//控制悬停鼠标样式
   			this._onHightLightMouseOverHandler=dojo.connect(this._ctrlHighlightLy,"onMouseOver",this,function(){
	       		this.trimanmap.map.setMapCursor('pointer');
	       	});
	       	this._onHightLightMouseOutHandler=dojo.connect(this._ctrlHighlightLy,"onMouseOut",this,function(){
	       		this.trimanmap.map.setMapCursor('default');
	       	});
	       	this._onHightLightMouseClickHandler=dojo.connect(this._ctrlHighlightLy,"onClick",this,function(e){
	       		this._clickCallBack(e.mapPoint);
	       	});
		}
		if(this._lp.layerServiceName!=""||this._lp.layerServiceUrl!=""){
	   		if(this._lp.layerServiceName!=null&&this._lp.layerServiceName!=""){
	   			dojo.forEach(this.trimanmap.baseDMSUrls, 
		        	function(url){
		        		if(this._lp.layerServiceName==url.servicename)this._lp.layerServiceUrl=url.url;
		        	}
		        ,this);
			}
   		}
		if(this._lp.customlayer!=null){//自定义图层
			this._ctrlLy=this._lp.customlayer;
	   		this.trimanmap.map.addLayer(this._ctrlLy);
			this._init();
		}else{
	    	this._ctrlLy=new esri.layers.ArcGISDynamicMapServiceLayer(this._lp.layerServiceUrl,{visible:false,opacity:this._lp.opacity});
	   		this.trimanmap.map.addLayer(this._ctrlLy);
	   		dojo.connect(this._ctrlLy,"onLoad",this,function(){
	    		this._init();
	   		});
		}
    },
    //根据id设置图层显示
    setVisibleLayersByIds:function(layerids){
    	this._curshowlayerids=layerids;
    	if(this._curshowlayerids.length === 0){
			this._ctrlLy.setVisibleLayers([-1]);
		}else{
    		this._ctrlLy.setVisibleLayers(this._curshowlayerids);
		}
    	this._cancelMouseEvent();
    	this._resetCurQueryLayerIds();
    	this._bindMouseEvent();
    	this._ctrlHighlightLy.remove(this._highlightgraphic);
		this._ctrlHighlightLy.remove(this._labelgraphic);
    	this.trimanmap.map.infoWindow.hide();
    },
    //根据名称设置图层显示
    setVisibleLayersByNames:function(layernames){
    	var layerids=dojo.map(layernames, function(layername){ 
    		if(this._layerinfos[layername]) return this._layerinfos[layername].id;
    	},this);
    	this.setVisibleLayersByIds(layerids);
    },
    //重新设置多个自定义参数,并刷新地图
    resetLayerOptions:function(layeroptions){
    	this._layeroptions={};
    	if(layeroptions.length>0){
   			dojo.forEach(layeroptions,function(layeroption){
   				this._setLayerOption(layeroption);
   			},this);
   		}
   		this._resetCurQueryLayerIds();
   		this._ctrlLy.setLayerDefinitions(this._layerdefs,false);
    },
    //获取图层对象
    getCtrlLayer:function(){
    	return this._ctrlLy;
    },
    refreshLayer:function(){
    	this._ctrlLy.refresh();
    },
    clearHighLight:function(){
    	if(this._ctrlHighlightLy) this._ctrlHighlightLy.clear();
    },
    //销毁图层控制
    destroyLayerCtrl:function(){
		dojo.disconnect(this._onMapMouseMoveHandler);
		dojo.disconnect(this._onMapClickHandler);
		dojo.disconnect(this._onTipHideHandler);
		dojo.disconnect(this._onHightLightMouseOverHandler);
		dojo.disconnect(this._onHightLightMouseOutHandler);
		dojo.disconnect(this._onHightLightMouseClickHandler);
		this._ctrlHighlightLy.remove(this._highlightgraphic);
		this._ctrlHighlightLy.remove(this._labelgraphic);
    	this.trimanmap.map.removeLayer(this._ctrlLy);
    	this.trimanmap.map.removeLayer(this._ctrlHighlightLy);
    	this._ctrlLy=null;
    	this._ctrlHighlightLy=null;
		this._lp=null;
		this._layerinfos=null;
		this._layeroptions=null;
		this._layerdefs=null;
		this._curshowlayerids=[];
		this._curquerylayerids=[];
		this._onMapMouseMoveHandler=null;
		this._onMapClickHandler=null;
		this._onTipHideHandler=null;
		this._onHightLightMouseOverHandler=null;
		this._onHightLightMouseOutHandler=null;
		this._onHightLightMouseClickHandler=null;
		this._highlightgraphic=null;
		this._labelgraphic=null;
		this._labelsymol=null;
    }
});

//地图高级图层控制功能构件,使用featurelayer实现，地图服务要求ArcGIS10.0及以上
dojo.declare("Triman.Map.FeatrueLayerCtrl", null, {
	constructor: function(trimanmap){
		dojo.require("esri.layers.FeatureLayer");
		//内部变量
		this.trimanmap=trimanmap;//Triman.Map
    	this._ctrlLy=[];//图层对象数组
    	this._ctrlHighlightLy=null;//高亮图层
		this._ctrlHighlightLyId="ctrlHighlightlayer_"+Math.ceil(Math.random()*10000);
		this._lp=null;//参数
		this._layerinfos=null;//来自地图服务的图层信息
		this._layeroptions=null;//图层自定义参数
		this._layerdefs=null;//图层属性过滤条件
		this._curshowlayer=[];//当前显示的图层
		this._onTipHideHandler=null;
		this._labelDivId="featurelayerctl_label_div";
		this._labelOffsetX=0;
		this._labelOffsetY=-30;
		this._highlightgraphic=null;//高亮或者闪烁的图形
		this._flashCount=0;//闪烁计数器
		this._flashGraphic=function(){//闪烁定位图形
			var _self=this;//很重要，解决变量作用范围问题
			if(this._flashCount%2==0) this._ctrlHighlightLy.add(this._highlightgraphic);
			else this._ctrlHighlightLy.remove(this._highlightgraphic);
			this._flashCount++;
			if(this._flashCount<=this._lp.flashTimes*2) window.setTimeout(function(){_self._flashGraphic();},this._lp.flashFrequency/2);
			else{
				this._flashCount=0;
				if(this._lp.isClickHighlight){//闪烁后保留highlight
					this._ctrlHighlightLy.add(this._highlightgraphic);
					this._bindTipHide();
				}
			}
		}
		//内部方法
	    this._addLabelDiv=function(labeltext,left,top){
	    	Triman.Map.Util.createNode("div",
				{id:this._labelDivId,
					style:{
						position:"absolute",top:top+"px",left:left+"px","zIndex":9999,
						height:"auto","lineHeight":"20px",width:"auto",
						"background":"#FFFFE0",border:"solid 1px gray",filter:"alpha(opacity=100)",
						"fontFamily":'Microsoft YaHei',"fontSize":"14px","fontColor":"gray"
					}
			},this.trimanmap.map.root,"",labeltext);
	    },
	    this._removeLabelDiv=function(){
	    	var el=document.getElementById(this._labelDivId);
	    	if(el) this.trimanmap.map.root.removeChild(el);
	    },
	    this._addHighlight=function(gra){
			this.trimanmap.map.reorderLayer(this._ctrlHighlightLy,99);
	    	this._ctrlHighlightLy.add(gra);
       	 	this._ctrlHighlightLy.remove(this._highlightgraphic);
       	 	this._highlightgraphic=gra;
       	 	this._bindTipHide();
	    },
	    this._bindTipHide=function(){
	    	//关闭tip时隐藏各类信息
    		this._onTipHideHandler=dojo.connect(this.trimanmap.map.infoWindow,"onHide",this,function(){
	       		dojo.disconnect(this._onTipHideHandler);
	       		this._ctrlHighlightLy.remove(this._highlightgraphic);
	       	});
	    },
	    this._setLayerOption=function(layeroption){
	    	if(layeroption!=null){
				if(typeof this._layerinfos[layeroption.name]!="undefined"){
	    			this._layeroptions[layeroption.name]=layeroption;
					this._layerdefs[this._layerinfos[layeroption.name].id]=this._getWhere(layeroption.name);
				}
	    	}
	    },
	   	this._getLabelText=function(name,f){
	    	if(this._layeroptions[name]!=null){
	    		return Triman.Map.Util.attachTemplateToData(this._layeroptions[name].label,[f]);
	    	}
	    	return "";
	   	},
	   	this._getTitle=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].title!=null){
	    		return this._layeroptions[name].title;
	    	}
	    	return "信息";
	   	},
	    this._getContent=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].content!=null){
	    		return this._layeroptions[name].content;
	    	}
	    	return "${*}";
	   	},
	   	this._getAppendContent=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].append!=null){
	    		return this._layeroptions[name].append;
	    	}
	    	return "";
	   	},
	   	this._getWhere=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].where!=null){
	    		return this._layeroptions[name].where;
	    	}
	    	return " 1=1 ";
	   	},
	   	this._getDisplayfield=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].displayfield!=null){
	    		return this._layeroptions[name].displayfield;
	    	}
	    	return "";
	   	},
	   	this._getFieldalias=function(name){
	    	if(this._layeroptions[name]!=null&&this._layeroptions[name].fieldalias!=null
	    		&&this._layeroptions[name].displayfield!=null){
	    		var fnames=this._layeroptions[name].fieldalias.split(",");
	    		var fields=this._layeroptions[name].displayfield.split(",");
	    		if(fnames.length>0){
	   				var newf=[];
		   			for(var i=0;i<fnames.length;i=i+1){
		   				newf[fields[i]]=fnames[i];
		   			}
	   				return newf;
	   			}
	    	}
	    	return [];
	   	},
	   	this._getHighLightSymbol=function(name,type){
	   		var op=this._layeroptions[name];
	   		if(type=="point"){
		   		if(op!=null&&op.imgUrl!=null&&op.imgUrl!=""){
		   			return new esri.symbol.PictureMarkerSymbol(op.imgUrl
		   				,(op.imgWidth==null||op.imgWidth==0)?24:op.imgWidth
		   				,(op.imgHeight==null||op.imgHeight==0)?24:op.imgHeight);
		   		}
	   		}else if (type=="polygon"||type=="extent"){
				return Triman.Map.Graphic.defaultHighLightFillSymbol;
			}else if(type=="polyline"){
				return Triman.Map.Graphic.defaultHighLightLineSymbol; 
			}else if(type=="point"||type=="multipoint"){
				return Triman.Map.Graphic.defaultHighLightSymbol;
			}
	   	},
	   	this._transAttr=function(field,f){
	   		var fields=field.split(",");
	   		if(fields.length>0){
	   			var newf=[];
	   			dojo.forEach(fields,function(fname){
	   				newf[fname.toUpperCase()]=f[fname.toUpperCase()];
		    	},this);
	   			return newf;
	   		}
	   		return f;
	   	},
	   	this._clickCallBack=function(mapPoint){
	   		if(typeof this._lp.clickCallBack=="function") this._lp.clickCallBack(mapPoint);
	   	}
	},
	//外部方法定义
	initLayerCtrl:function(lp){
		this._lp=lp;
    	this._layerinfos={};
    	this._layeroptions={};
    	this._layerdefs=[];
    	if(this.trimanmap.map.getLayer(this._ctrlHighlightLyId)==null){
			this._ctrlHighlightLy=new esri.layers.GraphicsLayer({id:this._ctrlHighlightLyId,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._ctrlHighlightLy);
			//控制悬停鼠标样式
   			this._onHightLightMouseOverHandler=dojo.connect(this._ctrlHighlightLy,"onMouseOver",this,function(){
	       		this.trimanmap.map.setMapCursor('pointer');
	       	});
	       	this._onHightLightMouseOutHandler=dojo.connect(this._ctrlHighlightLy,"onMouseOut",this,function(){
	       		this.trimanmap.map.setMapCursor('default');
	       	});
	       	this._onHightLightMouseOutHandler=dojo.connect(this._ctrlHighlightLy,"onClick",this,function(e){
	       		this._clickCallBack(e.mapPoint);
	       	});
		}
		if(this._lp.layerServiceName!=""||this._lp.layerServiceUrl!=""){
			if(this._lp.layerServiceName!=null&&this._lp.layerServiceName!=""){
    			dojo.forEach(this.trimanmap.baseDMSUrls, 
		        	function(url){
		        		if(this._lp.layerServiceName==url.servicename)this._lp.layerServiceUrl=url.url;
		        	}
		        ,this);
    		}
    		var tmpLy=new esri.layers.ArcGISDynamicMapServiceLayer(this._lp.layerServiceUrl,{visible:false,opacity:0});
    		dojo.connect(tmpLy,"onLoad",this,function(){
    			//初始化地图服务信息
	    		dojo.forEach(tmpLy.layerInfos,function(layerinfo){
	    			this._layerinfos[layerinfo.name]=layerinfo;
	    		},this);
	    		//初始化显示的图层
	    		if(this._lp.initShowLayerNames.length>0){
	    			dojo.forEach(lp.initShowLayerNames,function(name){
	    				if(typeof this._layerinfos[name]!="undefined"){
		    				this._lp.initShowLayerIds.push(this._layerinfos[name].id);
		    				this._curshowlayer.push({"id":this._layerinfos[name].id,"name":name});
	    				}
	    			},this);
	    		}
	    		//初始化图层自定义参数
	    		if(this._lp.layerOptions.length>0){
	    			dojo.forEach(this._lp.layerOptions,function(layeroption){
	    				this._setLayerOption(layeroption);
	    			},this);
	    		}
	    		this.setVisibleLayers();
    		});
		}
	},
	setVisibleLayers:function(){
		for(var i=0;i<this._ctrlLy.length;i++){
			this.trimanmap.map.removeLayer(this._ctrlLy[i]);
		}
		this._ctrlLy=[];
		dojo.forEach(this._curshowlayer,function(layer){
			var featurelayer=new esri.layers.FeatureLayer(this._lp.layerServiceUrl+"/"+layer.id,
			  	{id:"featrue_"+layer.id,mode:esri.layers.FeatureLayer.MODE_ONDEMAND,outFields: ["*"],displayOnPan:!dojo.isIE});
	    	this.trimanmap.map.addLayer(featurelayer);
			dojo.connect(featurelayer,"onMouseOver",this,function(e){//鼠标hover事件
	       		this.trimanmap.map.setMapCursor('pointer');
				if(this._lp.isHoverLabel){
	       			var gra=e.graphic;
	       			var g=e.graphic.geometry;
	       			var left=e.clientX+this._labelOffsetX;
	       			var top=e.clientY+this._labelOffsetY;
	       			if(g.type=="point"){
        	 			var labelpoint= this.trimanmap.map.toScreen(g);
        	 			left=labelpoint.x+this._labelOffsetX;
        	 			top=labelpoint.y+this._labelOffsetY;
        	 		}
	       			this._removeLabelDiv();
					this._addLabelDiv("&nbsp;"+this._getLabelText(gra.getLayer().name,gra.attributes)+"&nbsp;",left,top);
				}
	       	});
	       	dojo.connect(featurelayer,"onMouseOut",this,function(e){
	       		this.trimanmap.map.setMapCursor('default');
	       		this._removeLabelDiv();
	       	});
	       	if(this._lp.tipType=="click"){
	       		dojo.connect(featurelayer,"onClick",this,function(e){
	       			this._clickCallBack(e.mapPoint);
	       			var gra=e.graphic,layerName=gra.getLayer().name;
	       			var dfield=this._getDisplayfield(layerName),dfieldname=[];
	       			var attr=gra.attributes,title="",content="";
        	 		if(dfield!=""){
        	 			attr=this._transAttr(dfield,attr);
        	 			dfieldname=this._getFieldalias(layerName);
        	 		}
        	 		title=Triman.Map.Util.attachTemplateToData(this._getTitle(layerName),[attr],dfieldname);
        	 		content=Triman.Map.Util.attachTemplateToData(this._getContent(layerName),[attr],dfieldname) + this._getAppendContent(layerName);
	        	 	this.trimanmap.map.infoWindow.setTitle(title);
	        	 	this.trimanmap.map.infoWindow.setContent(content);
	        	 	this.trimanmap.map.infoWindow.show(e.mapPoint);
	       			var tmpgraphic=new esri.Graphic(gra.geometry,this._getHighLightSymbol(layerName,gra.geometry.type),attr,new esri.InfoTemplate(title, content));
	        	 	if(this._lp.isClickHighlight&&!this._lp.isClickFlash) this._addHighlight(tmpgraphic);
	        	 	if(this._lp.isClickFlash){
						this.trimanmap.map.reorderLayer(this._ctrlHighlightLy,99);
       	 				if(this._highlightgraphic) this._ctrlHighlightLy.remove(this._highlightgraphic);
	        	 		this._highlightgraphic=tmpgraphic;
	        	 		this._flashGraphic();
	        	 	}
	       		});
	       	}
			this._ctrlLy.push(featurelayer);
		},this);
		this.refreshLayer();
	},
	setVisibleLayersByName:function(layernames){//根据图层中文名称设置图层显示
		this._curshowlayer=[];
		dojo.forEach(layernames,function(layername){
			this._curshowlayer.push({"id":this._layerinfos[layername].id,"name":layername});
		},this);
		this.setVisibleLayers();
	},
	refreshLayer:function(){//刷新图层显示
		var level=this.trimanmap.map.getLevel();
		dojo.forEach(this._ctrlLy,function(layer){
			var layeroption=this._layeroptions[layer.name];
			if(layeroption.showlevel&&!layeroption.showlevel[level]){
				layer.setVisibility(false);
			}else{
				layer.setVisibility(true);
			}
		},this);
		this._removeLabelDiv();
	}
});

dojo.declare("Triman.Map.LayersParam", null, {//地图高级图层控制参数类
	tipType:"click",//hover、click、none，使用featurelayer时只有click、none
	customlayer:null,//图层对象,优先级比layerServiceName高，arcgis10.1后的动态添加非MXD配置的图层
	layerServiceName:"",//地图服务名称，需要在Triman.Map下的baseDMSUrls定义过，优先级比layerServiceUrl高
	layerServiceUrl:"",//地图URL
	layerOptions:null,//图层自定义参数数组
	initShowLayerNames:[],//初始化显示的图层名称，优先级高
	initShowLayerIds:[],//初始化显示的图层ID
	tolerance:10,//查询范围大小，单位：像素
	isHoverHighlight:true,//悬停时是否高亮
	isHoverLabel:true,//悬停时是否显示标注
	isClickHighlight:true,//点击时是否高亮
	isClickFlash:false,//点击时是否高亮闪烁
	flashFrequency:1000,//闪烁频率
	flashTimes:2,//闪烁次数
	isMultiFeatures:true,//当点击位置有多个信息时，是否允许在Popup中显示多个，只有tipType为"click"时才有效
	clickCallBack:null,//鼠标点击回调函数，返回mapPoint
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});

dojo.declare("Triman.Map.LayerOption", null, {//单个图层自定义参数
	name:"",//图层名称
	label:"",//鼠标悬停时，标注显示的内容
	title:"信息",//tip的标题
	content:"${*}",//tip的内容
	append:"",//tip的附加内容，不支持模版
	where:"1=1",//图层过滤条件
	displayfield:null,//自定义需要显示字段
	fieldalias:null,//自定义显示字段的别名
	isquery:true,//是否允许地图悬停和点击查询true或者{0:true,1:false}
	showlevel:{},//显示级别控制{0:true,1:false}
	imgUrl:"",//悬停时高亮的图标
	imgWidth:24,
	imgHeight:24,
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});