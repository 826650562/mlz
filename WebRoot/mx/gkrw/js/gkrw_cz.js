/*
 * 跟控任务js
 * 2017-06-12 
 */
jQuery(document).ready(function() {
	MXZH.gkrwcz = function() {};
	MXZH.gkrwcz.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.czgkrw.init(this.config);
			this.addeventlister();
		},
		config : {
			URL : [ "${basePath}/gkrw_queryZrw.action" ],
			gkrwArrays : [ ".gkrw_item_right" ],
			mbdxArrays : [ ".mudx_close", ".boxdown" ]
		},
		addeventlister : function() {
			//注册事件
			var self = this;
			$(this.config.mbdxArrays[0]).unbind().click(function() {
				var jlxx = parseInt($(this).attr("jlxx"));
				var mbdx = $($(this).parent().parent().parent().find("span[class='mudx_titletxt']"));
				for (jlxx; jlxx < mbdx.length; jlxx++) {
					$(mbdx[jlxx]).siblings("span").attr("jlxx", jlxx - 1);
					$(mbdx[jlxx]).html("目标对象【 " + jlxx + " 】");
				}
				$(this).parent().parent().remove();
			});
			$(this.config.mbdxArrays[1]).unbind().click(function() {
				var i = $(this).attr("wzxx");
				var a = $("." + i + " .imgscontent .imgouter:gt(1):not(:last)");
				if (a.is(':visible')) {
					a.slideUp('fast');
					$(this).removeClass('up');
					$(this).text("展开");
				} else {
					a.slideDown('fast').show();
					$(this).addClass('up');
					$(this).text("收起");
				}
				return false;
			});
			$(this.config.gkrwArrays[0]).unbind().click(function() {
				MXZH.effectController.animateOfCB(2, '702px');
				MXZH.effectController.check_button(false);
				$(this).parent().css("background", "#d2e3ff");
				$(this).parent().siblings().attr("style", "");
				var rwid = $(this).attr("rwid");
				var cjsj = $(this).attr("gkrw_cjsj");
				var rwname = $(this).find("div[class='gkrw_peoName ellipsis']").text();
				self.czgkrw.queryzrw(rwid, rwname, cjsj);
			})
		},
		czgkrw : new MXZH.czgkrw()
	};
})

MXZH.czgkrw = function() {
	//元素图层
	this.config = {

	}
};
MXZH.czgkrw.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	queryzrw : function(rwid, rwname, cjsj) {
		var self = this;
		$.ajax({
			url : self.config.URL[0],
			data : {
				rwid : rwid
			},
			type : "post",
			success : function(msg) {
				var gkmsg = JSON.parse(msg)
				self.showzrw(gkmsg, rwname, cjsj);
			},
			error : function() {
				layer.msg('查询失败！');
			}
		});
	},
	showzrw : function(gkmsg, rwname, cjsj) {
		$("#gkrw_zrw").html('');
		var Str = "<h3 class='gkrw__title ellipsis'>" + rwname + "</h3><div class='leftPanel3_Main'>" +
			"<div class='gkrw_lctishi'>以下为关键节点动态</div><div class='gkrw_lcbox'><ul id='gkrw_zxx'><li><div class='gkrw_lcbg'><div class='gkrw_lcbginnner'><div class='gkrw_label'>" +
			"<div class='gkrw_lcxtb'><img src='mx/gkrw/images/gkrw_lcxtb.png' width='23' height='23'></div>" +
			"<div class='gkrw_lctxt' style='padding:0px;'><strong>指挥员</strong><span class='colorGray'>创建于：" + cjsj + "</span></div>" +
			"</div></div></div></li></ul></div></div>";
		$("#gkrw_zrw").append(Str);
		if (gkmsg.length > 0) {
			for (var i = 0; i < gkmsg.length; i++) {
				var mb_name = gkmsg[i].mb_name;
				var content = "";
				if (gkmsg[i].content != null && gkmsg[i].content != "") {
					content = gkmsg[i].content;
				}
				var start_time = "";
				if (gkmsg[i].start_time != null && gkmsg[i].start_time != "") {
					var start_times = gkmsg[i].start_time.time;
					start_time = dateFormat(start_times, 'yyyy-MM-dd hh:mm:ss');
				}
				var end_time = "";
				if (gkmsg[i].end_time != null && gkmsg[i].end_time != "") {
					var end_times = gkmsg[i].end_time.time;
					end_time = dateFormat(end_times, 'yyyy-MM-dd hh:mm:ss');
				}
				var zz_name = gkmsg[i].zz_name;
				var xz_name = gkmsg[i].xz_name;
				var xz_id = gkmsg[i].xz_id;
				var zz_id = gkmsg[i].zz_id;
				var state = gkmsg[i].state;
				var imgs = "";
				if (state == 1) {
					imgs = "<img src='mx/gkrw/images/zz.png' width='47' height='19'>";
				} else if (state == 2) {
					imgs = "<img src='mx/gkrw/images/yj.png' width='47' height='19'>";
				} else if (state == 3) {
					imgs = "<img src='mx/gkrw/images/tg.png' width='47' height='19'>";
				} else {
					imgs = "<img src='mx/gkrw/images/wcl.png' width='47' height='19'>";
				}
				var str_zrw = "<li><div class='gkrw_lcbg'><div class='gkrw_lcbginnner'><div class='gkrw_label'>" +
					"<div class='gkrw_lcxtb'><img src='mx/gkrw/images/gkrw_lcxtb.png' width='23' height='23'></div>" +
					"<div class='gkrw_lcbq'><img src='mx/gkrw/images/zrw.png' width='65' height='19'></div>" +
					"<div class='gkrw_lcbq'>" + imgs + "</div></div>" +
					"<div class='gkrw_lcli'><div class='gkrw_lctxt'><strong>" + xz_name + "</strong></div></div>" +
					"<div class='gkrw_lcli'><div class='gkrw_lctxt'>组长：" + zz_name + "</div></div>" +
					"<div class='gkrw_lcli'><div class='gkrw_lctxt'>开始时间：" + start_time + "</div></div>" +
					"<div class='gkrw_lcli'><div class='gkrw_lctxt'>结束时间：" + end_time + "</div></div>" +
					"<div class='gkrw_lcli'><div class='gkrw_lctxt'>目标对象：" +
					"<span class='gkdx_name'>" + mb_name + "</span></div></div><div class='gkrw_lcli'>" +
					"<div class='gkrw_lctxt'>备注：" + content + "</div></div>" +
					"<div class='gkrw_lcli'><div class='gkrw_lctxt' style='padding:10px 0px 0px 20px;'>" +
					"<button class='gkdx_lcbtn dt_cx'  end_time='" + end_time + "' rwname='" + rwname + "' start_time='" + start_time + "' zz_id='" + zz_id + "'>查看轨迹</button><button class='gkdx_lcbtn zrw_cx' end_time='" + end_time + "' rwname='" + rwname + "' start_time='" + start_time + "' xz_id='" + xz_id + "'>查看消息</button></div></div></div></div></li>"
				$("#gkrw_zxx").append(str_zrw);
			}
			var gkrwzcz = new MXZH.gkrwzcz();
			gkrwzcz.init();
		}
	}
}