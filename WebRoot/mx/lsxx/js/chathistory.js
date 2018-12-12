var pageNo = 1;
var totalPage;
var pageNo1 = 1;
var totalPage1;
var totalNo;
var ls_startTime = '';
var ls_endTime = '';
var ls_conditions = '';
var totalPage1;
//消息者传参
var ls_sname = '';
var ls_rname = '';
var ls_sender = '';
var ls_receiver = '';
var ls_groupname = '';
var ls_groupid = '';
var jlwz;
//

function yy_player(playstr, pltime, yy_url, self) {
	var amrid = null;
	jQuery.ajax({
		url : "${basePath}/home_yyPlayer.action",
		data : {
			yy_url : yy_url
		},
		type : "post",
		success : function(result) {
			var html = "<audio id='amrid" + playstr + "' src=" + result + "  autoplay='true' ></audio>"
			amrid = document.getElementById("amrid" + playstr);
			if (!amrid) {
				$(self).after($(html));
				amrid = document.getElementById("amrid" + playstr);
			} else {
				//amrid.Play();
				$("#amrid" + playstr).remove();
				$(self).after($(html));
			}
			document.getElementById("imga" + playstr).style.display = "none";
			document.getElementById("imgb" + playstr).style.display = "";
			setTimeout("emb_stop('" + playstr + "')", pltime * 1000);
		},
		error : function(error) {
			throw (error);
			throw ('数据请求失败！');
		}
	});
}
function emb_stop(stopstr) {
	var amrid = document.getElementById("amrid" + stopstr);
	amrid.pause();
	document.getElementById("imga" + stopstr).style.display = "";
	document.getElementById("imgb" + stopstr).style.display = "none";
}


/*
 * 控制器等待
 */
jQuery(document).ready(function() {

	/*
	  * 控制器
	  * */
	MXZH.lsxxCF = function() {};
	MXZH.lsxxCF.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.lsxx.init(this.config);
			this.addeventlister();
		},
		config : {
			dataURL : "${basePath}/home_queryByList.action", //请求后台的数据地址
			DivIdArray : [ "#sendername", "#srjt", "#receivername", "#qzname", "#msgpage" ],
			ls_startTime : "#starttime",
			ls_endTime : "#endtime",
			context : "#lsxx_context",
			ls_conditions : "#ls_conditions",
			pageSize : 10,
			BtnArray : [ "query", "chathistory" ]
		},
		addeventlister : function() {
			//注册事件
			var self = this;
			dojo.connect(dojo.byId(this.config.BtnArray[0]), 'click', function() {
				//$(self.config.DivIdArray[0]).css("display", "none");
				//$(self.config.DivIdArray[1]).css("display", "none");
				//$(self.config.DivIdArray[2]).css("display", "none");
				//$(self.config.DivIdArray[3]).css("display", "none");
				//$(self.config.DivIdArray[4]).text("");
				//$(self.config.context).html(" ");
				self.lsxx.getData();
			});
		},
		lsxx : new MXZH.lsxx()
	}
//jquery 等待文件加载完毕执行
})
/*
 * 历史消息列表，具体功能在该类里面
 * 通过配置类调用
 * */

