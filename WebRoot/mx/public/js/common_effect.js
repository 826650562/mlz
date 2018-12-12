/*
 * 通用的页面效果实现js
 * wxl 2017-04-14
 * 使用方法：在使用页面前先引用该js 
 */
//--------------------------------------------------------------------------------------------------------------//
jQuery(document).ready(function() {
	//配置
	var _effectConfig = {
		_button : 'mainLeftOnOff',
		_mainLeft : 'mainLeft',
		_mainRight : 'mainRight',
		_leftPanel2 : '.leftPanel2',
		_villageCompanyTopRight : '#villageCompanyTopRight',
		_companyRoadTopRight : '#companyRoadTopRight',
		_riskManageTopRight : '#riskManageTopRight',
		_jq : $('body'),
		duration : 60,
		iconLeft : './mx/public/images/jiantouleft.png',
		iconRight : './mx/public/images/jiantouright.png',
		layout_left : 'layout_left',
		//每个栏目有1个或者2个侧边栏 配置
		numOfLM : [ 'jsxx', 'lsxx', 'sswz', 'lsgj', 'xxsb', 'dzwl', 'xllx', 'xxsb' ],
		//需要每次都初始化的栏目名称
		needs_int : [ 'sswz' ],
		_instances:{}
	};
	//效果控制器
	var effectController = function() {
		this.init();
		this.ojbs = {};
		this.loaded = null; //loading效果是否已经开启
	};
	effectController.prototype = {
		init : function() {
			//初始化
			for (var i = 0; i < _effectConfig.numOfLM.length; i++) {
				$("." + _effectConfig.numOfLM[i]).attr("_cb", 0); //默认侧边栏个数 
			}
			this.addEventListener();
			//发送定时请求
			this.timingRequie();
		},
		addEventListener : function() {
			//注册事件
			dojo.connect(dojo.byId(_effectConfig._button), 'onclick', this, this._buttonOfClick)
			var self = this;
			$("." + _effectConfig.layout_left + " ul li").on('click', function(e) {
				self.switchClick(e);
				$(this).find('a').addClass("navActive");
			});
			//$("#clean_path").unbind().click(this, this.LMend);
		},
		timingRequie:function(){
			window.setInterval(function(){
				$.ajax({
					url : "${basePath}/home_sendSession.action?time=" + new Date().getTime(),
					type : "post",
					success : function(msg) {
						MXZH.log(msg);
					},
					error : function(error) {
						throw (error);
					}
				})
			
			} ,1000*60) //20分钟 请求一次
		},
		_buttonOfClick : function() {
			//当点击的时候  判断是回退或者前进   
			//查询是几次
			//获取当前number
			var number = parseInt($("." + this.tempClassName).attr("_cb"));
			if (number == 1) {
				$("." + _effectConfig._mainLeft).hide();
				$(_effectConfig._leftPanel2).hide();
				$(_effectConfig._villageCompanyTopRight).hide();
				$(_effectConfig._companyRoadTopRight).hide();
				$(_effectConfig._riskManageTopRight).hide();
				//更换图标
				this.replaceIcon('iconRight');

				//回退到0
				$("." + this.tempClassName).attr("_cb", 0);
				//动画
				this.animateOfCB(0)
			} else if(number == 2 || number == 3){
				$("." + _effectConfig._mainLeft).show();
				$(_effectConfig._leftPanel2).hide();
				//更换图标
				this.replaceIcon('iconLeft');
				//回退到0
				$("." + this.tempClassName).attr("_cb", 1);
				//动画
				this.animateOfCB(1)
			} else {
				//为0  展开
				$("." + _effectConfig._mainLeft).show();
				this.replaceIcon('iconLeft');
				this.animateOfCB(1);
				$("." + this.tempClassName).attr("_cb", 1);
			}
		},
		animateOfCB : function(number, w) {
			//参数 number：开合第几个侧边栏  direction 方向
			//侧边栏的动画过程
			var lf = $("." + _effectConfig._mainLeft);
			var lr = $("." + _effectConfig._mainRight);
			var self = this;
			// 张开一个 
			if (number == 0) {
				lf.animate({
					width : "0px",
					display : 'none'
				}, _effectConfig.duration, 'linear', function() {
					lr.animate({
						left : "0px",
						display : 'block'
					}, _effectConfig.duration, function() {
						$(".leftPanel2").hide();
						self.replaceIcon("iconRight");
						$("." + self.tempClassName).attr("_cb", 0);
					});
				});
			} else if (number == 1) {
				lf.animate({
					width : "351px",
					display : 'block'
				}, _effectConfig.duration, 'linear', function() {
					lr.animate({
						left : "351px",
						display : 'block'
					}, _effectConfig.duration, function() {
						$(".leftPanel2").hide();
						self.replaceIcon("iconLeft");
						$("." + self.tempClassName).attr("_cb", 1);
					});
					$(".slider-thumb").remove();
				});
			} else if (number == 2) {
				lf.animate({
					width : w || "702px",
					display : 'block'
				}, _effectConfig.duration, 'linear', function() {
					lr.animate({
						left : w || "702px",
						display : 'block'
					}, _effectConfig.duration, function() {
						$("." + self.tempClassName + "_Panel2").show();
						self.replaceIcon("iconLeft");
						$("." + self.tempClassName).attr("_cb", 2);
					});
				});
			} else if (number == 3) {
				lf.animate({
					width : w || "702px",
					display : 'block'
				}, _effectConfig.duration, 'linear', function() {
					lr.animate({
						left : w || "702px",
						display : 'block'
					}, _effectConfig.duration, function() {
						$("." + self.tempClassName + "2_Panel2").show();
						self.replaceIcon("iconLeft");
						$("." + self.tempClassName).attr("_cb", 3);
					});
				});
			}
		},
		switchClick : function(node) {
			//这里是首页 栏目的切换
			$("." + _effectConfig.layout_left + " ul li a").removeClass("navActive");
			//点击的时候切换栏目
			this.tempClassName = node.currentTarget.className;
			this.switchLanMu();
			//判断是否出来第二个栏目
			this.tempClassName == "jsxx" ? this.check_panl2(0) : this.check_panl2(1);
			this.LMbegin();
		},
		switchLanMu : function() {
			//1.获取点击的li的类名  lsgj
			// 类名为 leftPanel1_Main 关闭
			// lsgj_Panel1 这个显示  其他的都关闭 
			$(".leftPanel1_Main").fadeOut(100);
			$("." + this.tempClassName + "_Panel1").fadeIn(100);
			$(".mainLeft").show();
		},
		check_panl2 : function(number) {
			//判断是否出来第二个栏目
			if (number == 2) {
				$("." + this.tempClassName).attr('_cb', 2);
				$(".leftPanel2").hide();
				$("." + this.tempClassName + "_Panel2").fadeIn(100);
				this.animateOfCB(2);
			} else if (number == 1) {
				$("." + this.tempClassName).attr('_cb', 1);
				$("." + this.tempClassName + "_Panel2").fadeOut(100);
				this.animateOfCB(1);
			}
		},
		replaceIcon : function(type) {
			//替换图片
			switch (type) {
			case 'iconLeft':
				$("." + _effectConfig._button + " img").attr("src", _effectConfig.iconLeft);
				break;
			case 'iconRight':
				$("." + _effectConfig._button + " img").attr("src", _effectConfig.iconRight);
				break;
			}
		},
		LMbegin : function(lanmuName) {
			//开始栏目的操作  根据className 确定是那个栏目
			if (!dojo.isObject(MXZH)) {
				MXZH.errorLog('mxzh对象没有先加载,检测Config.js');return false;
			}
			!!lanmuName && (this.tempClassName = lanmuName);
			var invokeClassName = this.tempClassName + 'CF';
			var invokeClass = MXZH[invokeClassName];
			this.LMend();
			if (!dojo.isFunction(invokeClass)) {
				if ($(".mainRight").css('left') != '1px') {
					this.animateOfCB(0);this.check_button(true);
				}
				if ('jsxx' != this.tempClassName)
					MXZH.errorLog('mxzh对象中没有' + invokeClassName + "类，请先注册！");
			} else {
				var invokeFun = null;
				if (dojo.indexOf(_effectConfig.needs_int, this.tempClassName) >= 0) {
					invokeFun = new invokeClass();
					invokeFun.init();//触发 init()
				} else {
					invokeFun = MXZH.classFactory(invokeClass, invokeClassName);
				}
				this.ojbs = invokeFun;
				//_effectConfig._instances[this.tempClassName]=this.ojbs = invokeFun;
				this.ojbs['lmName'] = this.tempClassName;
				this.check_button();
				this.openOrCloseOther()
			}
		},
		openOrCloseOther:function(){
			if(this.tempClassName=='tjfx'){
				$(".layout_right").fadeOut(400);
				$(".layout_right_2").fadeIn(300);
			}else{
				$(".layout_right").fadeIn(300);
				$(".layout_right_2").fadeOut(400);
			}
			if(this.tempClassName=='jkdx'){
				//是否显示图例
				$(".tuli").fadeIn(300);
			}else
				$(".tuli").fadeOut(400);
		},
		check_button : function(bool) {
			if (!bool) $("." + _effectConfig._button).show();
			else $("." + _effectConfig._button).hide();
		},
		LMend : function(event) {
			var self;
			if (event && event.data) {
				self = event.data
			} else
				self = this;
			 //栏目结束  要清除在地图上的点线面  停止数据更新
			 
			if(self.ojbs.destroy && (self.ojbs['lmName']!=self.tempClassName)){
				self.ojbs.destroy();
			}
		},
		LMendBefore:function(){
			if(!(this.tempClassName=='sswz' && this.ojbs.lmName=='jjqy')) 
				{
				  return true;
				}
		},
		loading : function(bool) {
			layui.use('layer', function() {
				var layer = layui.layer;
				if (bool)
					this.loaded = layer.load(2, {
						shade : [ 0.4, '#000' ],
						area : 'auto',
						maxWidth : 60
					});
				else
					this.loaded && layer.close(this.loaded);
			});
		}
	}
	//添加到命名空间等待使用
	MXZH.effectController = new effectController();
//jquery 等待文件加载完毕执行
})