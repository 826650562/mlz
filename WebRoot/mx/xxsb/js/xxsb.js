// JavaScript Document

layui.use(['form','element'], function(){
    var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块
	var form = layui.form();
  //监听导航点击
	element.on('nav(demo)', function(elem){
	  layer.msg(elem.text());
    });
	              
});

  
<!------信息上报未处理信息 弹出框 start------>
	layui.use(['layer','form'], function(){
	  var layer = layui.layer;
	  $('.xxsb_edit').on('click', function(){
	  layer.open({
	  type: 2, 
	  id:'layui-layer1',
	  title :'信息处理',
	  btn: ['保存', '新建标签'],
	  shadeClose: true,
	  shift:-1,
	  btnAlign: 'c',
	  offset: ['80px', '450px'],
	  area: ['350px', '310px'],
	  content: ['mx/xxsb/iframe_xxsb_no.jsp', 'no'],
	  success: function(layero, index){
		 //$("#layui-layer-iframe"+index).contents().find("#xxsb_test").html("");
		 $("#layui-layer-iframe"+index).contents().find("#xxsb_test").append("<input type='checkbox' name='like[write]' id='bqid' title='已处理'>");	
		 $("#layui-layer-iframe"+index)[0].contentWindow.layui.form().render("checkbox");
		   // MXZH.log(layero, index);
		  },
	  yes: function(index, layero){
		    //按钮【按钮一】的回调
		  var r = $("#layui-layer-iframe"+index).contents().find('[id=bqid]');
		  var id_array=new Array();  
		  for(var i=0;i<r.length;i++){
		      if(r[i].checked){
		         id_array.push(r[i].title);
		       }
		    }  
		  var idstr=id_array.join(',');
		  alert(idstr);
		  var ss = $("#layui-layer-iframe"+index).contents().find('.layui-textarea').val();

		  layer.close(index);
		  },
	  btn2: function(index, layero){
		  var self = index;	
		    //按钮【按钮二】的回调
		  layer.prompt({
			  maxlength: 5 ,
			  title: '新建标签',
		  },function(value, index, elem){
			  $("#layui-layer-iframe"+self).contents().find("#xxsb_test").append("<input type='checkbox' name='like[write]' id='bqid' title='"+value+"'>");
			  $("#layui-layer-iframe"+self)[0].contentWindow.layui.form().render("checkbox");
			  // alert(value); //得到value
			  layer.close(index);
			});
		    return false 
		  }
	 
	  });  
      });
	  
	 
      });  
<!------信息上报未处理信息 迹弹出框 end--->

<!------信息上报全部信息 弹出框 start------>
	layui.use('layer', function(){
	  var layer = layui.layer;
	  $('.xxsb_search').on('click', function(){
	  layer.open({
	  type: 2, 
	  title :'搜索查询',
	  id:'layui-layer2',
	  shadeClose: true,
	  btn: ['搜索'],
	  shift:-1,
	  btnAlign: 'c',
	  offset: ['80px', '450px'],
	  area: ['350px', '375px'],
	  content: ['mx/xxsb/iframe_xxsb_all.jsp', 'no'],
	  success: function(layero, index){
		  $("#layui-layer-iframe"+index).contents().find(".bqbox").append("<input type='checkbox' name='like[write]' id='bqid' title='已处理'>");
		  $("#layui-layer-iframe"+index)[0].contentWindow.layui.form().render("checkbox");
		  },
	  yes: function(index, layero){
		    //按钮【按钮一】的回调
		  var r = $("#layui-layer-iframe"+index).contents().find('[id=bqid]');
		  var id_array=new Array();  
		  for(var i=0;i<r.length;i++){
		      if(r[i].checked){
		         id_array.push(r[i].title);
		       }
		    }  
		  var idstr=id_array.join(',');
		  alert(idstr);
		  var sbr = $("#layui-layer-iframe"+index).contents().find("#sbr").val();
		  var sbnr = $("#layui-layer-iframe"+index).contents().find("#sbnr").val();
		  alert(sbr+sbnr);
		  layer.close(index);
		  }
	  });  
      });
	 
      });  
<!------信息上报全部信息 迹弹出框 end--->



<!-----------过多文字隐藏，点击展开-------------->
 $(function(){
        $(".xxsb_box1 ul li,.xxsb_box2 ul li").each(function(){
            var maxwidth=30;//设置最多显示的字数
            var text=$(this).find(".xxsb_p").text();
            if($(this).find(".xxsb_p").text().length>maxwidth){
                $(this).find(".xxsb_p").text($(this).find(".xxsb_p").text().substring(0,maxwidth));
                $(this).find(".xxsb_p").html($(this).find(".xxsb_p").html()+'...');//如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
                $(this).find(".xxsb_p").append("<a href='###' style='color:#417bdc;'>点击展开</a>");
            };
            $(this).find("a").click(function(){
                $(this).parent(".xxsb_p").text(text);//点击“点击展开”，展开全文
            })
        })
    })

