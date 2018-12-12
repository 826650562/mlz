// JavaScript Document
 $(function(){
	<!------警戒区域新建 迹弹出框 end--->

		//选项卡切换图标
		$(".layui-tab-title li").click(function(){
			 if($(this).index()==0){
				 $(this).find("img").attr("src","mx/jjqy/images/yj_blue.png");
				 $(this).siblings("li").find("img").attr("src","mx/jjqy/images/guanli_gray.png");
			 }else{
				 $(this).find("img").attr("src","mx/jjqy/images/guanli_blue.png");
				 $(this).siblings("li").find("img").attr("src","mx/jjqy/images/yj_gray.png");
			 }
	    });
		
		
    })

