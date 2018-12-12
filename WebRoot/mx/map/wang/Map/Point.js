dojo.declare("Wang.Map.Point", null, {
    //单点输出
	constructor:function(option){
		this.x=option.x;
		this.y=option.y;
		this.MapSr=option.map.defaultMapSr||4326//坐标系
		this.op={};
		_.extendOwn(this.op, option);
	},
	init:function(){
	    return	this.chack() && this.getGraphic();
	},
	getMarkeSymbol:function(){
	  return  new esri.symbol.SimpleMarkerSymbol(
	      this.op.type||esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, this.op.size||10, 
	        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color( this.op.lineColor||[255,0,0]), 1),
	        new dojo.Color(this.op.MainColor||[0,255,0,0.25])) 
	},
	getPicSymbol:function(){
	    //获取图片样式
		return new esri.symbol.PictureMarkerSymbol(this.op.url,this.op.width,this.op.height);
	},
	getPoint:function(){
	  return new esri.geometry.Point(this.x, this.y, new esri.SpatialReference({ wkid: this.MapSr }));
	},
	getGraphic:function(){
	  //组合图形
	 return new esri.Graphic(this.getPoint(),this.op.type=='normal'?this.getMarkeSymbol():this.getPicSymbol(),this.op,this.op.infote||null);
	},
	chack:function(){
    	//检查参数是否符合要求
		var isok;
		if(_.isEmpty(this.op.type)) return;
	    this.op.type==='pic'?this.op.url?isok=true:isok=false:isok=true;
	    return isok;
	}
	
	
})