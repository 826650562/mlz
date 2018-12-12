dojo.declare("Triman.Map.Query", null, {//地图定位、分布功能构件
	//构造方法 
	constructor: function(trimanmap){
		this.trimanmap=trimanmap;
		dojo.require("esri.tasks.query");
		dojo.require("esri.tasks.find");
		dojo.require("esri.tasks.identify");
	},
	execQuery:function(queryParam){
		if(!queryParam.queryType) {alert("QueryParam is error!"); return; }
		switch(queryParam.queryType){
			case 1:   //Query
				var queryTask=new esri.tasks.QueryTask(queryParam.queryMapService+queryParam.queryMapLayers[0]);
				var query=new esri.tasks.Query();
				query.returnGeometry=true;
				query.outFields=queryParam.outFields;
				query.geometry=queryParam.queryGeometry;
				query.where=queryParam.queryWhere;
				query.outSpatialReference = queryParam.outSpatialReference!=null?queryParam.outSpatialReference:this.trimanmap.map.spatialReference;
				dojo.connect(queryTask, "onError", function(error) {alert(error.message);});
				dojo.connect(queryTask, "onComplete", function(result) {
					if(typeof queryParam.callBack!="undefined"&&queryParam.callBack!=null){
			    		queryParam.callBack(result);
			    	}
				});
				queryTask.execute(query);
				break;
			case 2:   //Identify
				var identifyTask=new esri.tasks.IdentifyTask(queryParam.queryMapService);
		        var identifyParams=new esri.tasks.IdentifyParameters();
		        identifyParams.tolerance=queryParam.tolerance;
		        identifyParams.returnGeometry=true;
		        identifyParams.layerIds=queryParam.queryMapLayers;
		        identifyParams.layerOption=esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
		        identifyParams.width=this.trimanmap.map.width;
		        identifyParams.height=this.trimanmap.map.height;
		        identifyParams.geometry=queryParam.queryGeometry;
		        identifyParams.mapExtent=this.trimanmap.map.extent;
		        dojo.connect(identifyTask, "onError", function(error) {alert(error.message);});
				dojo.connect(identifyTask, "onComplete", function(result) {
					if(typeof queryParam.callBack!="undefined"&&queryParam.callBack!=null){
			    		queryParam.callBack(result);
			    	}
				});
		        identifyTask.execute(identifyParams);
				break;
			case 3:   //find
				var findTask=new esri.tasks.FindTask(queryParam.queryMapService);
		        var findParams=new esri.tasks.FindParameters();
		        findParams.returnGeometry=true;
		        findParams.layerIds =queryParam.queryMapLayers;
		        findParams.searchFields=queryParam.queryFields;
		        findParams.searchText=queryParam.queryText;
		        dojo.connect(findTask, "onError", function(error) {alert(error.message);});
				dojo.connect(findTask, "onComplete", function(result) {
					if(typeof queryParam.callBack!="undefined"&&queryParam.callBack!=null){
			    		queryParam.callBack(result);
			    	}
				});
		        findTask.execute(findParams);
				break;
			case 0:
				alert("QueryParam is error!");
				return;
			  break;
		}
	}
	//是否要做统计和排序？
});
dojo.declare("Triman.Map.QueryParam", null, {
	queryMapService:null,   //mapserviceURL，不带图层ID
	queryMapLayers:null,    //图层ID值，是数组[]
	queryGeometry:null,     //query Identify
	queryWhere:null,        //query Identify
	outFields:null,       //返回字段，数组形式
	tolerance:3 ,            //Identify
	queryFields:null,        //find
	queryText:null,         //find
	contains:false,         //find  查找是否为精确查找，如大小写等
	queryType:0,            //query:1  Identify:2  find:3
	outSpatialReference:null,
	callBack:null,          //返回函数
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
			if(this.queryMapLayers.length>1){  //是Identify或find
				if(typeof this.queryGeometry!="undefined"){ //Identify
					this.queryType = 2;
				}else if(typeof this.queryFields!="undefined"&&typeof this.queryText!="undefined"){ //find
					this.queryType = 3;
				}
			}else{//Query
				if(typeof this.queryGeometry!="undefined"||typeof this.queryWhere!="undefined" ) this.queryType = 1;
			}
		}
    }
});
