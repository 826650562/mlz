/**
 *
 * @authors Steve Chan (you@example.org)
 * @date    2017-06-08 10:09:00
 * @version $Id$
 */

/**
 * 自定义layui控件
 */
layui.define(function(exports) {
	exports('yydj_status', function(opt) {
		var ht = "";
		var chrome_extensions = "audioVideo_" + opt.uid;
		if (opt.type == "user" || window.parent.CallMode == "p2p") { //普通用户没有逐出按键
			ht = "<div uid='" + opt.uid + "' id='user_" + opt.uid + "' class='yyhjBoxListItem'>" +
					"<div class='yyhjListTitle'>" +
					"</div>" +
					"<div class='yyhjListMain'>" +
						"<div id='ocx_video' style='display: block'>" +
							"<div id = '" + chrome_extensions + "'></div>" +
						"</div>" +
						"<div id='yyhjListimgBox' class='yyhjListimgBoxBlue' style='display: block' >" +
							"<div class='yyhjListImg'><img src='images/yyhjdefaulthead.png'></div>" +
							"<div id='yyhjListNameBg' class='yyhjListNameBgBlue'>正在连接</div>" +
						"</div>" +
					"</div>" +
					"<div id='yyhjListBottom' class='yyhjListBottomGray'>" +
						"<div id='yyhjBgName' class='yyhjGrayBgName'>" + opt.name + "</div>" +
					"</div>" +
				"</div>";
		} else if (opt.type == "creator" || opt.type == "admin" || window.parent.CallMode == "group") { //管理员和创建者可以逐出用户
			ht = "<div  uid='" + opt.uid + "' id='user_" + opt.uid + "' class='yyhjBoxListItem'>" +
					"<div class='yyhjListTitle'>" +
						"<div id='" + opt.uid + "' class='yyhjListTitleClose' del='" + opt.id + "' uname='" + opt.name + "'><img src='images/itemcolse.png' width='35' height='25'></div>" +
					"</div>" +
					"<div class='yyhjListMain'>" +
						"<div id='ocx_video' style='display: block'>" +
							"<div id = '" + chrome_extensions + "'></div>" +
						"</div>" +
						"<div id='yyhjListimgBox' class='yyhjListimgBoxBlue' style='display: block' >" +
							"<div class='yyhjListImg'><img src='images/yyhjdefaulthead.png'></div>" +
							"<div id='yyhjListNameBg' class='yyhjListNameBgBlue'>正在连接</div>" +
						"</div>" +
					"</div>" +
					"<div id='yyhjListBottom' class='yyhjListBottomGray'>" +
						"<div id='yyhjBgName' class='yyhjGrayBgName'>" + opt.name + "</div>" +
					"</div>" +
				"</div>";
		}
		//追加用户窗口
		$("#test").append(ht);
		
		//用户窗口添加音视频插件
		var naclModule = "<embed name='nacl_module' class='nacl_module' id='nacl_module' width='148' height='110' path='pnacl/Release' src='pnacl/Release/media_stream_audio.nmf' type='application/x-pnacl'>"
		$("#" + chrome_extensions).append(naclModule);
	});
});