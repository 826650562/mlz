// JavaScript Document

	layui.use('layer', function(){
	  var layers = layui.layer;
	  <!------通知公告弹出框 start------>
	  $('.tzgg_add').on('click', function(){
	  layers.open({
	  content: ['mx/tzgg/iframe_xjgg.jsp', 'no'], 
	  type: 2, 
	  id:'layui-layer',
	  shadeClose: true,
	  btn: ['确定'],
	  btnAlign: 'c',
	  area: ['600px', '415px'],
	  yes: function(index, layero){
		  var tzgg_title = $("#layui-layer-iframe"+index).contents().find("#tzgg_title").val();
		  var tzgg_context = $("#layui-layer-iframe"+index)[0].contentWindow.layui.layedit.getContent(1);
		  if(tzgg_title ==""){
			  layer.msg('标题不能为空！');
			  return false;
		  }
			$.ajax({
				url : "${basePath}/home_addtzgg.action",
				data : {
					tzgg_title : tzgg_title,
					tzgg_context : tzgg_context,
					username : username
				},
				type : "post",
				success : function() {
					  layers.msg('上传成功！');
					  var tzggCF = new MXZH.tzggCF();
						  tzggCF.init();
				},
				error : function() {
					layers.msg('上传失败！');
				}
			});	
			  layers.close(index);
		  },
	  });  
      });
	  <!------通知公告弹出框 end--->
	  
	  <!------删除通知公告 start------>
	  $('.tzgg_del').on('click', function(){
		  var id_array=new Array();  
		  $('input[name="like1[write]"]:checked').each(function(){  
		      id_array.push($(this).attr("id"));//向数组中添加元素  
		  });  
		  var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串 
		  if(idstr ==""){
			  layers.msg('请选择删除的信息！');
			  return false;
		  }
		  $.ajax({
				url : "${basePath}/home_deltzgg.action",
				data : {
					idArray : idstr
				},
				type : "post",
				success : function() {
					 layers.msg('删除成功！');
					 var tzggCF = new MXZH.tzggCF();
					 tzggCF.init();
				},
				error : function() {
					layers.msg('删除失败！');
				}
			});	
	  });
	  <!------删除通知公告 end--->
      });  
<!-----------过多文字隐藏，点击展开-------------->
 $(function(){
        $(".tzgg_box ul li").each(function(){
            var maxwidth=45;//设置最多显示的字数
            var text=$(this).find(".tzgg_cont span").text();
            if($(this).find(".tzgg_cont span").text().length>maxwidth){
                $(this).find(".tzgg_cont span").text($(this).find(".tzgg_cont span").text().substring(0,maxwidth));
                $(this).find(".tzgg_cont span").html($(this).find(".tzgg_cont span").html()+'...');//如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
                $(this).find(".tzgg_cont").append("<a href='###' style='color:#417bdc;'>点击展开</a>");
            };
            $(this).find("a").click(function(){
                $(this).siblings("span").text(text);//点击“点击展开”，展开全文
				$(this).text("");
            })
        })
    })




