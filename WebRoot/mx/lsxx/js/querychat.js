
/*
      * 控制器等待
      */
jQuery(document).ready(function() {
	/*
	  * 控制器
	  * */
	MXZH.querychat = function() {};
	MXZH.querychat.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.Dlsxx.init(this.config);
			this.addeventlister();
		},
		config : {
			context : "#context",
			queryURL : "${basePath}/home_queryContext.action", //请求后台的数据地址	
			queryQzURL : "${basePath}/home_queryQzContext.action", //请求后台的数据地址	
			chathistory : "#chathistory",
			DivIdArray : [ "#sendername", "#srjt", "#receivername", "#qzname" ],
			QzClass : ".getQzdhxxx",
			GrClass : ".getGrdhxxx"
		},
		addeventlister : function() {
			var self = this;
			$(this.config.QzClass).unbind().click(function() {
				$(this).css("background", "#d2e3ff");
				$(this).siblings().attr("style", "");
				//  $(this).siblings().css("background","#fff");
				MXZH.effectController.check_panl2(2); //第一次执行这个时，可能导致layui事件未绑定
				self.Dlsxx.getQzdhxxx($(this).attr("group_name"), $(this).attr("Hismessagelistgroup_id"), $(this).attr("ls_startTime"), $(this).attr("ls_endTime"), 1);
			//self.Dlsxx.getQzdhxxx($(this).attr("group_name"), $(this).attr("Hismessagelistgroup_id"), $(this).attr("ls_startTime"), $(this).attr("ls_endTime"), 1);
			});
			$(this.config.GrClass).unbind().click(function() {
				$(this).css("background", "#d2e3ff");
				$(this).siblings().attr("style", "");
				//$(this).siblings().css("background","#fff");
				MXZH.effectController.check_panl2(2);
				self.Dlsxx.getGrdhxxx($(this).attr("sender_name"), $(this).attr("receiver_name"), $(this).attr("hismessagelistsender"), $(this).attr("hismessagelistreceiver"), $(this).attr("ls_startTime"), $(this).attr("ls_endTime"), 1);
			//self.Dlsxx.getGrdhxxx($(this).attr("sender_name"), $(this).attr("receiver_name"), $(this).attr("hismessagelistsender"), $(this).attr("hismessagelistreceiver"), $(this).attr("ls_startTime"), $(this).attr("ls_endTime"), 1);
			});
		},
		Dlsxx : new MXZH.Dlsxx()
	}
//jquery 等待文件加载完毕执行
})


/*
 * 历史消息列表，具体功能在该类里面
 * 通过配置类调用
 * */

