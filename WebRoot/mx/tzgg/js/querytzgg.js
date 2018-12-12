var totalTzggNo;
/*
 * 控制器等待
 */
jQuery(document).ready(function() {

	/*
	 * 控制器
	 *
	 */
	MXZH.tzggCF = function() {};
	MXZH.tzggCF.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.tzgg.init(this.config);
			this.tzgg.getData();
			this.addeventlister();
		},
		config : {
			dataURL : "${basePath}/home_queryTzgg.action", //请求后台的数据地址
			addurl : "${basePath}/home_addtzgg.action",
			delurl : "${basePath}/home_deltzgg.action",
			TzggIdArray : [ "#tzgglist", ".tzgg_newgg", ".tzgg_delgg" ],
			iframeIdArray : [ "#layui-layer-iframe", "#tzgg_title" ],
			pageSize : 5
		},
		addeventlister : function() {
			var self = this;
			$(this.config.TzggIdArray[1]).unbind().click(function() {
				self.tzgg.addtzgg();
			});
			$(this.config.TzggIdArray[2]).unbind().click(function() {
				self.tzgg.deltzgg();
			});
		},
		tzgg : new MXZH.tzgg()
	}
})
/*
 * 通知公告消息列表，具体功能在该类里面
 * 通过配置类调用
 * */

