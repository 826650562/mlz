dojo.declare("Triman.Map.Measure", null, {//地图测量功能构件
	
	//构造函数
	constructor: function(trimanmap){
		this.trimanmap=trimanmap;//Triman.Map
		this.clickCount=null; //点击次数
		this.clickPointX=null;//点击的x
		this.clickPointY=null;//点击的y
		this.points=null;
		this.lenConnection=null;
		this.type="";
		this.tempAreaGraphic=null;
		this._measureLy=null;
		this._measureLyId="measurelayer";
		this._measureLy1=null;
		this._measureLyId1="measurelayer1";
		this._tmpFGraphic=null;
		this._labelDivId="measure_label_div";
		this._labelOffsetX=0;
		this._labelOffsetY=-30;
		this.resultShowType="fixed";
		this.symbol=null;
		this.callBack=null;
		this.isContinuous=true;
		this.isShowLabel=false;
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
	    };
	    this._removeLabelDiv=function(){
	    	var el=document.getElementById(this._labelDivId);
	    	if(el) this.trimanmap.map.root.removeChild(el);
	    };
		this.initMeasure();
		this.createResultShowPanel();
    },
    //初始化量算
    initMeasure: function(){
		this.clickCount=0;
		this.clickPointX=[];
		this.clickPointY=[];
		this.points=[];
		this.lenConnection=[];
		this.type="";
		this.tempAreaGraphic=null;
		if(this.trimanmap.map.getLayer(this._measureLyId)==null){
			this._measureLy=new esri.layers.GraphicsLayer({id:this._measureLyId,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._measureLy);
		}else{
			this._measureLy=this.trimanmap.map.getLayer(this._measureLyId);
		}
		if(this.trimanmap.map.getLayer(this._measureLyId1)==null){
			this._measureLy1=new esri.layers.GraphicsLayer({id:this._measureLyId1,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._measureLy1);
		}else{
			this._measureLy1=this.trimanmap.map.getLayer(this._measureLyId1);
		}
	},
	loadPara:function(mp){
		if(typeof mp!="undefined"){
			dojo.safeMixin(this,mp);
		}
		if(this.resultShowType=="fixed"){
			if(this.type=="len"){
				this.showLengthBox();
			}else if(this.type=="area"){
				this.showAreaBox();
			}else if(this.type=="location"){
				this.showLocationBox();
			}
		}
	},
	createResultShowPanel:function(){
		//<!-- 数据显示的底层，用以设置样式 -->
		var measurebottomDiv = Triman.Map.Util.createNode("div",
    	{id: "measurebottom",style:{visibility:"hidden",filter:"alpha(opacity=60)" ,position: "absolute", left:"55px", top:"0px", width:"430px", height:"30px"}}, 
    	this.trimanmap.map.root,
    	"",
    	"<table width='430' border='0' cellspacing='0' cellpadding='0'><tr ><td width='3' height='30'><img src='"+MAPAPI_URL+"/img/mianban_01.gif' width='3' height='30' /></td><td background='"+MAPAPI_URL+"/img/mianban_03.gif'>&nbsp;</td><td width='3'  height='30'><img src='"+MAPAPI_URL+"/img/mianban_05.gif' width='3' height='30' /></td></tr></table>");
		//<!-- 测量距离 数据显示层 -->
		var measureBoxDiv = Triman.Map.Util.createNode("div",
    	{id: "measureBox",style:{position:"absolute",visibility:"hidden", overflow:"hidden", left:"0px", top:"0px", width:"430px", height:"30px"}}, 
    	measurebottomDiv,
    	"",
    	"<table width='430px' style='font:normal 12px verdana;'><tr><td valign='middle' style='font-weight:bold'>&nbsp;&nbsp;距离合计:<INPUT TYPE='text' id='theLenTotal' name='theLenTotal' VALUE='0' SIZE='15' readonly>&nbsp;米</td><td valign='middle' style='font-weight:bold'>延伸距离:<INPUT TYPE='text' id='theLenSegment' name='theLenSegment' VALUE='0' SIZE='15' readonly>&nbsp;米</td></tr></table>");
    	//<!-- 测量面积 数据显示层 -->
    	var measureAreaBoxDiv = Triman.Map.Util.createNode("div",
    	{id: "measureAreaBox",style:{position:"absolute",visibility:"hidden", overflow:"hidden", left:"0px", top:"0px", width:"430px", height:"30px"}}, 
    	measurebottomDiv,
    	"",
    	"<table width='430px' style='font:normal 12px verdana;'><tr><td valign='middle' style='font-weight:bold'>&nbsp;&nbsp;面积合计:<INPUT TYPE='text' id='theAreaTotal1' name='theAreaTotal1' VALUE='0' SIZE='12' readonly>&nbsp;平方米</td><td valign='middle' style='font-weight:bold'>合计:<INPUT TYPE='text' id='theAreaTotal2' name='theAreaTotal2' VALUE='0' SIZE='12' readonly>&nbsp;平方公里</td></tr></table>");
		//<!-- 测量点 数据显示层 -->
		var locationBoxDiv = Triman.Map.Util.createNode("div",
    	{id: "locationBox",style:{position:"absolute",visibility:"hidden", overflow:"hidden", left:"0px", top:"0px", width:"430px", height:"30px"}}, 
    	measurebottomDiv,
    	"",
    	"<table width='430px' style='font:normal 12px verdana;'><tr><td valign='middle' style='font-weight:bold'>&nbsp;&nbsp;X:<INPUT TYPE='text' id='theLocationX' name='theLocationX' VALUE='' SIZE='12' readonly>&nbsp;&nbsp;</td><td valign='middle' style='font-weight:bold'>Y:<INPUT TYPE='text' id='theLocationY' name='theLocationY' VALUE='' SIZE='12' readonly>&nbsp;</td></tr></table>");
		//------------------------------
	},
    //测量已有的geometry
    measureGeo:function(g){
    	
    },
    //测量距离
    len:function(mp){
    	this.disconnectAll();
    	this.type="len";
    	this.loadPara(mp);
      	this.trimanmap.maptoolbars.bindDrawEndEventCustom(function(g,self){
      		self._tmpFGraphic=g;
			self.addMeasureGraphic(g);
			self.clickAddPoint(null,self.type,true);
		},this);
		this.startMeasure(esri.toolbars.Draw.POLYLINE);
		this.lenConnection[0]=dojo.connect(this.trimanmap.map,"onClick",this,function(e){
			this.clickAddPoint(e,this.type,false);
		});
		if(this.isShowLabel){
			this.lenConnection[1]=dojo.connect(this.trimanmap.map,"onMouseMove",this,function(e){
				var mp = e.mapPoint;
				this._removeLabelDiv();
				if(this.points.length>0){
					var lastpt=this.points[this.points.length-1];
					var length;
					if(this.trimanmap.mapsr.wkid=="4326") length=Util.getFlatternDistance(lastpt[0],lastpt[1],mp.x,mp.y);
					else{
						var pt1=new esri.geometry.Point(lastpt,this.trimanmap.mapsr);
						var pt2=new esri.geometry.Point([mp.x,mp.y],this.trimanmap.mapsr);
						length=esri.geometry.getLength(pt1,pt2);
					}
					var left=e.clientX+this._labelOffsetX;
	       			var top=e.clientY+this._labelOffsetY;
					this._addLabelDiv("&nbsp;"+Math.round(length)+"米&nbsp;",left,top);
				}
			});
		}
    },
    //测量面积
    area:function(mp){
    	this.disconnectAll();
    	this.type="area";
    	this.loadPara(mp);
      	this.trimanmap.maptoolbars.bindDrawEndEventCustom(function(g,self){
      		self.deleteMeasureGraphic();
			self.addMeasureGraphic(g);
			self._tmpFGraphic=g;
			self.clickAddPoint(null,self.type,true);
		},this);
		this.startMeasure(esri.toolbars.Draw.POLYGON);
		this.lenConnection[2]=dojo.connect(this.trimanmap.map,"onClick",this,function(e){
			this.clickAddPoint(e,this.type,false);
		});
    },
    //测量点
    location:function(mp){
    	this.disconnectAll();
    	this.type="location";
    	this.loadPara(mp);
      	this.trimanmap.maptoolbars.bindDrawEndEventCustom(function(g,self){
      		self.deleteMeasureGraphic();
			self._tmpFGraphic=g;
			self.addMeasureGraphic(g);
			self._callBack({type:"location",
				point:new esri.geometry.Point(g.x,g.y,self.trimanmap.mapsr),isOver:true});
			if(self.isContinuous) self.location();
		},this);
		this.startMeasure(esri.toolbars.Draw.POINT);
    },
    //调用返回结果函数并显示结果，内部使用
    _callBack:function(json){
    	if(this.resultShowType=="fixed"){
    		if(json.type=="location"){
				document.getElementById("theLocationX").value=json.point.x;
				document.getElementById("theLocationY").value=json.point.y;
			}else if(json.type=="len"){
				document.getElementById("theLenTotal").value=json.totalLength;
				document.getElementById("theLenSegment").value=json.segmentLength;
			}else if(json.type=="area"){
				document.getElementById("theAreaTotal1").value=json.area;
				document.getElementById("theAreaTotal2").value=Math.round(Math.abs(json.area)*0.000001*100)/100;
			}
		}
		if(this.resultShowType=="maptip"){
			var labelsymol=new esri.symbol.TextSymbol(Triman.Map.Graphic.defaultMeasureLabelSymbol.toJson());
	        var labelpoint=json.point;
			if(json.type=="location"){
				labelsymol.setText("X:"+Math.round(json.point.x*100000)/100000+";\n\r"
					+"Y:"+Math.round(json.point.y*100000)/100000);
				labelsymol.setOffset(0,15);
			}else if(json.type=="len"){
       	 		labelsymol.setText(json.totalLength+"米");
       	 		labelsymol.setOffset(5,5);
			}else if(json.type=="area"){
				labelsymol.setText(json.area+"平方米;\n\r"
					+Math.round(Math.abs(json.area)*0.000001*100)/100+"平方公里;\n\r"
					+"周长:"+json.totalLength+"米");
				if(this._tmpFGraphic!=null){
					labelpoint=this._tmpFGraphic.getExtent().getCenter();
				}
			}
			if((!json.isOver||json.type=="location")&&json.type!="area"){
	       	 	this._measureLy1.add(new esri.Graphic(labelpoint,labelsymol));
	       	 	this._measureLy1.add(new esri.Graphic(labelpoint,Triman.Map.Graphic.defaultMeasurePointSymbol));
       	 	}
       	 	if(json.type=="area"&&json.isOver){
       	 		this._measureLy1.add(new esri.Graphic(labelpoint,labelsymol));
       	 	}
		}
    	if(typeof this.callBack!="undefined"&&this.callBack!=null){
    		var _result=new Triman.Map.MeasureResult(json);
    		_result.finishedGeometry=this._tmpFGraphic;
    		this.callBack(_result);
    	}
    },
    //单击事件方法
    clickAddPoint: function(e,type,isover){
    	if(this.clickCount==0) this.deleteMeasureGraphic();
    	var point=null;//当前点击位置的点对象
    	if(!isover){
			this.clickPointX[this.clickCount]=e.mapPoint.x;
			this.clickPointY[this.clickCount]=e.mapPoint.y;
			this.points[this.clickCount]=[this.clickPointX[this.clickCount],this.clickPointY[this.clickCount]];
		}
		point=new esri.geometry.Point(this.clickPointX[this.clickCount],this.clickPointY[this.clickCount],this.trimanmap.mapsr);
		if(type=="len"){//测量线
			if(this.clickCount>0){//大于等于2个点时才计算
				//总长度
				var line=new esri.geometry.Polyline(this.trimanmap.mapsr);
				line.addPath(this.points);
				//最后一段长度				
				var segpts=[this.points[this.points.length-2],this.points[this.points.length-1]];
				var segline=new esri.geometry.Polyline(this.trimanmap.mapsr);
				segline.addPath(segpts);
				
				var gs= new Triman.Map.Gsvc(this.trimanmap.gsvcUrl);
				//dojo.connect(gs, "onError",this, function(e){alert(e.message);});
				gs.project([line,segline],this.trimanmap.mearsuresr);
				dojo.connect(gs, "onProjectComplete", function(geomerties) {//投影成平面
					var lengthParams = new esri.tasks.LengthsParameters();
					lengthParams.polylines = geomerties;
          			lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
          			lengthParams.geodesic = true;
					gs.lengths(lengthParams);
				});
				dojo.connect(gs, "onLengthsComplete",this, function(lengths){//测量
					var lenv=Math.round(lengths.lengths[0]);
					var seglenv=Math.round(lengths.lengths[1]);
					//返回线结果
					this._callBack({type:"len",segmentLength:seglenv,totalLength:lenv,
						pointIndex:this.clickCount,point:point,isOver:isover});
					if(isover){//结束后关闭
						this.disconnectAll(this.trimanmap.maptoolbars);
						this.initMeasure();
						if(this.isContinuous) this.len();
					}
	        	});
			}
		}else if(type=="area"){//测量面积
			var area=new esri.geometry.Polygon(this.trimanmap.mapsr);
			if(isover) area=this._tmpFGraphic;
			else area.addRing(this.points);
			if(this.clickCount>1){
				//未画完前临时添加面
				this._measureLy.remove(this.tempAreaGraphic);
				this.tempAreaGraphic=new esri.Graphic(area, this.getMeasureSymbol(area));
				this._measureLy.add(this.tempAreaGraphic);
				var gs= new Triman.Map.Gsvc(this.trimanmap.gsvcUrl);
				//dojo.connect(gs, "onError",this, function(e){alert(e.message);});
				//临时处理地方坐标系的BUG
				if(this.trimanmap.mearsuresr.wkid!=this.trimanmap.mapsr.wkid){
					gs.project([area],this.trimanmap.mearsuresr);
					dojo.connect(gs, "onProjectComplete", function(geomerties) {//投影成平面
					    var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
				        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
				        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
						areasAndLengthParams.polygons = geomerties;
						gs.areasAndLengths(areasAndLengthParams);
					});
				}else{
					var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
			        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
			        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
					areasAndLengthParams.polygons = [area];
					gs.areasAndLengths(areasAndLengthParams);
				}
				dojo.connect(gs, "onAreasAndLengthsComplete",this,function(result){//测量
					var area=Math.round(Math.abs(result.areas[0])*100)/100;
					var length=Math.round(Math.abs(result.lengths[0])*100)/100;
					//返回结果
					this._callBack({type:"area",area:area,totalLength:length,pointIndex:this.clickCount,point:point,isOver:isover});
        			if(isover){
        				this._measureLy.remove(this.tempAreaGraphic);
						this.disconnectAll(this.trimanmap.maptoolbars);
						this.initMeasure();
						if(this.isContinuous) this.area();
					}
        		});
			}
		}
		if(!isover)this.clickCount++;
	},
	//开始测量
	startMeasure:function(type){
		this.trimanmap.maptoolbars.drawToolbar.activate(type);
		this.trimanmap.maptoolbars.navToolbar.activate(esri.toolbars.Navigation.PAN);
		this.trimanmap.map.enableScrollWheelZoom();
	},
	//取消事件绑定，恢复工具栏
    disconnectAll: function(toolbar){
		dojo.disconnect(this.lenConnection[0]);
  		dojo.disconnect(this.lenConnection[1]);
  		dojo.disconnect(this.lenConnection[2]);
  		this.trimanmap.maptoolbars.navToolbar.deactivate();
        this.trimanmap.maptoolbars.drawToolbar.deactivate();
        if(this.trimanmap.maptoolbars.editToolbar!=null) this.trimanmap.maptoolbars.editToolbar.deactivate();
	},
	//获取测量样式
	getMeasureSymbol :function(geometry){
		if(this.symbol!=null) return this.symbol;
		var symbol;
		if (geometry.type=="polygon"||geometry.type=="extent"){
			symbol = Triman.Map.Graphic.defaultMeasureFillSymbol;
		}else if(geometry.type=="polyline"){
			symbol = Triman.Map.Graphic.defaultMeasureLineSymbol;
		}else if(geometry.type=="point"){
			symbol = Triman.Map.Graphic.defaultMeasurePointSymbol;
		}
		return symbol;
	},
	//显示隐藏信息显示区域
	showLengthBox:function(){
		document.getElementById("measurebottom").style.visibility="visible";
		document.getElementById("measureBox").style.visibility="visible";
		this.hideAreaBox();
		this.hideLocationBox();
	},
	hideLengthBox:function(){
		if(document.getElementById("measureBox")!=null && document.getElementById("measureBox")!= undefined){
			document.getElementById("measureBox").style.visibility="hidden";
			document.getElementById("theLenTotal").value=0;
			document.getElementById("theLenSegment").value=0;
		}
	},
	showAreaBox:function(){
		document.getElementById("measurebottom").style.visibility="visible";
		document.getElementById("measureAreaBox").style.visibility="visible";
		this.hideLengthBox();
		this.hideLocationBox();
	},
	hideAreaBox:function(){
		if(document.getElementById("measureAreaBox")!=null && document.getElementById("measureAreaBox")!= undefined){
			document.getElementById("measureAreaBox").style.visibility="hidden";
			document.getElementById("theAreaTotal1").value=0;
			document.getElementById("theAreaTotal2").value=0;
		}
	},
	showLocationBox:function(){
		document.getElementById("measurebottom").style.visibility="visible";
		document.getElementById("locationBox").style.visibility="visible";
		this.hideLengthBox();
		this.hideAreaBox();
	},
	hideLocationBox:function(){
		if(document.getElementById("locationBox")!=null && document.getElementById("locationBox")!= undefined){
			document.getElementById("locationBox").style.visibility="hidden";
			document.getElementById("theLocationX").value="";
			document.getElementById("theLocationY").value="";
		}
	},
	//--------------------------------
	//取消量算
	cancelMeasure:function(){
		document.getElementById("measurebottom").style.visibility="hidden";
		this.hideLengthBox();
		this.hideAreaBox();
		this.hideLocationBox();
		this.disconnectAll(this.trimanmap.maptoolbars);
		this.initMeasure();
		this.deleteMeasureGraphic();
	},
	//添加测量的Graphic
	addMeasureGraphic:function(g){
		this._measureLy.add(new esri.Graphic(g, this.getMeasureSymbol(g),{"type":"measure"}));
	},
	//删除测量留下的Graphic
	deleteMeasureGraphic:function(clearIds){
		if(typeof clearIds!="undefined"){
			Triman.Map.Util.deleteGra(clearIds,this.trimanmap.map,this._measureLyId);
		}else{
			this._measureLy.clear();
			this._measureLy1.clear();
		}
	}
});

dojo.declare("Triman.Map.MeasureParam", null, {
	isContinuous:true,//是否连续测量
	resultShowType:"fixed",//结果显示方式
	symbol:null,//自定义样式
	callBack:null,//返回结果函数
	isShowLabel:false,//是否显示实时距离标签，只有距离量算有效
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});

dojo.declare("Triman.Map.MeasureResult", null, {
	type:"",//location,len,area
	segmentLength:0,//段长度
	totalLength:0,//总长度
	area:0,//面积
	pointIndex:0,//第几个点
	point:null,//当前点的的对象
	isOver:false,//测量是否结束
	finishedGeometry:null,
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});