/*
 * 标记小控件
 * 王新亮
 * 2017/6/13 
 */
var is_Mark = false;
/*var marker = []; {
	id_:'',
	title:'',
	content:''
};

var points = {}*/
var currentId = 0;
dojo.declare("Wang.Map.mark",
	null,
	{
		titles_text : {},
		iconLayer : new esri.layers.GraphicsLayer({
			className : 'icon_layer'
		}),
		textLayer : new esri.layers.GraphicsLayer({
			className : 'text_layer'
		}),
		constructor : function(opts) {
			if (!opts) {
				throw ("map参数不能为空！");
			}
			this.map = opts.map;
			this.map.addLayers([this.iconLayer,this.textLayer]);
			var self = this;
			is_Mark = true;
			//改变鼠标样式
			self.map.setMapCursor("url(" + WangConfig.IMG.range_cur + "),auto");
			currentId++;

			dojo.connect(self.map, "onClick", function(e) {
				if (is_Mark) {
					self.setPointTOMap(e.mapPoint, self);
					//弹窗
					self.showInfowind(e);
					//定位到中心
					self.map.centerAt(e.mapPoint);
				}
			});
			dojo.connect(self.iconLayer, 'onClick', function(e) {
				//在弹出来
				var attr = e.graphic.attributes;
				if (attr) {
					self.showInfowind(e, attr, true);
				} 

			});
			dojo.connect(self.iconLayer, 'onMouseMove', function() {
				self.map.setMapCursor("pointer");
			});
			dojo.connect(self.iconLayer, 'onMouseOut', function() {
				self.map.setMapCursor("default");
			});

		},
		initHtml : function(obj) {
			var c="",t="";
			if(obj && obj['content']){
				c=obj['content'];
			}
			if(obj && obj['title']){
				t=obj['title']
			}
			return "<label class='layui-form-label labers_mark'>标题：</label> <div class='layui-input-block blocks_mark'>" +
				"<input type='text' name='title' required  lay-verify='required' placeholder='请输入标题' autocomplete='off' class='layui-input title_mark' value=" + t + "></div>" +
				"<div class='layui-form-item layui-form-text'>" +
				"<label class='layui-form-label labers_mark'>内容：</label>" +
				" <div class='layui-input-block blocks_mark' >" +
				" <textarea name='desc' placeholder='请输入内容' class='layui-textarea mark_area'>" + c+ "</textarea>" +
				"</div> </div><div class='layui-input-block' style='margin-left: 144px;min-height:0px'> <button class='layui-btn layui-btn-primary layui-btn-mini save_mark'  lay-submit lay-filter='formDemo' style='background-color:#fff'>提交</button>" +
				" <button type='reset' class='layui-btn layui-btn-primary layui-btn-mini delete_mark' style='background-color:#fff'>删除</button> </div>";
		},
		showInfowind : function(e, attr, merge) {
			this.map.infoWindow.setTitle('我的标记');
			this.map.infoWindow.setContent(this.initHtml(attr));
			this.map.infoWindow.show(
				e.screenPoint,
				this.map.getInfoWindowAnchor(e.screenPoint));
			is_Mark = false;
			this.map.setMapCursor("default");
			var self = this;
			var attr=attr;
			 var id_;
			    if(attr && attr.id){
			    	id_=attr.id;
			    }else{
			    	id_=currentId;
			 }
			$(".save_mark").on('click', function() {
				var val = $(".title_mark").val();
				var text = $.trim(val) || "我的标记" + currentId;
				if (text.length > 5)
					text = text.substring(0, 5) + ".."
				var textArea = $(".mark_area").val();
			   	if (attr) {
					var re;
					dojo.forEach(self.textLayer.graphics, function(item) {
						if (item && item.attributes.id ==id_ && item.attributes.type == 'text') {
							re=item;
						}
					});
					re && self.textLayer.remove(re);
					self.iconLayer.redraw();
				} 
			    var textPoint=new esri.geometry.Point(e.mapPoint,new esri.SpatialReference({
			    	wkid:4326
			    }));
				self.textLayer.add(new esri.Graphic(textPoint, self.getTextSybol(text, 12, '#333'), {
					type : 'text',
					id : id_,
					other : e,
				}))
				$(".icon_layer").find("text").attr({
					"fill" : '#333',
				});
				var iconLayerre;
				dojo.forEach(self.iconLayer.graphics, function(item) {
					if (item.attributes.id ==id_ ) {
						iconLayerre=item;
					}
				});
				iconLayerre.attributes.title=text;
				iconLayerre.attributes.content=textArea;
				self.map.infoWindow.hide();
			});
			$(".delete_mark").on('click', function() {
				self.map.infoWindow.hide();
				dojo.forEach(self.iconLayer.graphics, function(item) {
					if (item && item.attributes.id == id_) {
						self.iconLayer.remove(item);
					}
				});
				dojo.forEach(self.textLayer.graphics, function(item) {
					if (item && item.attributes.id == id_) {
						self.textLayer.remove(item);
					}
				});
			})
		},
		getTextSybol : function(text, size, color) {
			// 图标之上放文字
			var color = new dojo.Color(color);
			var _font = esri.symbol.Font;
			var font = new _font(size + "px", _font.STYLE_NORMAL,
				_font.VARIANT_NORMAL, _font.WEIGHT_NORMAL,
				"Microsoft YaHei");
			var textsbol = new esri.symbol.TextSymbol(text, font, color);
			textsbol.setOffset(35, -5);
			return textsbol;
		},
		setPointTOMap : function(point, s) {
			s.iconLayer.add(new esri.Graphic(point, s.getPicSYS(), {
				type : 'icon',
				id : currentId,  //标记id
				title : '',  //标记标题
				content : ''  //标记内容
			}))
		},
		getPicSYS : function() {
			return new esri.symbol.PictureMarkerSymbol('mx/public/images/biaoji2.png', 10, 22);
		}
	});