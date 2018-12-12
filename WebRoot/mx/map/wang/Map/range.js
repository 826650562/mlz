/**
 * 王新亮
 * 测距小工具
 * 20161214
 */
dojo.declare("Wang.Map.range",
					null,
					{  
						constructor : function(opts) {
							if (!opts) {
								throw ("map参数不能为空！");
							}
							this.ranges=[];
							this.map=opts.map;
							//this.initDraw();
							var self=this;
							dojo.connect(this.map,"onClick",  getPointsOfClick);
						 	function getPointsOfClick (e){
								dojo.require("esri.geometry.geodesicUtils");
				        	    if(self.beginRange){
								//将这些点 放到地图上
								self.path.push(MXZH.MercatorToGeo(e.mapPoint));
								self.dompoints.add( new esri.Graphic(e.mapPoint,self.getMarkerSymbol()));
								var g= self.dompoints.graphics;
								if(g.length==1){
									//第一个节点
									//显示起点
									var geo=g[0].geometry;
									self.setpicAndTexy(geo,"起点",self.dompoints);
								}else{
									//显示距离
									var polyline = new esri.geometry.Polyline(new esri.SpatialReference({wkid:4326}));
									 polyline.addPath(self.path);
									self.sumdis  = Number(esri.geometry.geodesicUtils.geodesicLengths([polyline], esri.Units.KILOMETERS));
									self.sumdis= Math.round(self.sumdis*100)/100; 
								    var distext=self.sumdis+"公里";
									self.setpicAndTexy(self.path[self.path.length-1],distext,self.dompoints,self.getlengthOfpic(self.sumdis),40);
								 }
				        	   }
							} 
						},
						initDraw:function(){
							  this.path=[];
							  this.sumdis=0;
							  //初始化画图工具
							  dojo.require("esri.toolbars.draw");
							  this.tb = new esri.toolbars.Draw(this.map);
							   //转变鼠标样式
							  this.map.setMapCursor("url("+WangConfig.IMG.range_cur+"),auto");
							  this.tb.setLineSymbol(this.getLineSymbol(0.4));
							  var self=this;
							  this.beginRange=true;
					          this.tb.on("draw-complete", getGraphic);
					          this.tb.activate(esri.toolbars.Draw.POLYLINE);
					          
					      	  this.dompoints=new esri.layers.GraphicsLayer();//节点图层
							  this.lineLayer=new esri.layers.GraphicsLayer();//线图层
							  
					          this.map.addLayers([this.lineLayer,this.dompoints]);
					          this.ranges.push([this.lineLayer,this.dompoints]);
						      dojo.connect(this.dompoints,'onClick', deleteLayer);
						        var self=this;
						      	function deleteLayer (e){
						        	  //删除测距线
						      		  var attr=e.graphic.attributes;
						        	  if(attr && attr.type=="delete"){
						        		  self.clearRange(attr.id,self);
						        	  }
						           } 
					            function getGraphic (e){
									//获取画图工具所得的图形
					        	  self.lineLayer.add(new esri.Graphic(e.geometry,self.getLineSymbol(0.6)));
									//self.layers.push(this.lineLayer); 
									self.tb.deactivate();//停止笔画
									self.beginRange=false;
									self.map.setMapCursor("default");
									//添加一个删除点
									var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(WangConfig.IMG.range_close, 12, 14);
									pictureMarkerSymbol.setOffset(15, 15);
									var key=e.geometry.paths[0].length-1;
									self.dompoints.add( new esri.Graphic(MXZH.MercatorToGeo(new esri.geometry.Point(e.geometry.paths[0][key])),pictureMarkerSymbol,
											{type:'delete',id:self.ranges.length-1}));
								} 
						   },
						setpicAndTexy:function(geo,text,layer,width,offsetX){
							//返回 一个图片文本和文字
							var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(WangConfig.IMG.range_ceju, width-5||40, 15);
							var font = new esri.symbol.Font("8pt", esri.symbol.Font.STYLE_NORMAL,
									esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_NORMAL,"微软雅黑");
							var TSymbol =new esri.symbol.TextSymbol(text, font, new esri.Color([156,156,156,0.8]));
							pictureMarkerSymbol.setOffset(width-25||30, 0);
							TSymbol.setOffset(width-25||30, -5);
							layer.add(new esri.Graphic(geo,pictureMarkerSymbol));
							layer.add(new esri.Graphic(geo,TSymbol));
						},
						clearRange:function(id,self){
							//清除线 点
							self.map.removeLayer(this.ranges[id][0]);
							self.map.removeLayer(this.ranges[id][1]);
							this.path=[];
							this.sumdis=0;
						},
						getlengthOfpic:function(string){
							//根据字符多少求出来 图片大概长度
							//一个字符一个  像素   一个中文两个像素
							return  (string.toString().length+4)*8;
						},
						getLineSymbol:function(opcity){
						  return  new esri.symbol.SimpleLineSymbol(
								  esri.symbol.SimpleLineSymbol.STYLE_SOLID,
								    new esri.Color([255,0,0,opcity]),
								    3
								  );
						},
						getMarkerSymbol:function(opcity){
							  return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
									    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
									    	    new esri.Color([180,99,255]), 2),
									    	    new esri.Color([255,0,0,1]));
							},
		});





