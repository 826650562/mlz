var isInitTag=false;
$(function() {
	initlbs();
	$("#lbs").hover(function() {
		$(".demo").css("display", "block");
	}, function() {
		$(".demo").css("display", "none");
		initlbs();
	});
});
function initlbs() {
	$.ajax({
		url : "${basePath}/home_querylbs.action",
		type : "post",
		async : false,
		success : function(msg) {
			if(!isInitTag){
				$(".single-slider").attr("value", msg);
				initjRange();
				isInitTag=true;	
			}else{
				$('.single-slider').jRange('setValue', msg);
			}
		},
		error : function(error) {
			throw ('数据请求失败！');
		}
	});

}
function initjRange() {
	$('.single-slider').jRange({
		from : 1,
		to : 30,
		step : 1,
		scale : [ 1, 10, 20, 30 ],
		format : '%s',
		width : 165,
		showLabels : true,
		showScale : true
	});
}