dojo.declare("Triman.Map.PathAnalysis", null, {//地图路径分析
	//构造方法
	constructor: function(trimanmap){
		this.trimanmap=trimanmap;
		this.startStop=null;
		this.endStop=null;
		this.routeParams = new esri.tasks.RouteParameters();
		this.routeParams.stops = new esri.tasks.FeatureSet();
		this.routeParams.directionsLengthUnits=esri.Units.KILOMETERS;
	},
	doStartSite:function(point){
	    var siteGraphic = new esri.Graphic( new esri.geometry.Point(point.x,point.y,this.trimanmap.map.spatialReference),Triman.Map.Graphic.defaultRouteStartSymbol).setAttributes({site:"start"});
		this.startStop = siteGraphic;
		return this.startStop;
	},
	doEndSite:function(point){
		var siteGraphic = new esri.Graphic(new esri.geometry.Point(point.x,point.y,this.trimanmap.map.spatialReference),Triman.Map.Graphic.defaultRouteEndSymbol).setAttributes({site:"end"});
		this.endStop = siteGraphic;
		return this.endStop;
	},
	clearSite:function(){
		this.startStop = null;
		this.endStop = null;
	},
	doPathAnalysis:function(PathAnalysisParam){
		if(this.startStop==null && this.endStop==null) {return ;}
		var routeTask = new esri.tasks.RouteTask(PathAnalysisParam.routeNAMapService);
		this.routeParams.returnDirections = PathAnalysisParam.returnDirections;
		this.routeParams.outSpatialReference = PathAnalysisParam.outSpatialReference;
		this.routeParams.directionsLengthUnits = PathAnalysisParam.directionsLengthUnits;
		this.routeParams.stops.features.push(this.startStop);
		this.routeParams.stops.features.push(this.endStop);
		dojo.connect(routeTask, "onSolveComplete",function(solveResult){
			var directions = solveResult.routeResults[0].directions;
			//alert(solveResult.routeResults[0]);
			var siteGraphic = solveResult.routeResults[0].route.setSymbol(Triman.Map.Graphic.defaultRouteLineSymbol);
			siteGraphic.setAttributes({site:"line"});
			var dirStrings="全程约: <b>" + Util.formatDistance(directions.totalLength, "公里") +" </b>" ;
			dirStrings+="<table>"; 
			dojo.forEach(directions.features, function(feature, i) {
				var temptext = feature.attributes.text.replace('Location 1',"起点");
				temptext = temptext.replace('Location 2',"终点");
				dirStrings+="<tr><td valign='top' align='right' class='dirString'><span style='font-weight:600'>"+(i+1)+".</span></td><td class='dirString'>" + temptext + " (" + Util.formatDistance(feature.attributes.length ,"公里") +")</td></tr>";
			});
			dirStrings+="</table>";
			var infoTemplate = new esri.InfoTemplate();
			infoTemplate.setTitle("最短路径"); 
		    infoTemplate.setContent(dirStrings);
		    siteGraphic.setInfoTemplate(infoTemplate);
		    var tempReturnGraphics = new Array();
		    tempReturnGraphics["Aline"] = siteGraphic;
		    tempReturnGraphics["Sline"] = directions;//属性：totalLength{总长} 数组单个属性:features[0].attributes.text{从XX路至XX路},features[0].attributes.length{单条线路长度}
		    PathAnalysisParam.callBack(tempReturnGraphics);
		});
	    dojo.connect(routeTask, "onError",function(error){
	    	alert("路径分析出错！");
	    });
	    routeTask.solve(this.routeParams);
	}
});
dojo.declare("Triman.Map.PathAnalysisParam", null, {
	routeNAMapService:null,   //最短路径地图服务
	returnDirections:false,   //路程说明是否返回，如路径服务没有设置路程且ture，则路径结果报错
	outSpatialReference:{"wkid":102100},
	directionsLengthUnits:null,
	callBack:null,          //返回函数
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});
