dojo.declare("Triman.Map.Locate", null, {//地图定位、分布功能构件
	//构造方法
	constructor: function(trimanmap){
		//内部参数定义
		this.trimanmap=trimanmap;//Triman.Map
		this._locateLy=null;
		this._locateLyId="locatelayer";
		this._clusterLy=null;
		this._clusterLyId="clusterlayer";
		this._tolence=10;
		this._keyDownHandler=null;
		this._onMapExtentChangeHandler=null;
		this._onTipHideHandler=null;
		this._catoIds={};
		this._lp=null;
		this._labelDivId="locate_label_div";
		this._labelOffsetX=0;
		this._labelOffsetY=-30;
		this._labelstyle={
						position:"absolute",top:"0px",left:"0px","zIndex":9999,
						height:"20px","lineHeight":"20px",width:"auto",
						"background":"#FFFFE0",border:"solid 1px gray",filter:"alpha(opacity=100)",
						"fontFamily":'Microsoft YaHei',"fontSize":"14px","fontColor":"gray"
					};
		this._flashGra=[];//被闪烁的图形
		this._flashCount=0;//闪烁计数器
		this._hlgra=null;//高亮图形
		this._flashGraphic=function(){//闪烁定位图形
			var _self=this;//很重要，解决变量作用范围问题
			if(this._flashCount%2==0) dojo.forEach(this._flashGra,function(gra){this._locateLy.add(gra)},this);
			else dojo.forEach(this._flashGra,function(gra){this._locateLy.remove(gra)},this);
			this._flashCount++;
			if(this._flashCount<=this._lp.flashTimes*2) window.setTimeout(function(){_self._flashGraphic();},this._lp.flashFrequency/2);
			else{
				this._flashGra=[];
				this._flashCount=0;
			}
		};
		this._reorderDrawLayer=function(index){
			this.trimanmap.map.reorderLayer(this._locateLy,index);
		};
		//内部方法
	    this._addLabelDiv=function(labeltext,left,top){
	    	this._labelstyle.left=left+"px";
	    	this._labelstyle.top=top+"px";
	    	Triman.Map.Util.createNode("div",{id:this._labelDivId,style:this._labelstyle},this.trimanmap.map.root,"",labeltext);
	    };
	    this._removeLabelDiv=function(){
	    	var el=document.getElementById(this._labelDivId);
	    	if(el) this.trimanmap.map.root.removeChild(el);
	    };
	    this._bindHideTip=function(){
			this._onTipHideHandler=dojo.connect(this.trimanmap.map.infoWindow,"onHide",this,function(){
	       		dojo.disconnect(this._onTipHideHandler);
	       		if(this._hlgra) this._locateLy.remove(this._hlgra);
	       	});
	    }
		//初始化图层
		if(this.trimanmap.map.getLayer(this._locateLyId)==null){
			this._locateLy=new esri.layers.GraphicsLayer({id:this._locateLyId,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._locateLy);
		}else{
			this._locateLy=this.trimanmap.map.getLayer(this._locateLyId);
		}
		//dojo.require("js.Triman.Map.extras.ClusterLayer");
	    dojo.connect(this._locateLy,"onMouseOver",this,function(e){//鼠标hover事件
       		this.trimanmap.map.setMapCursor('pointer');
   			var gra=e.graphic;
   			var g=e.graphic.geometry;
   			if(gra.attributes.label&&gra.attributes.label!=""){
	   			var left=e.clientX+this._labelOffsetX;
	   			var top=e.clientY+this._labelOffsetY;
	   			if(g.type=="point"){
	   	 			var labelpoint= this.trimanmap.map.toScreen(g);
	   	 			left=labelpoint.x+this._labelOffsetX;
	   	 			top=labelpoint.y+this._labelOffsetY;
	   	 		}
				this._addLabelDiv("&nbsp;"+Triman.Map.Util.attachTemplateToData(gra.attributes.label,[gra.attributes])+"&nbsp;",left,top);
			}
       	});
		dojo.connect(this._locateLy,"onMouseOut",this,function(e){
       		this.trimanmap.map.setMapCursor('default');
       		this._removeLabelDiv();
       	});
	},
	//定位、分布
	locate:function(locatepara){
		//var margin=this.trimanmap.map.extent.getWidth()/this.trimanmap.map.width*this._tolence;
		this._lp=locatepara;
		if(typeof this._lp.isTop=="undefined"||this._lp.isTop) this._reorderDrawLayer(99);
		var margin=0.002;
		var zoomExtent=null,locateGeometry,locateExtent,locateGraphics=[];
		var tipPoint,locateTitle,locateContent;
		var tmpcatoId={};
		this._catoIds["catoId"]=[];
		dojo.forEach(locatepara.locateObjects,
			function(locobj){
				var symbol;
				locateTitle=locobj.attributes.title?locobj.attributes.title:"";
				locateContent=locobj.attributes.content?locobj.attributes.content:"";
				if(locobj.x!=null&&locobj.y!=null){//判断是否坐标定位
					locateGeometry=new esri.geometry.Point(locobj.x, locobj.y,this.trimanmap.map.spatialReference);
				}else if(locobj.geometry!=null){
					locateGeometry=locobj.geometry;
				}else{
					return;
				}
				//设置样式
				if(typeof locatepara.isShowImg=="undefined"||locatepara.isShowImg){
					if(locobj.symbol&&typeof locobj.symbol!="undefined"){
						symbol=locobj.symbol;
					}else{
						if(locateGeometry.type=="point"){
							if(locobj.imgUrl&&locobj.imgUrl!=""){
								symbol=new esri.symbol.PictureMarkerSymbol(locobj.imgUrl,locobj.imgWidth,locobj.imgHeight);
								symbol.setOffset(locobj.imgOffsetX, locobj.imgOffsetY);
							}else if(locobj.x!=null&&locobj.y!=null){
								symbol=Triman.Map.Graphic.getDefaultXYLocateSymbol();
							}
						}else if(locobj.geometry!=null){
							//根据不同的形状获取样式
							symbol=Triman.Map.Graphic.getDefaultLocateSymbol(locobj.geometry.type);
						}
					}
				}
				//获取当前范围
                if(locateGeometry.type=="point"){
                	tipPoint=locateGeometry;
                	locateExtent=new esri.geometry.Extent(eval(locateGeometry.x) - eval(margin), 
		                		eval(locateGeometry.y) - eval(margin), 
		                		eval(locateGeometry.x) + eval(margin), 
		                		eval(locateGeometry.y) + eval(margin), this.trimanmap.map.spatialReference);
                }else{
                	if(locateGeometry.type=="extent"){
                		locateExtent=locateGeometry;
                	}else{
                		locateExtent=locateGeometry.getExtent();
                	}
                	if(locateGeometry.type=="polyline"){
                		tipPoint=locateGeometry.getPoint(0,0);
                	}else{
                		tipPoint=locateExtent.getCenter();
                	}
                }
                //获取分布最大范围
                if(zoomExtent==null) zoomExtent=locateExtent;
                zoomExtent=zoomExtent.union(locateExtent);
				//生成Graphic
				var gra=new esri.Graphic(locateGeometry, symbol);
				if(locateTitle!=""||locateContent!=""){
					var infoTemplate=esri.InfoTemplate(locateTitle,locateContent);
					gra.setInfoTemplate(infoTemplate);
				}
               	gra.setAttributes(locobj.attributes);
               	locateGraphics.push(gra);
               	if(locatepara.isFlash) this._flashGra.push(gra);
               	//获取分类标识
               	if(tmpcatoId[locobj.attributes.catoId]==null){
               		this._catoIds["catoId"].push(locobj.attributes.catoId);
               	}
               	tmpcatoId[locobj.attributes.catoId]=1;
			}
		,this);
		if(locateGraphics.length>0){
			if(this.trimanmap.map.infoWindow.clearFeatures)this.trimanmap.map.infoWindow.clearFeatures();
			this.trimanmap.map.infoWindow.hide();
			if(locatepara.isClear){//清除之前相同catoId的数据
				this.clear(this._catoIds);
			}
			//添加图形
			if(locatepara.isFlash) this._flashGraphic();
			else dojo.forEach(locateGraphics,function(gra){this._locateLy.add(gra)},this);
			
	        if(locatepara.locateObjects.length&&locatepara.locateObjects.length==1){
				if(locatepara.isShowTip){//显示tip
					this._hlgra=locateGraphics[0];
		            this.trimanmap.map.infoWindow.setTitle(
		            	Triman.Map.Util.attachTemplateToData(locateTitle,[locatepara.locateObjects[0].attributes]));
		            this.trimanmap.map.infoWindow.setContent(
	            		Triman.Map.Util.attachTemplateToData(locateContent,[locatepara.locateObjects[0].attributes]));
					if(typeof locatepara.tipAnchor!="undefined") this.trimanmap.map.infoWindow.anchor=locatepara.tipAnchor;
					if(locatepara.isCenter||locatepara.isZoom||locatepara.zoomLevel!=null){//等待地图范围变更后再显示tip窗口
						this._onMapExtentChangeHandler=dojo.connect(this.trimanmap.map,"onExtentChange",this,function(){
							dojo.disconnect(this._onMapExtentChangeHandler);
							this.trimanmap.map.infoWindow.show(tipPoint);
							if(locatepara.isHideHighlight) this._bindHideTip();
						});
					}else{
						this.trimanmap.map.infoWindow.show(tipPoint);
						if(locatepara.isHideHighlight) this._bindHideTip();
					}
				}
			}
			//地图范围控制
			if(locatepara.isCenter&&locatepara.zoomLevel!=null){
				this.trimanmap.map.centerAndZoom(zoomExtent.getCenter(),locatepara.zoomLevel);
			}else{
				if(locatepara.isCenter){
					this.trimanmap.map.centerAt(zoomExtent.getCenter());
				}
				if(locatepara.zoomLevel!=null){
					this.trimanmap.map.setLevel(locatepara.zoomLevel);
				}else if(locatepara.isZoom){
					var tmpef=1.5;
					if(locatepara.expandFactor) tmpef=locatepara.expandFactor;
					this.trimanmap.map.setExtent(zoomExtent.expand(tmpef));
				}
			}
		}
	},
	//聚合分布
	clusterLocate:function(cp){
		this.trimanmap.removeLayerById(this._clusterLyId);
		dojo.disconnect(this._keyDownHandler);
		var options={ 
          "data":cp.locateObjects,
          "distance":cp.distance,
          "id": "clusters", 
          "labelColor":cp.labelColor,
          "labelOffset":cp.labelOffset,
          "resolution": this.trimanmap.map.extent.getWidth() / this.trimanmap.map.width,
          "singleColor": cp.singleColor,
          "singleTemplate": cp.singleTemplate,
          "spatialReference":(cp.spatialReference==null?this.trimanmap.mapsr:cp.spatialReference),
          "maxSingles":cp.maxSingles,
          id:this._clusterLyId,displayOnPan:!dojo.isIE
        };
		this._clusterLy = new Triman.Map.extras.ClusterLayer(options);
		//定义样式
		var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(4);
        var renderer = new esri.renderer.ClassBreaksRenderer(defaultSym,"clusterCount");
		dojo.forEach(cp.breaks,function(breakinfo){renderer.addBreak(breakinfo);});
        this._clusterLy.setRenderer(renderer);
        //添加图层
        this.trimanmap.map.addLayer(this._clusterLy,99);
        if(cp.isZoom) this.trimanmap.map.setExtent(this._clusterLy.zoomExtent.expand(2));
        //键盘按ESC取消普通的撒点
        this._keyDownHandler=dojo.connect(this.trimanmap.map, "onKeyDown",this,function(e){
			if(e.keyCode==27){ this._cleanCluster();}
        });
	},
	//清楚指定的定位信息
	clear:function(clearIds){
		if(typeof clearIds!="undefined"){
			Triman.Map.Util.deleteGra(clearIds,this.trimanmap.map,this._locateLyId);
			this.trimanmap.map.infoWindow.hide();
		}else{
			this._locateLy.clear();
			dojo.disconnect(this._keyDownHandler);
			this.trimanmap.removeLayerById(this._clusterLyId);
			this.trimanmap.map.infoWindow.hide();
		}
		if(this.trimanmap.map.infoWindow.clearFeatures)this.trimanmap.map.infoWindow.clearFeatures();
	},
	//清楚单个聚合下的撒点
	_cleanCluster:function() {
		this.trimanmap.map.infoWindow.hide();
		this._clusterLy.clearSingles();
    }
});
dojo.declare("Triman.Map.LocateObject", null, {
	x:null,
	y:null,
	geometry:null,
	attributes:{
		markId:null,
		catoId:"locate",
		title:"信息",
		content:"",
		label:""
	},
	imgUrl:"",
	imgWidth:null,
	imgHeight:null,
	imgOffsetX:null,
	imgOffsetY:null,
	symbol:null,
	constructor: function(json){
		this.imgUrl=Triman.Map.Graphic.defaultImageUrl;
		this.imgWidth=Triman.Map.Graphic.defaultImageWidth;
		this.imgHeight=Triman.Map.Graphic.defaultImageHeight;
		this.imgOffsetX=Triman.Map.Graphic.defaultImageOffsetX;
		this.imgOffsetY=Triman.Map.Graphic.defaultImageOffsetY;
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});
dojo.declare("Triman.Map.LocateParam", null, {
	locateObjects:null,//需要定位的信息
	isCenter:true,//是否将定位信息居中
	isZoom:true,//是否自动放大地图
	zoomLevel:null,//地图放大级别
	isClear:true,//是否清除之前相同种类的定位元素
	isShowTip:true,//当单个定位时，是否直接显示tip信息
	isHideHighlight:false,//当单个定位时,关闭tip后是否清除高亮图形
	tipAnchor:"auto",//tip内容显示的位置"auto","left","right","top","bottom"
	isShowImg:true,//定位、分布时是否显示图标
	isFlash:false,//定位图形是否闪烁
	flashFrequency:1000,//闪烁频率
	flashTimes:3,//闪烁次数
	isTop:true,//每次定位是否保证图形在最上面
	expandFactor:1.5,//自动放大时的外扩系数
	constructor: function(jsonArray){
		if(typeof jsonArray!="undefined"){
			this.locateObjects=jsonArray;
		}
    }
});
dojo.declare("Triman.Map.ClusterParam", null, {
	locateObjects:null,
	isZoom:true,
	distance:30,
	labelColor: "#fff",
	labelOffset: 10,
	singleColor: "#888",
	spatialReference:null,
	singleTemplate:null,
	maxSingles:2000,
	breaks:null,
	constructor: function(jsonArray){
        this.singleTemplate=esri.dijit.PopupTemplate({
          "title": "{title}",
          "description":"{content}"
        });
        this.breaks=Triman.Map.Graphic.defaultClusterBreaks;
		if(typeof jsonArray!="undefined"){
			this.locateObjects=jsonArray;
		}
    }
});