MXZH.tzgg = function() {
	//元素图层
	this.config = {

	};
};
MXZH.tzgg.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	getData : function() {
		MXZH.effectController.loading(true); //锁屏功能
		//获取通知公告消息数据
		var self = this;
		$.ajax({
			url : self.config.dataURL,
			data : {
				pageNo : 1,
				pageSize : self.config.pageSize
			},
			type : "post",
			success : function(tzgglist) {
				layui.use([ 'laypage', 'form' ], function() {
					var laypage = layui.laypage,
						form = layui.form();
					self.showtzgg(JSON.parse(tzgglist));
					if(totalTzggNo >1){
						$("#Pagetzgg").css("display","block");
						$(".tzgg_box").css("bottom","50px");
					}else{
						$("#Pagetzgg").css("display","none");
						$(".tzgg_box").css("bottom","0px");
					}
					laypage({
						cont : 'Pagetzgg',
						pages : totalTzggNo, //总页数
						groups : 4, //连续显示分页数
						first : false,
						last : false,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo = obj.curr;
								self.getPage(pageNo);
							}
						}
					});
				});
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	addtzgg : function() {
		var self = this;
		layui.use('layer', function() {
			var layer = layui.layer;
			layer.open({
				content : [ 'mx/tzgg/iframe_xjgg.jsp', 'no' ],
				type : 2,
				id : 'layui-layer',
				shadeClose : true,
				btn : [ '确定' ],
				btnAlign : 'c',
				area : [ '600px', '415px' ],
				yes : function(index, layero) {
					var tzgg_title = $(self.config.iframeIdArray[0] + index).contents().find(self.config.iframeIdArray[1]).val();
					var tzgg_context = $(self.config.iframeIdArray[0] + index)[0].contentWindow.layui.layedit.getContent(1);
					var imgList = $($(self.config.iframeIdArray[0] + index)[0].contentWindow.layui.layedit.getContent(1));
					var img_total = 0;
					var wz_tzgg_context = $(self.config.iframeIdArray[0] + index)[0].contentWindow.layui.layedit.getText(1);
					for(var i=0;i<imgList.length;i++){
						if(imgList.eq(i).attr('src') !==null)(
								img_total++
						)
					}
					if(img_total >10){
						layer.msg('图片不能超出10张！');
						return false;
					}
					if (tzgg_title == "") {
						layer.msg('标题不能为空！');
						return false;
					}
					if (tzgg_title.length >16) {
						layer.msg('标题长度不能超过16个字符！');
						return false;
					}
					if(wz_tzgg_context.length >800){
						layer.msg('内容不能超出800个字符！');
						return false;
					}
					$.ajax({
						url : self.config.addurl,
						data : {
							tzgg_title : tzgg_title,
							tzgg_context : tzgg_context,
							username : username
						},
						type : "post",
						success : function() {
							layer.close(index);
							layer.msg('上传成功！');
							self.getData();
							self.getData();
						},
						error : function() {
							layer.close(index);
							layer.msg('上传失败！');
						}
					});
				},
			});
		});
	},
	deltzgg : function() {
		var self = this;
		layui.use('layer', function() {
			var layer = layui.layer;
			var id_array = new Array();
			$('input[name="like1[write]"]:checked').each(function() {
				id_array.push($(this).attr("id")); //向数组中添加元素  
			});
			var idstr = id_array.join(','); //将数组元素连接起来以构建一个字符串 
			if (idstr == "") {
				layer.msg('请选择删除的信息！');
				return false;
			}
			layer.confirm('确定删除吗？', {
				  btn: ['确定','取消'] //按钮
				}, function(){
					$.ajax({
						url : self.config.delurl,
						data : {
							idArray : idstr
						},
						type : "post",
						success : function() {
							layer.msg('删除成功！');
							self.getData();
							self.getData();
						},
						error : function() {
							layer.msg('删除失败！');
						}
					});
				}, function(){
					layer.msg('已取消', {
					    time: 1000
					  });
				});
		});
	},
	getPage : function(pageNo) {
		MXZH.effectController.loading(true); //锁屏功能
		var self = this;
		$.ajax({
			url : self.config.dataURL,
			data : {
				pageNo : pageNo,
				pageSize : self.config.pageSize
			},
			type : "post",
			success : function(tzgglist) {
				self.showtzgg(JSON.parse(tzgglist));
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	showtzgg : function(tzgglist) {
		$(this.config.TzggIdArray[0]).html(" ");
		if (tzgglist[0].beanList.length > 0) {
			totalTzggNo = tzgglist[0].totalPage;
			for (var i = 0; i < tzgglist[0].beanList.length; i++) {
				var title = tzgglist[0].beanList[i].title;
				var tzgg_id = tzgglist[0].beanList[i].id;
				var content = tzgglist[0].beanList[i].content;
				var pics = tzgglist[0].beanList[i].pics;
				var trHtml = " ";
				if (content != null && content != "") {
					if (pics != null && pics != "") {
						var picsArray = JSON.parse(pics);
						trHtml = "<li><div class='tzgg_txt_title'><div class='checkTitleInput'> "
							+ "<input type='checkbox' name='like1[write]' lay-skin='primary' id='" + tzgg_id + "' ></div>"
							+ "<div class='checkTitleName ellipsis'>" + title + "</div></div>"
							+ "<div class='tzgg_cont' style='word-wrap:break-word;word-break:break-all;'><span >" + content + "</span></div>"
							+ " <div class='tzgg_imgBox'><div class='tzgg_imgcont' picsArray='"+picsArray+"'> <img src='" + picsArray[0] + "'></div><div class='tzgg_imgNum'>共" + picsArray.length + "张</div></div>"
							+ "<div class='tzgg_time'><span>发布时间：</span>"
							+ "<span>" + dateFormat(tzgglist[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</span></div></li>";
					} else {
						trHtml = "<li><div class='tzgg_txt_title'><div class='checkTitleInput'> "
							+ "<input type='checkbox' name='like1[write]' lay-skin='primary' id='" + tzgg_id + "' ></div>"
							+ "<div class='checkTitleName ellipsis'>" + title + "</div></div>"
							+ "<div class='tzgg_cont'style='word-wrap:break-word;word-break:break-all;'><span >" + content + "</span></div>"
							+ "<div class='tzgg_time'><span>发布时间：</span>"
							+ "<span>" + dateFormat(tzgglist[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</span></div></li>";
					}
				} else {
					if (pics != null && pics != "") {
						var picsArray = JSON.parse(pics);
						trHtml = "<li><div class='tzgg_txt_title'><div class='checkTitleInput'> "
							+ "<input type='checkbox' name='like1[write]' lay-skin='primary' id='" + tzgg_id + "' ></div>"
							+ "<div class='checkTitleName ellipsis'>" + title + "</div></div>"
							+ " <div class='tzgg_imgBox'><div class='tzgg_imgcont' picsArray='"+picsArray+"'> <img src='" + picsArray[0] + "'></div><div class='tzgg_imgNum'>共" + picsArray.length + "张</div></div>"
							+ "<div class='tzgg_time'><span>发布时间：</span>"
							+ "<span>" + dateFormat(tzgglist[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</span></div></li>";
					} else {
						trHtml = "<li><div class='tzgg_txt_title'><div class='checkTitleInput'> "
							+ "<input type='checkbox' name='like1[write]' lay-skin='primary' id='" + tzgg_id + "' ></div>"
							+ "<div class='checkTitleName ellipsis'>" + title + "</div></div>"
							+ "<div class='tzgg_time'><span>发布时间：</span>"
							+ "<span>" + dateFormat(tzgglist[0].beanList[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</span></div></li>";
					}
				}

				$(this.config.TzggIdArray[0]).append(trHtml);
			}
			this.wzxr();
			 layui.use("form", function() {
				var form = layui.form();
				form.render("checkbox");
			}); 
		} /*else {
			var layer = layui.layer;
			layer.msg('未查询到数据！');
		}*/
		MXZH.effectController.loading(false); //去除锁屏功能
		var opentzggtk = new MXZH.opentzggtk();
		opentzggtk.init();
	},
	wzxr : function() {
		$(".tzgg_box ul li").each(function() {
			var maxwidth = 30; //设置最多显示的字数
			var text = $(this).find(".tzgg_cont span").text();
			if ($(this).find(".tzgg_cont span").text().length > maxwidth) {
				$(this).find(".tzgg_cont span").text($(this).find(".tzgg_cont span").text().substring(0, maxwidth));
				$(this).find(".tzgg_cont span").html($(this).find(".tzgg_cont span").html() + '...'); //如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
				$(this).find(".tzgg_cont").append("<a href='###' style='color:#417bdc;'>展开</a>");
			}
			;
			$(this).find("a").click(function() {
				$(this).siblings("span").text(text); //点击“点击展开”，展开全文
				$(this).text("");
				return false;
			})
		})
	}
}