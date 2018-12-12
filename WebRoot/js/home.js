$(document).ready(function() {
	//一级菜单点击事件
	$(".first_menu").on("click", first_menu_click);
	//二级菜单点击事件
	$(".second_menu").on("click", second_menu_click);
});



function first_menu_click(){
	var hc = $(this).hasClass("active");
	if(!hc){
		//设置自身和兄弟节点的变化
	    $(this).css("background-color","#00C1DE");
	    $(this).addClass("active");
	    $(this).parent().siblings().find("a:first").css("background-color","#011925");
	    $(this).parent().siblings().find("a:first").removeClass("active");
	    //设置左侧展开还是合并的图标
	    $(this).find("i").removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom");
	    $(this).parent().siblings().find("a:first").find("i").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right");
	    $(this).parent().find("ul").show();
	    $(this).parent().siblings().find("ul").hide();
	}else{
		$(this).css("background-color","#00C1DE");
		$(this).removeClass("active");
		$(this).find("i").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right");
	    $(this).parent().find("ul").hide();
	}
    
}

function second_menu_click(){
    $(this).css("background-color","#4A5064");
    $(this).parent().siblings().find("a").css("background-color","#012B3B");
}
/**
 * 加载首页面
 */
function load_home() {
	$.ajax({
		url : basepath + "/home_loadHome.action",
		dataType : "html",
		method : "post",
		async : false,
		success : function(html) {
			$("#main_index").show();
			$("#main_index").html(html);
			$("#main_map").hide();
		}
	});
}
/**
 * 加载人员定位
 */
function load_persion_location() {
	//$("#main_index").hide();
	$(".main").hide();
	$("#main_map").show();
}

/**
 * 打开系统管理
 */
function openNewWindow() {
	$.ajax({
		url : basepath + "/home_queryadminpassword.action",
		type : "post",
		success : function(word) {
			var newHref = "http://192.168.2.200:18080/?"
			+ Base64.encodeURI("username=admin&password="
				+ word + "&time=" + new Date().getTime());
			//password中可以传加密以后的值
			window.open(newHref, "_blank");
		},
		error : function(error) {
			throw ('数据请求失败！');
		}
	});
}
//成果展示 
function load_chengguo_show() {
	$(".main").hide();
	$("#main_chengguo").show();
	var index = 2;
	function swithcPic(index, self) {
		var path = $(self).attr("path");
		$(self).attr("src", path + "00" + index + ".jpg");
	}
	$("#_myimgs_cg").click(function(e) {
		if (e.which == 1 && e.ctrlKey) {
			if (index > 1  ) {
				index--;
				console.info("--",index);
				swithcPic(index, this)
				
			}
		} else {
			if (index <= 7 && index >=0 ) {
				console.info("++",index);
				swithcPic(index, this)
				index++;
			}
		}

	});
}





