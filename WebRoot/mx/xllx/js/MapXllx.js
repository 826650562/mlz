/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-18 13:37:25
 * @version $Id$
 */

jQuery(document).ready(function() {
    var INDEX = ""; //layui全局index
    
    var myGraphicsLayer = new esri.layers.GraphicsLayer();   //用于绘制路线的全局graphicsLayer
    
    MXZH.WangMapXllx = function() {}
    MXZH.WangMapXllx.prototype = {
        init: function(opts) {
            opts && dojo.safeMixin(this.config, opts);
            this.map = opts.map.map;
            this.layers = [];
            this.grcLayer = null;
        },
        config: {},
        drawPath: function(id) {
            var self = this;
            this.grcLayer = new esri.layers.GraphicsLayer(); //节点图层
            this.layers.push(this.grcLayer); //临时线路 集合
            this.map.addLayer(this.grcLayer);
            dojo.require("esri.toolbars.draw");
            tb = new esri.toolbars.Draw(self.map);
            tb.on("draw-end", addGraphic);
            self.map.disableMapNavigation();
            tb.activate("polyline");   //通过鼠标点击来连线

            function addGraphic(evt) {
                tb.deactivate();
                self.map.enableMapNavigation();
                var symbol = self.getLineSymbol();
                var grc = new esri.Graphic(evt.geometry, symbol);
                self.grcLayer.add(grc);
            }
        },
        getLineSymbol: function() {
            return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 1]), 3);
        },
        removeLayer: function() {
            var self = this;
            dojo.forEach(self.layers, function(item) {
                self.map.removeLayer(item);
            })
            this.layers = [];
        },
        removeGraphics: function(id) {
        	var isclear=[];
        	if(!id) myGraphicsLayer.clear();
        	dojo.forEach(myGraphicsLayer.graphics,function(item,index){
        		if(item.attributes['id']==id){
        			isclear.push(item);
        		}
        	});
        	dojo.forEach(isclear,function(i){
        		myGraphicsLayer.remove(i);
        	});
        },
        showPath: function(pathStr, id) {
        	this.removeGraphics();
            var self = this;
            var resizeInterval1, resizeInterval2;
            var resizeTimer, resizeTime = 800;
            var pathObj = JSON.parse(pathStr);
            var lineExtent = [];
            var resultUnionExtent;
            var tempUnionExtent;
            this.map.addLayer(myGraphicsLayer);
            for (var i = 0; i < pathObj.length; i++) {
            	var gra = new esri.Graphic(pathObj[i]);
            	gra.attributes={};
            	gra.attributes['id']=id;
            	lineExtent[i] = gra.geometry.getExtent();
            	myGraphicsLayer.add(gra);
            	if (i == 0) {
            		tempUnionExtent = gra.geometry.getExtent();
            	}
            	resultUnionExtent = tempUnionExtent.union(lineExtent[i]);
            }
            this.map.setExtent(resultUnionExtent.expand(1.5));
            clearTimeout(resizeTimer);
           	resizeInterval1 = setInterval(function() {
            	self.map.lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 1]), 3);
                for (var i = 0; i < pathObj.length; i++) {
            		myGraphicsLayer.graphics[myGraphicsLayer.graphics.length - 1 - i].setSymbol(self.map.lineSymbol);
            	}
            }, 200);
            resizeInterval2 = setInterval(function() {
            	self.map.lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0]), 3);
                for (var i = 0; i < pathObj.length; i++) {
            		myGraphicsLayer.graphics[myGraphicsLayer.graphics.length - 1 - i].setSymbol(self.map.lineSymbol);
            	}
            }, 220);
            resizeTimer = setTimeout(function() {
                clearInterval(resizeInterval1);
                clearInterval(resizeInterval2);
                self.map.lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 1]), 3);
                for (var i = 0; i < pathObj.length; i++) {
            		myGraphicsLayer.graphics[myGraphicsLayer.graphics.length - 1 - i].setSymbol(self.map.lineSymbol);
            	}
            }, resizeTime);
        }
    };
})
