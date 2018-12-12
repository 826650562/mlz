/*
 * 图层控制
 * 王新亮
 * 2017/08/11
 * 该功能实现对一些已发布的服务在地图上进行展示，隐藏等控制 
 */WangConfig
dojo.declare("Wang.Map.layerControler",
	null,
	{
	    ContrLayer:[],//所有的图层
	    config:{},
	    button:$("#tcbutton"),
	    container:$('.layerContor'),
		constructor : function(opts) {
			if (!opts) {
				throw ("map参数不能为空！");
			}
			var s=this;
			this.map = opts.map;
			this.config=WangConfig.services.layerControler;
			//this.map.addLayers(ContrLayer);
			this.checkoutShow();
			//判断类型 并 显示
			this.addLayerInfotoHtml();
			layerControlFun=function(data,all){
				  if(all){
					  //假如 全选了
					  data.elem.checked?s.showServices(null,true):s.showServices(null,false);
				  }else{
					  data.elem.checked?s.showServices(data.value,true):s.showServices(data.value,false); 
				  }
			}
		},
		showServices:function(value,isopen){
			if(!value){
				  dojo.map(this.ContrLayer,function(l){
					  isopen?l.show():l.hide();
				  })	
			}else{
				 dojo.map(this.ContrLayer,function(l){
					  if(l.className==value){
						  isopen?l.show():l.hide();
					  }
				  })
			}
		},
		checkoutShow:function(){
			//判断是否显示
		 
			if(this.config.buttonVisible){
                            $("#tcbutton").css('display','block')
                         }else
                            $("#tcbutton").css('display','none')
 
		},
		addLayerInfotoHtml:function(){
			var html='';this.ContrLayer=[];
			for(o in this.config.services){
				var valus=this.config.services[o];
				this.addFeatureLayuers(valus);
				html+=" <tr><td><input lay-filter='mychoose'  value="+valus[0]+" type='checkbox' name='' lay-skin='primary'></td><td>"+valus[0]+"</td></tr> ";
			}
			$('.layerContainer').html(html);
		},
		addFeatureLayuers:function(values){
			 var infoTemplate = new esri.InfoTemplate("${name}","<div>名称：${name}</div>");
			 var f =new esri.layers.FeatureLayer(values[2],{
				 className:values[0],
				 infoTemplate: infoTemplate,
				 outFields: ["*"]
			 });
			 switch(values[1]){ 
			   case 'point':
				  var symbol= new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10,
						    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
						    new esri.Color([255,0,0]), 1),
						    new esri.Color([0,255,0,0.25]));
				   var renderer = new esri.renderer.SimpleRenderer(symbol);
				   f.setRenderer(renderer);
				   break;
			   case 'polygon':
				   var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([255,0,0,0.5]));
				   var renderer = new esri.renderer.SimpleRenderer(symbol);
				   f.setRenderer(renderer);
				   break;
			 }
			/*f.visible=false;*/
			this.ContrLayer.push(f);
			this.map.addLayer(f);
			f.hide();
		}
 
	});