// JavaScript Document

layui.use(['form','upload','element'], function(){
    var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块
	var form = layui.form();
  //监听导航点击
	element.on('nav(demo)', function(elem){
	  layer.msg(elem.text());
    });
	layui.upload({
    url: '' //上传接口
    ,success: function(res){ //上传成功后的回调
    	MXZH.log(res)
    }
  });
  
	              
});



<!------警戒区域新建 弹出框 start------>
	layui.use('layer', function(){
	  var layer = layui.layer;
	  $('.jjqy_search').on('click', function(){
	  layer.open({
	  type: 2, 
	  shade: 0,
	  title :'新建警戒区',
	  btn: ['确定','取消'],
	  shift:-1,
	  btnAlign: 'c',
	  offset: ['80px', '450px'],
	  area: ['350px', '465px'],
	  content: ['iframe_jjqy_add.html', 'no'] 
	  });  
      });
	  
	 
      });  
<!------警戒区域新建 迹弹出框 end--->



 $(function(){
		
		//选项卡切换图标
		$(".layui-tab-title li").click(function(){
			 if($(this).index()==0){
				 $(this).find("img").attr("src","gkrw/images/rwcx_blue.png");
				 $(this).siblings("li").find("img").attr("src","gkrw/images/rwxz_gray.png");
			 }else{
				 $(this).find("img").attr("src","gkrw/images/rwxz_blue.png");
				 $(this).siblings("li").find("img").attr("src","gkrw/images/rwcx_gray.png");
			 }
	    });
    })