//人员签到统计
function load_person_show(){
	$(".main").hide();
	$("#main_persontongji").show();
	function comOption(data) {
		this.setSeries = function () {
			var length = data.value.length;
			var array = [];
			for (let index = 0; index < length; index++) {
				const element = data.value[index];
				let seriesObj = {
					name: data.legend[index],
					type: 'bar',
					barGap: '30%',
					data: element
				}
				array.push(seriesObj);
			}
			return array;
		}
		return {
			title: {
				text: data.name,
				textStyle: {
					align: 'center'
				},
				x: 'center',
				y: 'top'
			},
			grid: {
				bottom: 100
			},
			// color: ['#a7a272', '#dcd9bf', '#d4c64b'],
			color: data.color,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: data.legend,
				top: 'bottom'
			},
			toolbox: {},
			xAxis: {
				data: data.xAxis,
				axisLabel: {
					align: 'right',
					rotate: 45,
					verticalAlign: 'middle'
				}
			},
			yAxis: {
				min: 0,
				max: data.max,
				splitNumber: data.splitNumber
			},
			series: setSeries()
		}
	}
	var data = [
		{
			'name': '考勤管理统计',
			'legend': ['未到企业次数', '缺勤次数'],
			'xAxis': ['南桥镇', '奉城镇', '四团镇', '拓林镇', '庄行镇', '金汇镇', '南村镇', '海湾镇', '奉浦社区', '金海社区', '上海奉贤海湾旅游区'],
			'color': ['#a7a272', '#dcd9bf'],
			'max': 10,
			'splitNumber': 10,
			'value': [
				[2, 2, 4, 5, 6, 1, 2, 1, 2, 2, 2],
				[3, 4, 5, 6, 7, 8, 9, 6, 5, 8, 7]
			],
			'especially': true,
			'done': true
		}
	];
	data.map(function (item, index) {
		
		var dom = $('#echart1');
		var myChart = echarts.init(dom[0]);
		var option = comOption(item);

		if (item.especially) {
			option.xAxis = {
				type: 'value',
				min: 0,
				max: item.max,
				splitNumber: item.splitNumber
			}
			option.yAxis = {
				type: 'category',
				data: item.xAxis,
			}
		}
		if (item.type == 'pie') {
			option = {};
			option.tooltip = {
				trigger: 'item',
				formatter: "{a} <br/>{b}: ({d}%)"
			}
			option.legend = {
				orient: 'vertical',
				x: '400px',
				data: item.legend
			}
			option.series = [{
				name: '城镇名称：',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
						value: 6,
						name: item.legend[0]
					},
					{
						value: 7,
						name: item.legend[1]
					},
					{
						value: 8,
						name: item.legend[2]
					},
					{
						value: 8,
						name: item.legend[3]
					},
					{
						value: 9,
						name: item.legend[4]
					},
					{
						value: 10,
						name: item.legend[5]
					},
					{
						value: 10,
						name: item.legend[6]
					},
					{
						value: 11,
						name: item.legend[7]
					},
					{
						value: 12,
						name: item.legend[8]
					},
					{
						value: 12,
						name: item.legend[9]
					},
					{
						value: 7,
						name: item.legend[10]
					},
				]
			}]
		}
		myChart.setOption(option);
	});
}

function load_jgperson_show(){
	$(".main").hide();
	$("#main_jgpersontongji").show();
	function comOption(data) {
		this.setSeries = function () {
			var length = data.value.length;
			var array = [];
			for (let index = 0; index < length; index++) {
				const element = data.value[index];
				let seriesObj = {
					name: data.legend[index],
					type: 'bar',
					barGap: '30%',
					data: element
				}
				array.push(seriesObj);
			}
			return array;
		}
		return {
			title: {
				text: data.name,
				textStyle: {
					align: 'center'
				},
				x: 'center',
				y: 'top'
			},
			grid: {
				bottom: 100
			},
			// color: ['#a7a272', '#dcd9bf', '#d4c64b'],
			color: data.color,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: data.legend,
				top: 'bottom'
			},
			toolbox: {},
			xAxis: {
				data: data.xAxis,
				axisLabel: {
					align: 'right',
					rotate: 45,
					verticalAlign: 'middle'
				}
			},
			yAxis: {
				min: 0,
				max: data.max,
				splitNumber: data.splitNumber
			},
			series: setSeries()
		}
	}
	var data = [
		 {
              'name': '奉贤区一月监管人员检查统计',
              'legend': ['企业数', '隐患数', '安全执法数'],
              'xAxis': ['张三', '李四', '王五', '陈留', '李典', '吴勇', '马宇', '钟傲娇'],
              'color': ['#a7a272', '#dcd9bf', '#d4c64b'],
              'max': 40,
              'splitNumber': 8,
              'value': [
                  [10, 6, 7, 10, 6, 10, 7, 10],
                  [20, 31, 26, 34, 25, 35, 22, 36],
                  [5, 6, 7, 8, 3, 4, 6, 7]
              ]
      }
	];
	data.map(function (item, index) {
		
		var dom = $('#echart2');
		var myChart = echarts.init(dom[0]);
		var option = comOption(item);

		if (item.especially) {
			option.xAxis = {
				type: 'value',
				min: 0,
				max: item.max,
				splitNumber: item.splitNumber
			}
			option.yAxis = {
				type: 'category',
				data: item.xAxis,
			}
		}
		if (item.type == 'pie') {
			option = {};
			option.tooltip = {
				trigger: 'item',
				formatter: "{a} <br/>{b}: ({d}%)"
			}
			option.legend = {
				orient: 'vertical',
				x: '400px',
				data: item.legend
			}
			option.series = [{
				name: '城镇名称：',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
						value: 6,
						name: item.legend[0]
					},
					{
						value: 7,
						name: item.legend[1]
					},
					{
						value: 8,
						name: item.legend[2]
					},
					{
						value: 8,
						name: item.legend[3]
					},
					{
						value: 9,
						name: item.legend[4]
					},
					{
						value: 10,
						name: item.legend[5]
					},
					{
						value: 10,
						name: item.legend[6]
					},
					{
						value: 11,
						name: item.legend[7]
					},
					{
						value: 12,
						name: item.legend[8]
					},
					{
						value: 12,
						name: item.legend[9]
					},
					{
						value: 7,
						name: item.legend[10]
					},
				]
			}]
		}
		myChart.setOption(option);
	});
}

