dojo.declare("Triman.Map.Locus", null, {//轨迹分析
	//构造方法
	constructor: function(trimanmap){
		//内部参数定义
		this.trimanmap=trimanmap;//Triman.Map
		this._lp=null;//参数
		this._locusLy=null;//轨迹图层对象
		this._locusLyId="locusLayer_"+Math.ceil(Math.random()*10000);//轨迹图层ID
		this._playing="playing";
		this._stopped="stopped";
		this._paused="paused";
		this._status=this._stopped;//状态 playing,stopped,paused
		this._curInd=0;//当前播放的位置
		this._slowest=1500;//最慢速度值
		this._running_time_ctl=null;
		this._delstayflag="#DEL#";
		this._zoomExtent=null;
		this._margin=0.002;
		this._trackGraphic=null;
		//内部函数定义
		this._processData=function(){//处理数据后增加停留信息
			if(!(this._lp.isCalcStay||this._lp.mapTrackType=="fullextent"||this._lp.initType=="realtime")) return;
			var sdind=0,isStay=false,d,dis=null;//当前停留点索引，停留状态，当前数据，与停留点的距离
			if(this._lp.locusDatas.length>1){
				for(var i=1;i<this._lp.locusDatas.length;i=i+1){
					d=this._lp.locusDatas[i];
					var pd=this._lp.locusDatas[sdind];
					if(this._lp.mapTrackType=="fullextent"||this._lp.initType=="realtime"){//获取最大范围
						var tmpExtent=new esri.geometry.Extent(d.x - eval(this._margin),
							 eval(d.y) - eval(this._margin), 
							 eval(d.x) + eval(this._margin), 
							 eval(d.y) + eval(this._margin), this.trimanmap.map.spatialReference);
						if(this._zoomExtent==null) this._zoomExtent=tmpExtent;
                		this._zoomExtent=this._zoomExtent.union(tmpExtent);
					}
					if(this._lp.isCalcStay){//处理停留
	        			dis=Math.sqrt(Math.pow(pd.x-d.x, 2) + Math.pow(pd.y-d.y, 2));
	        			//判断是否WGS84坐标系，需要简单转换
	        			dis=this.trimanmap.mapsr.wkid=="4326"?Util.getFlatternDistance(pd.x,pd.y,d.x,d.y):dis;
	       				if(dis>=this._lp.stayRadius){//没有停留
		       				this._lp.locusDatas[sdind].staytime=isStay?this._timeDiff(this._lp.locusDatas[i-1].time,pd.time):"";
		       				sdind=i;
		       				isStay=false;
		       			}else{
		       				this._lp.locusDatas[i].staytime=this._delstayflag;
		       				isStay=true;
		       			}
	       			}
				}
				if(this._lp.isCalcStay&&isStay){//处理最后一条记录的停留
					this._lp.locusDatas[sdind].staytime=
						this._timeDiff(this._lp.locusDatas[this._lp.locusDatas.length-1].time,this._lp.locusDatas[sdind].time);
				}
			}
		};
		this._timeDiff=function(t,pt){//计算停留时间，返回"1年2月3天4小时5分6秒"
			var nd=Math.abs(parseInt(t.substring(0,4),10)-parseInt(pt.substring(0,4),10));
			var yd=Math.abs(parseInt(t.substring(4,6),10)-parseInt(pt.substring(4,6),10));
			var dd=Math.abs(parseInt(t.substring(6,8),10)-parseInt(pt.substring(6,8),10));
			var td=Math.abs(parseInt(t.substring(8,10),10)-parseInt(pt.substring(8,10),10));
			var md=Math.abs(parseInt(t.substring(10,12),10)-parseInt(pt.substring(10,12),10));
			var sd=Math.abs(parseInt(t.substring(12,14),10)-parseInt(pt.substring(12,14),10));
			var timediff="";
			if(nd!=0) timediff+=nd+"年";
			if(yd!=0) timediff+=yd+"个月";
			if(dd!=0) timediff+=dd+"天";
			if(td!=0) timediff+=td+"小时";
			if(md!=0) timediff+=md+"分";
			if(sd!=0) timediff+=sd+"秒";
			return timediff;
		};
		this._playCallBack=function(){//返回结果
			if(typeof this._lp.playCallBack=="function"){
				return this._lp.playCallBack(new Triman.Map.LocusResult(
					{locusData:this._lp.locusDatas[this._curInd],curInd:this._curInd,status:this._status}));
			}
		};
		this._createPointGraphic=function(d,symbol){//创建图标
			return new esri.Graphic(new esri.geometry.Point(d.x, d.y,this.trimanmap.map.spatialReference)
						,symbol,d.attributes);
		};
		this._createLineGraphic=function(d1,d2,symbol){//创建线
			var line=new esri.geometry.Polyline(this.trimanmap.map.spatialReference);
			return new esri.Graphic(line.addPath([new esri.geometry.Point(d1.x,d1.y,this.trimanmap.map.spatialReference),new esri.geometry.Point(d2.x,d2.y,this.trimanmap.map.spatialReference)]),symbol);
		}
		this._addStayLabel=function(d,_self){//添加停留文字标注
			if(d.staytime!=""&&d.staytime!=_self._delstayflag&&_self._lp.isShowStayTime){
				var labelsymol=new esri.symbol.TextSymbol(_self._lp.stayLabelSymbol.toJson()).setText(d.staytime);
		        _self._locusLy.add(new esri.Graphic(new esri.geometry.Point(d.x, d.y,_self.trimanmap.map.spatialReference)
					,labelsymol));
			}
		};
		this._addPoint=function(d,g,_self){//添加起始、结束、普通点
			if(!(_self._lp.isHideOtherStay&&d.staytime==_self._delstayflag)&&g!=null){
				_self._locusLy.add(g);
			}
		};
		this._addTrackPoint=function(d,_self){//添加跟踪点
			if(_self._trackGraphic!=null){
				_self._locusLy.remove(_self._trackGraphic);
			}
			_self._trackGraphic=_self._createPointGraphic(d,new esri.symbol.PictureMarkerSymbol(_self._lp.trackImgUrl,_self._lp.trackImgWidth,_self._lp.trackImgHeight));
			_self._locusLy.add(_self._trackGraphic);
		};
		this._drawLocus=function(){//画轨迹图形，核心功能
			if(this._curInd>this._lp.locusDatas.length-1) {
				this._locusLy.remove(this._trackGraphic);//移除跟踪点
				this.stop();
				return;
			}
			var d=this._lp.locusDatas[this._curInd],tmpgraphic=null,_self=this;
			if(this._curInd==0){//起始点
				tmpgraphic=this._createPointGraphic(d,this._lp.beginSymbol);
			}else if(this._curInd==this._lp.locusDatas.length-1){//结束点
				tmpgraphic=this._createPointGraphic(d,this._lp.endSymbol);
				if(this._lp.isShowLine){//轨迹线
					var d0=this._lp.locusDatas[this._curInd-1];
					this._locusLy.add(this._createLineGraphic(d0,d,this._lp.lineSymbol));
				}
			}else{
				var d0=this._lp.locusDatas[this._curInd-1];
				var d2=this._lp.locusDatas[this._curInd+1]
				if(d&&d.staytime&&d.staytime!=""&&d.staytime!=this._delstayflag){//停留点
					tmpgraphic=this._createPointGraphic(d,this._lp.stopSymbol);
				}else{//普通点
					if(this._lp.isShowNormal){
						var normalSymbol=new esri.symbol.PictureMarkerSymbol(this._lp.normalSymbol.toJson());
						if(this._lp.isNormalAngel){
							normalSymbol.setAngle(Triman.Map.Util.calAzimuthNorth(d.x,d.y,d2.x,d2.y));
						}
						tmpgraphic=this._createPointGraphic(d,normalSymbol);
					}
				}
				if(this._lp.isShowLine){//轨迹线
					this._locusLy.add(this._createLineGraphic(d0,d,this._lp.lineSymbol));
				}
			}
			if(this._lp.mapTrackType=="track"){//地图跟踪控制
				var point=new esri.geometry.Point(d.x, d.y,this.trimanmap.map.spatialReference);
				if(this._curInd==0){//起点
					this.pause();//地图范围变更前先暂停
					this.trimanmap.map.centerAt(point).then(function(){
						_self.trimanmap.map.setLevel(_self._lp.mapTrackLevel).then(function(){
							_self.start();//地图范围变更后继续
							_self._addPoint(d,tmpgraphic,_self);//添加图标
						});
					});
				}else{
					if(!this.trimanmap.map.extent.contains(point)){
						this.pause();//地图范围变更前先暂停
						this.trimanmap.map.centerAt(point).then(function(){
							if(_self._curInd<_self._lp.locusDatas.length-1) _self.start();//地图范围变更后继续
							_self._addPoint(d,tmpgraphic,_self);//添加图标
							_self._addStayLabel(d,_self);//添加停留文字标注
							_self._addTrackPoint(d,_self);//添加跟踪点
						});
					}else{
						this._addPoint(d,tmpgraphic,this);//添加图标
						this._addStayLabel(d,this);//添加停留文字标注
						this._addTrackPoint(d,this);//添加跟踪点
					}
				}
			}else{
				this._addPoint(d,tmpgraphic,this);//添加图标
				this._addStayLabel(d,this);//添加停留文字标注
				this._addTrackPoint(d,this);//添加跟踪点
			}
			if(this._curInd<this._lp.locusDatas.length-1){//调用返回函数,倒数第二个点
				this._playCallBack();
			}
			if(this._curInd>this._lp.locusDatas.length-1){//最后一个点停止
				this._locusLy.remove(this._trackGraphic);//移除跟踪点
				this.stop();
			}else if(this._curInd<this._lp.locusDatas.length){//下一个点
				this._curInd=this._curInd+1;
			}
		};
		this._running=function(){//开始播放
			var _self=this;//很重要，解决变量作用范围问题
			if(this._lp.locusDatas.length>0&&this._status==this._playing){
				this._running_time_ctl=window.setTimeout(function(){_self._drawLocus();_self._running();},this._slowest/this._lp.speed);//递归调用
			}
		};
	},
	initLocus:function(lp){//初始化并分析轨迹数据
		this._lp=lp;
		if(this.trimanmap.map.getLayer(this._locusLyId)==null){//初始化轨迹图层
			this._locusLy=new esri.layers.GraphicsLayer({id:this._locusLyId,displayOnPan:!dojo.isIE});
			this.trimanmap.map.addLayer(this._locusLy);
		}
		this._processData();//深度处理数据
		return this._lp.locusDatas;
	},
	start:function(){//开始
		if(this._lp.initType=="history"){
			if(this._status!=this._playing){
				if(this._status==this._stopped) this._locusLy.clear();
				if(this._lp.mapTrackType=="fullextent"){//设置最大范围
					this.trimanmap.map.setExtent(this._zoomExtent.expand(2));
				}
				this._status=this._playing;
				this._running();
			}
		}else if(this._lp.initType=="realtime"){
			
		}
	},
	pause:function(){//暂停
		window.clearTimeout(this._running_time_ctl);
		this._status=this._paused;
		this._playCallBack();
	},
	stop:function(){//停止
		window.clearTimeout(this._running_time_ctl);
		this._status=this._stopped;
		this._playCallBack();
		this._curInd=0;
	},
	getPlayStatus:function(){//获取播放状态
		return this._status;
	},
	setSpeed:function(speed){//设置速度
		this._lp.speed=speed;
	},
	setLocusDatas:function(lds){//设置轨迹数据
		this.stop();
		this._lp.locusDatas=lds;
		this._processData();//深度处理数据
	},
	showHistoryTrack:function(){//一次性显示历史轨迹
		this.trimanmap.map.setExtent(this._zoomExtent.expand(2));
		for(var i=0;i<this._lp.locusDatas.length;i=i+1){
			var d=this._lp.locusDatas[i],tmpgraphic=null;
			if(i==0){//起始点
				tmpgraphic=this._createPointGraphic(d,this._lp.beginSymbol);
			}else if(i==this._lp.locusDatas.length-1){//结束点
				tmpgraphic=this._createPointGraphic(d,new esri.symbol.PictureMarkerSymbol(this._lp.trackImgUrl,this._lp.trackImgWidth,this._lp.trackImgHeight));
				this._trackGraphic=tmpgraphic;
				this._locusLy.add(this._createLineGraphic(d0,d,this._lp.lineSymbol));
			}else{
				var d0=this._lp.locusDatas[i-1];
				if(d.staytime&&d.staytime!=""&&d.staytime!=this._delstayflag){//停留点
					tmpgraphic=this._createPointGraphic(d,this._lp.stopSymbol);
				}
				this._locusLy.add(this._createLineGraphic(d0,d,this._lp.lineSymbol));
			}
			this._addPoint(d,tmpgraphic,this);//添加图标
			this._addStayLabel(d,this);//添加停留文字标注
		}
	},
	addTrackData:function(ld){//添加跟踪数据
		var tmpld=ld,_self=this;
		var d0=this._lp.locusDatas[this._lp.locusDatas.length-1];
		var point=new esri.geometry.Point(ld.x, ld.y,this.trimanmap.map.spatialReference);
		this._locusLy.add(this._createLineGraphic(d0,ld,this._lp.lineSymbol));
		if(this._lp.isCalcStay){//动态计算停留
			//to do
		}
		this._lp.locusDatas.push(tmpld);
		if(!this.trimanmap.map.extent.contains(point)){
			this.trimanmap.map.centerAt(point).then(function(){
				_self._addStayLabel(ld,_self);//添加停留文字标注
				_self._addTrackPoint(ld,_self);//添加跟踪点
			});
		}else{
			this._addStayLabel(ld,this);//添加停留文字标注
			this._addTrackPoint(ld,this);//添加跟踪点
		}
		
	},
	clear:function(){
		this._locusLy.clear();
	}
});
dojo.declare("Triman.Map.LocusParam", null, {//轨迹参数类
	initType:"history",//"history":历史轨迹,"realtime":实时跟踪
	speed:10,//轨迹速度,从慢到快分别为1-100，实时跟踪时无效
	trackImgUrl:"",//跟踪图标URL（只出现在最新的点上）
	trackImgWidth:18,//跟踪图标宽度
	trackImgHeight:18,//跟踪图标高度
	isCalcStay:true,//是否计算停留时间
	isShowStayTime:true,//是否显示停留时间
	isHideOtherStay:true,//是否隐藏多余停留点
	isShowNormal:true,//是否显示普通点,实时跟踪一定不显示
	isNormalAngel:true,//是否对普通点旋转角度,IE6、7、8建议设置为false
	isShowLine:true,//是否显示轨迹线,实时跟踪一定显示
	stayRadius:10,//停留半径,单位米
	mapTrackType:"fullextent",//地图跟踪方式，initType为realtime时只能是track
							  //"fullextent":全视野(地图默认放大到最适合的大小),"track":跟踪最新点的位置
	mapTrackLevel:6,//地图跟踪级别
	//数据必须是已经按照时间从早到晚排序的
	locusDatas:[],//locusData数组，详细内容请参考Triman.Map.LocusData
	playCallBack:null,//播放回调函数
	beginSymbol:null,//开始图标样式，不建议修改
	endSymbol:null,//结束图标样式，不建议修改
	normalSymbol:null,//普通图标样式，不建议修改，箭头朝正北
	stopSymbol:null,//停留图标样式，不建议修改
	stayLabelSymbol:null,//停留文字样式，不建议修改
	lineSymbol:null,//轨迹线样式，不建议修改
	constructor: function(json){
		this.trackImgUrl=Triman.Map.Graphic.defaultImageUrl;
		this.trackImgWidth=Triman.Map.Graphic.defaultImageWidth;
		this.trackImgHeight=Triman.Map.Graphic.defaultImageHeight;
		this.beginSymbol=Triman.Map.Graphic.defaultBeginSymbol;
		this.endSymbol=Triman.Map.Graphic.defaultEndSymbol;
		this.normalSymbol=Triman.Map.Graphic.defaultNormalLocusSymbol;
		this.stopSymbol=Triman.Map.Graphic.defaultStopSymbol;
		this.stayLabelSymbol=Triman.Map.Graphic.defaultStayLabelSymbol;
		this.lineSymbol=Triman.Map.Graphic.defaultLocusLineSymbol;
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
			if(this.initType=="realtime") this.mapTrackType="track";
		}
    }
});
dojo.declare("Triman.Map.LocusData", null, {//轨迹数据类
	id:null,//唯一值，不为空且唯一，若数据没有唯一值可以用序号
	x:null,y:null,//坐标,不为空
	time:"",//时间，不为空,格式:"yyyymmddhh24miss"
	staytime:"",//停留时间，可以为空，已提供计算功能,格式:"1年2月3天4小时5分6秒"
	attributes:{},//其它属性,格式为JSON
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});
dojo.declare("Triman.Map.LocusResult", null, {//轨迹播放时，返回的数据
	locusData:null,//播放的轨迹数据
	curInd:0,//播放位置索引
	status:"",//播放状态，"playing","stopped","paused"
	constructor: function(json){
		if(typeof json!="undefined"){
			dojo.safeMixin(this,json);
		}
    }
});
