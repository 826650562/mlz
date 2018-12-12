var findex = '';
var xxsbtotalpage = '';
/*
 * 控制器等待
 */
jQuery(document).ready(function() {

	/*
	  * 控制器
	  *
	  */
	MXZH.xxsbCF = function() {};
	MXZH.xxsbCF.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.xxsb.init(this.config);
			this.addeventlister();
			$(this.config.XxsbIdArray[0]).trigger("click"); //点开自动点击执行未处理事件
		},
		config : {
			dataURL : "${basePath}/home_queryTzgg.action?time=" + new Date().getTime(), //请求后台的数据地址
			XxsbIdArray : [ "#xxsb_no", "#xxsb_all", ".xxsb_edit", ".xxsb_search", ".newMessage" ],
			pageSize : 5
		},
		addeventlister : function() {
			var self = this;
			$(this.config.XxsbIdArray[0]).unbind().click(function() {
				$(self.config.XxsbIdArray[0]).find("img").attr("src", "mx/xxsb/images/no_blue.png");
				$(self.config.XxsbIdArray[1]).find("img").attr("src", "mx/xxsb/images/all_gray.png");
				self.xxsb.getData(self);
			});
			$(this.config.XxsbIdArray[1]).unbind().click(function() {
				$(self.config.XxsbIdArray[1]).find("img").attr("src", "mx/xxsb/images/all_blue.png");
				$(self.config.XxsbIdArray[0]).find("img").attr("src", "mx/xxsb/images/no_gray.png");
				self.xxsb.getAllData(self);
			});
			$(this.config.XxsbIdArray[3]).unbind().click(function() {
				self.xxsb.layuisearch(self);
			});
		},
		layuibd : function() {
			var self = this;
			$(this.config.XxsbIdArray[2]).unbind().click(function() {
				self.xxsb.openlayui($(this).attr("id"));
			});
		},
		xxsb : new MXZH.xxsb()
	}
//jquery 等待文件加载完毕执行
})
/*
 * 信息上报消息列表，具体功能在该类里面
 * 通过配置类调用
 * */