MXZH.Dlsxx = function() {
	//元素图层
	this.config = {

	};
};
MXZH.Dlsxx.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	//查询个人之间对话详细信息
	getGrdhxxx : function(sname, rname, senders, receivers, ls_startTime, ls_endTime, spageNo1) {
		MXZH.effectController.loading(true); //锁屏功能
		ls_groupid = "-1";
		var self = this;
		$.ajax({
			url : self.config.queryURL,
			data : {
				ls_startTime : ls_startTime,
				ls_endTime : ls_endTime,
				sender : senders,
				receiver : receivers,
				pageNo : spageNo1
			},
			dataType : "json",
			type : "post",
			success : function(msgresult) {
				self.showContexts(msgresult);
				if (totalPage1 > 1) {
					$("#msgpage").css("display", "block");
					$(".lsxx_detailCont").css("bottom", "50px");
				} else {
					$("#msgpage").css("display", "none");
					$(".lsxx_detailCont").css("bottom", "0px");
				}
				layui.use('laypage', function() {
					var laypages = layui.laypage;
					laypages({
						cont : 'msgpage',
						pages : totalPage1,
						first : false,
						last : false,
						groups : 4,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo1 = obj.curr;
								self.getGrcontextPage(sname, rname, senders, receivers, ls_startTime, ls_endTime, pageNo1);
							}
						}
					});
				});
				/*layui.use('laypage', function() {
					var laypages = layui.laypage;
					laypages({
						cont : 'msgpage',
						pages : totalPage1,
						first : false,
						last : false,
						groups : 4,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo1 = obj.curr;
								self.getGrcontextPage(sname, rname, senders, receivers, ls_startTime, ls_endTime, pageNo1);
							}
						}
					});
				});*/
				var opentk = new MXZH.opentk();
				opentk.init();
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
		$(this.config.DivIdArray[0]).css("display", "block").text(sname);
		$(this.config.DivIdArray[1]).css("display", "block");
		$(this.config.DivIdArray[2]).css("display", "block").text(rname);
		$(this.config.DivIdArray[3]).css("display", "none");
	},
	getGrcontextPage : function(sname, rname, senders, receivers, ls_startTime, ls_endTime, pageNo1) {
		MXZH.effectController.loading(true); //锁屏功能
		ls_groupid = "-1";
		var self = this;
		$.ajax({
			url : self.config.queryURL,
			data : {
				ls_startTime : ls_startTime,
				ls_endTime : ls_endTime,
				sender : senders,
				receiver : receivers,
				pageNo : pageNo1
			},
			dataType : "json",
			type : "post",
			success : function(result) {
				self.showContexts(result);
				var opentk = new MXZH.opentk();
				opentk.init();
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	//查询群组对话详细信息
	getQzdhxxx : function(grpname, groupid, ls_startTime, ls_endTime, spageNo1) {
		MXZH.effectController.loading(true); //锁屏功能
		$(this.config.chathistory).find("li").removeClass('lsxx_active');
		var self = this;
		pageNo1 = spageNo1;
		ls_groupname = grpname;
		ls_groupid = groupid;
		$.ajax({
			url : self.config.queryQzURL,
			data : {
				ls_startTime : ls_startTime,
				ls_endTime : ls_endTime,
				groupid : groupid,
				pageNo : spageNo1
			},
			dataType : "json",
			type : "post",
			success : function(result) {
				self.showContexts(result);
				if (totalPage1 > 1) {
					$("#msgpage").css("display", "block");
					$(".lsxx_detailCont").css("bottom", "50px");
				} else {
					$("#msgpage").css("display", "none");
					$(".lsxx_detailCont").css("bottom", "0px");
				}
				layui.use('laypage', function() {
					var laypage = layui.laypage;
					laypage({
						cont : 'msgpage',
						pages : totalPage1, //总页数
						groups : 4, //连续显示分页数
						first : false,
						last : false,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo1 = obj.curr;
								self.getQzcontextPage(grpname, groupid, ls_startTime, ls_endTime, pageNo1);
							}
						}
					});
				});
				layui.use('laypage', function() {
					var laypage = layui.laypage;
					laypage({
						cont : 'msgpage',
						pages : totalPage1, //总页数
						groups : 4, //连续显示分页数
						first : false,
						last : false,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo1 = obj.curr;
								self.getQzcontextPage(grpname, groupid, ls_startTime, ls_endTime, pageNo1);
							}
						}
					});
				});
				var opentk = new MXZH.opentk();
				opentk.init();
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
		$(this.config.DivIdArray[0]).css("display", "none");
		$(this.config.DivIdArray[1]).css("display", "none");
		$(this.config.DivIdArray[2]).css("display", "none");
		$(this.config.DivIdArray[3]).css("display", "block").text(grpname);
	},
	//查询群组分页对话详细信息
	getQzcontextPage : function(grpname, groupid, ls_startTime, ls_endTime, pageNo) {
		MXZH.effectController.loading(true); //锁屏功能
		var self = this;
		ls_groupname = grpname;
		ls_groupid = groupid;
		$.ajax({
			url : self.config.queryQzURL,
			data : {
				ls_startTime : ls_startTime,
				ls_endTime : ls_endTime,
				groupid : groupid,
				pageNo : pageNo
			},
			dataType : "json",
			type : "post",
			success : function(result) {
				self.showContexts(result);
				var opentk = new MXZH.opentk();
				opentk.init();
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	//查询历史详细消息记录
	showContexts : function(contextList) {
		$(this.config.context).html(" ");
		var totalNo = contextList[0].totalNo;
		totalPage1 = contextList[0].totalPage;
		if (contextList[0].beanList.length > 0) {
			var blist = contextList[0].beanList;
			//var blist = contextList[0].beanList.reverse();
			for (var i = 0; i < blist.length; i++) {
				var sender_name = blist[i].sendername;
				var divHtml = " ";
				var str = blist[i].content;
				var reg = /\[.+?\]/g;
				str = str.replace(reg, function(a, b) {
					return face[a];
				});

				if (blist[i].type == 0) { //信息
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'>" +
							"<div class='personName'>" + sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div>"
							+ "<div class='lsxxDetail_right_cont'> <div class='lsxxDetail_right_txtBox'><div class='lsxxDetail_right_txt' style='word-wrap:break-word;word-break:break-all;'>" + str + "</div> <div class='qipao_right_jiantou'></div></div></div></div></li>";
					} else {
						divHtml = "<li ><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'>" +
							"<div class='personName'>" + sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'> <div class='lsxxDetail_left_txtBox'><div class='lsxxDetail_left_txt' style='word-wrap:break-word;word-break:break-all;'>" + str + "</div> <div class='qipao_left_jiantou'></div></div></div></div></li>";
					}
				}
				if (blist[i].type == 2) { //语音
					var amrid = "_" + blist[i].id;
					var _tmp1 = eval('(' + blist[i].attachment + ')');
					var amrurl = base_url + _tmp1.url;
					var mins = _tmp1.duration;
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'><div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'>  <div class='lsxxDetail_right_yuyinBox'><img id='imga" + amrid + "' src='mx/lsxx/images/historyAudioright.png' width='39' height='33' onclick='yy_player(\"" + amrid + "\",\"" + mins + "\",\"" + amrurl + "\",this);' /><img id='imgb" + amrid + "' style='display:none' src='mx/lsxx/images/historyAudioright.gif' width='39' height='33' onclick='emb_stop(\"" + amrid + "\");' />" +
							"</div><div class='historyAudioTimeRight'>" + mins + "\"</div>"
							+ "</div></li>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'><div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, 'yyyy-MM-dd hh:mm:ss') + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'>  <div class='lsxxDetail_left_yuyinBox'><img id='imga" + amrid + "' src='mx/lsxx/images/historyAudioleft.png' width='39' height='33' onclick='yy_player(\"" + amrid + "\",\"" + mins + "\",\"" + amrurl + "\",this);' /><img id='imgb" + amrid + "' style='display:none' src='mx/lsxx/images/historyAudioleft.gif' width='39' height='33' onclick='emb_stop(\"" + amrid + "\");' />" +
							"</div><div class='historyAudioTimeLeft'>" + mins + "\"</div>"
							+ "</div></li>";
					}
				}
				if (blist[i].type == 4) { //显示地图
					var _tmp = eval('(' + blist[i].attachment + ')');
					//var mapImgUrl = base_url + _tmp.thumbnail;
					var mapImgUrl = _tmp.thumbnail;
					var mapUrl = "mx/lsxx/dqwz.jsp?latitude=" + _tmp.latitude + "&longitude=" + _tmp.longitude;
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'><div class='lsxxDetail_right_txtBox'><div class='lsxxDetail_right_weizhi filejm' id='id_" + i + "' tplj=" + mapUrl + " wzxh='" + i + "' jslx='4' ><div class='lsxx_map'>"
							+ "<img src='" + mapImgUrl + "' width='120' height='100'></div><div class='lsxxDetail_rigth_weizhiTxt'>" + _tmp.address + "</div> <div class='qipao_right_jiantou'></div></div></div></div>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'><div class='lsxxDetail_left_txtBox'><div class='lsxxDetail_left_weizhi filejm' id='id_" + i + "' tplj=" + mapUrl + " wzxh='" + i + "' jslx='4'><div class='lsxx_map'>"
							+ "<img src='" + mapImgUrl + "' width='120' height='100'></div><div class='lsxxDetail_left_weizhiTxt'>" + _tmp.address + "</div> <div class='qipao_left_jiantou'></div></div></div></div>";
					}
				}

				if (blist[i].type == 3) { //影音播放
					var tmpVideo = base_url;
					var _tmp = eval('(' + blist[i].attachment + ')');
					var imgUrl = _tmp.thumbnail;
					var video = tmpVideo + _tmp.url;
					//	var videoUrl = "pages/video.jsp?url=" + video;
					if (sender_name == username) {
						divHtml = "<li> <div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'><div class='lsxxDetail_right_shipinBox filejm' id='id_" + i + "' tplj=" + video + " wzxh='" + i + "'  jslx='3'><div class='shipin_mengceng'><div class='shipin_xtb'>"
							+ "<img src='mx/lsxx/images/bofang.png' width='35' height='35' /></div></div> <div class='lsxxDetail_right_shipin'><img src='" + imgUrl + "' width='120' height='100'></div> <div class='qipao_right_jiantou'></div></div></div></div></li>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'>  <div class='lsxxDetail_left_shipinBox filejm' id='id_" + i + "' tplj=" + video + " wzxh='" + i + "'  jslx='3'><div class='shipin_mengceng'><div class='shipin_xtb'>"
							+ "<img src='mx/lsxx/images/bofang.png' width='35' height='35' /></div></div> <div class='lsxxDetail_left_shipin'><img src='" + imgUrl + "' width='120' height='100'></div> <div class='qipao_left_jiantou'></div></div></div></div></li>";
					}
				}

				if (blist[i].type == 1) { //图片
					var _tmp = eval('(' + blist[i].attachment + ')');
					var imgurl = _tmp.thumbnail;
					var imgMax = base_url + _tmp.original;
					if (sender_name == username) {
						divHtml = "<li><div class='lsxxDetail_right'><div class='lsxxDetail_right_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_right_cont'><div class='lsxxDetail_right_txtBox filejm' id='id_" + i + "' tplj=" + imgMax + " wzxh='" + i + "' jslx='1'> <div class='lsxxDetail_right_img'>"
							+ "<img src='" + imgurl + "' width='120' height='80' /></div><div class='qipao_right_jiantou'></div></div></div></div></li>";
					} else {
						divHtml = "<li><div class='lsxxDetail_left'><div class='lsxxDetail_left_nametime'> <div class='personName'>"
							+ sender_name + "</div><div class='lsxx_time'>" + dateFormat(blist[i].create_time.time, "yyyy-MM-dd hh:mm:ss") + "</div></div>"
							+ "<div class='lsxxDetail_left_cont'><div class='lsxxDetail_left_txtBox filejm' id='id_" + i + "' tplj=" + imgMax + " wzxh='" + i + "' jslx='1'> <div class='lsxxDetail_left_img'>"
							+ "<img src='" + imgurl + "' width='120' height='80' /></div><div class='qipao_left_jiantou'></div></div></div></div></li>";
					}
				}

				$(this.config.context).append(divHtml);
			}
		}
		MXZH.effectController.loading(false); //去除锁屏功能
	}
}