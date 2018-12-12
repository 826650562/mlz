dojo.declare("Triman.Map.Graphic", null, {});
var Graphic;
function initTrimanGraphic(){
	dojo.mixin(Triman.Map.Graphic, null, {
		defaultMeasureLineSymbol:new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255,0,0]), 2),
		defaultMeasureFillSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25])),
		defaultMeasurePointSymbol:new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 1), new dojo.Color([0,255,0,0.25])),
		defaultMeasureLabelSymbol:new esri.symbol.TextSymbol(" ",new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"宋体"),new dojo.Color("#000000")),
		defaultRouteLineSymbol:new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([0,0,255,0.5])).setWidth(5),
		defaultRouteStartSymbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/routestart.png", 32, 40),
		defaultRouteEndSymbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/routeend.png", 32, 40),
		defaultRouteSegmentSymbol:new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([255,0,0,0.5])).setWidth(8),
		defaultImageUrl:MAPAPI_URL+"/img/dw.gif",
		defaultImageWidth:18,
		defaultImageHeight:18,
		defaultImageOffsetX:0,
		defaultImageOffsetY:0,
		defaultClusterBreaks:[
			{minValue:0,maxValue:2,symbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/pin_bluelarge.png", 32, 32).setOffset(0, 15)}
			,{minValue:2,maxValue:200,symbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/pin_greenlarge.png", 56, 56).setOffset(0, 15)}
			,{minValue:200,maxValue:500,symbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/pin_orangelarge.png", 64, 64).setOffset(0, 15)}
			,{minValue:500,maxValue:9999,symbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/pin_redlarge.png", 72, 72).setOffset(0, 15)}
		],
		defaultDrawMarkerSymbol:new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 1), new dojo.Color([0,255,0,0.25])),
		defaultDrawLineSymbol:new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255,0,0]), 2),
		defaultDrawFillSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25])),
		defaultBufferFillSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25])),
		defaultHighLightSymbol:new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25])),
		defaultHighLightFillSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25])),
		defaultHighLightLineSymbol:new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255,0,0]), 4),
		defaultFlashSymbol:new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25])),
		defaultFlashFillSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25])),
		defaultFlashLineSymbol:new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 4),
		defaultLabelSymbol:new esri.symbol.TextSymbol(" "
		        	 		,new esri.symbol.Font("12pt",esri.symbol.Font.STYLE_NORMAL
		        	 			,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"宋体")
		        	 		,new dojo.Color("#0000FF")).setOffset(0,-30),
		defaultLocateMarkerSymbol:null,
		defaultLocateLineSymbol:new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255,0,0]), 5),
		defaultLocateFillSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25])),
		defaultBeginSymbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/begin.png", 62, 62).setOffset(0, 32),
		defaultEndSymbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/end.png", 62, 62).setOffset(0, 32),
		defaultNormalLocusSymbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/arrow.png", 22, 22),
		defaultStopSymbol:new esri.symbol.PictureMarkerSymbol(MAPAPI_URL+"/img/stop.png", 31, 31).setOffset(0, 16),
		defaultStayLabelSymbol:new esri.symbol.TextSymbol(" ",new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"宋体"),new dojo.Color("#0000FF")).setOffset(0, 31),
		defaultLocusLineSymbol:new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DOT, new dojo.Color([255,0,0,0.7]), 3),
		getDefaultXYLocateSymbol:function(){
			if(Triman.Map.Graphic.defaultLocateMarkerSymbol==null){
				Triman.Map.Graphic.defaultLocateMarkerSymbol=new esri.symbol.PictureMarkerSymbol(Triman.Map.Graphic.defaultImageUrl
					,Triman.Map.Graphic.defaultImageWidth,Triman.Map.Graphic.defaultImageHeight);
				Triman.Map.Graphic.defaultLocateMarkerSymbol.setOffset(Triman.Map.Graphic.defaultImageOffsetX
					, Triman.Map.Graphic.defaultImageOffsetY);
			}
			return Triman.Map.Graphic.defaultLocateMarkerSymbol;
		},
		getDefaultLocateSymbol:function(type,style){
			var outlineStyle, outlineColor, size, width, fillStyle, fillColor, opacity;
	        if (style) {
	            outlineStyle = style.outlineStyle || esri.symbol.SimpleLineSymbol.STYLE_SOLID;
	            outlineColor = style.outlineColor || [2, 238, 244];
	            size = style.size || 20;
	            width = style.width || 2;
	            fillStyle = style.fillStyle || esri.symbol.SimpleFillSymbol.STYLE_SOLID;
	            fillColor = style.fillColor || [255, 255, 0];
	            opacity = style.opacity || [0.25];
	        }else {
	            outlineColor = [255, 0, 0];
	            size = 10;
	            width = 2;
	            fillColor = [255, 0, 0];
	            opacity = [1];
	            outlineStyle = esri.symbol.SimpleLineSymbol.STYLE_SOLID
	            fillStyle = esri.symbol.SimpleFillSymbol.STYLE_SOLID;
	        }
	        var symbol;
	        switch (type.toLowerCase()) {
	            case "point":
	                symbol = Triman.Map.Graphic.getDefaultXYLocateSymbol();
	                break;
	            case "polyline":
	                symbol = Triman.Map.Graphic.defaultLocateLineSymbol;
	                break;
	            case "polygon":
	                symbol = Triman.Map.Graphic.defaultLocateFillSymbol;
	                break;
	            case "extent":
	                symbol = Triman.Map.Graphic.defaultLocateFillSymbol;
	                break;
	            case "multipoint":
	                symbol = Triman.Map.Graphic.getDefaultXYLocateSymbol();
	                break;
	        }
	        return symbol;
		}
	});
	Graphic=Triman.Map.Graphic;
}