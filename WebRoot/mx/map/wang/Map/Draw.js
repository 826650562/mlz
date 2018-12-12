dojo.declare("Triman.Map.Draw", null, {//地图图形绘制功能构件
	//构造方法
	constructor: function(trimanmap){
		//内部参数定义
		this.trimanmap=trimanmap;//Triman.Map
		this.dp=null;//参数,
		this.result=null;
		this._drawLy=null;
		this._drawLyId="drawlayer";
		//初始化图层
		if(this.trimanmap.map.getLayer(this._drawLyId)==null){
			this._drawLy=new esri.layers.GraphicsLayer({id:this._drawLyId,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._drawLy);
		}else{
			this._drawLy=this.trimanmap.map.getLayer(this._drawLyId);
		}
	},
	//绘制图形
	draw:function(dp){
		this.result=new Triman.Map.DrawResult();
		if(typeof dp!="undefined"){
			this.dp=dp;
			if(typeof this.dp.isTop=="undefined"||this.dp.isTop) this._reorderDrawLayer(99);
			if(dp.geometryType!==""){
				this.trimanmap.maptoolbars.draw(dp.geometryType);
				this.trimanmap.maptoolbars.bindDrawEndEventCustom(this._processDraw,this);
			}else if(dp.geometries!==null){
				this._processDraw(dp.geometries,this);
			}
		}
	},
	//取消绘制
	cancelDraw:function(){
		this.trimanmap.maptoolbars.cancelDrawEndEventCustom();
	},
    //清楚指定的绘制信息
	clear:function(clearIds){
		if(typeof clearIds!="undefined"){
			Triman.Map.Util.deleteGra(clearIds,this.trimanmap.map,this._drawLyId);
		}else{
			this._drawLy.clear();
		}
	},
	remove:function(g){
		Triman.Map.Util.deleteGraObj(g,this.trimanmap.map,this._drawLyId);
	},
	_reorderDrawLayer:function(index){
		this.trimanmap.map.reorderLayer(this._drawLy,index);
	},
	_addDrawToMap:function(g,customsymbol,isbuffer){
    	var symbol;
    	if(typeof customsymbol!=="undefined"&&customsymbol!==null){
    		symbol=customsymbol;
    	}else{
			if (g.type=="polygon"||g.type=="extent"){
				symbol=Triman.Map.Graphic.defaultDrawFillSymbol;
			}else if(g.type=="polyline"){
				symbol=Triman.Map.Graphic.defaultDrawLineSymbol; 
			}else if(g.type=="point"||g.type=="multipoint"){
				symbol=Triman.Map.Graphic.defaultDrawMarkerSymbol;
			}
		}
		var drawGraphic=new esri.Graphic(g,symbol,this.dp.attributes);
		//drawGraphic.setInfoTemplate(esri.InfoTemplate(this.dp.attributes.title,this.dp.attributes.content));
		if(isbuffer){//缓冲图形
			this.result.bufferGraphics.push(drawGraphic);
			if(this.dp.isDrawBufferGeo) this._drawLy.add(drawGraphic);
		}else{//非缓冲
			this.result.graphics.push(drawGraphic);
			if(this.dp.isDrawGeo) this._drawLy.add(drawGraphic);
		}
    },
	_processDraw:function(gs,self){
		var dp=self.dp;
		var geometries=gs.length?gs:[gs];
		var csymbol=(typeof dp.symbol!="undefined")?dp.symbol:null;
		dojo.forEach(geometries,function(g){
			self._addDrawToMap(g,csymbol,false);//绘制图形
		});
		if(dp.isDoBuffer&&dp.bufferDistance>0){//绘制缓冲图形
			var gsvc= new esri.tasks.GeometryService(self.trimanmap.gsvcUrl);
			var params = new esri.tasks.BufferParameters();
			params.distances = [dp.bufferDistance];
			params.bufferSpatialReference=self.trimanmap.buffersr;
			params.outSpatialReference=self.trimanmap.map.spatialReference;
			params.unit=dp.bufferUnit;
			params.geometries=geometries;
			gsvc.buffer(params, function(bufferedGeometries){
				dojo.forEach(bufferedGeometries, function(g) {
					self._addDrawToMap(g,dp.bufferSymbol,true);
				},this);
				self._callBack();
			});
		}else{
			self._callBack();
		}
	},
	_callBack:function(){
		this.dp.callBack(this.result);
	}
});

dojo.declare("Triman.Map.DrawParam", null, {
	geometryType:"",
	isDrawGeo:true,
	geometries:null,
	symbol:null,
	isDoBuffer:false,
	bufferDistance:0,
	bufferUnit:null,
	bufferSymbol:null,
	isDrawBufferGeo:true,
	isTop:true,//每次是否保证绘制的图形在最上面
	attributes:{
		markId:null,
		catoId:"draw",
		title:"${catoId}",
		content:"${catoId}"
	},
	callBack:null,
	constructor: function(json){
		this.bufferUnit=esri.tasks.GeometryService.UNIT_METER;
		this.bufferSymbol=Triman.Map.Graphic.defaultBufferFillSymbol;
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});

dojo.declare("Triman.Map.DrawResult", null, {
	graphics:[],
	bufferGraphics:[],
	constructor: function(json){
		this.graphics=[];
		this.bufferGraphics=[];
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});