function load_ajsys_show(){
	$(".main").hide();
	$("#main_ajsystongji").show();
	function comOption(data) {
		this.setSeries = function () {
			var length = data.value.length;
			var array = [];
			for (let index = 0; index < length; index++) {
				const element = data.value[index];
				let seriesObj = {
					name: data.legend[index],
					type: 'bar',
					barGap: '30%',
					data: element
				}
				array.push(seriesObj);
			}
			return array;
		}
		return {
			title: {
				text: data.name,
				textStyle: {
					align: 'center'
				},
				x: 'center',
				y: 'top'
			},
			grid: {
				bottom: 100
			},
			// color: ['#a7a272', '#dcd9bf', '#d4c64b'],
			color: data.color,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: data.legend,
				top: 'bottom'
			},
			toolbox: {},
			xAxis: {
				data: data.xAxis,
				axisLabel: {
					align: 'right',
					rotate: 45,
					verticalAlign: 'middle'
				}
			},
			yAxis: {
				min: 0,
				max: data.max,
				splitNumber: data.splitNumber
			},
			series: setSeries()
		}
	}
	var data = [
		 {
              'name': '奉贤区五月检查统计',
              'legend': ['检查企业数', '发现隐患数', '隐患整改复查数'],
              'xAxis': ['南桥镇', '奉城镇', '四团镇', '拓林镇', '庄行镇', '金汇镇', '南村镇', '海湾镇', '奉浦社区', '金海社区', '上海奉贤海湾旅游区'],
              'color': ['#a7a272', '#dcd9bf', '#d4c64b'],
              'max': 20,
              'splitNumber': 10,
              'value': [
                  [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 11],
                  [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 12],
                  [5, 6, 7, 8, 9, 6, 7, 7, 3, 4, 5]
              ]
          }
	];
	data.map(function (item, index) {
		
		var dom = $('#echart3');
		var myChart = echarts.init(dom[0]);
		var option = comOption(item);

		if (item.especially) {
			option.xAxis = {
				type: 'value',
				min: 0,
				max: item.max,
				splitNumber: item.splitNumber
			}
			option.yAxis = {
				type: 'category',
				data: item.xAxis,
			}
		}
		if (item.type == 'pie') {
			option = {};
			option.tooltip = {
				trigger: 'item',
				formatter: "{a} <br/>{b}: ({d}%)"
			}
			option.legend = {
				orient: 'vertical',
				x: '400px',
				data: item.legend
			}
			option.series = [{
				name: '城镇名称：',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
						value: 6,
						name: item.legend[0]
					},
					{
						value: 7,
						name: item.legend[1]
					},
					{
						value: 8,
						name: item.legend[2]
					},
					{
						value: 8,
						name: item.legend[3]
					},
					{
						value: 9,
						name: item.legend[4]
					},
					{
						value: 10,
						name: item.legend[5]
					},
					{
						value: 10,
						name: item.legend[6]
					},
					{
						value: 11,
						name: item.legend[7]
					},
					{
						value: 12,
						name: item.legend[8]
					},
					{
						value: 12,
						name: item.legend[9]
					},
					{
						value: 7,
						name: item.legend[10]
					},
				]
			}]
		}
		myChart.setOption(option);
	});
}

