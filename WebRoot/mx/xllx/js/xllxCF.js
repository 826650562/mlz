/**
 * 
 * @authors Steve Chan (zychen@mlight.com.cn)
 * @date    2017-04-18 13:37:25
 * @version $Id$
 */


jQuery(document).ready(function() {
    MXZH.xllxCF = function() {};
    MXZH.xllxCF.prototype = {
        init: function(opts) {
            opts && dojo.safeMixin(this.config, opts);
            this.deletePopUps();
            this.xllx.init();
            this.xllx.dealWithQueryPathInfo();
            this.xllx.dealWithRemoveLayer();
            this.addEventListner();
        },
        config: {
            BtnArray: [".addButton", "#clean_path"]
        },
        addEventListner: function() {
            var self = this;
            $(this.config.BtnArray[0]).unbind().click(function(e) {
                self.addPopUps();
                self.xllx.dealWithRemoveLayer();
            });
            $(this.config.BtnArray[1]).unbind().click(function(e) {
            	self.xllx.dealWithRemoveLayer();
            });
        },
        deletePopUps: function() {
        	layui.use(['layer'], function() {
        		var layer = layui.layer;
        		layer.closeAll();
        	})
        },
        destroy:function(){
        	this.xllx.destroy();
        },
        addPopUps: function() {
            layui.use(['element', 'layer'], function() {
                var element = layui.element();
                element.on('nav(demo)', function(elem) {});
                INDEX = layer.open({
                    id: "mylayer",
                    type: 2,
                    shade: 0,
                    move: false,
                    btn: ['确定'],
                    btnAlign: 'c',
                    offset: ['80px', '450px'],
                    area: ['350px', '270px'],
                    content: ['mx/xllx/iframe_addxllx.jsp', 'no'],
                    cancel: function(index, layero) {
                        layer.close(index);
                        return false;
                    }
                });
            });
        },
        xllx: new MXZH.Xllx()
    };
});