MXZH.lsxx = function() {
	//元素图层
	this.config = {

	};
};
MXZH.lsxx.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	getData : function() {
		var reg = /^\s*|\s*$/g;
		var st = $(this.config.ls_startTime).val();
		var et = $(this.config.ls_endTime).val();
		if (st !== '' && st !== null && et !== '' && et !== null) {
			st = st.replace(reg, "");
			et = et.replace(reg, "");
			if (st > et) {
				layui.use([ 'layer' ], function() {
					var layer = layui.layer;
					layer.msg('注意:开始时间必须小于结束时间!');
					$(this.config.ls_startTime).val("");
					$(this.config.ls_endTime).val("");
				});
				return false;
			}
		}
		MXZH.effectController.loading(true); //锁屏功能
		//获取历史消息数据
		var self = this;
		$.ajax({
			url : self.config.dataURL,
			data : {
				ls_startTime : $(self.config.ls_startTime).val(),
				ls_endTime : $(self.config.ls_endTime).val(),
				ls_conditions : $(self.config.ls_conditions).val(),
				pageNo : 1,
				pageSize : self.config.pageSize
			},
			type : "post",
			success : function(Hismessagelist) {
				self.showmessage(JSON.parse(Hismessagelist));
				if(totalPage >1){
					$("#chatpage").css("display", "block");
					$(".lsxx_resultCont").css("bottom","50px");
					
				}else{
					$("#chatpage").css("display", "none");
					$(".lsxx_resultCont").css("bottom","0px");
				}
				layui.use([ 'laypage', 'layer' ], function() {
					var laypage = layui.laypage,
						layer = layui.layer;
					laypage({
						cont : 'chatpage',
						pages : totalPage, //总页数
						groups : 4, //连续显示分页数
						first : false,
						last : false,
						jump : function(obj, first) { //触发分页后的回调
							if (!first) { //点击跳页触发函数自身，并传递当前页：obj.cur
								pageNo = obj.curr;
								self.getPage();
							}
						}
					});
				});
				var charts = new MXZH.querychat();
				charts.init();
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	getPage : function() {
		MXZH.effectController.loading(true); //锁屏功能
		//获取分页历史消息数据
		var self = this;
		$.ajax({
			url : self.config.dataURL,
			data : {
				ls_startTime : $(self.config.ls_startTime).val(),
				ls_endTime : $(self.config.ls_endTime).val(),
				ls_conditions : $(self.config.ls_conditions).val(),
				pageNo : pageNo,
				pageSize : self.config.pageSize
			},
			type : "post",
			success : function(Hismessagelist) {
				self.showmessage(JSON.parse(Hismessagelist));
				var charts = new MXZH.querychat();
				charts.init();
			},
			error : function(error) {
				MXZH.effectController.loading(false); //去除锁屏功能
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	showmessage : function(Hismessagelist) {
		$("#" + this.config.BtnArray[1]).html(" ");
		ls_startTime = $(this.config.ls_startTime).val();
		ls_endTime = $(this.config.ls_endTime).val();
		if (Hismessagelist[0].beanList.length > 0) {
			totalPage = Hismessagelist[0].totalPage;
			for (var i = 0; i < Hismessagelist[0].beanList.length; i++) {
				var trHtml = " ";
				//群组信息
				if (Hismessagelist[0].beanList[i].group_id != '-1') {
					var strs = new Array();
					strs = (Hismessagelist[0].beanList[i].groupxx).split('-');
					var group_name = strs[0];
					var group_img = 'mx/lsxx/images/qztx1.png';
					trHtml = "<li class='getQzdhxxx'  group_name='" + group_name + "'  Hismessagelistgroup_id='" + Hismessagelist[0].beanList[i].group_id + "'  ls_startTime='" + ls_startTime + "' ls_endTime='" + ls_endTime + "' ><div class='qunzu_img'><img src='" + group_img + "' width='40' height='40' /></div>"
						+ "<div class='qunzu_txt'>" + group_name + "</div></li>";
				} else { //个人之间
					var sender_name = Hismessagelist[0].beanList[i].sendername;
					var sender_img = Hismessagelist[0].beanList[i].senderlogo;
					if (sender_img.length < 5) {
						sender_img = 'mx/lsxx/images/tx1.png';
					} else {
						sender_img = sender_img;
					}
					var receiver_name = Hismessagelist[0].beanList[i].receivername;
					var receiver_img = Hismessagelist[0].beanList[i].receiverlogo;
					if (receiver_img.length < 5) {
						receiver_img = 'mx/lsxx/images/tx1.png';
					} else {
						receiver_img = receiver_img;
					}
					//点对点信息
					trHtml = "<li class='getGrdhxxx'  sender_name='" + sender_name + "' receiver_name='" + receiver_name + "' Hismessagelistsender='" + Hismessagelist[0].beanList[i].sender + "' Hismessagelistreceiver='" + Hismessagelist[0].beanList[i].receiver + "' ls_startTime='" + ls_startTime + "' ls_endTime='" + ls_endTime + "' ><div class='person_left_img'><img src='" + sender_img + "' /></div>"
						+ "<div class='person_left_txt ellipsis'>" + sender_name + "</div>" + "<div class='person_jiantou'><img src='mx/lsxx/images/lsxxjt.png' width='31' height='10' /></div>"
						+ "<div class='person_right_img'><img src='" + receiver_img + "'  /> </div>"
						+ "<div class='person_right_txt ellipsis'>" + receiver_name + "</div></li>";
				}
				$("#" + this.config.BtnArray[1]).append(trHtml);
			}
		} else {
			var layer = layui.layer;
			totalPage = 0;
			layer.msg('未查询到数据！');
		}
		MXZH.effectController.loading(false); //去除锁屏功能
	}
}