function load_xcqk_show(){
	$(".main").hide();
	$("#main_xcqktongji").show();
	function comOption(data) {
		this.setSeries = function () {
			var length = data.value.length;
			var array = [];
			for (let index = 0; index < length; index++) {
				const element = data.value[index];
				let seriesObj = {
					name: data.legend[index],
					type: 'bar',
					barGap: '30%',
					data: element
				}
				array.push(seriesObj);
			}
			return array;
		}
		return {
			title: {
				text: data.name,
				textStyle: {
					align: 'center'
				},
				x: 'center',
				y: 'top'
			},
			grid: {
				bottom: 100
			},
			// color: ['#a7a272', '#dcd9bf', '#d4c64b'],
			color: data.color,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: data.legend,
				top: 'bottom'
			},
			toolbox: {},
			xAxis: {
				data: data.xAxis,
				axisLabel: {
					align: 'right',
					rotate: 45,
					verticalAlign: 'middle'
				}
			},
			yAxis: {
				min: 0,
				max: data.max,
				splitNumber: data.splitNumber
			},
			series: setSeries()
		}
	}
	var data = [
		 {
              'name': '现场情况分类统计',
              'legend': ['人员违章', '设备设施缺陷', '安全管理缺陷', '职业卫生'],
              'xAxis': ['南桥镇', '奉城镇', '四团镇', '拓林镇', '庄行镇', '金汇镇', '南村镇', '海湾镇', '奉浦社区', '金海社区', '上海奉贤海湾旅游区'],
              'color': ['#a7a272', '#dcd9bf', '#d4c64b', '#548894'],
              'max': 14,
              'splitNumber': 7,
              'value': [
                  [4, 2, 3, 4, 4, 4, 4, 5, 5, 6, 7],
                  [2, 4, 2, 3, 2, 2, 2, 2, 2, 1, 1],
                  [2, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
                  [3, 5, 7, 6, 4, 6, 7, 7, 8, 8, 9]
              ]
          }
	];
	data.map(function (item, index) {
		
		var dom = $('#echart4');
		var myChart = echarts.init(dom[0]);
		var option = comOption(item);

		if (item.especially) {
			option.xAxis = {
				type: 'value',
				min: 0,
				max: item.max,
				splitNumber: item.splitNumber
			}
			option.yAxis = {
				type: 'category',
				data: item.xAxis,
			}
		}
		if (item.type == 'pie') {
			option = {};
			option.tooltip = {
				trigger: 'item',
				formatter: "{a} <br/>{b}: ({d}%)"
			}
			option.legend = {
				orient: 'vertical',
				x: '400px',
				data: item.legend
			}
			option.series = [{
				name: '城镇名称：',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
						value: 6,
						name: item.legend[0]
					},
					{
						value: 7,
						name: item.legend[1]
					},
					{
						value: 8,
						name: item.legend[2]
					},
					{
						value: 8,
						name: item.legend[3]
					},
					{
						value: 9,
						name: item.legend[4]
					},
					{
						value: 10,
						name: item.legend[5]
					},
					{
						value: 10,
						name: item.legend[6]
					},
					{
						value: 11,
						name: item.legend[7]
					},
					{
						value: 12,
						name: item.legend[8]
					},
					{
						value: 12,
						name: item.legend[9]
					},
					{
						value: 7,
						name: item.legend[10]
					},
				]
			}]
		}
		myChart.setOption(option);
	});
}

