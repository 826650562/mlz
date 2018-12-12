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
	MXZH.opentzggtk = function() {};
	var totalPage1;
	MXZH.opentzggtk.prototype = {
		init : function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.Tzggtk.init(this.config);
			this.addeventlister();
		},
		config : {
			TkIdArray : [ "#light", "#fade", "#pres", "#nexts", "#contextxx", "#imgconts"], //lxpage
			LiClass : ".tzgg_imgcont",
			xxsbClass : ".xxsb_img",
			gztcClass:'.gztc_img' 
		},
		addeventlister : function() {
			var self = this;
			$(this.config.TkIdArray[2]).unbind().click(function() {
				self.Tzggtk.tzggimgPage("-1");
			});
			$(this.config.TkIdArray[3]).unbind().click(function() {
				self.Tzggtk.tzggimgPage(1);
			});
			$(this.config.LiClass).unbind().click(function() {
				self.Tzggtk.imgpage($(this).attr("picsArray"));
			});
			//感知图层调用 点击放大图片
			$(this.config.gztcClass).unbind().click(function() {
				self.Tzggtk.imgpage($(this).attr("picsArray"));
			});
			
			$(this.config.xxsbClass).unbind().click(function(e) {
				if ($(this).attr("filetype") == 1) {
					self.Tzggtk.imgpage($(this).attr("filesrc"));
				} else {
					self.Tzggtk.videopage($(this).attr("filesrc"));
				}
			});
			$(".xxsb_addrBox").on('click', function(e) {
			    var lon=parseFloat($(this).attr("lon"));
			    var lat=parseFloat($(this).attr("lat"));
			    if(!lon || !lat) return false;
				var bd=MXZH.bd09togcj02(lon,lat );
				var bdpoint=MXZH.ToWebMercator2(bd[0],bd[1]);
				var point = new esri.geometry.Point(bdpoint[0],bdpoint[1],
					new esri.SpatialReference({
						wkid : WangConfig.constants.wkt
					}))
				MXZH.mainMap.wangMap.map.centerAndZoom(point,12);
				// MXZH.mainMap.wangMap.map.setZoom(8);
			    //显示一个图标，三秒消失
				var tempLayer =new esri.layers.GraphicsLayer();
				tempLayer.add(new esri.Graphic(point, getPicSYS(), null, null));
				MXZH.mainMap.wangMap.map.addLayer(tempLayer);
				setTimeout(function(){
					MXZH.mainMap.wangMap.map.removeLayer(tempLayer);
				},3000);
				function getPicSYS(){
					 return  new esri.symbol.PictureMarkerSymbol("mx/xxsb/images/xxsb_xtbbig.png", 27, 34);
				}
			})
		},
		Tzggtk : new MXZH.Tzggtk()
	}
//jquery 等待文件加载完毕执行
})


/*
 * 通知公告弹框
 * 通过配置类调用
 * */

MXZH.Tzggtk = function() {
	//元素图层
	this.config = {

	};
};
MXZH.Tzggtk.prototype = {
	init : function(opts) {
		dojo.safeMixin(this.config, opts);
	},
	imgpage : function(picsArray) {
		picsarray = picsArray.split(',');
		imgtotal = picsarray.length;
		if (imgtotal > 1) {
			$(this.config.TkIdArray[2]).css("display", "block");
			$(this.config.TkIdArray[3]).css("display", "block");
		} else {
			$(this.config.TkIdArray[2]).css("display", "none");
			$(this.config.TkIdArray[3]).css("display", "none");
		}
		imgjs = 0;
		var ss = picsarray[0];
		var self = this;
		$(this.config.TkIdArray[0]).css("display", "block");
		$(this.config.TkIdArray[1]).css("display", "block");
		$(this.config.TkIdArray[4]).css("display", "none");
		$(this.config.TkIdArray[5]).css("display", "block");
		//$(this.config.TkIdArray[5]).find("img").css("background", "url('" + picsarray[0].replace("thumb_", "") + "') no-repeat center");
		$(this.config.TkIdArray[5]).find("img").attr("src", picsarray[0].replace("thumb_", ""));

	},
	tzggimgPage : function(opt) {
		if (opt == "-1") {
			if (imgjs > 0) {
				imgjs--;
				//$(this.config.TkIdArray[5]).find("img").css("background", "url('" + picsarray[imgjs].replace("thumb_", "") + "') no-repeat center");
				$(this.config.TkIdArray[5]).find("img").attr("src", picsarray[imgjs].replace("thumb_", ""));
			} else {
				var layer = layui.layer;
				layer.msg('已是最前一页！');
			}
		} else {
			if (imgjs < imgtotal - 1) {
				imgjs++;
				//$(this.config.TkIdArray[5]).find("img").css("background", "url('" + picsarray[imgjs].replace("thumb_", "") + "') no-repeat center");
				$(this.config.TkIdArray[5]).find("img").attr("src", picsarray[imgjs].replace("thumb_", ""));
			} else {
				var layer = layui.layer;
				layer.msg('已是最后一页！');
			}
		}
	},
	videopage : function(picsArray) {
		videosrc = "pages/video.jsp?url=" + picsArray;
		var self = this;
		$(this.config.TkIdArray[0]).css("display", "block");
		$(this.config.TkIdArray[1]).css("display", "block");
		$(this.config.TkIdArray[2]).css("display", "none");
		$(this.config.TkIdArray[3]).css("display", "none");
		$(this.config.TkIdArray[5]).css("display", "none");
		$(this.config.TkIdArray[4]).css("display", "block");
		//$(this.config.TkIdArray[5]).find("img").css("background", "url('" + picsarray[0].replace("thumb_", "") + "') no-repeat center");
		$(self.config.TkIdArray[4]).attr({
			"src" : videosrc
		})

	}
}