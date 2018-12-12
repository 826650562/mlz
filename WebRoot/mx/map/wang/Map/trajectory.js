/*
 * 人员活动轨迹
 * wxl
 * 20161013
 */
define(
    ["dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask",
        "esri/InfoTemplate", "esri/layers/GraphicsLayer",
        "esri/renderers/ClassBreaksRenderer", "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol", "dojo/_base/Color",
        "esri/renderers/HeatmapRenderer", "esri/SpatialReference",
        "dojo/_base/array", "esri/geometry/Point",
        "esri/geometry/webMercatorUtils",
        "esri/symbols/PictureMarkerSymbol","esri/geometry/Extent",
        "esri/geometry/Polyline","esri/geometry/ScreenPoint" 
    ],
    function (declare, Query, QueryTask, InfoTemplate, GraphicsLayer,
              ClassBreaksRenderer, Graphic, SimpleMarkerSymbol,
              SimpleLineSymbol, Color, heatmaprenderer, SpatialReference,
              arrayUtils, Point, webMercatorUtils, PictureMarkerSymbol,Extent,
              Polyline,ScreenPoint) {
        return declare(
            null,
            {
                //构造函数
                constructor: function () {
                      //  this._sfzhm=0;
                        this._map= null;
                        this._res=null;
                        this.onepoint=null,//放第一个图标
                        this.thisLayer= new GraphicsLayer();
                        this.lineSysbol= null;
                        this.pointSysbol= null;
                        this.jiantou_Sysbol=null;
                        // lineWidth:8,//底线宽度
                        this.angleArray=[];//角度数组
                        this.lengths=[];//每组的长度
                        this.lengths_fenduan=[];//
                        this.polylineArray = [];//线段
                        this.middlePoint = [];//线段中间的点

                        this.fenduanWidth=20;// 像素
                        this.pointAndPointWidth=3;
                        this.shengyu_length=0;//剩余长度
                    // [[252,158, 203, 1],[0,0,0,0.8]],
                        this.colors=[
                            [[64, 164, 42, 1],[255, 255, 255,0.8]],
                            [[240,102, 87, 1],[255,255,255,0.8]],
                            [[139,66, 249, 1],[255,255,255,0.8]],
                            [[253,137, 22, 1],[0,0,0,0.8]],

                        ];
                },
                init: function (options) {
                    this.clearGuiji();
                    this._map = options.map;
                    this._res=options.res;
                    var num=options.num;
                    this.lineSysbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][0]),6);
                    this.lineSysbol2 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([156, 155, 158, 0.4]),8);
                    this.jiantou_Sysbol=new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color(this.colors[num][1]), 2);
                    this.pointSysbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 6,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                            new Color([156, 155, 158, 0.4]), 1),
                        new Color(this.colors[num][0]));
                    this._map.addLayer(this.thisLayer);
                    this.analysisManPoints();
                    //分析地图的范围
                    this.init_extent();
                    this.addEventListening();
                },
                init_extent:function(){
                    var points_x=[];
                    var points_y=[];
                    dojo.forEach(this._res, function (item) {
                        points_x.push(item.lon);
                        points_y.push(item.lat);
                    })
                    var maxX= Math.max.apply(null,points_x);
                    var maxY= Math.max.apply(null,points_y);
                    var minX= Math.min.apply(null,points_x);
                    var minY= Math.min.apply(null,points_y);

                    var extent = new Extent(minX,minY,maxX,maxY, new SpatialReference({ wkid:4326 }));
                    this._map.setExtent(extent);
                },
                analysisManPoints: function () {
                    //分析获取的点
                    this.angleArray=[];
                    this.lengths=[];//每组的长度
                    this.lengths_fenduan=[];//
                    this.polylineArray=[];

                    for (var i = 1; i < this._res.length; i++) {
                        var p = new Polyline(new SpatialReference({wkid: 4326}));
                        p.addPath([new Point(this._res[i - 1]["lon"], this._res[i - 1]["lat"]),new Point(this._res[i]["lon"], this._res[i]["lat"])]);
                        this.polylineArray.push(p);
                        //将每个点转化为屏幕坐标
                        var pa1= this.MapToscreenPoint([this._res[i]["lon"],this._res[i]["lat"]]);
                        var pa2= this.MapToscreenPoint([this._res[i-1]["lon"],this._res[i-1]["lat"]]);
                        var len=this.getLength(pa1,pa2);
                        this.lengths.push(len);
                        this.lengths_fenduan.push(Math.floor(len/this.fenduanWidth));
                        this.angleArray.push(this.getAngleOfTwoPoint(pa1,pa2));
                        if (i != this._res.length - 1) {
                            this.middlePoint.push(new Point([this._res[i]["lon"], this._res[i]["lat"]]));
                        }
                    }
                    this.animationOfguiji(this._res, this.polylineArray, this.middlePoint);
                },
                animationOfguiji: function (res, polylineArray, middlePoint) {
                    for(var i = 0;i<polylineArray.length;i++){
                        if (i == polylineArray.length-1) {
                            this.thisLayer.add(this.onepoint);
                            //添加终点
                            this.addIconToMap(res[i], 'images/icon/end.png', [0, 12], [23, 40], 'end');
                            this.addIconToMap(res[i], 'images/icon/close10.gif', [10, 45], [12, 14], 'close');

                        } else {
                            if( !res[i] || (!res[i]["lon"] || !res[i]["lat"] ))  return;
                            this.thisLayer.add(new Graphic(middlePoint[i], this.pointSysbol), null, null);
                            this.thisLayer.add(new Graphic(polylineArray[i], this.lineSysbol2), null, null);
                            this.thisLayer.add(new Graphic(polylineArray[i], this.lineSysbol), null, null);
                            res[i]&&this.drawArrows(res,i);
                            if (i == 0) {
                                //添加起点图标
                                this.addIconToMap(res[0], 'images/icon/start.png', [0, 12], [23, 40], 'start',true);
                            }
                        }
                    }
                },
                drawArrows:function(res,i){
                	//画线上的箭头
                	 var  screenPoint=this.MapToscreenPoint([res[i]["lon"],res[i]["lat"]]);

                	 var a=  this.angleArray[i]+90;
                     var psa=this.polar2cartesian(this.pointAndPointWidth,a);
                     var leftpoint=[ screenPoint[0]+psa[0],screenPoint[1]+psa[1]];
                     var leftAllpoint=this.getPointsOfEveryLine(leftpoint,this.angleArray[i],this.lengths[i],i);

                     var b=  this.angleArray[i]-90;
                     var psb=this.polar2cartesian(this.pointAndPointWidth,b);
                     var rightPoint=[screenPoint[0]+psb[0],screenPoint[1]+psb[1]];
                     var rightAllpoint=this.getPointsOfEveryLine(rightPoint,this.angleArray[i],this.lengths[i],i);

                     var c=  this.angleArray[i];
                     var ps=this.polar2cartesian(this.pointAndPointWidth-1,c);
                     var middlePoint=[screenPoint[0]+ps[0],screenPoint[1]+ps[1]];// 中间往上的一点
                     var middleAllpoint=this.getPointsOfEveryLine(middlePoint,this.angleArray[i],this.lengths[i],i);

                     for(var j=0;j<leftAllpoint.length;j++){
                    	 var p = new Polyline(new SpatialReference({wkid: 4326}));
                         p.addPath([this.screenPointToMap(new ScreenPoint(leftAllpoint[j][0], leftAllpoint[j][1])),
                             this.screenPointToMap(new ScreenPoint(middleAllpoint[j][0], middleAllpoint[j][1])),
                             this.screenPointToMap(new ScreenPoint(rightAllpoint[j][0], rightAllpoint[j][1]))
                                    ]);
                       //画到地图上
                         this.thisLayer.add(new Graphic(p, this.jiantou_Sysbol), null, null);
                     }
                },
                getPointsOfEveryLine:function (pointa,angle,lengths,i){
                    //起点  角度   长度   位数
                    var AllPoint=[];
                    var countlen=this.shengyu_length>0?this.shengyu_length:this.fenduanWidth;
                    var countlen=this.fenduanWidth;
                    for(var j=0;j<this.lengths_fenduan[i];j++){
                        if(countlen<=lengths){
                            AllPoint.push(this.getTruePoints(angle,countlen,pointa));
                            countlen+=this.fenduanWidth;
                          }/*else{
                            this.shengyu_length=countlen-lengths;
                         }*/
                       }
                    return AllPoint;
                },
                MapToscreenPoint:function(mapPoint){
                    var screenPoint=this._map.toScreen(new Point(mapPoint[0],mapPoint[1],new SpatialReference({wkid: 4326})));
                    return [screenPoint.x,screenPoint.y];
                },
                screenPointToMap:function(screenPoint){
                    var mapPoint=this._map.toMap(screenPoint);
                    //MXZH.log(mapPoint);
                    return mapPoint;
                },
                addIconToMap: function (point, img, offset, imgsize, IconName,notputtomap) {
                    var pos = new Point(point["lon"], point["lat"], new SpatialReference({wkid: 4326}));
                    var sys = new PictureMarkerSymbol(img, imgsize[0], imgsize[1]);
                    offset && sys.setOffset(offset[0], offset[1]);
                    if(notputtomap){
                        this.onepoint=new Graphic(pos, sys, {name: IconName}, null);
                    }else
                    this.thisLayer.add(new Graphic(pos, sys, {name: IconName}, null));
                },

                clearGuiji: function () {
                    //清除轨迹
                    this.thisLayer.clear();
                    this.angleArray=[];
                    this.lengths=[];//每组的长度
                    this.lengths_fenduan=[];//
                },
                clearGuijiAndslider: function () {
                    this.clearGuiji();
                    if(window.tslder){
                        window.tslder.timeSlider.pause()
                        window.tslder.guijiLayer.clear();
                    }
                    $("#timeSliderDiv").fadeOut(300);
                   // var historyPathIsShow = ( !$('.historyPathQuery').hasClass('historyPathQueryActive') ) ? true : false;
                   // $('.historyPathQuery').toggleClass('historyPathQueryActive', !historyPathIsShow).fadeIn(300);

                },
                startMapExtent:function(){
                    //监听
                    var self=this;
                    this.mapExtenthandle= dojo.connect(this._map,'onZoomEnd',_mapExtentChange);
                    function _mapExtentChange(e){
                        self.clearGuiji();
                        self.analysisManPoints();
                    }
                },
                endMapExtent: function () {
                    dojo.disconnect(this.mapExtenthandle);
                },
                addEventListening: function () {
                    var self=this;
                    dojo.connect(this.thisLayer, 'onClick', function (e) {
                        try {
                            var name = e.graphic.attributes.name;
                        }
                        catch (e) {
                            MXZH.log('错误：' + e.toString());
                        }
                        if (name === 'close') {
                            //关闭轨迹路线
                            self.clearGuijiAndslider();
                            self.endMapExtent();
                        }

                    });
                    dojo.connect(this.thisLayer, 'onMouseOver', function (e) {
                        if(!e.graphic.attributes) return ;
                        try {
                            var name = e.graphic.attributes.name;
                        }
                        catch (e) {
                            MXZH.log('错误：' + e.toString());
                        }
                        if (name === 'close') {
                             //换鼠标
                            self._map .setMapCursor("pointer");
                            MXZH.log(e.graphic)
                          //  'images/icon/close10.gif', [10, 45], [12, 14],
                           var pic =new  PictureMarkerSymbol('images/icon/close10_hover.png', 12, 14);
                            pic.setOffset(10, 45);
                            e.graphic.symbol=pic;
                            self.thisLayer.redraw();
                        }

                    });
                    dojo.connect(this.thisLayer, 'onMouseOut', function (e) {
                        if(!e.graphic.attributes) return ;
                        try {
                            var name = e.graphic.attributes.name;
                        }
                        catch (e) {
                            MXZH.log('错误：' + e.toString());
                        }
                        if (name === 'close') {
                            //换鼠标
                            self._map .setMapCursor("default");
                            var pic =new  PictureMarkerSymbol('images/icon/close10.gif', 12, 14);
                            pic.setOffset(10, 45);
                            e.graphic.symbol=pic;
                            self.thisLayer.redraw();
                        }

                    });

                    this.startMapExtent();

                },
                
                
                
                
                /*
                 * 以下是通用算法 与具体业务无关
                 * wxl
                 */               
 
                /*
                                            极坐标转笛卡尔坐标
                 */
                polar2cartesian: function (R, theta) {
                    var x = R * Math.cos(theta);
                    var y = R * Math.sin(theta);
                    return [x, y];
                },

                /*
                                          根据两个点， 获取长度
                 */
                getLength: function (A, B) {
                    return Math.sqrt((A[0] - B[0]) * (A[0] - B[0]) + (A[1] - B[1])
                        * (A[1] - B[1]));
                },
                getTruePoints:function (theta,R,P){
                    //角度  长度   原位置
                    return   [this.polar2cartesian(R,theta)[0]+P[0],this.polar2cartesian(R,theta)[1]+P[1]];
                },
                //获取两个点 与坐标系之间的角度
                getAngleOfTwoPoint: function (p1,p2){
                    return   Math.atan2(p1[1]- p2[1], p1[0]  - p2[0]);
                }


            });
    });			
				