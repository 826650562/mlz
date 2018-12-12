dojo.declare("Triman.Map.Util", null, {});
dojo.mixin(Triman.Map.Util, null, {
	//根据删除指定的多个graphic
	//Array[key]=['v1','v2']
	labelSeparator:"：",
    deleteGra: function(keyArray,map,graphiclayerid){
    	var delegras=[];
    	var graphiclayer=map.graphics;
    	if(typeof graphiclayerid!="undefined"){
    		if(map.getLayer(graphiclayerid)!==null){
    			graphiclayer=map.getLayer(graphiclayerid);
    		}
    	}
    	dojo.forEach(graphiclayer.graphics,
    		function(gra){
    			if(typeof gra.attributes!='undefined'){
	    			for(var key in keyArray){
	    				var v=gra.attributes[key];
	    				var vall=keyArray[key];
	    				for(var i=0;i<vall.length;i=i+1){
	    					if(v==vall[i]){
	    						delegras.push(gra);
	    					}
	    				}
	    			}
    			}
    		}
    	,this);
    	dojo.forEach(delegras,function(gra){
    		graphiclayer.remove(gra);
    	});
    },
    //删除单个graphic对象
    deleteGraObj:function(graphic,map,graphiclayerid){
    	if(typeof graphic!="undefined"&&graphic!==null) {
    		var graphiclayer=map.graphics;
	    	if(typeof graphiclayerid!="undefined"){
	    		if(map.getLayer(graphiclayerid)!==null){
	    			graphiclayer=map.getLayer(graphiclayerid);
	    		}
	    	}
    		graphiclayer.remove(graphic);
    	}
    },
    transNullObject:function(o){
    	return (o==null||o=="Null"||o=="null"?"":o);
    },
    attachTemplateToData:function(template,data,fieldalias) {
        var i = 0,len = data.length,fragment = '';
        regall=new RegExp('\\$\\{\\*}', 'ig');
        
        // 遍历数据集合里的每一个项，做相应的替换
        function replace(obj) {
            var t, key, reg;
			if(regall.test(template)){
				//是否显示所有属性
				t="";
        		for (key in obj) {
        			if(key.indexOf("SHAPE_")!=-1) continue;
        			if(key!="Shape"&&key!="OBJECTID"&&key!="FID"){
        				var fname=fieldalias[key]==null?key:fieldalias[key];
	                	t += fname+Triman.Map.Util.labelSeparator+Triman.Map.Util.transNullObject(obj[key])+"<br><br>";
	                }
	            }
        	}else{
	            for (key in obj) {//遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
	            	var vv=Triman.Map.Util.transNullObject(obj[key]);
	        		var v=vv==""?" ":vv;
	                reg = new RegExp('\\$\\{' + key + '}', 'ig');
	                t = (t || template).replace(reg,v);
	            }
            }
            return t;
        }
        for (; i < len; i=i+1) {
            fragment += replace(data[i]);
        }
        return fragment;
    },
    //计算地球两点间距离，lng经度 lat纬度 
    getFlatternDistance: function(lng1,lat1,lng2,lat2){
    	var R=6378137.0;
    	var wcxsx=0.999;//误差系数x
    	var wcxsy=1.01;//误差系数y
    	var wcxs_last=Math.sqrt((lng1-lng2)*(lng1-lng2)*wcxsx*wcxsx+(lat1-lat2)*(lat1-lat2)*wcxsy*wcxsy)/Math.sqrt((lng1-lng2)*(lng1-lng2)+(lat1-lat2)*(lat1-lat2));
		var f = (lat1 + lat2)/2*Math.PI/180.0;
        var g = (lat1 - lat2)/2*Math.PI/180.0;
        var l = (lng1 - lng2)/2*Math.PI/180.0;
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s,c,w,r,d,h1,h2;
        var fl = 1/298.257;
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*R;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;
        var len=d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg))*wcxs_last;
      	return Math.round(len*100)/100;
    },
    //创建element
    createNode: function(tagName, attributes, parent, text,innerhtml ){
        var node = document.createElement(tagName);
        if (text) {
            var textNode = document.createTextNode(text);
            node.appendChild(textNode);
        }
        dojo.attr(node, attributes);
        if (parent) {
            parent.appendChild(node);
        }
        if(innerhtml){
        	node.innerHTML=innerhtml;
        }
        return node;
    },
    formatDistance:function(dist, units) {
	       var d = Math.round(dist * 100) / 100;
	       if (d === 0) {
	         return "";
	       }
	       return d + " " + units;
	},
	//计算A点到B点的与Y轴正方向(正北)的方位角
	calAzimuthNorth :function (Ax,Ay,Bx,By){
		var dx=Bx-Ax,dy=By-Ay;
		var azimuth=180/(Math.PI/Math.atan(dx/dy));
		if(dy<0) azimuth=azimuth+180;
		else if(dy>0&&dx<0) azimuth=azimuth+360;
		return azimuth;
	}
});
var Util=Triman.Map.Util;