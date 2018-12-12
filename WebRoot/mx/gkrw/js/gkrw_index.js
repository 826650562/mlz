/*
 * 跟控任务js
 * 2017-06-12 
 */
jQuery(document).ready(function() {
	MXZH.gkrwCF = function() {};
	MXZH.gkrwCF.prototype = {
		Myimg : null,
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.layuiform();
			this.gkrw.init(this.config);
			this.addfer();
			this.addeventlister();
		},
		layuiform : function() {
			layui.use("form", function() {
				var form = layui.form();
				form.render("radio");
			});
		},
		config : {
			URLS : [ "${basePath}/gkrw_queryLsgj.action", "${basePath}/tjfx_queryEndCount.action", "${basePath}/tjfx_queryType.action", "${basePath}/tjfx_queryHxqy.action", "${basePath}/gkrw_queryuser.action" ],
			URL : [ "app/gkrw/addtask", "app/gkrw/addtarget", "app/gkrw/querygkrw", "${basePath}/gkrw_queryGkrw.action" ],
			mblArray : [ ".layui-tab-title li", "#chongzhi", "#gkrw_cx", "#fzrxx" ],
			mbdxArray : [ ".mbdxadd", ".mudx_box", ".mudx_close", "#mbbc", ".gkrw_czbox" ],
			rwmbcxArray : [ "#ksday", "#jsday", "#zjzt", "#rwdj", "#rwmb_nr", "#rwmb_cx" ],
			pagesize : 2
		},
		addfer : function() {
			var self = this;
			//页面初始化时，第一次加载用户
			$.ajax({
				url : self.config.URLS[4],
				cache : false,
				data : {
				},
				type : "post",
				success : function(msg) {
					var jsonuser = JSON.parse(msg);
					showuser(jsonuser);
				},
				error : function() {
					layer.msg('删除失败！');
				}
			});
			function showuser(msg) {
				var selector = self.config.mblArray[3];
				$(selector).html("");
				$(selector).append("<option value=''>选择任务负责人</option>");
				for (var i = 0; i < msg.length; i++) {
					var strhtml = "<option value='" + msg[i].id + "'>" + msg[i].name + "</option>";
					$(selector).append(strhtml);
				}

				layui.use("form", function() {
					var form = layui.form();
					form.render("select");
				});
			}
		},
		addeventlister : function() {
			//注册事件
			var self = this;
			$(this.config.rwmbcxArray[5]).unbind().click(function() {
				var ksday = $(self.config.rwmbcxArray[0]).val();
				var jsday = $(self.config.rwmbcxArray[1]).val();
				if (self.gkrw.checktime(ksday, jsday)) {
					var zjzt = $(self.config.rwmbcxArray[2]).find("input[type='radio']:checked").val();
					var rwdj = $(self.config.rwmbcxArray[3]).find("input[type='radio']:checked").val();
					var rwmb_nr = $(self.config.rwmbcxArray[4]).val();
					self.gkrw.querygkrw(ksday, jsday, zjzt, rwdj, rwmb_nr, self.config.pagesize);
				}
			});
			$(this.config.mblArray[0]).unbind().click(function() {
				if ($(this).index() == 0) {
					$(this).find("img").attr("src", "mx/gkrw/images/rwcx_blue.png");
					$(this).siblings("li").find("img").attr("src", "mx/gkrw/images/rwxz_gray.png");
				} else {
					$(this).find("img").attr("src", "mx/gkrw/images/rwxz_blue.png");
					$(this).siblings("li").find("img").attr("src", "mx/gkrw/images/rwcx_gray.png");
				}
			});
			$(this.config.mbdxArray[0]).unbind().click(function() {
				self.gkrw.addmbdx();
				layui.use([ 'upload' ], function() {
					layui.upload({
						url : 'app/home/addimg', //上传接口
						success : function(res) { //上传成功后的回调
							self.Myimg.attr('src', res.data.src);
						}
					});
				});
			});
			$(this.config.mbdxArray[3]).unbind().click(function() {
				var layer = layui.layer;
				var date = new Date();
				var currentTime = date.Format("yyyyMMddhhmmss");
				var rwbh = "RW" + currentTime;
				var rwid = currentTime + "" + Math.floor(Math.random() * 999999);
				var rwmc = $(self.config.mbdxArray[4]).find("input[id='rwmc']").val().replace(/</g, '').replace(/>/g, '');
				var rwnr = $(self.config.mbdxArray[4]).find("textarea[id='rwnr']").val();
				var rwfzr = $("#fzrxx").find("option:selected").text();
				var rwfzrid = $("#fzrxx").find("option:selected").val();
				var mbdj = $(self.config.mbdxArray[4]).find("input[type='radio']:checked").val();
				var mbdj_name = $(self.config.mbdxArray[4]).find("input[type='radio']:checked").attr("title");
				var mudx_nr = $(".mudx_box").find("div[class='mudx_nr']");
				if (rwmc === null || rwmc.replace(/\s/g, "") === "") {
					layer.msg('名称不能为空');
					return false;
				}
				if (rwfzrid === null || rwfzrid === "") {
					layer.msg('负责人不能为空');
					return false;
				}
				if (rwmc.length > 16) {
					layer.msg('任务名称不能超过16个字符');
					return false;
				}
				if (rwnr === null || rwnr.replace(/\s/g, "") === "") {
					layer.msg('任务内容不能为空');
					return false;
				}
				if (rwnr.length > 200) {
					layer.msg('任务内容不能超过200字符');
					return false;
				}

				if (mudx_nr.length < 1) {
					layer.msg('需添加个目标对象');
					return false;
				}
				for (var i = 0; i < mudx_nr.length; i++) {
					var mbdxmc = $(mudx_nr[i]).find("input[class='layui-input']").val();
					if (mbdxmc === null || mbdxmc.replace(/\s/g, "") === "") {
						layer.msg('目标对象不能为空');
						return false;
					}
					if (mbdxmc.length > 20) {
						layer.msg('目标对象不能超过20字符');
						return false;
					}
					var mbdxms = $(mudx_nr[i]).find("textarea[class='layui-textarea']").val();
					if (mbdxms === null || mbdxms.replace(/\s/g, "") === "") {
						layer.msg('对象描述不能为空');
						return false;
					}
					if (mbdxms.length > 120) {
						layer.msg('对象描述不能超过120字符');
						return false;
					}

				}
				self.gkrw.saverw(rwid, rwbh, rwmc, rwnr, rwfzr, rwfzrid, mbdj, mbdj_name);
				for (var i = 0; i < mudx_nr.length; i++) {
					var mbdxmc = $(mudx_nr[i]).find("input[class='layui-input']").val();
					var mbdxms = $(mudx_nr[i]).find("textarea[class='layui-textarea']").val();
					var imgpath = $($($(".mudx_box").find("div[class='mudx_nr']")[i]).find("img")[0]).attr("src");
					self.gkrw.savemb(rwid, mbdxmc, mbdxms, imgpath);
				}
				$(self.config.mbdxArray[1]).html('');

			});
			upload_wj = function(e) {
				self.Myimg = $(e).parents(".gkrw_shachun").siblings('.gkrw_slt').find("img");
			}
		},
		destroy : function() {
			if (window._gkrw_gj) {
				_gkrw_gj.clearGuiji();
			}
		},
		gkrw : new MXZH.gkrw()
	};
})
MXZH.gkrw = function() {
	//元素图层
	this.config = {

	}
};
MXZH.gkrw.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	querygkrw : function(ksday, jsday, zjzt, rwdj, rwmb_nr, pagesize) {
		var self = this;
		$.ajax({
			url : self.config.URL[3],
			//url : self.config.URLS[0],
			data : {
				start_time : ksday,
				end_time : jsday,
				state : zjzt,
				level : rwdj,
				content : rwmb_nr,
				pagesize : pagesize,
				pages : 1
			},
			type : "post",
			success : function(msg) {
				var gkmsg = JSON.parse(msg)
				self.showmsg(gkmsg);
				layui.use([ 'laypage' ], function() {
					var allpage = gkmsg[0].totalPage;
					var laypage = layui.laypage;
					laypage({
						cont : 'gkrw_page',
						pages : allpage,
						first : false,
						last : false,
						groups : 4,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo = obj.curr;
								self.querygkrwbypage(ksday, jsday, zjzt, rwdj, rwmb_nr, pagesize, pageNo);
							}
						}
					});
				});
			},
			error : function() {
				layer.msg('查询失败！');
			}
		});
	},
	querygkrwbypage : function(ksday, jsday, zjzt, rwdj, rwmb_nr, pagesize, pageno) {
		var self = this;
		$.ajax({
			url : self.config.URL[3],
			data : {
				start_time : ksday,
				end_time : jsday,
				state : zjzt,
				level : rwdj,
				content : rwmb_nr,
				pagesize : pagesize,
				pages : pageno
			},
			type : "post",
			success : function(msg) {
				var gkmsg = JSON.parse(msg)
				self.showmsg(gkmsg);
			},
			error : function() {
				layer.msg('查询失败！');
			}
		});
	},
	showmsg : function(gkmsg) {
		$(this.config.mblArray[2]).html('');
		var strhtml = "";
		if (gkmsg[0].beanList.length > 0) {
			for (var i = 0; i < gkmsg[0].beanList.length; i++) {
				var task_name = gkmsg[0].beanList[i].task_name;
				var rwbh = gkmsg[0].beanList[i].rwbh;
				var state_name = gkmsg[0].beanList[i].state_name;
				var level = gkmsg[0].beanList[i].level;
				var start_time = gkmsg[0].beanList[i].start_time.time;
				var start_times = dateFormat(start_time, 'yyyy-MM-dd hh:mm:ss');
				var rwid = gkmsg[0].beanList[i].rwid;
				var end_time = "";
				if (gkmsg[0].beanList[i].end_time != "" && gkmsg[0].beanList[i].end_time != null) {
					var end_times = gkmsg[0].beanList[i].end_time.time;
					end_time = dateFormat(end_times, 'yyyy-MM-dd hh:mm:ss');
				}
				var imgs = "";
				if (level == 1) {
					imgs = "<img src='mx/gkrw/images/gao.png' width='25' height='25'>";
				} else if (level == 2) {
					imgs = "<img src='mx/gkrw/images/zhong.png' width='25' height='25'>";
				} else {
					imgs = "<img src='mx/gkrw/images/di.png' width='25' height='25'>";
				}
				var imgsxx = "";
				var mb_name = "";
				for (var j = 0; j < gkmsg[0].beanList[i].target.length; j++) {
					var img = gkmsg[0].beanList[i].target[j].mb_image;
					mb_name += "、" + gkmsg[0].beanList[i].target[j].mb_name;
					var mgxx = JSON.parse(img).thumb;
					var xx = "";
					if (mgxx != null && mgxx != "") {
						xx = "<div class='imgouter'><img src='" + mgxx + "' width='65' height='65'></div>";
					}
					imgsxx = imgsxx + xx;
				}
				if (gkmsg[0].beanList[i].target.length > 3) {
					imgsxx = imgsxx + "<div class='boxdown' wzxx=" + i + ">展开</div>";
				}
				strhtml = "<li class='" + i + "'><div class='gkrw_item_right' rwid=" + rwid + " gkrw_cjsj= '" + start_times + "' ><div class='gkrw_peoName ellipsis'>" + task_name + "</div>"
					+ "<div class='gkrw_item_li'>编号：" + rwbh + "</div><div class='gkrw_item_li'>状态：" + state_name + "</div>"
					+ "<div class='gkrw_item_li'><span class='addpeoTitle'>等级：</span>"
					+ " <span style='height:25px; float:left;'>" + imgs + "</span></div>" +
					"<div class='gkrw_item_li'>开始时间：" + start_times + "</div>" +
					"<div class='gkrw_item_li'>结束时间：" + end_time + "</div>" +
					"<div class='gkrw_item_lis'><span class='addpeoTitles'>目标对象：" + mb_name.substring(1) + "</span> </div>" +
					"<div class='box_all'><div class='imgscontent'>" + imgsxx + "</div></div></div></li>";
				$(this.config.mblArray[2]).append(strhtml);
				this.cssxr(i);
			}
			this.wzxr();
		} else {
			var layer = layui.layer;
			layer.msg('未查询到数据！');
		}
		var gkrwcz = new MXZH.gkrwcz();
		gkrwcz.init();
	},
	cssxr : function(i) {
		var a = $("." + i + " .imgscontent .imgouter:gt(1):not(:last)");
		a.hide();
	},
	wzxr : function() {
		$(".gkrw_box1 ul li").each(function() {
			var maxwidth = 30; //设置最多显示的字数
			var text = $(this).find(".gkrw_item_lis span").text();
			if ($(this).find(".gkrw_item_lis span").text().length > maxwidth) {
				$(this).find(".gkrw_item_lis span").text($(this).find(".gkrw_item_lis span").text().substring(0, maxwidth));
				$(this).find(".gkrw_item_lis span").html($(this).find(".gkrw_item_lis span").html() + '...'); //如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
				$(this).find(".gkrw_item_lis").append("<a href='###' style='color:#417bdc;'>展开</a>");
			}
			;
			$(this).find("a").click(function() {
				$(this).siblings("span").text(text); //点击“点击展开”，展开全文
				$(this).text("");
			})
		})
	},
	addmbdx : function() {
		var xxlength = $(this.config.mbdxArray[1]).find("ul").length + 1;
		var strhtml = "";
		strhtml = "<div class='mudx_cont1'><div class='mudx_title'>"
			+ "<span class='mudx_titletxt'> 目标对象【" + xxlength + "】</span>"
			+ "<span class='mudx_close' jlxx=" + xxlength + "><img src='mx/gkrw/images/mudx_close.png' width='35' height='35'></span></div>"
			+ "<div class='mudx_nr'><ul><li><div class='gkrw_newTitle'>目标对象姓名：</div>"
			+ "<div class='gkrw_inputBox'><input type='text' name='title' lay-verify='title' autocomplete='off' placeholder='目标对象姓名' class='layui-input'></div></li>"
			+ "<li><div class='gkrw_newTitle'>目标对象描述：</div>"
			+ "<div class='gkrw_inputBox'><textarea placeholder='目标对象描述' class='layui-textarea'></textarea></div>"
			+ "<div class='gkrw_newTitle' style='text-align:right; font-size:12px; color:#999;'><em style='padding-right:15px;'>文字长度<120</em></div>"
			+ "<div class='gkrw_slt'> <img src='mx/gkrw/images/xyr.png'></div>"
			+ "<div class='gkrw_shachun'><input type='file' name='file' lay-type='images' class='layui-upload-file' onclick=upload_wj(this)></div>"
			+ "</li></ul></div></div>";
		$(this.config.mbdxArray[1]).append(strhtml);
		var gkrwcz = new MXZH.gkrwcz();
		gkrwcz.init();
	},
	savemb : function(rwid, mbdxmc, mbdxms, imgpath) {
		var self = this;
		$.ajax({
			url : self.config.URL[1],
			data : {
				rwid : rwid,
				mb_name : mbdxmc,
				task_content : mbdxms,
				mb_image : imgpath
			},
			type : "post",
			success : function() {},
			error : function() {
				layer.msg('保存失败！');
			}
		});
	},
	saverw : function(rwid, rwbh, rwmc, rwnr, rwfzr, rwfzrid, mbdj, mbdj_name) {
		var self = this;
		$.ajax({
			url : self.config.URL[0],
			data : {
				rwid : rwid,
				rwbh : rwbh,
				task_name : rwmc,
				level : mbdj,
				level_name : mbdj_name,
				fzr_id : rwfzrid,
				fzr_name : rwfzr,
				task_content : rwnr
			},
			type : "post",
			success : function() {
				$(self.config.mblArray[1]).click();
				layer.msg('保存成功！');
			},
			error : function() {
				layer.msg('保存失败！');
			}
		});

	},
	checktime : function(ksday, jsday) {
		var reg = /^\s*|\s*$/g;
		if (ksday !== '' && ksday !== null && jsday !== '' && jsday !== null) {
			ksday = ksday.replace(reg, "");
			jsday = jsday.replace(reg, "");
			if (ksday > jsday) {
				layui.use([ 'layer' ], function() {
					var layer = layui.layer;
					layer.msg('注意:开始时间必须小于结束时间!');
				});
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	},
	uuid : function() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
}