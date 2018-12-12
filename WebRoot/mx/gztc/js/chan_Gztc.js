jQuery(document).ready(function() {
	MXZH.Gztc = function() {};
	MXZH.Gztc.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.wangMapGztc.init(this.config);
		},
		config : {
			BtnArray : [ ".layui-layer-btn0", ".gztc_tabTitle_xtb1", ".gztc_tabTitle_xtb2" ],
			map : MXZH.mainMap.wangMap,
			currentpageNo : 1,
			everyPages : 4,
		},
		dealWithDeleteFence : function(id) {
			var self = this;
			layer.confirm("您确定要删除吗？", {
				btn : [ "确定", "取消" ]
			}, function() {
				MXZH.effectController.loading(true);
				$.ajax({
					url : "${basePath}/home_deleteForGztc.action?time=" + new Date().getTime(),
					data : {
						groupid : id
					},
					type : "post",
					success : function(msg) {
						MXZH.effectController.loading(false);
						layer.msg("删除成功！", {
							time : 1000
						});
						//self.dealWithRemoveLayer(id);
						self.dealWithQueryfeaturesInfo();
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
		dealWithQueryfeaturesInfo : function(iscall) {
			if(!iscall){
				this.config.currentpageNo=1;
			}
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_queryForGztc.action?time=" + new Date().getTime(),
				data : {
					currentpageNo : self.config.currentpageNo,
					everyPages : self.config.everyPages,
				},
				success : function(msg) {
					MXZH.effectController.loading(false);
					var info = JSON.parse(msg);
					layui.use([ 'laypage' ], function() {
						var laypage = layui.laypage;
						laypage({
							first: '首页' ,
							last: '末页' ,
							cont : 'gztc_page',
							pages : Math.ceil(info[0].totalPage / self.config.everyPages),
							groups : 3,
							curr : info[0].currentpageNo,
							jump : function(obj, first) { //触发分页后的回调
								if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
									self.config.currentpageNo = obj.curr;
									self.dealWithQueryfeaturesInfo(true);
								} else {
									self.config.currentpageNo = 1;
								}
							}
						});
					});
					self.dealWithAppendManage(info);
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					layer.msg('数据查询失败！', {
						time : 1000
					})
				}
			});
		},
		gztc_search:function(infos,iscall){
			//根据搜索条件开始搜索
			var self = this;
			MXZH.effectController.loading(true);
			if(!iscall){
				self.config.currentpageNo=1;
			}
			var  pages={
				currentpageNo : self.config.currentpageNo,
				everyPages : self.config.everyPages,
			};
			infos= dojo.safeMixin(infos, pages);
			
    		$.ajax({
				url : "${basePath}/home_searchInfoOfgztc.action?time=" + new Date().getTime(),
				data : infos,
				success : function(msg) {
					MXZH.effectController.loading(false);
					var info = JSON.parse(msg);
					
					layui.use([ 'laypage' ], function() {
						var laypage = layui.laypage;
						laypage({
							first: '首页' ,
							last: '末页' ,
							cont : 'gztc_page',
							pages : Math.ceil(info[0].totalPage / self.config.everyPages),
							groups : 3,
							curr : info[0].currentpageNo,
							jump : function(obj, first) { //触发分页后的回调
								if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
									self.config.currentpageNo = obj.curr;
									self.gztc_search(infos,true);
								} else {
									self.config.currentpageNo = 1;
								}
							}
						});
					});
					//展示搜索结果
					self.dealWithAppendManage(info);
				},
				error : function(error) {
					MXZH.effectController.loading(false);
				}
			});
		},
		dealWithAppendManage : function(listInfo) {
			var self = this;
			var listHtml = " ";
			$(".gztc_all ul").html(" ");
			//首先清除地图的图形
			this.wangMapGztc.clearGrcLayer();
			if (listInfo[0].fencelist.length > 0) {
				for (var i = 0; i < listInfo[0].fencelist.length; i++) {
				  var item=listInfo[0].fencelist[i].fence;
				  var nr,dis;
				  var lenth=item['1'].length;
				  
				  if(lenth>30){
					  nr= item['1'].substr(0,30)+"..." ,dis='initial'
				  }else{
					  nr= item['1'],dis='none'
				  }
				  
				 listHtml =  " <li id_="+item[6]+">  <div class='nocopyTitle'>"+item['0']+"</div>"+
				   "   <div class='nocopyCont'style='word-wrap:break-word;'><span class='pnocopyCont'>"+
				   "  "+nr+"</span><span style='display:"+dis+"' class='_zhankai'>展开</span>"+
				   "  </div> <div class='nocopayimgbox'> <div class='nocopayimg gztc_img' picsArray="+item[8]+"><img src="+item[8]+" /></div>"+
				   "  <div class='imgnum'>共1张</div>  </div>  <div class='timebox'>"+
				   "  <div class='fbsj'>"+item[2]+"</div> <div class='delbox'>"+
				   "       <div class='delxtb'><i class='layui-icon' style='font-size:20px;'>&#xe640</i></div> <div class='deltxt delete_gztc' _id="+item[6]+">删除</div>"+
				   " </div> </div>   </li>";
				 
					$(".gztc_all ul").append(listHtml);
					//展示图层
					this.wangMapGztc.addGracsTogrcLayer([item[4],item[5]]);
				}
				$(".delete_gztc").on('click',function(){
					  var id= $(this).attr("_id");
					  self.dealWithDeleteFence(id);
					});	
				$(".gztc_all ul li").on('click',function(){
					// 缩放至
					var myid=$(this).attr('id_');
					dojo.map(listInfo[0].fencelist,function(item){
						 if(item.fence[6]==myid){
							 self.wangMapGztc.centerAt(item.fence[4]);
						 }
					});
				})
				$("._zhankai").on("click",function(){
					var myid=$(this).parents('li').attr('id_'),that=$(this);
					if(that.attr("type")=='展开' || !that.attr("type")){
						dojo.map(listInfo[0].fencelist,function(item){
							 if(item.fence[6]==myid){
								 that.text("收起").attr("type",'收起');
								 that.siblings(".pnocopyCont").text(item.fence['1']);  
								 var hs=Math.ceil(item.fence['1'].length/22)*25;
								 that.parents(".nocopyCont").css('maxHeight',hs+'px');
							 }
						});
					}else{
						dojo.map(listInfo[0].fencelist,function(item){
							 if(item.fence[6]==myid){
								 that.text("展开").attr("type",'展开');
								 that.siblings(".pnocopyCont").text(item.fence['1'].substr(0,30)+"..."); 
								 that.parents(".nocopyCont").css('maxHeight','50px');
							 }
						});	
					}
				})
			} else {
				layer.msg("未查询到数据！", {
					time : 2000
				})
			}
			var opentzggtk = new MXZH.opentzggtk();
			opentzggtk.init();
		},
		
		clearDeleteFenceLayer : function(id) {
			//清除对应的图层
			this.wangMapGztc.clearGrcLayer(id);
		},
		
		showYjLayer : function(info) {
			this.wangMapGztc.showZTmpLayer(info);
		},

		dealWithSave : function(info) {
			var self = this;
			MXZH.effectController.loading(true);
			$.ajax({
				url : "${basePath}/home_addForGztc.action?time=" + new Date().getTime(),
				data : {
					polygon : info['MyPolygon'],
					point : info['Mypoint'],
					name : info['fName'],
					miaoshu : info['gznr'],
					distance : info['TSLength'],
					creater : info['fcjpeo'],
					createrdate : info['fdate'],
					img_url:info['img']
				},
				type : "post",
				success : function(msg) {
					MXZH.effectController.loading(false);
					layer.msg("数据保存成功！", {
						time : 1000
					});
					window.INDEX_gztc && INDEX_gztcs.length  && layer.close(INDEX_gztcs[0]);
					INDEX_gztcs=[];
					//查询
					self.dealWithQueryfeaturesInfo();
				},
				error : function(error) {
					MXZH.effectController.loading(false);
					throw (error);
					throw ("数据保存失败！");
				}
			})
		},
		dealWithRemoveAndAdd : function(g, i) {
			this.wangMapGztc.removeTemGraphics();
			this.wangMapGztc.showFence(g, i);

		},
		 wangMapGztc : new MXZH.WangMapGztc(),
	     bigPic : new MXZH.opentPics() 
	}
})