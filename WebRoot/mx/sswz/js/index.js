/*
 *实时位置组件
 *wxl
 *2017-04-10  密讯2.0
 *使用方法是实例化控制器类，实时位置类并不暴露出去 
 */

/*********************************************************************************************/
/*
 * 实时位置业务逻辑类，具体功能在该类里面
 * 通过配置类调用
 */
jQuery(document).ready(function() {
	//实时位置的的业务逻辑
	var sswzLayer=null;
	var jjqyLayers=null;
	MXZH.sswz = function(opts) {
		//元素图层
		this.init(opts);
		this.groupRes = {};
		this.isReady = false;
		this.msg = '数据尚未就绪，请稍等！';
		//this.initialize = _.once(this.msgOfsswz);
		this.usernameOfsencend = []; //使用第二种颜色的成员集合
		this.useridOfsencend = [];
		this.nameOfsencend = [];
		this.userOfsencend = [];
		this.xmin_max = [-1000, 140000000 ];
		this.ymin_max = [ -1000, 140000000 ];
		this.isLoop = true;
		this.is_taned = false;
		this.titleDiv = null;
	};
	MXZH.sswz.prototype = {
		init : function(opts) {
			if(sswzLayer){
				MXZH.mainMap.wangMap.map.removeLayer(sswzLayer);
			} 
			
			sswzLayer = new esri.layers.GraphicsLayer({
				className : 'sswz'
			});
			MXZH.mainMap.wangMap.map.addLayer(sswzLayer);
			
			if(jjqyLayers){
				MXZH.mainMap.wangMap.map.removeLayer(jjqyLayers);
			}
			/*dojo.connect(MXZH.mainMap.wangMap.map,"onClick",function(e){
				MXZH.log(e.mapPoint.x,e.mapPoint.y);
			});*/
			jjqyLayers= new esri.layers.GraphicsLayer({
				className : 'jjqy'
			});
			MXZH.mainMap.wangMap.map.addLayer(jjqyLayers);
			this.config = opts;
			//this.config.map && this.config.map.addLayers([this.graLayer]);
			this.groups = []; //分組情況
			this.exent = this.config.map.extent;
		},
		addBufferLayer : function(bufferArray, id) {
			//添加从数据库中的的缓冲数据
			var self = this;
			//jjqyLayers.clear();
			dojo.forEach(bufferArray, function(b, index) {
				var gra = JSON.parse(b.replace(/'/g, "\""));
				gra.attributes['Layertype'] = 'list_buffer';
				gra.attributes['id'] = id;
				jjqyLayers.add(new esri.Graphic(gra));
			})
			// MXZH.getMap.addLayer(jjqyLayers);
		},
		showPoint : function(pointList, self) {
			if (pointList[0].length <= 0 ) {
				self.isReady = false;
				self.msg = '暂无用户上传新位置数据！';
				//self.initialize();
				!this.is_taned && self.msgOfsswz(self.msg);
				this.is_taned = true;
				MXZH.effectController.loading(false);
				return;
			}
			// 遍历所有的点 并添加到地图中
			dojo.connect(sswzLayer, 'onMouseOver', function(e) {/*
				var left = e.clientX || e.screenX || e.pageX;
				var top = e.clientY || e.screenY || e.pageY;
				if (left && top) {
					$("<label class='title_label'>" + e.graphic.attributes.name + "</label>").css({
						'position' : 'absolute',
						'left' : left + 10 + "px",
						'top' : +top + "px",
						'width' : 'auto',
						' height' : "30px",
						'background' : 'azure',
						'padding' : '0px 4px'
					})
						.appendTo($("body"))
				}
			*/})
			dojo.connect(sswzLayer, 'onMouseOut', function(e) {
			   //$(".title_label").remove();
			})
			//显示人员信息
	/*		dojo.connect(sswzLayer,'onClick',function(e){
				var map=MXZH.mainMap.wangMap.map;
				var attr=e.graphic.attributes;
				var point=e.graphic.geometry;
				map.infoWindow.setTitle(attr.user_name);
				var speed=attr.speed>0?attr.speed:0;
				var qy=attr.qy==null?"无数据":attr.qy;
				var html="<div class='alert_content'> <ul><li>姓名："+attr.user_name+" </li> <li>街镇："+attr.officeName+" </li><li>人员名称："
				+attr.roleName+" </li><li>当前检查企业："+qy+"</li> <li>速度："+speed+" 千米/小时</li> <li>位置："
				+attr.lon +","+attr.lat+"</li>" 
				+"<li>定位方式："+attr.signal_source+"</li><li>检查企业数："+attr.qyNum
				+"</li><li>发现隐患数："+attr.fxNum+"</li><li>复查隐患数："+attr.fcNum
				+"</li><li>行程公里数："+attr.schedAll+"公里</li></ul> </div> ";
				map.infoWindow.setContent(html);
				map.infoWindow.show(point);
				$(".alert_footer_text").unbind().click(function(){
					self.calluser(attr.user_name);
				});
			});*/
				dojo.connect(sswzLayer,'onClick',function(e){
				var map=MXZH.mainMap.wangMap.map;
				var attr=e.graphic.attributes;
				var point=e.graphic.geometry;
				map.infoWindow.setTitle(attr.name);
				var speed=attr.speed>0?attr.speed:0;
				var qy=attr.qy==null?"无数据":attr.qy;
				var html="<div class='alert_content'> <ul><li>姓名："+attr.name+" </li> <li>单位："+attr.office_name+" </li><li>当前检查企业："+qy+"</li> <li>速度："+speed+" 千米/小时</li> <li>位置："
				+attr.lon +","+attr.lat+"</li>" 
				+"<li>定位方式：GPS</li> </ul> </div> ";
				map.infoWindow.setContent(html);
				map.infoWindow.show(point);
				$(".alert_footer_text").unbind().click(function(){
					self.calluser(attr.user_name);
				});
			});
			
			
			var yhattr = [];
			var mbattr = [];

			var yhpoints = [];
			var mbpoints = [];

			var yhPointList = pointList[0];
			var mbPointList = pointList[1]; //目标对象
			for (var i = 0; i < yhPointList.length; i++) {
			/*	yhpoints.push(MXZH.ToWebMercator(new esri.geometry.Point(
						MXZH.bd09togcj02(yhPointList[i].lon,yhPointList[i].lat),
						new esri.SpatialReference({
							wkid : WangConfig.constants.wkt
						}))));
				yhattr.push(yhPointList[i]) ;*/
				
				yhpoints.push(MXZH.ToWebMercator(new esri.geometry.Point( [yhPointList[i].lon,yhPointList[i].lat],
						new esri.SpatialReference({
							wkid : WangConfig.constants.wkt
						}))));
				yhattr.push(yhPointList[i]) ;
			}
 
			self.fillDatasHtml([ yhpoints, yhattr ], self.addPointsToMap);
			//self.addPointsToMap2(mbpoints, mbattr);
			MXZH.effectController.loading(false);
		},
		calluser:function(user_name){
			MXZH.log(user_name);
		},
		addPointsToMap : function(points, attr) {
			// 参数：points类型的点对象
			// 首先清空之前的位置（既图标和文字）
			sswzLayer && sswzLayer.clear();
			if (!this.isLoop) return;
			for (var i = 0; i < points.length; i++) {
				//过滤不正常坐标 不显示
				if (this.xmin_max[0] <= points[i].x && this.xmin_max[1] >= points[i].x
					&& this.ymin_max[0] <= points[i].y && this.ymin_max[1] >= points[i].y) {
					var text = attr[i].name || '无';
					var tCount = this.countByteLength(text, 1);
					var rtext = '';
					if (tCount > 8) {
						// 超过三个字用长的图标
						rtext = text.substr(0, 8) + "..";
					} else {
						rtext = text;
					}
					var img1 = WangConfig.IMG.sswz_mapPeoXtbFour;
					var img2 = WangConfig.IMG.peonameBlue;
					if (dojo.indexOf(this.usernameOfsencend, attr[i].user_name) >= 0) {
						img1 = WangConfig.IMG.sswz_mapPeoXtb;
						img2 = WangConfig.IMG.peonameGreen;
					}
					var picSybol = this.getSybols(attr[i].direction, null, img1, [ 24, 32 ]); //是否要进行计算
					var picSybolOfName = this.getSybols(null, [ 50, -4 ], img2, [ 65, 20 ]); //需要进行偏移 
					var textSybol = this.getTextSybol(rtext, [ 50, -8 ]); //需要进行偏移 
					sswzLayer.add(new esri.Graphic(points[i], picSybol, attr[i], null)); //图片
					sswzLayer.add(new esri.Graphic(points[i], picSybolOfName,dojo.safeMixin(attr[i],{
						user_name : attr[i].user_name,
						name : text,
						type : 'picSybolOfName'
					}) , null)); //名称下的图片图形
					sswzLayer.add(new esri.Graphic(points[i], textSybol,dojo.safeMixin(attr[i],{
						user_name : attr[i].user_name,
						type : 'picSybolOfName',
						name : text,
						type : 'name'
					}) , null)); //名称
				}
			}
		},
		addPointsToMap2 : function(points, attr) {
			// 参数：points类型的点对象
			// 首先清空之前的位置（既图标和文字）
			//this.graLayer.clear();
			if (!this.isLoop) return;
			for (var i = 0; i < points.length; i++) {
				//过滤不正常坐标 不显示
				if (this.xmin_max[0] <= points[i].x && this.xmin_max[1] >= points[i].x
					&& this.ymin_max[0] <= points[i].y && this.ymin_max[1] >= points[i].y) {
					var text = attr[i].mb_name || '无';
					var tCount = this.countByteLength(text, 1);
					var rtext = '';
					if (tCount > 8) {
						// 超过三个字用长的图标
						rtext = text.substr(0, 8) + "..";
					} else {
						rtext = text;
					}
					img1 = 'mx/jjqy/images/peo1_peo_red.png';
					img2 = 'mx/jjqy/images/peo1_text_red.png';
					if (dojo.indexOf(this.usernameOfsencend, attr[i].user_name) >= 0) {
					}
					var textPoint =MXZH.ToWebMercator(new esri.geometry.Point(points[i].x,points[i].y, new esri.SpatialReference({
						wkid : 4326
					}))) ;
					
					var picSybol = this.getSybols(attr[i].direction, null, img1, [ 31, 32 ]); //是否要进行计算
					var picSybolOfName = this.getSybols(null, [ 50, -4 ], img2, [ 75, 30 ]); //需要进行偏移 
					var textSybol = this.getTextSybol(rtext, [ 50, -8 ]); //需要进行偏移 
					attr[i].user_name = attr[i].user_name + "_mubiao";
					sswzLayer.add(new esri.Graphic(points[i], picSybol, attr[i], null)); //图片
					sswzLayer.add(new esri.Graphic(points[i], picSybolOfName, {
						user_name : attr[i].user_name + "_mubiao",
						name : text,
						type : 'picSybolOfName'
					}, null)); //名称下的图片图形
					
					var textsys=new esri.Graphic(textPoint, textSybol, {
						user_name : attr[i].user_name + "_mubiao",
						type : 'picSybolOfName',
						name : text,
						type : 'name'
					}, null);
					sswzLayer.add(textsys); //名称
				}
			}
		},
		countByteLength : function(str, cnCharByteLen) {
			// 对图标里面的字数进行过滤
			// 超过四个字的话截取三个字，然后加上点点点，用四个字的图标
			var byteLen = 0;
			for (var i = 0; i < str.length; i++) {
				if ((/[\x00-\xff]/g).test(str.charAt(i)))
					byteLen += 1;
				else
					byteLen += cnCharByteLen;
			}
			return byteLen;
		},
		//图片图标
		getSybols : function(angle, Offset, img, hw) {
			var pics = new esri.symbol.PictureMarkerSymbol(img, hw[0], hw[1]);
			angle && pics.setAngle(angle)
			Offset && pics.setOffset(Offset[0], Offset[1]);
			return pics;
		},
		//文字图标
		getTextSybol : function(text, Offset) {
			// 图标之上放文字
			var color = new dojo.Color('#ffffff');
			var _font = esri.symbol.Font;
			var font = new _font("13px", _font.STYLE_NORMAL,
				_font.VARIANT_NORMAL, _font.WEIGHT_NORMAL,
				"Microsoft YaHei");
			var textsbol = new esri.symbol.TextSymbol(text, font, color);
			textsbol.setOffset(Offset[0], Offset[1]);
			return textsbol;
		},
		myfocus : function(username) {
			//个人的缩放致
			//MXZH.log(graLayer);
			var gracs = sswzLayer.graphics;
			var self = this;
			var layers = [];
			dojo.forEach(gracs, function(item) {
				var attr = item.attributes;
				if (attr && attr.user_name == username) {
					layers.push(item);
					if (item.symbol) {
						if (item.symbol.url && item.symbol.url.indexOf('peonormal') > 0) {
							item.symbol.url = WangConfig.IMG.sswz_mapPeoXtb;
						}
						if (item.symbol.url && item.symbol.url.indexOf('peonameBlue') > 0) {
							item.symbol.url = WangConfig.IMG.peonameGreen;
						}
						sswzLayer.redraw();
					}
					self.config.map.centerAndZoom(item.geometry, 13);
				}
			})
			dojo.forEach(layers, function(item) {
				sswzLayer.remove(item);
				sswzLayer.add(item);
			});
		},
		groupFocus : function(Ids, type) {
			//缩放致
			var self = this;
			var points_x = [];
			var points_y = [];
			var gracs = sswzLayer.graphics;
			if (type == 'Group') {
				//多个群组的缩放致
				Ids.map(function(groupId) {
					var members = self.groupRes[groupId];
					if (!members) return;
					initExent(members);
				});
			} else {
				//多个人的缩放致
				initExent(Ids);
			}
			function initExent(members) {
				dojo.forEach(gracs, function(item) {
					for (var i = 0; i < members.length; i++) {
						var attr = item.attributes;
						var geo = item.geometry;
						if (attr.user_name && attr.user_name == members[i].login_name) {
							points_x.push(geo.x);points_y.push(geo.y);
							//重画图标颜色
							if (item.symbol) {
								if (item.symbol.url && item.symbol.url.indexOf('peonormal') > 0) {
									item.symbol.url = WangConfig.IMG.sswz_mapPeoXtb;
									sswzLayer.redraw();
								}
								if (item.symbol.url && item.symbol.url.indexOf('peonameBlue') > 0) {
									item.symbol.url = WangConfig.IMG.peonameGreen;
									sswzLayer.redraw();
								}
							}
						}
					}
				})
			}
			if (!self.exent) return;
			self.exent.xmin = Math.max.apply(Math, points_x);
			self.exent.xmax = Math.min.apply(Math, points_x);
			self.exent.ymin = Math.max.apply(Math, points_y);
			self.exent.ymax = Math.min.apply(Math, points_y);
			if ((self.exent.xmin && self.exent.xmax && self.exent.ymin && self.exent.ymax) != -Infinity
			  && self.exent.xmin !=	Infinity  && self.exent.xmax !=	Infinity   && self.exent.ymin !=	Infinity &&  self.exent.ymax !=	Infinity
			) {
				self.config.map.setExtent(self.exent);
			}
		},
		fillGroupHtml : function(res, self) {
			self.groupRes = res;
			var countent = $("." + self.config.sswzCont).find(".sswzCont_countent") //容器
			countent.html("");
			var farther = $("." + self.config.mygroup_div); //分组外层div
			var myli = $(".wxl_liForGroup"); //分组内层
			farther.find(".mygrouplu").html("");
			//dojo.forEach(res, function(item, key) {});
			
			var keys=Object.keys(res)
			
			keys.sort(function(item,item2){
				var s=Number(item.split(";")[3]);
				var s2=Number(item2.split(";")[3]);
				return s-s2;
			});
			
			keys.map(function(key){
				myli.css('display','block');
				var item = res[key]
				//填充分组外层内容
				var split = key.split(";");
				var groupName = split[0];
				//var groupId=split[1];
				var myf = farther.clone();
				myf.find('.ellipsis').text(groupName);
				myf.find('.layui-colla-title-right').attr("group_id", key);
				myf.show().appendTo(countent);
				//填充分组内层
				dojo.forEach(item, function(obj) {
					if(obj.name!=''){
						var liconle = myli.clone();
						liconle.find(".sswz_person_txt").text(obj.name).attr("__id", obj.login_name);
						liconle.find(".sswz_person_dingwei").attr("member_id", obj.login_name);
						//if(obj.avatar)liconle.children(".sswz_person_img").children(".userIcon").attr("src", "https://192.168.2.193:8888"+obj.avatar);
						liconle.appendTo(myf.find(".mygrouplu"));	
					}
				});
			});
			
			var newdiv=$(".sswzCont_countent").clone();
			$(".sswzCont_countent").children().each(function(index,item){
          	  var _h=$(item).find(".layui-colla-title-right").attr("group_id").split(";")
              var _myid=_h[1];
          	  var  ids=_h[2].split(",");
          	  if(ids.length>=4){
          		$(item).remove();
          	  }else{
          		newdiv.children().each(function(index1,item1){
              	  var _h1=$(item1).find(".layui-colla-title-right").attr("group_id").split(";")
                	  var myid=_h1[1];
              	  var parent_id=_h1[2].split(",")[2];
                    if(parent_id==_myid){
                  	  $(item1).find(".layui-colla-title").css("left",'10px');
                  	  $(item).find(".mygrouplu").first().append(item1); 
                    }
                })
          	  }
          	
            
              });
       
			
			var cgb=$(".wxl_liForGroup").filter(function(index,item){
				
				return $(item).find(".sswz_person_txt").text()=='曹桂宾';
			});
			
            var sjl=$(".wxl_liForGroup").filter(function(index,item){
				
				return $(item).find(".sswz_person_txt").text()=='沈新龙';
			});
            
            cgb.insertBefore(sjl);
            
            
			myli.css('display','none'); 
			layui.element().init();
			//个人定位按钮
			$(".sswz_person_dingwei").unbind().click(function() {
				self.IconDRClick(self, $(this).attr("member_id"));
			});
			$(".wxl_liForGroup").unbind().click(function() {
				self.IconDRClick(self, $(this).find(".sswz_person_dingwei").attr("member_id"));
			});
			$(".layui-colla-title-right").unbind().click(function() {
				self.IconGroupClick(self, $(this).attr("group_id"));
			});
		},
		IconGroupClick : function(self, Groupid) {
			//点击群组图片
			self.groupFocus([ Groupid ], 'Group');
		},
		IconDRClick : function(self, drid) {
			//点击单人图片
			self.myfocus(drid);
		},
		fillDatasHtml : function(res, callback) {
			//检测群组是否就位
			this.isReady = true;
			this.checkOutGroup(res);
			callback.call(this, res[0], res[1]);
		},
		keyss : function(arr) {
			var array = [];
			for (var o in arr) {
				array.push(o);
			}
			return array;
		},
		values : function(arr) {
			var array = [];
			for (var o in arr) {
				array.push(arr[o]);
			}
			return array;
		},
		checkOutGroup : function(res) {
			//检车并对比 群组中信息
			var self = this;
			if (self.keyss(this.groupRes).length > 0 && res.length > 0) {
				//假如两侧数据都就绪
				dojo.forEach($(".sswzCont_countent").children(), function(item, index) {
					var length = 0;
					var sum = 0;
					var lu = $(item).find(".mygrouplu"); //ul标签
					var time = 0;
					length = lu.children().length;
					dojo.forEach(lu.children(), function(val) { //li标签
						//内层li列表
						var _id = $(val).children('.sswz_person_txt').attr('__id'); //就是username
						var isKai = false;
						dojo.forEach(res[1], function(member) {
							//位置不正确是否显示
							if (_id == member.user_name) {
								isKai = true;
								var dete = new Date(member.sent_time.time);
								time = dete.Format('hh:mm:ss');
								sum++;
							}
						});
						var imgDom1 = $(val).children('.sswz_person_dingwei').find(".drdwIcon");
						var qz=$(val).parent().parent().siblings("a").find(".qzdwIcon");
						
						if (isKai) {
							$(val).find(".sswz_person_red").text(time).css("color", '#25A162');
							if(qz.length>=1){
								self.switchIcons( /*蓝色图标*/ 'dingweiBlue', qz);
							}
							self.switchIcons( /*蓝色图标*/ 'dingweiBlue', imgDom1);
						} else {
							if(qz.length>=1){
								self.switchIcons( /*灰色图标*/ 'dingweiGray', qz)
							}
							$(val).find(".sswz_person_red").text("位置关闭");
							self.switchIcons( /*灰色图标*/ 'dingweiGray', imgDom1)
						}
					})
					$(item).children().children(".sumofgroup").text("(" + sum + "/" + length + ")");
					//切换图标
				 	var imgDom = $(item).children().find('.qzdwIcon').first();
					sum == 0 ? self.switchIcons( /*灰色图标 */'dingweiGray', imgDom) : self.switchIcons( /*蓝色图标*/ 'dingweiBlue', imgDom); 
				})
			}
		},
		switchIcons : function(iconName, className) {
			//切换图标
			var imgsrc = WangConfig.constants.url + '/sswz/images/' + iconName + '.png';
			className.attr('src', imgsrc);
		},
		forSearch : function() {
			if (!this.isReady) {
				this.msgOfsswz(this.msg);
				return;
			}
			//搜索
			var text = $.trim($(this.config.input_sswz).val());
			if (!text) {
				this.msgOfsswz('请输入搜索内容！');
				return;
			}
			//一、搜索群组
			var groupNames = this.keyss(this.groupRes);
			var selectedGroupNames = []; //选中的群组名
			var selectedDRNames = []; //选中的群成员名
			dojo.forEach(groupNames, function(item) {
				if (item.indexOf(text) >= 0) {
					//假如匹配到了
					selectedGroupNames.push(item);
				}
			});
			//匹配 成员
			var members = this.values(this.groupRes);
			for (var i = 0; i < members.length; i++) {
				dojo.forEach(members[i], function(item) {
					if (item.name.indexOf(text) >= 0) {
						//假如匹配到了
						selectedDRNames.push(item);
					}
				})
			}
			this.reSetDivForGroup(selectedGroupNames, selectedDRNames);
			selectedGroupNames.length > 0 && this.groupFocus(selectedGroupNames, 'Group');
			selectedDRNames.length > 0 && this.groupFocus(selectedDRNames, 'dr');
		},
		//假如多个人被选中 就以群组的方式缩放致   //假如是单个人  就以单个人缩放致
		reSetDivForGroup : function(selectedGroupNames, selectedDRNames) {
			if (!selectedGroupNames.length && !selectedDRNames.length) {
				this.msgOfsswz('没有搜索结果！')
			}
			var mygroup_divs = $(".sswzCont_countent").children();
			dojo.forEach(mygroup_divs, function(item) {
				$(item).find('.layui-colla-title').removeClass('_sswz_active');
				$(item).find('.layui-colla-title-right').css('backgroundColor', '#003548');
				for (var i = 0; i < selectedGroupNames.length; i++) {
					if ($(item).find('.layui-colla-title-right').attr('group_id') == selectedGroupNames[i]) {
						$(item).prependTo('.sswzCont_countent');
						addcssfordiv($(item));
					}
				}
				//显示查询单人
				var li = $(item).find('.mygrouplu').children();
				dojo.forEach(li, function(li) {
					//遍历每个组的li标签
					$(li).removeClass('lsxx_active');
					var merid = $(li).find(".sswz_person_txt").attr('__id');
					for (var i = 0; i < selectedDRNames.length; i++) {
						if (merid == selectedDRNames[i].username) {
							$(item).prependTo('.sswzCont_countent');
							$(li).addClass('lsxx_active');
							addcssfordiv($(item));
						}
					}
				});
			})
			function addcssfordiv(fatheDiv) {
				fatheDiv.find('.layui-colla-title').addClass('_sswz_active');
				fatheDiv.find('.layui-colla-title-right').css('backgroundColor', '#005675');
			}
		//---------查询排序结束------------ 
		},
		msgOfsswz : function(msg) {
			var self = this;
			layui.use('layer', function() {
				var layer = layui.layer;
				layer.msg(msg || self.msg, {
					area : [ '240px', '50px' ],
					time : 3000 //1秒关闭（如果不配置，默认是3秒）
				}, function() {
					//do something
				});
			});
		},
		removecssfordiv : function(fatheDiv) {
			$('.layui-colla-title').removeClass('_sswz_active');
			$('.layui-colla-title-right').css('backgroundColor', '#003548');
			$('.wxl_liForGroup').removeClass('lsxx_active');
		},
		chooseMembers : function(drawer) {
			//参数  画图工具类
			//MXZH.log(drawer);
			drawer.initToolbar(this.contains, this);
		},
		uniq : function(ar) {
			var ret = [];
			for (var i = 0, j = ar.length; i < j; i++) {
				if (ret.indexOf(ar[i]) === -1) {
					ret.push(ar[i]);
				}
			}
			return ret;
		},
		contains : function(g, grcs, s) {
			//判断是否包含
			var pipeirests = [];
			dojo.forEach(sswzLayer.graphics, function(item) {
				if (g.contains(item.geometry)) {
					s.usernameOfsencend.push(item.attributes.user_name);
					s.useridOfsencend.push(item.attributes.user_id);
					s.nameOfsencend.push(item.attributes.name);
					if (item.symbol.url && item.symbol.url.indexOf('peonormal') > 0) {
						item.symbol.url = WangConfig.IMG.sswz_mapPeoXtb;
					}
					if (item.symbol.url && item.symbol.url.indexOf('peonameBlue') > 0) {
						item.symbol.url = WangConfig.IMG.peonameGreen;
					}
					sswzLayer.redraw();
				}
			});
			s.usernameOfsencend = s.uniq(s.usernameOfsencend);
			s.useridOfsencend = s.uniq(s.useridOfsencend);
			s.nameOfsencend = s.uniq(s.nameOfsencend);
			BoxCall = true;
			CallMode = "group";
			var boxCallUids = s.useridOfsencend;
			var boxCallNames = s.nameOfsencend;
			var boxCallIds = s.usernameOfsencend;
			s.usernameOfsencend = [];
			s.useridOfsencend = [];
			s.nameOfsencend = [];
			grcs.clear();
			for (var i = 0; i < boxCallIds.length; i++) {
				if (boxCallIds[i] == "" || typeof (boxCallIds[i]) == "undefined") {
					boxCallIds.splice(i, 1);
					i = i - 1;
				}
			}
			for (var i = 0; i < boxCallUids.length; i++) {
				if (boxCallUids[i] == "" || typeof (boxCallUids[i]) == "undefined") {
					boxCallUids.splice(i, 1);
					i = i - 1;
				}
			}
			for (var i = 0; i < boxCallNames.length; i++) {
				if (boxCallNames[i] == "" || typeof (boxCallNames[i]) == "undefined") {
					boxCallNames.splice(i, 1);
					i = i - 1;
				}
			}
			//MXZH.log("已选中的用户uid: ", JSON.stringify(boxCallUids));
			//MXZH.log("已选中用户的用户名： ", JSON.stringify(boxCallNames));
			//MXZH.log("已选中用户的id： ", JSON.stringify(boxCallIds));
			window.BoxCallUids = boxCallUids; //暴露框选用户id
			window.BoxCallNames = boxCallNames;
			window.BoxCallIds = boxCallIds;
			if (boxCallIds.length > 0) {
				//打开语音对讲界面
				INDEX = layer.open({
					type : 2,
					id : 'layui-yydj',
					shade : 0,
					shift : -1,
					maxmin : true,
					btnAlign : 'c',
					area : [ '750px', '553px' ],
					content : [ IM.yydjPageUrl + "?v=" + new Date().getTime(), 'no' ],
					success : function(index, layero) { //语音对讲窗口打开后获取焦点
						var tmpId = 'layui-layer-iframe' + layero;
						window.frames[tmpId].focus();
					},
					cancel : function(index, layero) { //关闭语音对讲界面，同时请求会话管理服务释放会话
						if (confirm('确定要关闭吗')) {
							var tmpId = 'layui-layer-iframe' + index;
							var conferenceMap = window.frames[tmpId].conferenceMap;
							var roomId = window.frames[tmpId].RoomId;
							var creatorId = window.frames[tmpId].CreatorId;
							var topicJsToCpp = window.frames[tmpId].topicJsCpp;
							//var bfcpClient = window.frames[tmpId].bfcpClient;
							var ocx_audios = window.frames[tmpId].ocx_audios;
							var ocx_videos = window.frames[tmpId].ocx_videos;

							if (roomId && conferenceMap) { //判断是否建立了会话
								if (conferenceMap.has(roomId)) {
									if (conferenceMap.get(roomId).get(IM.userId).get("role") == "creator") { //判断为主叫
										Active = true;
									} else {
										Active = false;
									}
								}

								if (Active) { //管理员或者创建者关闭语音对讲则释放会话
									var releaseRequest = {
										operate : 'PTT_RELEASE',
										userId : IM.userId,
										roomId : roomId
									};
									MXZH.log("释放会话！", JSON.stringify(releaseRequest));
									postMsg(true, wrapPttMsg(releaseRequest));
									if (conferenceMap.has(roomId)) {
										conferenceMap.delete(roomId);
									}
									MXZH.log("当前会话：", JSON.stringify(conferenceMap));

									//退出登录抢麦服务器	
//									if (bfcpClient != "") {
//										bfcpClient.disconnect(IM.userId, roomId);
//									}
									
									roomId = "";
									RoomId = "";
									hasRoom = false;
									BoxCall = false;
									CallMode = "";
									window.frames[tmpId].AddCount = 0;
									window.frames[tmpId].AddCountCreator = 0;
									layer.close(index);
								} else { //普通用户则退出会话
									var hangupRequest = {
										operate : 'PTT_HANGUP',
										userId : IM.userId,
										roomId : roomId
									};
									MXZH.log("退出会话！", JSON.stringify(hangupRequest));
									postMsg(true, wrapPttMsg(hangupRequest));
									if (conferenceMap.has(roomId)) {
										conferenceMap.delete(roomId);
									}
									MXZH.log("当前会话：", JSON.stringify(conferenceMap));

									//退出登录抢麦服务器
//									if (bfcpClient != "") {
//										bfcpClient.disconnect(IM.userId, roomId);
//									}
									
									roomId = "";
									RoomId = "";
									hasRoom = false;
									BoxCall = false;
									window.frames[tmpId].AddCount = 0;
									window.frames[tmpId].AddCountCreator = 0;
									layer.close(index);
									CallMode = "";
								}
								//关闭语音对讲界面
								RoomId = "";
								hasRoom = false;
								BoxCall = false;
								window.frames[tmpId].AddCount = 0;
								window.frames[tmpId].AddCountCreator = 0;
								layer.close(index);
								CallMode = "";
							} else { //没有建立任何会话，直接删除界面
								//关闭语音对讲界面
								RoomId = "";
								hasRoom = false;
								BoxCall = false;
								window.frames[tmpId].AddCount = 0;
								window.frames[tmpId].AddCountCreator = 0;
								layer.close(index);
								CallMode = "";
							}
						}
						return false;
					},
					full : function(index, layero) { //语音对讲窗口最大化
						console.log("最大化");
						var tmpId = 'layui-layer-iframe' + INDEX;
						var ifm = document.getElementById(tmpId);
					
						var height = document.documentElement.clientHeight;
						var width = document.documentElement.clientWidth;
						
						//缩放放大
						var w_s = width/4 -40;
						$("#"+tmpId).contents().find(".yyhj_title").width(width+"px");
						$("#"+tmpId).contents().find(".yyhj_cont").width(width+"px");
						$("#"+tmpId).contents().find(".yyhj_sliddown").width(width+"px");
						$("#"+tmpId).contents().find(".yyhj_cont").height((height-140)+"px");
						$("#"+tmpId).contents().find(".yyhj_bottom").width(width+"px");  
						$("#"+tmpId).contents().find(".bottomanniu").css("margin", "0 "+0.144*width+"px");
						$("#"+tmpId).contents().find(".yyhj_title_left").width((4*width/15)+"px");
						$("#"+tmpId).contents().find(".yyhj_title_mid").width((7*width/15)+"px");
						$("#"+tmpId).contents().find(".yyhj_title_right").width((4*width/15)+"px");
						$("#"+tmpId).contents().find(".yyhjListTitle").width(w_s +"px");
						$("#"+tmpId).contents().find(".yyhjListMain").width(w_s +"px");
						$("#"+tmpId).contents().find(".yyhjListMain").height("250px");
						$("#"+tmpId).contents().find(".yyhjListBottomGray").width(w_s+"px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").width(w_s-2+"px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").height("274px");
						$("#"+tmpId).contents().find(".yyhjListBottomBlue").width(w_s+"px");
						$("#"+tmpId).contents().find(".yyhjBlueBgName").css("margin-left",0.35*w_s+"px");
						//$("#"+tmpId).contents().find(".yyhjBlueBgXtb").css("margin-left","134px");
						$("#"+tmpId).contents().find(".nacl_module").attr('width',w_s);
						$("#"+tmpId).contents().find(".nacl_module").attr('height',250);
						$("#"+tmpId).contents().find(".yyhjBox").width(width+"px");
						$("#"+tmpId).contents().find(".yyhjBox ul").width(width-34+"px");
						$("#"+tmpId).contents().find(".yyhjBox").height((height-140)+"px");
						$("#"+tmpId).contents().find(".yyhjGrayBgName").width(0.93*w_s+"px");
						
						$('#' + tmpId).contents().find("#ptt").find(".bottomline").addClass("bottomline-full");
						$('#' + tmpId).contents().find("#ptt").find(".anniutxt").addClass("anniutxt-full");
						$('#' + tmpId).contents().find("#anniutb").addClass("anniutb-full");
					},
					min : function(index, layero) { //语音对讲窗口最小化
					},
					restore : function(index, layero) { //窗口还原后重新获得焦点
						console.log("还原");
						var tmpId = 'layui-layer-iframe' + INDEX;
						window.frames[tmpId].focus();
						
						//缩放还原
						$("#"+tmpId).contents().find(".yyhj_title").width("750px");
						$("#"+tmpId).contents().find(".yyhj_cont").width("750px");
						$("#"+tmpId).contents().find(".yyhj_sliddown").width("750px");
						$("#"+tmpId).contents().find(".yyhj_cont").height("420px");
						$("#"+tmpId).contents().find(".yyhj_bottom").width("750px");
						$("#"+tmpId).contents().find(".bottomanniu").css('margin', '0 77px');
						$("#"+tmpId).contents().find(".yyhj_title_left").width("200px");
						$("#"+tmpId).contents().find(".yyhj_title_mid").width("350px");
						$("#"+tmpId).contents().find(".yyhj_title_right").width("200px");
						$("#"+tmpId).contents().find(".yyhjListTitle").width("148px");
						$("#"+tmpId).contents().find(".yyhjListMain").width("148px");
						$("#"+tmpId).contents().find(".yyhjListMain").height("110px");
						$("#"+tmpId).contents().find(".yyhjListBottomGray").width("148px");
						$("#"+tmpId).contents().find(".yyhjListBottomBlue").width("148px");
						$("#"+tmpId).contents().find(".yyhjBlueBgName").css({"margin-left":"8px","width":"90px"});
						$("#"+tmpId).contents().find(".yyhjGrayBgName").width("138px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").width("148px");
						$("#"+tmpId).contents().find(".yyhjBoxListItem").height("164px");
						$("#"+tmpId).contents().find(".nacl_module").attr('width',148);
						$("#"+tmpId).contents().find(".nacl_module").attr('height',110);
						$("#"+tmpId).contents().find(".yyhjBox").width("750px");
						$("#"+tmpId).contents().find(".yyhjBox ul").width("716px");
						$("#"+tmpId).contents().find(".yyhjBox").height("360px");
						$("#"+tmpId).contents().find(".yyhjBlueBgXtb").css("margin-left","-23px");
						
						$('#' + tmpId).contents().find("#ptt").find(".bottomline").removeClass("bottomline-full");
						$('#' + tmpId).contents().find("#ptt").find(".anniutxt").removeClass("anniutxt-full");
						$('#' + tmpId).contents().find("#anniutb").removeClass("anniutb-full");
					}
				});
			} else {
				BoxCall = false;
			}
			
//			layer.open({
//				content : "选中的用户名：" + s.usernameOfsencend.toString(),
//				yes : function(index, layero) {
//					s.usernameOfsencend = [];
//					grcs.clear();
//					layer.close(index); //如果设定了yes回调，需进行手工关闭
//				}
//			});
			
		},
		clear : function() {
			sswzLayer.clear();
			MXZH.getMap.removeLayer(sswzLayer);
			//jjqyLayers.clear();
			MXZH.getMap.removeLayer(jjqyLayers);
		}
	}
	/************************自定义画图类************************************************/
	MXZH.myDraw = function() {}
	MXZH.myDraw.prototype = {
		init : function(opts) {
			this.map = opts.map;
			this.layers = [];
			this.grcLayer = null;
		},
		initToolbar : function(callback, sswzInstenc) {
			var self = this;
			this.grcLayer = new esri.layers.GraphicsLayer(); //节点图层
			this.layers.push([ this.grcLayer, this.grcLayer ]);
			this.map.addLayer(this.grcLayer);
			dojo.require("esri.toolbars.draw");
			tb = new esri.toolbars.Draw(self.map);
			tb.on("draw-end", addGraphic);
			self.map.disableMapNavigation();
			//tb.activate("rectangle");freehandpolygon
			tb.activate("freehandpolygon");
			function addGraphic(evt) {
				tb.deactivate();
				self.map.enableMapNavigation();
				var symbol = self.getFillsys();
				var grc = new esri.Graphic(evt.geometry, symbol);
				self.grcLayer.add(grc);
				callback(evt.geometry, self.grcLayer, sswzInstenc);
			//self.contains(evt.geometry,callback);
			}
		},
		getLinesys : function() {
			return new esri.symbol.CartographicLineSymbol(
				esri.symbol.CartographicLineSymbol.STYLE_SOLID,
				new esri.Color([ 255, 0, 0 ]), 10,
				esri.symbol.CartographicLineSymbol.CAP_ROUND,
				esri.symbol.CartographicLineSymbol.JOIN_MITER, 5
			);
		},
		getFillsys : function() {
			return new esri.symbol.PictureFillSymbol(WangConfig.IMG.sswzFill,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color('#000'), 0.7), 42, 42);
		},
		deleteLayer : function(id) {
			var self = this;
			dojo.forEach(self.layers, function(item) {
				if (id && item[0].indexOf(id) > 0) {
					self.map.removeLayer(item[1]);
				} else {
					//没有id全部删除
					self.map.removeLayer(item[1]);
				}
			})
		}
	}
	/********************************实时位置的控制器******************************************************/
	MXZH.sswzCF = function() {
		this.isLoop = true;
	};
	MXZH.sswzCF.prototype = {
		init : function(opts) {
			//从每个类的控制器的init()开始  所以如果不需要按钮  就要自己触发init()
			opts && dojo.safeMixin(this.config, opts);
			this.config['map'] = MXZH.mainMap.wangMap.map;
			this.sswz = new MXZH.sswz(this.config);
			this.mydraw = new MXZH.myDraw();
			this.mydraw.init(this.config);
			this.getGroup(this.sswz.fillGroupHtml, this.sswz);
			this.timer_yoyo(); //开启定时查询
			this.addEvenlistener();
			$(".kuangxuan_").fadeIn(300);
			//this.showJJyq();
		},
		config : {
			//默认配置项
			dataURL : "${basePath}/map_NowPlace.action?time=" + new Date().getTime(), //请求后台的数据地址
			GroupURL : "${basePath}/map_Group.action?time=" + new Date().getTime(), //请求后台的群组信息数据地址
			distance : 600, //获取距离最新时间多少毫秒的时间
			dateNow : 30, //距离最近时间多少秒的时间
			frequency : 3000, //多久请求一次数据
			button_ : 'mybution',
			wxl_liForGroup : 'wxl_liForGroup',
			mygroup_div : 'mygroup_div',
			sswzCont : 'sswzCont',
			button_sswz : '.button_sswz',
			input_sswz : '.input_sswz'
		},
	/*	showJJyq : function() {
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_queryForjjqy2ForSSwz.action?time=" + new Date().getTime(),
				success : function(msg) {
					MXZH.effectController.loading(false);
					var info = JSON.parse(msg);
					self.dealWithAppendjjqyToList(info);
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					layer.msg('数据查询失败！', {
						time : 1000
					})
				}
			});
		},*/
		dealWithAppendjjqyToList : function(i) {
			//参数 info
			var self = this;
			jjqyLayers.clear();
			dojo.forEach(i, function(item) {
				if (self.checkoutBufferStrs(item)) {
					//判断时间 并显示到地图中
					self.sswz.addBufferLayer([ item["bufferIn"], item["bufferOut"], item["bufferOrigin"] ], item['id']);
				}
			});
			deltr_jjqy = function(t) {
				var id = $(t).parents("li").attr("_id");
				self._jjqyDOMManager.deleteJJQY(id);
			}
			isread_jjqy = function(t) {
				var id = $(t).parents("li").attr("_id");
				self._jjqyDOMManager.isreadJJQY(id, $(t).parents("li"));
			}
			positionPerson = function(t) {
				//MXZH.msgOfsswz("该功能暂未开放！");
				return false;
			}
		},
		checkoutBufferStrs : function(item) {
			//检查是不是当前运行的警戒区  假如是 重点显示，并弄到地图中
			var dt = new Date()
			var badate = new Date(item['beginDate'].replace(/-/g, '/')),
				endate = new Date(item['end_date'].replace(/-/g, '/'));
			if (dt.getTime() >= badate.getTime() && dt.getTime() <= endate.getTime()) return true;
			return false;
		},
		getData : function(callback, self) {
			//获取实时数据
			var that = this;
			$.ajax({
				url : that.config.dataURL,
				data : {
					sjc : that.config.distance,
					sjc2 : that.config.dateNow
				},
				type : "post",
				success : function(msg) {
					var pointList = JSON.parse(msg);//pointList[[数据库数据],{添加的其他数据}];
					if(pointList[0]!=""){
						pointList[0][0].schedAll=pointList[1].schedAll;//行程公里数
						pointList[0][0].qyNum=pointList[1].qyNum;//检查企业数
						pointList[0][0].fxNum=pointList[1].fxNum;//发现隐患数
						pointList[0][0].fcNum=pointList[1].fcNum;//复查隐患数
						pointList.length=1;
						callback(pointList, self);
					}else{
						callback(pointList, self);
					}					
				}
			});
		},
		getGroup : function(callback, self) {
			//获取分组数据
			var that = this;
			$.ajax({
				url : that.config.GroupURL,
				/*	data : {
						sjc : this.config.distance
					},*/
				type : "post",
				success : function(msg) {
					var groupList = JSON.parse(msg);
					callback(groupList[0], self);
				}
			});
		},
		timer_yoyo : function() {
			//时间控制者悠悠
			var self = this;
			MXZH.effectController.loading(true);
			function timer() {
				self.getData(self.sswz.showPoint, self.sswz);
				self.timer = setTimeout(timer, 3000); //time是指本身,延时递归调用自己,3000为间隔调用时间,单位毫秒
			}
			timer();
		},
		addEvenlistener : function() {
			//注册事件
			var self = this;
			dojo.query(this.config.button_sswz).onclick(this.sswz, this.sswz.forSearch);
			//删除选中状态
			$('.input_sswz').bind('input propertychange', function() {
				//进行相关操作 
				self.sswz.removecssfordiv();
			});
			//添加框选按钮
			$(".kuangxuan_").show().prependTo('.maptoolbarTopRight');
			$(".kuangxuan_").unbind().click(function() {
				/****注册 框选事件***/
				self.mydraw.grcLayer && self.mydraw.grcLayer.clear();
				if (self.sswz.isReady) {
					self.sswz.chooseMembers(self.mydraw);
				} else {
					self.sswz.msgOfsswz(self.sswz.msg);
				}
			});
		},
		destroy : function() {
			this.sswz.clear();
			this.sswz.isLoop = this.isLoop = false;
			window.clearTimeout(this.timer);
			$(".kuangxuan_").fadeOut(300);
		}
		
	}
});
