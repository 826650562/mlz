INDEX_gztcs=[];
jQuery(document).ready(function() {
	MXZH.gztcCF = function() {};
	MXZH.gztcCF.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.deletePopUps();
			this.gztc.init();
			this.gztc.dealWithQueryfeaturesInfo();
			this.addEventListener();
			layui.use([ "element", "layer", "form" ], function() {
				element = layui.element();
				form = layui.form();
				layer = layui.layer;
				element.on('nav(demo)', function(elem) {});
			});
		},
		config : {
			BtnArray : [ ".gztcButton", ".layui-layer-btn0", '.gztc_search_button' ]
		},
		addEventListener : function() {
			var self = this;
			this.inputValues = {};
			var iframe = $("#layer_gztc").find("iframe")
			window.INDEX_gztc && $($("#layui-layer-iframe" + INDEX_gztc).contents().find(".addgztc")).unbind().click(function() {
				//画画
				//获取推送距离
				var Length = $.trim(iframe.contents().find("option:selected").eq(0).text());
				Length = Length.replace("米", '');
				if (!Length) {
					MXZH.msgOfsswz("画图之前请输入推送范围！");
					return false;
				} else {
					self.gztc.wangMapGztc.drawPointFeature(Length);
				}
				self.inputValues['TSLength'] = Length;
			});
			$(this.config.BtnArray[0]).unbind().click(function(e) {
				//打开弹出框
				self.addPopUps();
			});

			$(this.config.BtnArray[1]).unbind().click(function(e) {
				//保存
				self.inputValues['fName'] = iframe.contents().find('.fName').val().replace(/</g,'').replace(/>/g,''); //name
				var d=new Date();
				self.inputValues['fdate'] = d.Format("yyyy-MM-dd hh:mm:ss");
				self.inputValues['fcjpeo'] = iframe.contents().find('.fcjpeo').val().replace(/</g,'').replace(/>/g,'');
				self.inputValues['gznr'] = iframe.contents().find('#gznr').val();
				self.inputValues['img'] = iframe.contents().find('.gztc_slt').find("img").attr('src');
				self.checkJjqu();
			});
			$(this.config.BtnArray[2]).unbind().click(function() {
				var searchs = {};
				searchs.GztcBeginDate = $.trim($("#search_Begdate").val());
				searchs.GztcEndDate = $.trim($("#search_enddate").val());
				searchs.Gztcnr = encodeURI($.trim($("#gztc_seach_nr").val()));
 
				/*if(!searchs.GztcBeginDate || !searchs.GztcEndDate){
					MXZH.msgOfsswz('时间不能为空！');
					return false;
				}*/
				
				//检查字段
				var d1 = new Date(searchs.GztcBeginDate.replace(/-/g, '/'));
				var d2 = new Date(searchs.GztcEndDate.replace(/-/g, '/'));
				if (Number(d1) > Number(d2)) {
					MXZH.msgOfsswz('开始时间不能大于结束时间！');
					return false;
				}
				self.gztc.gztc_search(searchs);
			});
		},
		addBufferInfoToinputValues : function() {
			var gs = this.gztc.wangMapGztc.drawGrcLayer.graphics;
			if (gs.length < 2) {
				MXZH.msgOfsswz('没有绘制警戒区或者有图形错误！');return;
			}
			var layerStrMap = {};
			dojo.forEach(gs, function(g, index) {
				g.geometry=MXZH.MercatorToGeo(g.geometry);
				var strOfLayer = JSON.stringify(g.toJson());
				var Str = strOfLayer.replace(/"/g, "'");
				if (g.attributes.geotype == "polygon") {
					layerStrMap['MyPolygon'] = Str;
				}
				//g.geometry=MXZH.MercatorToGeo(g.geometry);
				if (g.attributes.geotype == "point") {
					layerStrMap['Mypoint'] = Str;
				}
			});
			dojo.mixin(this.inputValues, layerStrMap);
			//当数据获取完成后保存
            this.gztc.wangMapGztc.drawGrcLayer.clear();
			this.gztc.dealWithSave(this.inputValues);
		},
		checkJjqu : function() {
			//检查数据
			if (!$.trim(this.inputValues['fName'])) {
				MXZH.msgOfsswz("名称不能为空！");
				return false;
			}
			if ($.trim(this.inputValues['fName']).length > 18) {
				MXZH.msgOfsswz("名称在18个字符以内！");
				return false;
			}

			if (!$.trim(this.inputValues['gznr'])) {
				MXZH.msgOfsswz("内容不能为空！");
				return false;
			}
			if ($.trim(this.inputValues['gznr']).length > 500) {
				MXZH.msgOfsswz("内容不能超过500个字符！");
				return false;
			}
			if (!$.trim(this.inputValues['fcjpeo'])) {
				MXZH.msgOfsswz("采集人不能为空！");
				return false;
			}
			if ($.trim(this.inputValues['fcjpeo']).length > 10) {
				MXZH.msgOfsswz("采集人不能超过10个字符！");
				return false;
			}
			this.addBufferInfoToinputValues();
		},
		deletePopUps : function() {
			layui.use([ 'layer' ], function() {
				var layer = layui.layer;
				window.INDEX_gztc && INDEX_gztcs.length  && layer.close(INDEX_gztcs[0]);
				INDEX_gztcs=[];
			})
		},
		addPopUps : function() {
			var self=this;
			INDEX_gztc = layer.open({
				id : "layer_gztc",
				title : '新建感知要素',
				type : 2,
				shade : 0,
				shift:-1,
				btn : [ "确定" ],
				btnAlign : 'c',
				offset : [ '80px', '480px' ],
				area : [ '350px', '450px' ],
				content : [ 'mx/gztc/iframe_addgztc.jsp', 'no' ],
				cancel : function(index, layero) {
					cancelCreate(index, layero);
				},
				btn2 : function(index, layero) {
					cancelCreate(index, layero);
				}
			});
			INDEX_gztcs.push(INDEX_gztc)
		  function cancelCreate(index,layero){
				self.gztc.wangMapGztc.drawGrcLayer.clear();
				self.gztc.wangMapGztc.tb && self.gztc.wangMapGztc.tb.deactivate();
				layer.close(index);
				INDEX_gztcs=[];
		  }	
		},
		destroy : function() {
			this.deletePopUps();
			this.gztc.wangMapGztc.clearGrcLayer();
			if(this.gztc.wangMapGztc.tb){
				$("#cjbutton").fadeIn(300);$("#bjbutton").fadeIn(300);
				this.gztc.wangMapGztc.tb.deactivate();
			}  
			this.gztc.wangMapGztc.drawGrcLayer.clear();
		},
		gztc : new MXZH.Gztc()
	};
});