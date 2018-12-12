var wzxx = 0;
/*
      * 控制器等待
      */
jQuery(document).ready(function() {
	/*
	  * 控制器
	  * */
	MXZH.opentk = function() {};
	var totalPage1;
	MXZH.opentk.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.Tklsxx.init(this.config);
			this.addeventlister();
		},
		config : {
			JmUrl : "${basePath}/home_yyPlayer.action",
			TkIdArray : [ "#light", "#fade", "#pres", "#nexts", "#contextxx", "#imgconts" ], //lxpage
			LiClass : ".filejm"
		},
		addeventlister : function() {
			var self = this;
			$(this.config.TkIdArray[2]).unbind().click(function() {
				/*jQuery(self.config.TkIdArray[5]).find("img").css("background", "url('') no-repeat center");
				jQuery(self.config.TkIdArray[4]).attr({
					"src" : ''
				});*/
				self.Tklsxx.FileJmPage("-1");
			});
			$(this.config.TkIdArray[3]).unbind().click(function() {
				/*	jQuery(self.config.TkIdArray[5]).find("img").css("background", "url('') no-repeat center");
					jQuery(self.config.TkIdArray[4]).attr({
						"src" : ''
					});*/
				self.Tklsxx.FileJmPage(1);
			});
			$(this.config.LiClass).unbind().click(function() {
				$(self.config.TkIdArray[2]).css("display", "block");
				$(self.config.TkIdArray[3]).css("display", "block");
				self.Tklsxx.FilesJm($(this).attr("tplj"), $(this).attr("wzxh"), $(this).attr("jslx"));
			});
		},
		Tklsxx : new MXZH.Tklsxx()
	}
//jquery 等待文件加载完毕执行
})


/*
 * 历史消息弹框
 * 通过配置类调用
 * */

MXZH.Tklsxx = function() {
	//元素图层
	this.config = {

	};
};
MXZH.Tklsxx.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	//文件解密
	FilesJm : function(tplj, wzxh, jslx) {
		var self = this;
		jlwz = wzxh;
		$(this.config.TkIdArray[0]).css("display", "block");
		$(this.config.TkIdArray[1]).css("display", "block");
		if (jslx == 1) {
			$(this.config.TkIdArray[4]).css("display", "none");
			$(this.config.TkIdArray[5]).css("display", "block");
			this.FileJm(tplj, jslx);
		} else {
			$(this.config.TkIdArray[5]).css("display", "none");
			$(this.config.TkIdArray[4]).css("display", "block");
			if (jslx != 4) {
				this.FileJm(tplj, jslx);
			} else {
				jQuery(this.config.TkIdArray[4]).attr({
					"src" : tplj
				})
			}
		}
	},
	append : function(result, file_type) {
		if (file_type == 1) {
			$(this.config.TkIdArray[5]).find("img").attr("src", result);
		//$(this.config.TkIdArray[5]).find("img").css("background", "url('" + result + "') no-repeat center");
		} else if (file_type == 3) {
			$(this.config.TkIdArray[4]).attr({
				"src" : result
			})
		}

	},
	FileJm : function(file_url, file_type) {
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
				if (result.indexOf("mp4") >= 0) {
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
	FileJmPage : function(opt) {
		if (opt == "-1") {
			if (jlwz > 0) {
				jlwz--;
				if (jQuery("#id_" + jlwz).attr("jslx") != null) {
					var obj = jQuery("#id_" + jlwz);
					var tplj = obj.attr("tplj");
					var jslx = obj.attr("jslx");
					if (jslx == 1) {
						$(this.config.TkIdArray[4]).css("display", "none");
						$(this.config.TkIdArray[5]).css("display", "block");
						this.FileJm(tplj, jslx);
					} else {
						$(this.config.TkIdArray[5]).css("display", "none");
						$(this.config.TkIdArray[4]).css("display", "block");
						if (jslx != 4) {
							this.FileJm(tplj, jslx);
						} else {
							jQuery(this.config.TkIdArray[4]).attr({
								"src" : tplj
							})
						}
					}
					wzxx = jlwz;
				} else {
					this.FileJmPage(-1);
				}
			} else {
				jlwz =wzxx;
				var layer = layui.layer;
				layer.msg('已是最前页！');
			}
		} else {
			if (jlwz < 9) {
				jlwz++;
				if (jQuery("#id_" + jlwz).attr("jslx") != null) {
					var obj = jQuery("#id_" + jlwz);
					var tplj = obj.attr("tplj");
					var jslx = obj.attr("jslx");
					if (jslx == 1) {
						var filepath = this.FileJm(tplj, jslx);
						$(this.config.TkIdArray[4]).css("display", "none");
						$(this.config.TkIdArray[5]).css("display", "block");
						this.FileJm(tplj, jslx);
					} else {
						$(this.config.TkIdArray[5]).css("display", "none");
						$(this.config.TkIdArray[4]).css("display", "block");
						if (jslx != 4) {
							this.FileJm(tplj, jslx);
						} else {
							jQuery(this.config.TkIdArray[4]).attr({
								"src" : tplj
							})
						}
					}
					wzxx = jlwz;
				} else {
					this.FileJmPage(1);
				}

			} else {
				jlwz =wzxx;
				var layer = layui.layer;
				layer.msg('已是最后页！');
			}
		}

	}
}