function load_jdjc_show(){
	$(".main").hide();
	$("#main_jdjctongji").show();
	function comOption(data) {
		this.setSeries = function () {
			var length = data.value.length;
			var array = [];
			for (let index = 0; index < length; index++) {
				const element = data.value[index];
				let seriesObj = {
					name: data.legend[index],
					type: 'bar',
					barGap: '30%',
					data: element
				}
				array.push(seriesObj);
			}
			return array;
		}
		return {
			title: {
				text: data.name,
				textStyle: {
					align: 'center'
				},
				x: 'center',
				y: 'top'
			},
			grid: {
				bottom: 100
			},
			// color: ['#a7a272', '#dcd9bf', '#d4c64b'],
			color: data.color,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: data.legend,
				top: 'bottom'
			},
			toolbox: {},
			xAxis: {
				data: data.xAxis,
				axisLabel: {
					align: 'right',
					rotate: 45,
					verticalAlign: 'middle'
				}
			},
			yAxis: {
				min: 0,
				max: data.max,
				splitNumber: data.splitNumber
			},
			series: setSeries()
		}
	}
	var data = [
		 {
              'name': '奉贤区监督检查企业统计',
              'legend': ['南桥镇', '奉城镇', '四团镇', '拓林镇', '庄行镇', '金汇镇', '南村镇', '海湾镇', '奉浦社区', '金海社区', '上海奉贤海湾旅游区'],
              'value': [
                  [2, 2, 4, 5, 6, 1, 2, 1, 2, 2, 2],
                  [3, 4, 5, 6, 7, 8, 9, 6, 5, 8, 7]
              ],
              'type': 'pie',
              'radius': ['0%', '50%'],
              'data': [{
                  value: 6,
                  name: '南桥镇'
              }, {
                  value: 6,
                  name: '南桥镇'
              }, {
                  value: 6,
                  name: '南桥镇'
              }, {
                  value: 6,
                  name: '南桥镇'
              }, {
                  value: 6,
                  name: '南桥镇'
              }, {
                  value: 6,
                  name: '南桥镇'
              }, {
                  value: 6,
                  name: '南桥镇'
              }]
          }
	];
	data.map(function (item, index) {
		
		var dom = $('#echart5');
		var myChart = echarts.init(dom[0]);
		var option = comOption(item);

		if (item.especially) {
			option.xAxis = {
				type: 'value',
				min: 0,
				max: item.max,
				splitNumber: item.splitNumber
			}
			option.yAxis = {
				type: 'category',
				data: item.xAxis,
			}
		}
		if (item.type == 'pie') {
			option = {};
			option.title = {
					text: item.name ,
					textStyle: {
						align: 'center'
					},
					x: 'center',
					y: 'top'
			}
			option.grid = {
				width: '400px',
				height: '600px'
			}
			option.tooltip = {
				trigger: 'item',
				formatter: "{a} <br/>{b}: ({d}%)"
			}
			option.legend = {
				y: 'bottom',
				data: item.legend
			}
			option.series = [{
				name: '城镇名称：',
				type: 'pie',
				radius: '70%',
				data: [{
						value: 6,
						name: item.legend[0]
					},
					{
						value: 7,
						name: item.legend[1]
					},
					{
						value: 8,
						name: item.legend[2]
					},
					{
						value: 8,
						name: item.legend[3]
					},
					{
						value: 9,
						name: item.legend[4]
					},
					{
						value: 10,
						name: item.legend[5]
					},
					{
						value: 10,
						name: item.legend[6]
					},
					{
						value: 11,
						name: item.legend[7]
					},
					{
						value: 12,
						name: item.legend[8]
					},
					{
						value: 12,
						name: item.legend[9]
					},
					{
						value: 7,
						name: item.legend[10]
					},
				]
			}]
		}

		myChart.setOption(option);
	});
}






