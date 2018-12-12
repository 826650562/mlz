/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-27 14:20:25
 * @version $Id$
 */

jQuery(document).ready(function() {
	MXZH.dzwlCF = function() {};
	MXZH.dzwlCF.prototype = {
		init: function(opts) {
			opts && dojo.safeMixin(this.config, opts);
			this.deletePopUps();
			this.dzwl.init();
			this.dzwl.dealWithQueryFenceInfo();
			this.dzwl.dealWithRemoveLayer();
			
			this.addEventListener();
			layui.use(["element","layer", "form"], function() {
				element = layui.element();
				form = layui.form();
				layer = layui.layer;
				element.on('nav(demo)', function(elem) {});
			});
		},
		config: {
			BtnArray: [".xjwlButton", "#clean_path"]
		},
		addEventListener: function() {
			var self = this;
			$(this.config.BtnArray[0]).unbind().click(function(e) {
				self.addPopUps();
				self.dzwl.dealWithRemoveLayer();
			});
			$(this.config.BtnArray[1]).unbind().click(function(e) {
            	self.dzwl.dealWithRemoveLayer();
            });
		},
		deletePopUps: function() {
			layui.use(['layer'], function() {
				var layer = layui.layer;
				layer.closeAll();
			})
		},
		addPopUps: function() {
			var self=this;
			INDEX_dzwl = layer.open({
				id: "layer_dzwl",
				type: 2,
				shade: 0,
				move: false,
				btn: ["确定"],
				btnAlign: 'c',
				offset: ['80px', '450px'],
				area: ['350px', '230px'],
				content: ['mx/dzwl/iframe_adddzwl.jsp', 'no'],
				cancel: function(index, layero) {
					 //清除掉临时文件
					self.dzwl.clearTempLayerFOrCanceWindow();
					layer.close(index);
					return false;
				}
			});
		},
		dzwl: new MXZH.Dzwl() 
	};
});