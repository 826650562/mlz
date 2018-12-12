/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-18 13:37:25
 * @version $Id$
 */
jQuery(document).ready(function() {
	MXZH.Xllx = function() {};
	MXZH.Xllx.prototype = {
	    init: function(opts) {
	        opts && dojo.safeMixin(this.config, opts);
	        var layer = layui.layer;
	        this.wangMapXllx.init(this.config);
	    },
	    config: {
	        BtnArray: [".addxllx", ".xllx_caozuo", ".delthis", ".layui-layer-btn0", ".addButton"],
	        map: MXZH.mainMap.wangMap
	    },
	    dealWithEventListner: function() {
	        var self = this;
	        $($("#layui-layer-iframe" + INDEX).contents().find(".addxllx")).unbind().click(function(e) {     //绑定绘制路线事件
	        	self.dealWithDrawPath();
	        });
	        $(this.config.BtnArray[3]).unbind().click(function(e) {       //绑定保存路线及路线信息事件
	        	self.dealWithSave();
	        })
	    },
	    dealWithShowPath: function(path,id) {   //展示路线
	    	this.wangMapXllx.showPath(path,id);
	    },
	    dealWithRemoveLayer: function(id) {    //清除地图上已有的路线
	    	this.wangMapXllx.removeGraphics(id);
	    	this.wangMapXllx.removeLayer();
	    },
	    dealWithDrawPath: function() {    //绘制路线 
	    	this.wangMapXllx.drawPath();
	    },
	    dealWithDeletePath: function(id) {
	    	var self = this;

	    	layer.confirm("您确定要删除吗?", {
	    		btn: ["确定", "取消"]
	    	}, function() {
	    		MXZH.effectController.loading(true);
		        $.ajax({
		            url: "${basePath}/home_deleteForXllx.action?time="+new Date().getTime(),
		            data: {
		                groupid: id
		            },
		            type: "post",
		            success: function(msg) {
		            	MXZH.effectController.loading(false);
		            	layer.msg("删除成功！", {
		            		time: 1000
		            	});
		            	self.dealWithQueryPathInfo();
		            	self.dealWithRemoveLayer(id);
		            },
		            error: function(error) {
		    			MXZH.effectController.loading(false); //如果数据加载错误，去除锁屏
		    			layer.msg("删除失败！", {
		    				time: 1000
		    			})
		    		}
		        });
	    	});
	    },
	    dealWithQueryPath: function(id) {     //查询和展示路线
	    	var self = this;
	    	MXZH.effectController.loading(true); //锁屏
	    	$.ajax({
	    		url: "${basePath}/home_queryForXllxPath.action?time="+new Date().getTime(),
	    		data: {
	    			groupid: id
	    		},
	    		type: "post",
	    		success: function(msg) {
	    			MXZH.effectController.loading(false); //数据查询完成去除锁屏
	                self.dealWithShowPath(msg,id);
	    		},
	    		error: function(error) {
	    			MXZH.effectController.loading(false); //如果数据加载错误，去除锁屏
	                throw (error);
	                throw ('数据查询失败！');
	    		}
	    	})
	    },
	    dealWithQueryPathInfo: function() {     //查询路线信息
	    	var self = this;
	        MXZH.effectController.loading(true); //锁屏
	        $.ajax({
	            url: "${basePath}/home_queryForXLLX.action?time="+new Date().getTime(),
	            data: {},
	            type: "post",
	            success: function(msg) {
	                MXZH.effectController.loading(false); //数据查询完成去除锁屏
	                var info = JSON.parse(msg);
	                self.dealWithAppendList(info);
	            },
	            error: function(error) {
	                MXZH.effectController.loading(false); //数据查询失败去除锁屏
	                throw (error);
	                throw ("数据请求失败！");
	            }
	        });
	    },
	    dealWithUpdate: function() {
	    	var self = this;
	    	MXZH.effectController.loading(true);
	        $.ajax({
	            url: "${basePath}/home_addForxllx.action?time="+new Date().getTime(),
	            data: {
	                groupid: id,
	                LayerPath: '"' + layerStr.replace(/"/g, "'") + '"'
	            },
	            type: "post",
	            success: function(msg) {
	            	MXZH.effectController.loading(false);
	            	self.queryPathInfo();
	            },
	            error: function(error) {
	                MXZH.effectController.loading(false); //如果数据加载错误，去除锁屏
	                throw (error);
	                throw ('数据更新失败！');
	            }
	        });
	    },
        dealWithAppendList: function(listInfo) {
        	var self = this;
            $(".xllx_box ul").html(" "); //清空ul列表
            if (listInfo[0].routelist.length > 0) {
                for (var i = 0; i < listInfo[0].routelist.length; i++) {
                    var listHtml = " ";
                    listHtml = "<li>" +
                        "<h3 class='xllx_name ellipsis'>" + listInfo[0].routelist[i].route[0] + "</h3>" +
                        "<div class='xllx_cont'>" + listInfo[0].routelist[i].route[1] + "</div>" +
                        "<div class='xllx_time'><span>创建时间：</span><span>" + listInfo[0].routelist[i].route[3] + "</span></div>" +
                        "<div class='xllx_zuozhe'><span>创建者：</span><span class='ellipsis'>" + listInfo[0].routelist[i].route[2] + "</span></div>" +
                        "<div class='xllx_caozuo' id='" + listInfo[0].routelist[i].route[5] + "'>" +
                        "<span><i class='layui-icon' style='font-size:20px;'>&#xe640</i></span><span class='delthis' >删除</span>" +
                        "</div>" +
                        "</li>";
                    
                    $(".xllx_box ul").append(listHtml);
                    //为列表每一项绑定删除事件
                    $(".xllx_caozuo").unbind().click(function(e) {
        	            var groupid= $(this).attr("id");
        	            debugger
        	            self.dealWithDeletePath(groupid);
        	            e.stopPropagation();
        	        });
                }
                //为列表每一项绑定点击查询路线事件
                var div = document.getElementById('xllx_box'),
                	lis = div.getElementsByTagName('li');
                
	            for(var i=0;i<lis.length;i++){
	                (function(i){
	                    lis[i].onclick=function(e){
	                        var groupid = $(this.childNodes[4]).attr("id");
	                        $(this).css("background","#ddd");
	                        $(this).siblings().attr("style", "");
	                        self.dealWithQueryPath(groupid);
	                        e.stopPropagation();
	                    }
	                })(i)
	            }
	            
            } else {
                var layer = layui.layer;
                layer.msg("未查询到路线信息！");
            }
        },
        dealWithSavePath: function(id, layerStr, info) {
        	var self = this;
	    	MXZH.effectController.loading(true);
	        $.ajax({
	            url: "${basePath}/home_addForxllx.action?time="+new Date().getTime(),
	            data: {
	                LayerPath: '"' + layerStr.replace(/"/g, "'") + '"',
	                name: info[0],
	                miaosu: info[1],
	                creater: username,
	                createrdate: ""
	            },
	            type: "post",
	            success: function(msg) {   //保存成功后查询路线信息
	            	MXZH.effectController.loading(false);
	            	self.dealWithQueryPathInfo();
	            },
	            error: function(error) {
	                MXZH.effectController.loading(false); //如果数据加载错误，去除锁屏
	                throw (error);
	                throw ('数据保存失败！');
	            }
	        });
        },
        dealWithSave: function(id) {
	        var RouteName = $("#layui-layer-iframe" + INDEX).contents().find(".layui-input").val(),
	         	RouteRemarks = $("#layui-layer-iframe" + INDEX).contents().find(".layui-textarea").val(),
	        	info = [],
	        	strOfLayer = "";
	        
            if (RouteName == "") {
                layer.msg('路线名称不能为空！', {
                	time: 1000
                });
                return false;
            }
            info[0] = RouteName;
            info[1] = RouteRemarks;
	        //保存所画的图形 假如 this.xllx.layers 为空说明 没有画巡逻路线
            dojo.forEach(this.wangMapXllx.layers, function(layer) {
                strOfLayer += JSON.stringify(layer.graphics[0].toJson());
                strOfLayer += ",";
	        })
	        this.dealWithSavePath(id, strOfLayer.substr(0, strOfLayer.length - 1), info); //这里只传入图层信息 及对应的id，其他信息将在信息框处理js中获取。
	        layer.msg("保存路径信息成功！", {
	            time: 1000 //1秒关闭（如果不配置，默认是3秒）
	        });
	        this.dealWithRemoveLayer(); //成功保存之后，删除地图上的路径
            layer.closeAll(); //保存路径后关闭layer弹出层
	    },
	    destroy:function(){
	    	this.wangMapXllx.removeGraphics();
	    	this.wangMapXllx.removeLayer();
	    },
	    wangMapXllx: new MXZH.WangMapXllx()
	}
})