$(function() {
	var sswzLayer = new esri.layers.GraphicsLayer();
	dojo.mymap.addLayer(sswzLayer);

	//搜索
	$("#search").keydown(function(event) {
		if (event.keyCode == 13) {
			var text = $.trim($("#search").val());
			if (text.length > 0) {
				searchPoints(text);
			}
		}
	});



	$("#search").bind("input propertychange change", function(event) {
		var text = $.trim($("#search").val());
		if (text.length <= 0) {
			sswzLayer.clear();
		}
	});

	function searchPoints(rtext) {
		//搜索人名及企业
		var img1 = "";
		var img2 = '';
		var isqiye = false;
		sswzLayer.clear();
		//一个随机数坐标值x
		var randerXY = [ 121.465817, 30.909596 ];
		var randerXY2 = [ 121.49051093840735, 30.846486236167856 ]; //海光电机公司
		var reapoint;

		if (rtext.indexOf("公司") > 0) {
			//说明是输入的是公司
			img1 = 'images/chengguo/dingwei.png';
			img2 = 'images/chengguo/peonameBlue.png';
			reapoint = randerXY2
			isqiye = true;
		} else {
			img1 = 'mx/jjqy/images/peo1_peo_red.png';
			img2 = 'mx/jjqy/images/peo1_text_red.png';
			reapoint = randerXY
		}



		var textPoint = new esri.geometry.Point(reapoint[0], reapoint[1], new esri.SpatialReference({
			wkid : 4326
		}));

		var picSybol = getSybols(null, null, img1, [ 31, 32 ]); //是否要进行计算
		var picSybolOfName = getSybols(null, [ 60, -0 ], img2, [ 85, 30 ]); //需要进行偏移 
		var textSybol = getTextSybol(rtext, [ 60, -5 ]); //需要进行偏移 
		sswzLayer.add(new esri.Graphic(textPoint, picSybol, null, null)); //图片
		sswzLayer.add(new esri.Graphic(textPoint, picSybolOfName, {
			user_name : "_mubiao",
			name : rtext,
			type : 'picSybolOfName'
		}, null)); //名称下的图片图形

		var textsys = new esri.Graphic(textPoint, textSybol, {
			user_name : "_mubiao",
			type : 'picSybolOfName',
			name : rtext,
			type : 'name'
		}, null);
		sswzLayer.add(textsys); //名称
		dojo.mymap.map.centerAndZoom(textPoint, 9);
		//文字图标
		function getTextSybol(text, Offset) {
			// 图标之上放文字
			var color = new dojo.Color('#ffffff');
			var _font = esri.symbol.Font;
			var font = new _font("13px", _font.STYLE_NORMAL,
				_font.VARIANT_NORMAL, _font.WEIGHT_NORMAL,
				"Microsoft YaHei");
			var textsbol = new esri.symbol.TextSymbol(text, font, color);
			textsbol.setOffset(Offset[0], Offset[1]);
			return textsbol;
		}

		function getSybols(angle, Offset, img, hw) {
			var pics = new esri.symbol.PictureMarkerSymbol(img, hw[0], hw[1]);
			angle && pics.setAngle(angle)
			Offset && pics.setOffset(Offset[0], Offset[1]);
			return pics;
		}

		dojo.connect(sswzLayer, 'onClick', function(e) {
			var name = e.graphic.attributes.name;
			var point=e.graphic.geometry;
			dojo.mymap.map.infoWindow.setTitle(name);
			if (isqiye) {
				dojo.mymap.map.infoWindow.setContent("<div>企业名称:"+name+"</div><div>地址：上海市奉贤区东海村路199号</div>");
			} else {
				 dojo.mymap.map.infoWindow.setContent("<div>姓名："+name+"</div><div>手机号：15921663451</div><div>当前坐标："+point.x+" "+point.y+"</div>");
				//dojo.mymap.map.infoWindow.setContent("<div>企业名称:"+name+"</div><div>地址：上海市奉贤区东海村路199号</div>");
			}
			dojo.mymap.map.infoWindow.show(point);
			//map.centerAndZoom(item.geometry, 9);
		});

	}

})