MXZH.xxsb = function() {
	//元素图层
	this.config = {
		Xxsbcontent : [ "#no_xxsb", "#alls_xxsb" ],
		//信息上报所有的图层
		IconLayer : new esri.layers.GraphicsLayer({
			id : 'xxsb',
			className : 'xxsb'
		})
	};
};
MXZH.xxsb.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
		MXZH.mainMap.wangMap.map.addLayer(this.config.IconLayer);
		this.autoClearLayer();
	},
	getData : function(fself) {
		MXZH.effectController.loading(true); //锁屏功能
		var self = this;
		$.ajax({
			url : "app/sjcj/findDataCollect",
			data : {
				size_string : '100',
				type_string : '0'
			},
			type : "post",
			dataType : "json",
			success : function(tzgglist) {
				self.showMessage(tzgglist);
				fself.layuibd();
				MXZH.effectController.loading(false);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	showMessage : function(tzgglist) {
		$(this.config.Xxsbcontent[0]).html('');
		if (tzgglist.beanList.length > 0) {
			for (i = 0; i < tzgglist.beanList.length; i++) {
				var trHtml = "";
				var nr_text = tzgglist.beanList[i].text;
				var nr,dis;
				  var lenth=nr_text.length;
				  
				  if(lenth>30){
					  nr= nr_text.substr(0,30)+"..." ,dis='initial'
				  }else{
					  nr= nr_text,dis='none'
				  }
				if ('images' in tzgglist.beanList[i]) {
					var imgsm = tzgglist.beanList[i].images[0].thumbnail;
					var imageobj = tzgglist.beanList[i].images;
					var imagesize = tzgglist.beanList[i].images.length;
					var imagearray = new Array();
					for (x = 0; x < tzgglist.beanList[i].images.length; x++) {
						imagearray.push(tzgglist.beanList[i].images[x].original);
					}
					trHtml = "<li id_="+tzgglist.beanList[i].id+"> <div class='xxsb_topBox'><div class='xxsb_peoName ellipsis'>" + tzgglist.beanList[i].creater + "</div>"
						+ "<div class='xxsb_time'>" + dateFormat(tzgglist.beanList[i].createtime, 'yyyy-MM-dd hh:mm:ss') + "</div></div> <div class='nocopyCont' style='word-wrap:break-word;word-break:break-all'><span class='pnocopyCont' >" + nr + "</span><span style='display:"+dis+"' class='_zhankai'>展开</span></div>"
						+ "<div class='xxsb_imgbox'><div class='xxsb_img' filesrc='" + imagearray + "' filetype='1'><img src='" + imgsm + "'></div> <div class='imgtxt'>共" + imagesize + "张</div></div>"
						+ "<div class='xxsb_addrBox' lat=" + tzgglist.beanList[i].lat + " lon=" + tzgglist.beanList[i].lon + "><div class='xxsb_addr_xtb'><img src='mx/xxsb/images/xxsb_xtb1.png' width='14' height='19'></div>"
						+ "<div class='xxsb_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div>"
						+ "<div class='xxsb_edit' id='" + tzgglist.beanList[i].id + "' ><img src='mx/xxsb/images/editxtb.png' width='17' height='16'></div></div></li>"
				} else if ('video' in tzgglist.beanList[i]) {
					var imgsm = tzgglist.beanList[i].video[0].thumbnail;
					var video = tzgglist.beanList[i].video[0].original;
					trHtml = "<li id_="+tzgglist.beanList[i].id+"> <div class='xxsb_topBox'><div class='xxsb_peoName ellipsis'>" + tzgglist.beanList[i].creater + "</div>"
						+ "<div class='xxsb_time'>" + dateFormat(tzgglist.beanList[i].createtime, 'yyyy-MM-dd hh:mm:ss') + "</div></div> <div class='nocopyCont' style='word-wrap:break-word;word-break:break-all'><span class='pnocopyCont' >" + nr + "</span><span style='display:"+dis+"' class='_zhankai'>展开</span></div>"
						+ "<div class='xxsb_imgbox'><div class='xxsb_img' filesrc='" + video + "' filetype='2' ><div class='xxsb_sp'><img src='mx/lsxx/images/bofang.png' width='35' height='35' /></div><img src='" + imgsm + "'></div></div>"
						+ "<div class='xxsb_addrBox' lat=" + tzgglist.beanList[i].lat + " lon=" + tzgglist.beanList[i].lon + "><div class='xxsb_addr_xtb'><img src='mx/xxsb/images/xxsb_xtb1.png' width='14' height='19'></div>"
						+ "<div class='xxsb_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div>"
						+ "<div class='xxsb_edit' id='" + tzgglist.beanList[i].id + "' ><img src='mx/xxsb/images/editxtb.png' width='17' height='16'></div></div></li>"
				} else {
					trHtml = "<li id_="+tzgglist.beanList[i].id+"> <div class='xxsb_topBox'><div class='xxsb_peoName ellipsis'>" + tzgglist.beanList[i].creater + "</div>"
						+ "<div class='xxsb_time'>" + dateFormat(tzgglist.beanList[i].createtime, 'yyyy-MM-dd hh:mm:ss') + "</div></div> <div class='nocopyCont'style='word-wrap:break-word;word-break:break-all'><span class='pnocopyCont' >" + nr + "</span><span style='display:"+dis+"' class='_zhankai'>展开</span></div>"
						+ "<div class='xxsb_addrBox' lat=" + tzgglist.beanList[i].lat + " lon=" + tzgglist.beanList[i].lon + "><div class='xxsb_addr_xtb'><img src='mx/xxsb/images/xxsb_xtb1.png' width='14' height='19'></div>"
						+ "<div class='xxsb_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div>"
						+ "<div class='xxsb_edit' id='" + tzgglist.beanList[i].id + "'><img src='mx/xxsb/images/editxtb.png' width='17' height='16'></div></div></li>"
				}
				$(this.config.Xxsbcontent[0]).append(trHtml);
				// 动态更新页面数据的时候 添加图标到地图中
				this.addPointToMap(tzgglist.beanList[i].lon, tzgglist.beanList[i].lat);
			}
			$("._zhankai").on("click",function(){
				var myid=$(this).parents('li').attr('id_'),that=$(this);
				if(that.attr("type")=='展开' || !that.attr("type")){
					dojo.map(tzgglist.beanList,function(item){
						 if(item.id==myid){
							 that.text("收起").attr("type",'收起');
							 that.siblings(".pnocopyCont").text(item.text);  
							 var hs=Math.ceil(item.text.length/22)*25;
							 that.parents(".nocopyCont").css('maxHeight',hs+'px');
						 }
					});
				}else{
					dojo.map(tzgglist.beanList,function(item){
						 if(item.id==myid){
							 that.text("展开").attr("type",'展开');
							 that.siblings(".pnocopyCont").text(item.text.substr(0,30)+"..."); 
							 that.parents(".nocopyCont").css('maxHeight','50px');
						 }
					});	
				}
			})
			//this.activexr();
		} else {
			/*var layer = layui.layer;
			layer.msg('未查询到数据！');*/
		}
		var opentzggtk = new MXZH.opentzggtk();
		opentzggtk.init();
	},
	addPointToMap : function(x, y) {
       if(!x || !y) return false;
		//增加点到地图中
		var pics = new esri.symbol.PictureMarkerSymbol(WangConfig.IMG.xxsbicon, 44, 70);
		var bd=MXZH.bd09togcj02(x, y);
		var bdpoint=MXZH.ToWebMercator2(bd[0],bd[1]);
		var grc = new esri.Graphic(new esri.geometry.Point([ bdpoint[0], bdpoint[1] ],
			new esri.SpatialReference({
				wkid : WangConfig.constants.wkt
			})), pics, {
			date : Number(new Date())
		});
		this.config.IconLayer.add(grc);
	},
	autoClearLayer : function() {
		var self = this;
		function myclear() {
			if (self.config.IconLayer.graphics.length > 0) {
				var d = Number(new Date());
				self.config.IconLayer.graphics.map(function(g) {
					if ((d - g.attributes.date) >= 3000) {
						self.config.IconLayer.remove(g);
					}
				});
			}
			self.timeout = setTimeout(myclear, 1000);
		}
		myclear();
	},
	activexr : function() {
		$(".xxsb_box1 ul li,.xxsb_box2 ul li").each(function() {
			var maxwidth = 30; //设置最多显示的字数
			var text = $(this).find(".xxsb_p").text();
			if ($(this).find(".xxsb_p").text().length > maxwidth) {
				$(this).find(".xxsb_p").text($(this).find(".xxsb_p").text().substring(0, maxwidth));
				$(this).find(".xxsb_p").html($(this).find(".xxsb_p").html() + '...'); //如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
				$(this).find(".xxsb_p").append("<a href='###' style='color:#417bdc;'>点击展开</a>");
			}
			;
			$(this).find("a").click(function() {
				$(this).parent(".xxsb_p").text(text); //点击“点击展开”，展开全文
			})
		})
	},
	openlayui : function(xxsb_id) {
		var self = this;
		layui.use([ 'layer', 'form' ], function() {
			var layer = layui.layer;
			layer.open({
				type : 2,
				id : 'layui-layerf',
				title : '信息处理',
				btn : [ '保存', '新建标签' ],
				shadeClose : true,
				shift : -1,
				btnAlign : 'c',
				offset : [ '80px', '450px' ],
				area : [ '350px', '310px' ],
				content : [ 'mx/xxsb/iframe_xxsb_no.jsp', 'no' ],
				success : function(layero, index) {
					findex = index;
					$.ajax({
						url : "app/sjcj/getLabel",
						data : {
							page : '',
							size_string : '100',
							creater : ''
						},
						type : "post",
						dataType : "json",
						success : function(label) {
							self.showlabel(label, index);
							$("#layui-layer-iframe" + index)[0].contentWindow.layui.form().render("checkbox");
						},
						error : function(error) {
							throw (error);
							throw ('数据请求失败！');
						}
					});
				},
				yes : function(index, layero) {
					//按钮【按钮一】的回调
					var r = $("#layui-layer-iframe" + index).contents().find('[id=bqid]');
					var id_array = new Array();
					for (var i = 0; i < r.length; i++) {
						if (r[i].checked) {
							id_array.push(r[i].getAttribute("ids"));
						}
					}
					var labelsid = id_array.join(';');
					var dataCollect = $("#layui-layer-iframe" + index).contents().find('.layui-textarea').val();
					$.ajax({
						url : "app/sjcj/updateDataCollect",
						data : {
							description : dataCollect,
							xxsb_id : xxsb_id,
							labelsid : labelsid
						},
						type : "post",
						dataType : "json",
						success : function(date) {
							var total = parseFloat($(self.config.XxsbIdArray[4]).text());
							if (total > 1) {
								total--;
								$(self.config.XxsbIdArray[4]).html('').append(parseFloat(total));
							} else {
								total--;
								$(self.config.XxsbIdArray[4]).html('').append(parseFloat(total));
								$(self.config.XxsbIdArray[4]).css("display", "none");
							}
							$(self.config.XxsbIdArray[0]).trigger("click");
						},
						error : function(error) {
							throw (error);
							throw ('数据请求失败！');
						}
					});

					layer.close(index);
				},
				btn2 : function(index, layero) {
					var sy = index;
					//按钮【按钮二】的回调
					layer.prompt({
						maxlength : 5,
						title : '新建标签',
					}, function(value, index, elem) {
						value =value.replace(/</g,'').replace(/>/g,'');
						if ($("#layui-layer-iframe" + findex).contents().find('[id=bqid]').length > 0) {
							var r = $("#layui-layer-iframe" + findex).contents().find('[id=bqid]');
							var id_array = new Array();
							for (var i = 0; i < r.length; i++) {
								id_array.push(r[i].title);
							}
							if (id_array.indexOf(value) > 0) {
								layer.msg('标签已存在！');
								return false;
							}
						}
						$.ajax({
							url : "app/sjcj/addLabel",
							data : {
								label : value,
								creater : username
							},
							type : "post",
							success : function(suc) {
								$.ajax({
									url : "app/sjcj/getLabel",
									data : {
										page : '',
										size : '',
										creater : ''
									},
									type : "post",
									dataType : "json",
									success : function(label) {
										self.showlabel(label, findex);
										$("#layui-layer-iframe" + findex)[0].contentWindow.layui.form().render("checkbox");
									},
									error : function(error) {
										throw (error);
										throw ('数据请求失败！');
									}
								});
							},
							error : function(error) {
								throw (error);
								throw ('数据请求失败！');
							}
						});
						layer.close(index);
					});
					return false
				}
			});
		});
	//	});
	},
	showlabel : function(label, index) {
		$("#layui-layer-iframe" + index).contents().find("#xxsb_test").html("");
		if (label.beanList != null && label.beanList != "") {
			for (i = 0; i < label.beanList.length; i++) {
				if (i % 3 == 1) {
					$("#layui-layer-iframe" + index).contents().find("#xxsb_test").append("<input type='checkbox' name='like[write]' id='bqid' ids='" + label.beanList[i].id + "' title='" + label.beanList[i].name + "'>");
				} else if (i % 3 == 2) {
					$("#layui-layer-iframe" + index).contents().find("#xxsb_test").append("<input type='checkbox' name='like[read]' id='bqid' ids='" + label.beanList[i].id + "' title='" + label.beanList[i].name + "'>");
				} else {
					$("#layui-layer-iframe" + index).contents().find("#xxsb_test").append("<input type='checkbox' name='like[game]' id='bqid' ids='" + label.beanList[i].id + "' title='" + label.beanList[i].name + "'>");
				}

			}
		}
	},
	layuisearch : function(fself) {
		var self = this;
		layui.use('layer', function() {
			var layer = layui.layer;
			layer.open({
				type : 2,
				title : '信息搜索',
				id : 'layui-layerh',
				shadeClose : true,
				btn : [ '搜索' ],
				shift : -1,
				btnAlign : 'c',
				offset : [ '80px', '450px' ],
				area : [ '350px', '435px' ],
				content : [ 'mx/xxsb/iframe_xxsb_all.jsp', 'no' ],
				success : function(layero, index) {
					$.ajax({
						url : "app/sjcj/getLabel",
						data : {
							page : '',
							size_string : '100',
							creater : ''
						},
						type : "post",
						dataType : "json",
						success : function(label) {
							self.showlabel(label, index);
							$("#layui-layer-iframe" + index)[0].contentWindow.layui.form().render("checkbox");
						},
						error : function(error) {
							throw (error);
							throw ('数据请求失败！');
						}
					});

				},
				yes : function(index, layero) {
					//按钮【按钮一】的回调
					var st = $("#layui-layer-iframe" + index).contents().find("#xxsb_kssj").val();
					var et = $("#layui-layer-iframe" + index).contents().find("#xxsb_jssj").val();
					var sbr = $("#layui-layer-iframe" + index).contents().find("#sbr").val();
					var sbnr = $("#layui-layer-iframe" + index).contents().find("#sbnr").val();
					var r = $("#layui-layer-iframe" + index).contents().find('[id=bqid]');
					var id_array = new Array();
					for (var i = 0; i < r.length; i++) {
						if (r[i].checked) {
							id_array.push(r[i].getAttribute("ids"));
						}
					}
					var idstr = id_array.join(';');
					var reg = /^\s*|\s*$/g;
					if (st !== '' && st !== null && et !== '' && et !== null) {
						st = st.replace(reg, "");
						et = et.replace(reg, "");
						if (st > et) {
							layui.use([ 'layer' ], function() {
								var layer = layui.layer;
								layer.msg('注意:开始时间必须小于结束时间!');
								$("#layui-layer-iframe" + index).contents().find("#xxsb_kssj").val("");
								$("#layui-layer-iframe" + index).contents().find("#xxsb_jssj").val("");
							});
							return false;
						}
					}
					$.ajax({
						url : "app/sjcj/findDataCollect",
						data : {
							size_string : 5,
							labelsid : idstr,
							timebegin_string : st,
							timeend_string : et,
							creater : sbr,
							key : sbnr
						},
						type : "post",
						dataType : "json",
						success : function(tzgglist) {
							layer.close(index);
							self.showAllMessage(tzgglist);
							layui.use([ 'laypage' ], function() {
								var laypage = layui.laypage;
								laypage({
									cont : 'xxsb_page',
									pages : xxsbtotalpage,
									first : false,
									last : false,
									groups : 4,
									jump : function(obj, first) { //触发分页后的回调
										if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
											pageNo = obj.curr;
											self.getAllPage(pageNo,fself);
										}
									}
								});
							});
							layui.use([ 'laypage' ], function() {
								var laypage = layui.laypage;
								laypage({
									cont : 'xxsb_page',
									pages : xxsbtotalpage,
									first : false,
									last : false,
									groups : 4,
									jump : function(obj, first) { //触发分页后的回调
										if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
											pageNo = obj.curr;
											self.getAllPage(pageNo, fself);
										}
									}
								});
							});
						},
						error : function(error) {
							var layer = layui.layer;
							layer.msg('后台条件存在问题，请从新输入条件！');
							throw (error);
							throw ('数据请求失败！');
						}
					});
				}
			});
		});
	},
	getAllData : function(fself) {
		MXZH.effectController.loading(true);
		var self = this;
		$.ajax({
			url : "app/sjcj/findDataCollect",
			data : {
				size_string : 5,
				type_string : '',
				page_string : '',
				labelsid : '',
				timebegin_string : '',
				timeend_string : '',
				creater : '',
			},
			type : "post",
			dataType : "json",
			success : function(tzgglist) {
				self.showAllMessage(tzgglist);
				//fself.layuibd();
				if (xxsbtotalpage > 1) {
					$("#xxsb_page").css("display", "black");
					$(".xxsb_box2").css("bottom", "50px");
				} else {
					$("#xxsb_page").css("display", "none");
					$(".xxsb_box2").css("bottom", "0px");
				}
				layui.use([ 'laypage' ], function() {
					var laypage = layui.laypage;
					laypage({
						cont : 'xxsb_page',
						pages : xxsbtotalpage,
						first : false,
						last : false,
						groups : 4,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo = obj.curr;
								self.getAllPage(pageNo,fself);
							}
						}
					});
				});
				MXZH.effectController.loading(false);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	getAllPage : function(pageNo, fself) {
		MXZH.effectController.loading(true);
		var self = this;
		$.ajax({
			url : "app/sjcj/findDataCollect",
			data : {
				size_string : 5,
				type_string : '',
				page_string : pageNo,
				labelsid : '',
				timebegin_string : '',
				timeend_string : '',
				creater : '',
			},
			type : "post",
			dataType : "json",
			success : function(tzgglist) {
				self.showAllMessage(tzgglist);
				fself.layuibd();
				MXZH.effectController.loading(false);
			},
			error : function(error) {
				MXZH.effectController.loading(false);
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	showAllMessage : function(tzgglist) {
		$(this.config.Xxsbcontent[1]).html('');
		xxsbtotalpage = tzgglist.totalPage;
		if (tzgglist.beanList.length > 0) {
			for (i = 0; i < tzgglist.beanList.length; i++) {
				var trHtml = "";
				var description = "";
				if (tzgglist.beanList[i].description != null && tzgglist.beanList[i].description != "") {
					description = "<div class='xxsb_all_beizhu'>" + tzgglist.beanList[i].description + "</div><div class='xxsb_all_laberl'> ";
				}
				var labels = "";
				for (y = 0; y < tzgglist.beanList[i].labels.length; y++) {
					labels += "<div class='xxsb_all_laberlBox'> <div class='laberlstart'></div><div class='laberlend'>" + tzgglist.beanList[i].labels[y].name + "</div> </div>";
				}
				var nr_text = tzgglist.beanList[i].text;
				var nr,dis;
				  var lenth=nr_text.length;
				  
				  if(lenth>30){
					  nr= nr_text.substr(0,30)+"..." ,dis='initial'
				  }else{
					  nr= nr_text,dis='none'
				  }
				if ('images' in tzgglist.beanList[i]) {
					var imgsm = tzgglist.beanList[i].images[0].thumbnail;
					var imageobj = tzgglist.beanList[i].images;
					var imagesize = tzgglist.beanList[i].images.length;
					var imagearray = new Array();
					for (x = 0; x < tzgglist.beanList[i].images.length; x++) {
						imagearray.push(tzgglist.beanList[i].images[x].original);
					}
					trHtml = "<li id_="+tzgglist.beanList[i].id+"><div class='xxsb_topBox'><div class='xxsb_peoName ellipsis'>" + tzgglist.beanList[i].creater + "</div>"
						+ "<div class='xxsb_time'>" + dateFormat(tzgglist.beanList[i].createtime, 'yyyy-MM-dd hh:mm:ss') + "</div></div> <div class='nocopyCont' style='word-wrap:break-word;word-break:break-all'><span class='pnocopyCont'>" + nr + "</span><span style='display:"+dis+"' class='_zhankai'>展开</span></div>"
						+ "<div class='xxsb_imgbox'><div class='xxsb_img' filesrc='" + imagearray + "' filetype='1'><img src='" + imgsm + "'></div> <div class='imgtxt'>共" + imagesize + "张</div></div>"
						+ "<div class='xxsb_addrBox' lat=" + tzgglist.beanList[i].lat + " lon=" + tzgglist.beanList[i].lon + "><div class='xxsb_addr_xtb'><img src='mx/xxsb/images/xxsb_xtb1.png' width='14' height='19'></div>"
						+ "<div class='xxsb_all_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div></div>"
						+ "" + labels + "</div></li>"
				} else if ('video' in tzgglist.beanList[i]) {
					var imgsm = tzgglist.beanList[i].video[0].thumbnail;
					var video = tzgglist.beanList[i].video[0].original;

					trHtml = "<li id_="+tzgglist.beanList[i].id+"> <div class='xxsb_topBox'><div class='xxsb_peoName ellipsis'>" + tzgglist.beanList[i].creater + "</div>"
						+ "<div class='xxsb_time'>" + dateFormat(tzgglist.beanList[i].createtime, 'yyyy-MM-dd hh:mm:ss') + "</div></div> <div class='nocopyCont' style='word-wrap:break-word;word-break:break-all'><span class='pnocopyCont'>" + nr + "</span><span style='display:"+dis+"' class='_zhankai'>展开</span></div>"
						+ "<div class='xxsb_imgbox'><div class='xxsb_img' filesrc='" + video + "' filetype='2' ><div class='xxsb_sp'><img src='mx/lsxx/images/bofang.png' width='35' height='35' /></div><img src='" + imgsm + "'></div></div>"
						+ "<div class='xxsb_addrBox' lat=" + tzgglist.beanList[i].lat + " lon=" + tzgglist.beanList[i].bd + "><div class='xxsb_addr_xtb'><img src='mx/xxsb/images/xxsb_xtb1.png' width='14' height='19'></div>"
						+ "<div class='xxsb_all_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div></div>"
						+ "" + description + "" + labels + "</div></li>"
				} else {
					trHtml = "<li id_="+tzgglist.beanList[i].id+"> <div class='xxsb_topBox'><div class='xxsb_peoName ellipsis'>" + tzgglist.beanList[i].creater + "</div>"
						+ "<div class='xxsb_time'>" + dateFormat(tzgglist.beanList[i].createtime, 'yyyy-MM-dd hh:mm:ss') + "</div></div> <div class='nocopyCont' style='word-wrap:break-word;word-break:break-all'><span class='pnocopyCont'>" + nr + "</span><span style='display:"+dis+"' class='_zhankai'>展开</span></div>"
						+ "<div class='xxsb_addrBox' lat=" + tzgglist.beanList[i].lat + " bd=" + tzgglist.beanList[i].lon + "><div class='xxsb_addr_xtb'><img src='mx/xxsb/images/xxsb_xtb1.png' width='14' height='19'></div>"
						+ "<div class='xxsb_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div>"
						+ "<div class='xxsb_all_addr ellipsis' title='" + tzgglist.beanList[i].location + "'>" + tzgglist.beanList[i].location + "</div></div>"
						+ "" + description + "" + labels + "</div></li>"
				}
				$(this.config.Xxsbcontent[1]).append(trHtml);
			}
			$("._zhankai").on("click",function(){
				var myid=$(this).parents('li').attr('id_'),that=$(this);
				if(that.attr("type")=='展开' || !that.attr("type")){
					dojo.map(tzgglist.beanList,function(item){
						 if(item.id==myid){
							 that.text("收起").attr("type",'收起');
							 that.siblings(".pnocopyCont").text(item.text);  
							 var hs=Math.ceil(item.text.length/22)*25;
							 that.parents(".nocopyCont").css('maxHeight',hs+'px');
						 }
					});
				}else{
					dojo.map(tzgglist.beanList,function(item){
						 if(item.id==myid){
							 that.text("展开").attr("type",'展开');
							 that.siblings(".pnocopyCont").text(item.text.substr(0,30)+"..."); 
							 that.parents(".nocopyCont").css('maxHeight','50px');
						 }
					});	
				}
			})
			//this.activexr();
		} else {
			var layer = layui.layer;
			layer.msg('未查询到数据！');
		}
		var opentzggtk = new MXZH.opentzggtk();
		//注册定位点击事件
		opentzggtk.init();
	},
	getPage : function(pageNo) {
		MXZH.effectController.loading(true); //锁屏功能
		//获取分页历史消息数据
		var self = this;
		$.ajax({
			url : self.config.dataURL,
			data : {
				pageNo : pageNo,
				pageSize : self.config.pageSize
			},
			type : "post",
			success : function(tzgglist) {
				self.showxxsb(JSON.parse(tzgglist));
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	showxxsb : function(tzgglist) {
		$(this.config.TzggIdArray[0]).html(" ");
		if (tzgglist[0].beanList.length > 0) {
			totaalTzggNo = tzgglist[0].totalPage;
			for (var i = 0; i < tzgglist[0].beanList.length; i++) {
				var title = tzgglist[0].beanList[i].title;
				var tzgg_id = tzgglist[0].beanList[i].id;
				var content = tzgglist[0].beanList[i].content;
				var thumbnail = '';
				if (tzgglist[0].beanList[i].picture != "") {
					var _tmp = eval('(' + tzgglist[0].beanList[i].picture + ')');
					thumbnail = _tmp.thumbnail;
				}
				var trHtml = " ";
				trHtml = "<li><div class='lsgj_txt_title'><div class='checkTitleInput'> "
					+ "<input type='checkbox' name='like1[write]' lay-skin='primary' id='" + tzgg_id + "' ></div>"
					+ "<div class='checkTitleName ellipsis'>" + title + "</div></div>"
					+ "<div class='tzgg_cont'><span>" + content + "</span></div>"
					+ " <div class='tzgg_imgBox'> <img src='" + thumbnail + "'></div>"
					+ "<div class='tzgg_time'><span>发布时间：</span>"
					+ "<span>" + dateFormat(tzgglist[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</span></div></li>";
				$(this.config.TzggIdArray[0]).append(trHtml);

				layui.use("form", function() {
					var form = layui.form();
					form.render("checkbox");
				});

			}
		} else {
			var layer = layui.layer;
			layer.msg('未查询到数据！');
		}
		MXZH.effectController.loading(false); //去除锁屏功能
	}
}