/*
 * 统计分析 
 *  王新亮
 *  20170613
 */
MXZH.tjfxCF = function() {};
MXZH.tjfxCF.prototype = {
	init : function() {
		this.questsOftasking(this.uploadColumnTasking);
		this.questsOftaskEnds(this.uploadColumnTaskEnd);
		this.questsOfThreeKinds(this.showSecendChart_slry);
		this.questsOfCoreArea(this.showSecendChart_hxq);
		this.questsOfVeryDayMonitor(this.showthreeChart_gksl);
		this.questsOfMonthMonitor(this.showfrourChart_gksj);
		var self=this;setInterval(function(){
			self.questsOfVeryDayMonitor(self.showthreeChart_gksl);	
		},1000*60*60)//一小时
		
	},
	destroy:function(){
		
	},
	showSecendChart_slry : function(msg,t) {
		//展示第二个图表 三类人员
		var option = t.slryOption();
		var suffix="类人员";
		if(msg.length){
			dojo.forEach(msg,function(item){
				option.legend.data.push(item.personnel_type+"类人员");
				option.series[0].data.push({
					value:item.t_count,
					name:item.personnel_type+suffix
				});
			});
		}
		var dom = document.getElementById("sanlei_chart");
		var myChart = echarts.init(dom, "macarons");
		myChart.setOption(option);
	},
	showSecendChart_hxq : function(msg,t) {
		//展示第二个图表 核心区目标分布
		var option = t.hxqOption();
		if(msg.length){
			dojo.forEach(msg,function(item){
				option.series[0].data.push({
					value:item.p_num,
					name:item.police_addr
				});
			});
		}
		var dom = document.getElementById("hxqy_chart");
		var myChart = echarts.init(dom, "macarons");
		myChart.setOption(option);
	},
	showthreeChart_gksl : function(msg,t) {
		//展示第三个图表  当日跟控数量统计
		//MXZH.log(msg);
		var option = t.gkslOption();
		if(msg.length){
			dojo.forEach(msg,function(item){
				option.xAxis.data.push(item.t_time.hours);
				/**/
				//option.series[0].data.push(item.hxq_mbcount);
				option.series[0].data.push(item.all_count);
			});
		}
		var dom = document.getElementById("gksl_tjfx");
		var myChart = echarts.init(dom, "macarons");
		myChart.setOption(option);
	},
	showfrourChart_gksj : function(msg,t) {
		//展示第二个图表 核心区
		//MXZH.log(msg);
		var option1 = t.gkrwOption();
		var option2 = t.gkrwOption2();
 
		dojo.forEach(msg,function(item){
			
			option1.xAxis[0].data.push(item.times);
			option2.xAxis[0].data.push(item.times);
			
			option1.series[0].data.push(item.yjrws);
			option1.series[1].data.push(item.xzrws);
			
			option2.series[0].data.push("-"+item.yjmbs);
			option2.series[1].data.push("-"+item.xzmbs);
		});
		var dom1 = document.getElementById("gkrwydtj1");
		var myChart1 = echarts.init(dom1, "macarons");
		//第二个图表
		var dom2 = document.getElementById("gkrwydtj2");
		var myChart2 = echarts.init(dom2, "macarons");
		myChart1.setOption(option1);
		myChart2.setOption(option2);
	},
	/**
	 * 跟控数据月度统计
	 */
	gkrwOption : function() {
		return {
			grid:{
				bottom:'25px',
				left:'50px',
				right:'30px'
			},
			tooltip : {
				trigger : 'axis',
				 formatter: function(params) {
					 var str="";
					 if(params[0] && params[1] && params[0]['seriesName'] && params[1]['data']){
						 str= params[0]['seriesName']+":"+params[0]['data']+"<br>"+params[1]['seriesName']+":"+params[1]['data']
					 }
					 return str;
				 },
			},
			legend : {
				data : [ '已结案件数','新增案件数' ]
			},
			xAxis : [
				{
					type : 'category',
					data : [],
					axisPointer : {
						type : 'shadow'
					},
					position : 'botttom'
				}
			],
			yAxis : [
				{
					type : 'value',
					name : '案件数',
					axisLabel : {
						formatter : '{value}'
					}
				},
				{
					type : 'value',
					name : '目标数',
					axisLabel : {
						formatter : '{value}'
					}
				}
			],
			series : [
				{
					name : '已结案件数',
					type : 'bar',
					data : []
				},
				{
					name : '新增案件数',
					type : 'line',
					yAxisIndex : 1,
					data : []
				}
			]
		};

	},
	gkrwOption2 : function() {
		return {
			grid:{
				top:'5px',
				left:'50px',
				right:'30px'
			},
			tooltip : {
				trigger : 'axis',
				 formatter: function(params) {
				         var str="";
						 if(params[0] && params[1] && params[0]['seriesName'] && params[0]['data']){
							 str=  params[0]['seriesName']+
						      ":"+Math.abs(params[0]['data'])+"<br>"+params[1]['seriesName']+":"+Math.abs(params[1]['data']);
						 }
						 return str;
				 },
			},
			/*legend : {
				data : ['已结目标数','新增目标数' ],
				top:'-100px'
			},*/
			xAxis : [
				{
					type : 'category',
					data : [],
					axisPointer : {
						type : 'shadow'
					},
					show :false,
					position : 'top'
				}
			],
			yAxis : [
				{
					type : 'value',
					name : '',
					axisLabel : {
						formatter: function (value, index) {
                            return Math.abs(value)						
						}
					}
				},
				{
					type : 'value',
					name : '',
					axisLabel : {
						formatter: function (value, index) {
                            return Math.abs(value)							
						}
					}
				}
			],
			series : [
				{
					name : '已结目标数',
					type : 'bar',
					itemStyle:{
						normal:{
							color:'#bda29a'
						}
					},
					data : []
				},
				{
					name : '新增目标数',
					type : 'line',
					yAxisIndex : 1,
					itemStyle:{
						normal:{
							color:'#6e7074'
						}
					},
					data : []
				}
			]
		};

	},
	/**
	 * 当日跟控数量统计
	 */
	gkslOption : function() {
		return {
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				data : [ '核心区目标', '所有目标' ],
				right : '30px'
			},
			grid : {
				left : '3%',
				right : '4%',
				bottom : '3%',
				containLabel : true
			},
			xAxis : {
				type : 'category',
				boundaryGap : false,
				data : [ ]
			},
			yAxis : {
				type : 'value'
			},
			series : [/*{
				name : '核心区目标',
				type : 'line',
				data : []
			},*/
			{
				name : '所有目标',
				type : 'line',
				data : []
			}]
		};
	},
	/**
	 * 核心区 配置项
	 */
	hxqOption : function() {
		return {
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			calculable : true,
			series : [
				{
					name : '核心区目标分布',
					type : 'pie',
					radius : [ 20, '45%' ],
					center : [ '50%', '50%' ],
					roseType : 'area',
					data : []
				}
			]
		};
	},


	/**
	 * 三类人员统计分析
	 */
	slryOption : function() {
		return {
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				right : '20px',
				data : []
			},
			series : [
				{
					name : '三类人员',
					type : 'pie',
					center : [ '50%', '60%' ],
					radius : '45%',
					data : [],
					itemStyle : {
						emphasis : {
							shadowBlur : 10,
							shadowOffsetX : 0,
							shadowColor : 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
	},
	/**
	 * 统计分析的数据调用 函数  王新亮
	 */
	questsOftasking:function(callback){
	  //获取第一栏的统计数据
		$.ajax({
			url : "${basePath}/tjfx_queryCount.action?time="+new Date().getTime(),
			//data :  ,
			type : "post",
			success : function(msg) {
				var pointList = JSON.parse(msg);
				callback(pointList, self);
			}
		});
	},
	questsOftaskEnds:function(callback){
	  //获取第二栏的统计数据
		$.ajax({
			url : "${basePath}/tjfx_queryEndCount.action?time="+new Date().getTime(),
			type : "post",
			success : function(msg) {
				var pointList = JSON.parse(msg);
				callback(pointList, self);
			}
		});
	},
	questsOfThreeKinds:function(callback){
		  //获取第三栏的统计数据
		    var self=this; 
			$.ajax({
				url : "${basePath}/tjfx_queryType.action?time="+new Date().getTime(),
				type : "post",
				success : function(msg) {
					var pointList = JSON.parse(msg);
					callback(pointList, self);
				}
			});
		},
		questsOfCoreArea:function(callback){
		  //获取第三栏的统计数据
		    var self=this; 
			$.ajax({
				url : "${basePath}/tjfx_queryHxqy.action?time="+new Date().getTime(),
				type : "post",
				success : function(msg) {
					var pointList = JSON.parse(msg);
					callback(pointList, self);
				}
			});
		},
		questsOfVeryDayMonitor:function(callback){
			//获取 每日跟控数量的统计数据
			var self=this; 
			$.ajax({
				url : "${basePath}/tjfx_queryToday.action?time="+new Date().getTime(),
				type : "post",
				success : function(msg) {
					var pointList = JSON.parse(msg);
					callback(pointList, self);
				}
			});
		},
		questsOfMonthMonitor:function(callback){
			//获取 每月跟控数量的统计数据
			var self=this; 
			$.ajax({
				url : "${basePath}/tjfx_queryMouth.action?time="+new Date().getTime(),
				type : "post",
				success : function(msg) {
					var pointList = JSON.parse(msg);
					callback(pointList, self);
				}
			});
		},
	uploadColumnTasking:function(msg){
		$(".ReconIng").eq(0).text(msg[0].task_count);
		$(".ReconIng").eq(1).text(msg[0].target_count);
		$(".ReconIng").eq(2).text(msg[0].zzxz_count);
		$(".ReconIng").eq(3).text(msg[0].zzjy_count);
	},
	uploadColumnTaskEnd:function(msg){
		$(".ReconEnd").eq(0).text(msg.yj_count);
		$(".ReconEnd").eq(1).text(msg.yjmb_count);
		$(".ReconEnd").eq(2).text(parseFloat(msg.sj_count)+"小时");
		$(".ReconEnd").eq(3).text(msg.gk_count+"次");
	}
};