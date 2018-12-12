var imgtotal = "";
var imgjs = "";
var picsarray = [];
/*
      * 控制器等待
      */
jQuery(document).ready(function() {
	/*
	  * 控制器
	  * */
	MXZH.opentPics = function() {};
	var totalPage1;
	MXZH.opentPics.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.picstk.init(this.config);
			this.addeventlister();
		},
		config : {
			TkIdArray : [ "#light", "#fade", "#pres", "#nexts", "#contextxx", "#imgconts" ], //lxpage
			LiClass : ".tzgg_imgcont"
		},
		addeventlister : function() {
			var self = this;
			$(this.config.TkIdArray[2]).unbind().click(function() {
				self.picstk.tzggimgPage("-1");
			});
			$(this.config.TkIdArray[3]).unbind().click(function() {
				self.picstk.tzggimgPage(1);
			});
			/*$(this.config.LiClass).unbind().click(function() {
				self.picstk.imgpage(self.config.pics);
			});*/
		},
		setPicArray:function(pics){
			 this.picstk.imgpage(pics);
		},
		picstk : new MXZH.picsTk(),
		FileJm : function(file_url, file_type,callback) {
			var self = this;
			var jmresult = "";
			jQuery.ajax({
				url : self.config.JmUrl, //调用语音方法，减少代码量
				data : {
					yy_url : file_url,
					ypid : file_type
				},
				type : "post",
				success : function(result) {
					if (result.indexOf("tmp") >= 0) {
						jmresult = "pages/video.jsp?url=" + result;
						self.append(jmresult, file_type);
					} else {
						jmresult = result;
						self.append(jmresult, file_type);
					}
				},
				error : function(error) {
					throw (error);
					throw ('数据请求失败！');
				}
			});
		},
	}
//jquery 等待文件加载完毕执行
})
/*
 * 通知公告弹框
 * 通过配置类调用
 * */
MXZH.picsTk = function() {
	//元素图层
	this.config = {
	};
};
MXZH.picsTk.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	FileJm : function(file_url, file_type, callback) {
		var self = this;
		var jmresult = "";
		jQuery.ajax({
			url : "${basePath}/home_yyPlayer.action?time=" + new Date().getTime(),
			data : {
				yy_url : file_url,
				ypid : file_type
			},
			type : "post",
			success : function(result) {
				callback(result); //
			},
			error : function(error) {
				throw (error);
				throw ('数据请求失败！');
			}
		});
	},
	imgpage : function(picsArray) {
		picsarray = picsArray.split(',');
		picsarray.reverse();
		imgtotal = picsarray.length;
		imgjs = 0;
		var ss = picsarray[0];
		var self = this;
		if(picsarray.length>=2){
			$(this.config.TkIdArray[2]).css("display", "block");
			$(this.config.TkIdArray[3]).css("display", "block");
		}else{
			$(this.config.TkIdArray[2]).css("display", "none");
			$(this.config.TkIdArray[3]).css("display", "none");
		}
		$(this.config.TkIdArray[0]).css("display", "block");
		$(this.config.TkIdArray[1]).css("display", "block");
		$(this.config.TkIdArray[4]).css("display", "none");
		$(this.config.TkIdArray[5]).css("display", "block");
		//$(this.config.TkIdArray[5]).find("img").css("background", "url('" + picsarray[0]+ "') no-repeat center");
		this.FileJm(picsarray[0], 1, function(bigpic) {
			$(self.config.TkIdArray[5]).find("img").attr("src",bigpic);
		});
		
	},
	tzggimgPage : function(opt) { 
		var self=this;
		if (opt == "-1") {
			if (imgjs > 0) {
				imgjs--;
				this.FileJm(picsarray[imgjs], 1, function(bigpic) {
					$(self.config.TkIdArray[5]).find("img").attr("src",bigpic);
				});
				
			} else {
				var layer = layui.layer;
				layer.msg('已是最前一页！');
			}
		} else {
			if (imgjs < imgtotal-1) {
				imgjs++;
				this.FileJm(picsarray[imgjs], 1, function(bigpic) {
					$(self.config.TkIdArray[5]).find("img").attr("src",bigpic);
				});
			}else{
				var layer = layui.layer;
				layer.msg('已是最后一页！');
			}
		}
	 }
}