dojo.declare("Triman.Map.Gsvc", null, {//地图空间运算服务构件
	_geoService: null,
    _bufferParams: null,
    onBufferCompleteEventHandler: null,
    onLengthsCompleteEventHandler: null,
    onAreasAndLengthsCompleteEventHandler: null,
    onProjectCompleteEventHandler: null,
    onSimplifyCompleteEventHandler: null,
    //project(graphics, outSpatialReference, callback?, errback?)
    onErrorHandler:null,
    
    
    
    _getBufferParams: function(params){
        var bufferParams = new BufferParams(params);
        return bufferParams.getESRIBufferParams();
    },
    constructor: function( gsvcUrl, bufParams){
        this._geoService = new esri.tasks.GeometryService(gsvcUrl);
        this._bufferParams = this._getBufferParams(bufParams);
        this.onBufferCompleteEventHandler = dojo.connect(this._geoService, "onBufferComplete", this, function(graphics){
            this.onBufferComplete(graphics);
        });
        this.onLengthsCompleteEventHandler = dojo.connect(this._geoService, "onLengthsComplete", this, function(lengths){
            this.onLengthsComplete(lengths);
        });
        this.onAreasAndLengthsCompleteEventHandler = dojo.connect(this._geoService, "onAreasAndLengthsComplete", this, function(areasAndLengths){
            this.onAreasAndLengthsComplete(areasAndLengths);
        });
        this.onProjectCompleteEventHandler = dojo.connect(this._geoService, "onProjectComplete", this, function(graphics){
            this.onProjectComplete(graphics);
        });
        this.onSimplifyCompleteEventHandler = dojo.connect(this._geoService, "onSimplifyComplete", this, function(graphics){
            this.onSimplifyComplete(graphics);
        });
        this.onErrorHandler = dojo.connect(this._geoService,"onError",this,function(error){
        	this.onError(error);
        });
        
    },
    buffer: function(){
    	this._geoService.buffer(this._bufferParams);
    },
    lengths: function(graphics){
    	this._geoService.lengths(graphics);
    },
    areasAndLengths: function(graphics){
    	this._geoService.areasAndLengths(graphics);
    },
    project: function(graphics,sr){
    	this._geoService.project(graphics,sr);
    },
    simplify: function(graphics){
    	this._geoService.simplify(graphics);
    },
    

    doBuffer: function(targetGeometry, targetGraphic,callback){
        if (targetGeometry.type === "polygon") {
            this._geoService.simplify(targetGraphic, dojo.hitch(this, function(graphics){
                this._bufferParams.features = graphics;
            }));
        }
        else {
            this._bufferParams.features = [targetGraphic];
        }
        dojo.connect(this._geoService, "onBufferComplete", this, function showBuffer(features){
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.65]), 2), new dojo.Color([255, 0, 0, 0.35]));
			for (var j = 0, jl = features.length; j < jl; j++) {
                features[j].setSymbol(symbol);
                mapapi.map.graphics.add(features[j]);
				if(callback && dojo.isFunction(callback)){
					callback(features[j].geometry);
				}
            }
        })
        this._geoService.buffer(this._bufferParams);
    },
    //virtual methods
    onBufferComplete: function(graphics){
    
    },
    onLengthsComplete: function(lengths){
    },
    onAreasAndLengthsComplete: function(areasAndLengths){
    
    },
    onProjectComplete: function(graphics) {
    	
    },
    onSimplifyComplete: function(graphics){
    
    },
    onError: function(error){
    
    }
})

dojo.declare("BufferParams", null, {
    bufferSpatialReference: null,
    distances: null,
    features: null,
    outSpatialReference: null,
    unionResults: null,
    unit: null,
    constructor: function(params){
        if (params) {
            if (params.bufferSpatialReference != null) {
                this.bufferSpatialReference = params.bufferSpatialReference;
                console.debug("bufferSpatialReference:" + this.bufferSpatialReference);
            }
            if (params.distances != null) {
                this.distances = params.distances;
                console.debug("distances:" + this.distances);
            }
            if (params.features != null) {
                this.features = params.features;
                console.debug("features:" + this.features);
            }
            if (params.outSpatialReference != null) {
                this.outSpatialReference = params.outSpatialReference;
                console.debug("outSpatialReference:" + this.outSpatialReference);
            }
            if (params.unionResults != null) {
                this.unionResults = params.unionResults;
                console.debug("unionResults:" + this.unionResults);
            }
            if (params.unit != null) {
                this.unit = params.unit;
                console.debug("unit:" + this.unit);
            }
            
        }
        else {
            return;
        }
    },
    getESRIBufferParams: function(){
        var bufferParams = new esri.tasks.BufferParameters();
        bufferParams.bufferSpatialReference = this.bufferSpatialReference;
        bufferParams.distances = this.distances;
        bufferParams.features = this.features;
        bufferParams.outSpatialReference = this.outSpatialReference;
        bufferParams.unionResults = this.unionResults;
        bufferParams.unit = this.unit;
        return bufferParams;
    }
})