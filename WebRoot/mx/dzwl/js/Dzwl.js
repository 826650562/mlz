/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-27 14:42:25
 * @version $Id$
 */
jQuery(document).ready(function() {
	MXZH.Dzwl = function() {
	};
	MXZH.Dzwl.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.wangMapDzwl.init(this.config);
			this.date = new Date();
			var self=this;
			$(this.config.BtnArray[1]).unbind().click(function() {
				$(self.config.BtnArray[1]).find("img").attr("src", "mx/dzwl/images/tabxtb1_active.png");
				$(self.config.BtnArray[2]).find("img").attr("src", "mx/dzwl/images/tabxtb2.png");
			});
			$(this.config.BtnArray[2]).unbind().click(function() {
				$(self.config.BtnArray[1]).find("img").attr("src", "mx/dzwl/images/tabxtb2.png");
				$(self.config.BtnArray[2]).find("img").attr("src", "mx/dzwl/images/tabxtb2_active.png");
			});
		},
		config : {
			BtnArray : [ ".layui-layer-btn0" ,".dzwl_tabTitle_xtb1",".dzwl_tabTitle_xtb2"],
			map : MXZH.mainMap.wangMap
		},
		dealWithEventListner : function() {
			var self = this;
			$($("#layui-layer-iframe" + INDEX_dzwl).contents().find(".adddzwl")).unbind().click(function() {
				self.dealWithDrawFence();
			});
			$(this.config.BtnArray[0]).unbind().click(function(e) {
				self.dealWithSave();
			});
		},
		dealWithShowFence : function(fence, infoArr) {
			this.wangMapDzwl.showFence(fence, infoArr);
		},
		dealWithRemoveLayer : function(id) {
			this.wangMapDzwl.clearGrcLayer(id);
		},
		dealWithDrawFence : function() {
			this.wangMapDzwl.drawFence();
		},
		dealWithDeleteFence : function(id) {
			var self = this;
			layer.confirm("您确定要删除吗？", {
				btn : [ "确定", "取消" ]
			}, function() {
				MXZH.effectController.loading(true);
				$.ajax({
					url : "${basePath}/home_deleteForDzwl.action?time="+new Date().getTime(),
					data : {
						groupid : id
					},
					type : "post",
					success : function(msg) {
						MXZH.effectController.loading(false);
						layer.msg("删除成功！", {
							time : 1000
						});
						self.dealWithRemoveLayer(id);
						self.dealWithQueryFenceInfo();
					},
					error : function(error) {
						MXZH.effectController.loading(false);
						layer.msg('删除失败！', {
							time : 1000
						})
					}
				});
			});
		},
		dealWithQueryFence : function(infoArr) {
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_queryForDzwlPath.action?time="+new Date().getTime(),
				data : {
					groupid : infoArr[0]
				},
				type : "post",
				success : function(msg) {
					MXZH.effectController.loading(false);
					self.dealWithShowFence(msg, infoArr);
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					layer.msg('数据查询失败！', {
						time : 1000
					})
				}
			});
		},
		dealWithQueryFenceInfo : function() {
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_queryForDzwl.action?time="+new Date().getTime(),
				data : {},
				success : function(msg) {
					MXZH.effectController.loading(false);
					var info = JSON.parse(msg);
					self.dealWithAppendFenceManage(info);
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					layer.msg('数据查询失败！', {
						time : 1000
					})
				}
			});
		},
		toggleFenceInfo : function(tid, id) {
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_toggleForDzwl.action?time="+new Date().getTime(),
				data : {
					typeId : tid,
					groupid : id
				},
				success : function(msg) {
					MXZH.effectController.loading(false);
				},
				error : function(error) {
					MXZH.effectController.loading(false);
				}
			});
		},

		checkoutHtml : function(info) {},
		dealWithAppendFenceManage : function(listInfo) {
			//添加围栏
			var self = this;
			var listHtml = " ";
			$(".dzwl_all ul").html(" ");
			if (listInfo[0].fencelist.length > 0) {
				for (var i = 0; i < listInfo[0].fencelist.length; i++) {
					var ison='layui-form-onswitch';
					if(listInfo[0].fencelist[i].fence[6]=='0'){
						ison='layui-form-onswitch';
					}else ison='';
					if (listInfo[0].fencelist[i].fence[1] == "禁入") {
						listHtml = "<li >" +
							"<div class='noOutNoIn_xtb'><img src='mx/dzwl/images/noIn.png' width='47' height='47'></div>" +
							"<div class='noOutNoIn_Title ellipsis'>" + listInfo[0].fencelist[i].fence[0] + "</div>" +
							"<div class='noOutNoIn_openClose'  name='"+listInfo[0].fencelist[i].fence[0]+"'  type='"+listInfo[0].fencelist[i].fence[1]+"'  id='" + listInfo[0].fencelist[i].fence[5] + "'>" +
							"<div class='OI_openClose_txt'>禁入：</div>" +
							"<div class='OI_openClose_toggle'>" +
							" <div name='"+listInfo[0].fencelist[i].fence[6]+"' class='layui-unselect layui-form-switch "+ison+"' lay-skin='_switch'><em>ON</em><i></i></div> " +
							"</div>" +
							"<div class='dzwl_caozuo' >" +
							"<span><i class='layui-icon' style='font-size:20px;'>&#xe640</i></span><span class='delthis' id='" + listInfo[0].fencelist[i].fence[5] + "'>删除</span>" +
							"</div>" +
							"<div class='dzwl_caozuo' style='color: #333'>" +
							"<span><i class='layui-icon' style='font-size:20px;'>&#x1006;</i></span><span class='clearthis'  style='cursor: not-allowed'  id='" + listInfo[0].fencelist[i].fence[5] + "'>清除</span>" +
							"</div>" +
							"</div>" +
							"</li>";
						;
					} else if (listInfo[0].fencelist[i].fence[1] == "禁出") {
						listHtml = "<li>" +
							"<div class='noOutNoIn_xtb'><img src='mx/dzwl/images/noOut.png' width='47' height='47'></div>" +
							"<div class='noOutNoIn_Title ellipsis'>" + listInfo[0].fencelist[i].fence[0] + "</div>" +
							"<div class='noOutNoIn_openClose'  name='"+listInfo[0].fencelist[i].fence[0]+"'  type='"+listInfo[0].fencelist[i].fence[1]+"'  id='" + listInfo[0].fencelist[i].fence[5] + "'>" +
							"<div class='OI_openClose_txt'>禁出：</div>" +
							"<div class='OI_openClose_toggle'>" +
							" <div name='"+listInfo[0].fencelist[i].fence[6]+"' class='layui-unselect layui-form-switch "+ison+"' lay-skin='_switch'><em>ON</em><i></i></div> " +
							"</div>" +
							"<div class='dzwl_caozuo' >" +
							"<span><i class='layui-icon' style='font-size:20px;'>&#xe640</i></span><span class='delthis' id='" + listInfo[0].fencelist[i].fence[5] + "'>删除</span>" +
							"</div>" +
							"<div class='dzwl_caozuo'  style='color: #333' >" +
							"<span><i class='layui-icon' style='font-size:20px;'>&#x1006;</i></span><span class='clearthis' style='cursor: not-allowed'  id='" + listInfo[0].fencelist[i].fence[5] + "'>清除</span>" +
							"</div>" +
							"</div>" +
							"</li>";
					}
					$(".dzwl_all ul").append(listHtml);
				}
				 
				$(".layui-unselect").unbind().click(function(e){
					if($(this).hasClass("layui-form-onswitch")) {
						//假如有 就关闭
						$(this).removeClass("layui-form-onswitch");
						MXZH.log('关闭');
						var groupid = $(this).parent().parent().attr("id");
						var type = $(this).attr("name");
						var ty;
						type=='0'?ty='1':ty='0';
						self.toggleFenceInfo(ty, groupid);
						$(this).attr("name",ty);
						e.stopPropagation();
						
					}else{
						//假如没有  开启
						MXZH.log('开启');
						$(this).addClass("layui-form-onswitch");
						
						var groupid = $(this).parent().parent().attr("id");
						var type = $(this).attr("name");
						var ty;
						type=='0'?ty='1':ty='0';
						self.toggleFenceInfo(ty, groupid);
						$(this).attr("name",ty);
						e.stopPropagation();
					}
				});
				
				var div = document.getElementById('dzwl_all'),
					lis = div.getElementsByTagName('li');

				for (var i = 0; i < lis.length; i++) {
					(function(i) {
						lis[i].onclick = function(e) {
							var groupid = $(this.childNodes[2]).attr("id");
							var name = $(this.childNodes[2]).attr("name");
							var type = $(this.childNodes[2]).attr("type");

							$(this).css("background", "#d2e3ff");
							$(this).siblings().css("background", "#fff");

							self.dealWithQueryFence([groupid,name,type]);
							e.stopPropagation();
						}
					})(i)
				}
				$(".delthis").unbind().click(function(e) {
					var groupid = $(this).attr("id");
					self.dealWithDeleteFence(groupid);
					e.stopPropagation();
				});
				$(".clearthis").unbind().click(function(e) {
					var groupid = $(this).attr("id");
					self.clearDeleteFenceLayer(groupid);
					e.stopPropagation();
				});
				
				//激活所有存在于地图中对应的layer的图标
				self.wangMapDzwl.activeIconBylayer();
			} else {
				layer.msg("未查询到围栏数据！", {
					time : 1000
				})
			}
		},
		clearDeleteFenceLayer : function(id) {
			//清除对应的图层
			this.wangMapDzwl.clearGrcLayer(id);
		},
		clearTempLayerFOrCanceWindow:function(){
			this.wangMapDzwl.clearTempLayer();
		},
		dealWithAppendFenceAlarm : function(myListInfo) {
			//添加预警
			var self = this;
			var listHtml = "";
 
			if (myListInfo.length > 0) {
				for (var i = 0; i < myListInfo.length; i++) {
					var id_ = myListInfo[i]['user_name'] + ";" + myListInfo[i]['wlname'] + myListInfo[i]['yjsj'];
					var alreadExist = false;
					$.map($(".dzwl_box1 ul li"), function(item) {
						if ($(item).attr('_id') == myListInfo[i]['id']) {
							alreadExist = true;return;
						}
					});
					if (!alreadExist) {
						this.date.setTime(myListInfo[i]['yjsj']);
						if (myListInfo[i]['type'] == "禁入") {
							listHtml = "<li class ='wl_name' _id=" + myListInfo[i]['id'] + " Id=" + myListInfo[i]['user_name'] + ";" + myListInfo[i]['wlname'] + ";" + myListInfo[i]['yjsj'] + ">" +
								"<div class='noOutNoIn_xtb'><img src=" + MAPAPI_URL + "/mx/dzwl/images/noIn.png width='47' height='47'></div>" +
								"<div class='noOutNoIn_txt'>" + this.date.Format('YYYY/MM/DD hh:mm:ss') + "<strong>" + myListInfo[i]['yonghu'] + "</strong>进入禁入围栏<strong>" + myListInfo[i]['wlname'] + "</strong></div>" +
								"<div class='Iknow'><a href='javacript:void(0);' class='IknowBtn'>标记为已读</a><span><i class='layui-icon'></i></span>" +
								"</div></li>";
							//显示预警图层及位置
							self.showYjLayer(myListInfo[i]);
						} else if (myListInfo[i]['type'] == "禁出") {
							listHtml = "<li  class ='wl_name' _id=" + myListInfo[i]['id'] + " Id=" + myListInfo[i]['user_name'] + ";" + myListInfo[i]['wlname'] + ";" + myListInfo[i]['yjsj'] + ">" +
								"<div class='noOutNoIn_xtb'><img src=" + MAPAPI_URL + "/mx/dzwl/images/noOut.png width='47' height='47'></div>" +
								"<div class='noOutNoIn_txt'>" + this.date.Format('YYYY/MM/DD hh:mm:ss') + "<strong>" + myListInfo[i]['yonghu'] + "</strong>走出禁出围栏<strong>" + myListInfo[i]['wlname'] + "</strong></div>" +
								"<div class='Iknow'><a href='javacript:void(0);' class='IknowBtn'>标记为已读</a><span><i class='layui-icon'></i></span>" +
								"</div> </li>";
							//显示预警图层及位置
							self.showYjLayer(myListInfo[i]);
						}
						$(".dzwl_box1 ul").prepend(listHtml);
						$(".IknowBtn").unbind().click(function() {
							//点击标记
							var node = $(this).parents(".wl_name");
							var id = node.attr("_id");
							self.dealWithUpdate_(id, node);
						});
					}
				}

			}

		},

		showYjLayer : function(info) {
			this.wangMapDzwl.showZTmpLayer(info);
		},
		dealWithUpdate_ : function(id, event) {
			layer.confirm("您确定要标记这条记录吗？", {
				btn : [ "确定", "取消" ]
			}, function() {
				MXZH.effectController.loading(true);
				$.ajax({
					url : "${basePath}/home_deleteForYJ.action?time="+new Date().getTime(),
					data : {
						groupid : id
					},
					type : "post",
					success : function(msg) {
						layer.msg("标记成功！", {
							time : 1000
						});
						MXZH.effectController.loading(false);
						event.remove();
					},
					error : function(error) {
						layer.msg("抱歉出错！", {
							time : 1000
						});
						MXZH.effectController.loading(false);
					}
				})
			});

		},
		dealWithSaveFence : function(layerStr, info) {
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_addForDzwl.action?time="+new Date().getTime(),
				data : {
					LayerPath : '"' + layerStr.replace(/"/g, "'") + '"',
					name : info[0],
					miaosu : info[1],
					creater : username,
					createrdate : ""
				},
				type : "post",
				success : function(msg) {
					MXZH.effectController.loading(false);
					self.dealWithQueryFenceInfo();
					var idObj=JSON.parse(msg);
					var infos=[idObj[0].id,info[0],info[1]];
					layerStr = "["+layerStr+"]";
					self.dealWithRemoveAndAdd(layerStr,infos);//删除临时的图层，添加这个和文字图层
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					throw (error);
					throw ("数据保存失败！");
				}
			})
		},
		dealWithSave : function() {
			var FenceName = $("#layui-layer-iframe" + INDEX_dzwl).contents().find(".layui-input").val(),
				FenceStatus = $("#layui-layer-iframe" + INDEX_dzwl).contents().find('input:radio:checked').val(),
				info = [],
				strOfLayer = "";

			if (FenceName == "") {
				layer.msg("围栏名称不能为空！", {
					time : 1000
				});
				return false;
			}
			info[0] = FenceName;
			info[1] = FenceStatus;
			dojo.forEach(this.wangMapDzwl.drawGrcLayer.graphics, function(layer) {
				if (layer.attributes.type == 'fillLine') {
					strOfLayer += JSON.stringify(layer.toJson());
					strOfLayer += ",";
				}
			})
			var geoStr=strOfLayer.substr(0, strOfLayer.length - 1);
			this.dealWithSaveFence(geoStr, info);
			layer.msg("保存围栏成功！", {
				time : 1000
			});
			layer.closeAll();
		},
		dealWithRemoveAndAdd:function(g,i){
			this.wangMapDzwl.removeTemGraphics();
			this.wangMapDzwl.showFence(g,i);
			
		},
		wangMapDzwl : new MXZH.WangMapDzwl()
	}
})