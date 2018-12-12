/**
 * TODO 废弃forcusInsert函数以及相关功能<br/>    
 */
layui.define([ 'layer', 'laytpl', 'upload_mlight' ], function(exports) {

	var v = '3.6.0 Pro';
	var $ = layui.jquery;
	var layer = layui.layer;
	var laytpl = layui.laytpl;
	var device = layui.device();

	var SHOW = 'layui-show',
		THIS = 'layim-this',
		MAX_ITEM = 200;
	var recorder;
	var tag = false;
	var t;
	//回调
	var call = {};

	//对外API
	var LAYIM = function() {
		this.v = v;
		$('body').on('click', '*[layim-event]', function(e) {
			var othis = $(this),
				methid = othis.attr('layim-event');
			events[methid] ? events[methid].call(this, othis, e) : '';
		});

		// by ddl007@2017-09-07 解决图片拖拽问题
		document.addEventListener("dragover", function(event) {
			event.preventDefault();
		});
	};

	/**
	 * 根据传入的用户名，打开对应的会话窗口
	 * */
	LAYIM.popFriend = function(mUsername){
		$(".layim-list-friend .layim-friend"+mUsername).trigger("click");
	};
	
	var sendStatus = [ "sending", "sendSuc", "sendFail" ]; // 发送状态

	/**
	 * 判断是否为当前会话
	 * */
	function isCurChat(curChat, msgIndex) {
		return (curChat.data.type == msgIndex[0] && curChat.data.id == msgIndex[1]);
	}

	/**
	 * 标记消息发送记录为发送失败
	 * */
	LAYIM.prototype.setMsgSendFail = function(msgIndex) {
		var idObj = { // layIm下的消息索引
			type : msgIndex[0],
			id : msgIndex[1],
			timestamp : msgIndex[2],
			status : sendStatus[2] // 发送失败
		};
		updChatlog(idObj);

		var thatChat = thisChat();
		if (thatChat && isCurChat(thatChat, msgIndex)) { // 如果当前处于该会话下,则更新UI
			var ul = thatChat.elem.find('.layim-chat-main ul');
			var li = ul.find("li[data-cid='" + msgIndex[2] + "']"); // 找到对应li
			var newHtml = laytpl(elemChatSendFail).render(idObj); // 绑定重发事件
			li.find("i.layim-chatmsg-sendstatus").replaceWith(newHtml); // 替换i标签内容	
		}
	};

	/**
	 * 标记消息发送记录为发送中,消息发送默认状态<br/>
	 * */
	LAYIM.prototype.setMsgSending = function(msgIndex) {
		updChatlog({
			type : msgIndex[0],
			id : msgIndex[1],
			timestamp : msgIndex[2],
			status : sendStatus[0] // 发送中
		});

		// 替换标示内容
		var thatChat = thisChat();
		if (thatChat) { // 如果当前处于该会话下,则更新UI
			var ul = thatChat.elem.find('.layim-chat-main ul');
			var li = ul.find("li[data-cid='" + msgIndex[2] + "']"); // 找到对应li
			li.find("i.layim-chatmsg-sendstatus").replaceWith('<i class="layui-icon layim-chatmsg-sendstatus"><image src="images/icon/loading.gif" width="20" height="20"></image></i>'); // 发送中
		}
	};

	/**
	 * 标记消息发送记录为发送成功<br/>
	 * */
	LAYIM.prototype.setMsgSendSuc = function(msgIndex) {
		// 标记消息发送记录为发送成功
		updChatlog({
			type : msgIndex[0],
			id : msgIndex[1],
			timestamp : msgIndex[2],
			status : sendStatus[1] // 发送成功
		});

		var thatChat = thisChat();
		if (thatChat) { // 如果当前处于该会话下,则更新UI
			var ul = thatChat.elem.find('.layim-chat-main ul');
			var li = ul.find("li[data-cid='" + msgIndex[2] + "']"); // 找到对应li
			li.find("i.layim-chatmsg-sendstatus").remove(); // 删除i标签
		}
	};

	//基础配置
	LAYIM.prototype.config = function(options) {
		var skin = [];
		layui.each(Array(5), function(index) {
			skin.push(layui.cache.dir + 'css/modules/layim/skin/' + (index + 1) + '.jpg')
		});
		options = options || {};
		options.skin = options.skin || [];
		layui.each(options.skin, function(index, item) {
			skin.unshift(item);
		});
		options.skin = skin;
		options = $.extend({
			isfriend : !0,
			isgroup : !0,
			voice : 'default.mp3'
		}, options);
		if (!window.JSON || !window.JSON.parse) return;
		init(options);
		return this;
	};

	//监听事件
	LAYIM.prototype.on = function(events, callback) {
		if (typeof callback === 'function') {
			call[events] ? call[events].push(callback) : call[events] = [ callback ];
		}
		return this;
	};

	//获取所有缓存数据
	LAYIM.prototype.cache = function() {
		return cache;
	};

	// 设置当前用户状态
	LAYIM.prototype.setMineStatus = function(type) {
		var anim = 'layui-anim-upbit';
		var othis = $(".layui-layim-status li[lay-type='" + type + "']");
		var hide = function() {
			othis.next().hide().removeClass(anim);
		};
		var type = othis.attr('lay-type');
		if (type === 'show') {
			stope(e);
			othis.next().show().addClass(anim);
		} else {
			var prev = othis.parent().prev();
			othis.addClass(THIS).siblings().removeClass(THIS);
			prev.html(othis.find('cite').html());
			prev.removeClass('layim-status-' + (type === 'online' ? 'hide' : 'online'))
				.addClass('layim-status-' + type);
		}
	};

	//打开一个自定义的会话界面
	LAYIM.prototype.chat = function(data) {
		if (!window.JSON || !window.JSON.parse) return;
		return popchat(data), this;
	};

	//设置聊天界面最小化
	LAYIM.prototype.setChatMin = function() {
		return setChatMin(), this;
	};

	//设置当前会话状态
	LAYIM.prototype.setChatStatus = function(str) {
		var thatChat = thisChat();
		if (!thatChat) return;
		var status = thatChat.elem.find('.layim-chat-status');
		return status.html(str), this;
	};

	//接受消息
	LAYIM.prototype.getMessage = function(data) {
		return getMessage(data), this;
	};

	//桌面消息通知
	LAYIM.prototype.notice = function(data) {
		return notice(data), this;
	};

	//打开添加好友/群组面板
	LAYIM.prototype.add = function(data) {
		return popAdd(data), this;
	};

	//好友分组面板
	LAYIM.prototype.setFriendGroup = function(data) {
		return popAdd(data, 'setGroup'), this;
	};

	//消息盒子的提醒
	LAYIM.prototype.msgbox = function(nums) {
		return msgbox(nums), this;
	};

	//添加好友/群
	LAYIM.prototype.addList = function(data) {
		return addList(data), this;
	};

	//删除好友/群
	LAYIM.prototype.removeList = function(data) {
		return removeList(data), this;
	};

	//获取用户通讯录来转换username和avater
	LAYIM.prototype.getAllList = function() {
		return cache.friend;
	}

	//增加新的用户
	LAYIM.prototype.addFriend = function(user, groupId, groupName) {
		var friend = cache.friend,
			fgroup = null;
		for (var i = 0; i < friend.length; i++) {
			if (friend[i].id === groupId) {
				fgroup = friend[i];
				break;
			}
		}

		if (fgroup === null) { // 该群组不存在
			fgroup = {
				id : groupId,
				groupname : groupName,
				list : []
			};
			friend.push(fgroup); // 加入到目标位置
		}

		fgroup.list.push(user); // 加入目标群组
	}

	//设置好友在线/离线状态
	LAYIM.prototype.setFriendStatus = function(id, type) {
		var list = $('.layim-friend' + id);
		list[type === 'online' ? 'removeClass' : 'addClass']('layim-list-gray');
	};

	//解析聊天内容
	LAYIM.prototype.content = function(type, content) {
		return layui.data.content(type, content);
	};


	//主模板
	var listTpl = function(options) {
		var nodata = {
			friend : "该分组下暂无好友",
			group : "暂无群组",
			history : "暂无历史会话"
		};

		options = options || {};
		options.item = options.item || ('d.' + options.type);

		return [ '{{# var length = 0; layui.each(' + options.item + ', function(i, data){ length++; }}', '<li layim-event="chat" data-type="' + options.type + '" data-index="{{ ' + (options.index || 'i') + ' }}" class="layim-' + (options.type === 'history' ? '{{i}}' : options.type + '{{data.id}}') + ' {{ data.status === "offline" ? "layim-list-gray" : "" }}"><img src="{{ data.avatar }}"><span>{{ data.username||data.groupname||data.name||"佚名" }}</span><p>{{ data.remark||data.sign||"" }}</p><span class="layim-msg-status"></span></li>', '{{# }); if(length === 0){ }}', '<li class="layim-null">' + (nodata[options.type] || "暂无数据") + '</li>', '{{# } }}' ].join('');
	};

	var elemTpl = [ '<div class="layui-layim-main">', '<div class="layui-layim-info">', '<div class="layui-layim-user">{{ d.mine.username }}</div>', '<div class="layui-layim-status">', '{{# if(d.mine.status === "online"){ }}', '<span class="layui-icon layim-status-online" layim-event="status" lay-type="show">&#xe617;</span>', '{{# } else if(d.mine.status === "hide") { }}', '<span class="layui-icon layim-status-hide" layim-event="status" lay-type="show">&#xe60f;</span>', '{{# } }}', '<ul class="layui-anim layim-menu-box">', '<li {{d.mine.status === "online" ? "class=layim-this" : ""}} layim-event="status" lay-type="online"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-online">&#xe617;</cite>在线</li>', '<li {{d.mine.status === "hide" ? "class=layim-this" : ""}} layim-event="status" lay-type="hide"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-hide">&#xe60f;</cite>离线</li>', '</ul>', '</div>', '<input class="layui-layim-remark" placeholder="编辑签名" value="{{ d.mine.remark||d.mine.sign||"" }}">', '</div>', '<ul class="layui-unselect layui-layim-tab{{# if(!d.base.isfriend || !d.base.isgroup){ }}', ' layim-tab-two', '{{# } }}">', '<li class="layui-icon', '{{# if(!d.base.isfriend){ }}', ' layim-hide', '{{# } else { }}', ' layim-this', '{{# } }}', '" title="联系人" layim-event="tab" lay-type="friend">&#xe612;</li>', '<li class="layui-icon', '{{# if(!d.base.isgroup){ }}', ' layim-hide', '{{# } else if(!d.base.isfriend) { }}', ' layim-this', '{{# } }}', '" title="群组" layim-event="tab" lay-type="group">&#xe613;</li>', '<li class="layui-icon" title="历史会话" layim-event="tab" lay-type="history">&#xe611;</li>', '</ul>', '<ul class="layui-unselect layim-tab-content {{# if(d.base.isfriend){ }}layui-show{{# } }} layim-list-friend">', '{{# layui.each(d.friend, function(index, item){ var spread = d.local["spread"+index]; }}', '<li>', '<h5 layim-event="spread" lay-type="{{ spread }}"><i class="layui-icon">{{# if(spread === "true"){ }}&#xe61a;{{# } else {  }}&#xe602;{{# } }}</i><span>{{ item.groupname||"未命名分组"+index }}</span><em>(<cite class="layim-count"> {{ (item.list||[]).length }}</cite>)</em></h5>', '<ul class="layui-layim-list {{# if(spread === "true"){ }}', ' layui-show', '{{# } }}">', listTpl({
		type : "friend",
		item : "item.list",
		index : "index"
	}), '</ul>', '</li>', '{{# }); if(d.friend.length === 0){ }}', '<li><ul class="layui-layim-list layui-show"><li class="layim-null">暂无联系人</li></ul>', '{{# } }}', '</ul>', '<ul class="layui-unselect layim-tab-content {{# if(!d.base.isfriend && d.base.isgroup){ }}layui-show{{# } }}">', '<li>', '<ul class="layui-layim-list layui-show layim-list-group">', listTpl({
		type : 'group'
	}), '</ul>', '</li>', '</ul>', '<ul class="layui-unselect layim-tab-content  {{# if(!d.base.isfriend && !d.base.isgroup){ }}layui-show{{# } }}">', '<li>', '<ul class="layui-layim-list layui-show layim-list-history">', listTpl({
		type : 'history'
	}), '</ul>', '</li>', '</ul>', '<ul class="layui-unselect layim-tab-content">', '<li>', '<ul class="layui-layim-list layui-show" id="layui-layim-search"></ul>', '</li>', '</ul>', '<ul class="layui-unselect layui-layim-tool">', '<li class="layui-icon layim-tool-search" layim-event="search" title="搜索">&#xe615;</li>', '{{# if(d.base.msgbox){ }}', '<li class="layui-icon layim-tool-msgbox" layim-event="msgbox" title="消息盒子">&#xe645;<span class="layui-anim"></span></li>', '{{# } }}', '{{# if(d.base.find){ }}', '<li class="layui-icon layim-tool-find" layim-event="find" title="查找">&#xe608;</li>', '{{# } }}', '{{# if(!d.base.copyright){ }}', '<li class="layui-icon layim-tool-about" layim-event="about" title="关于">&#xe60b;</li>', '{{# } }}', '</ul>', '<div class="layui-layim-search"><input><label class="layui-icon" layim-event="closeSearch">&#x1007;</label></div>', '</div>' ].join('');

	//换肤模版
	var elemSkinTpl = [ '<ul class="layui-layim-skin">', '{{# layui.each(d.skin, function(index, item){ }}', '<li><img layim-event="setSkin" src="{{ item }}"></li>', '{{# }); }}', '<li layim-event="setSkin"><cite>简约</cite></li>', '</ul>' ].join('');

	//聊天主模板 '<span class="layui-icon layim-tool-face" title="选择表情" layim-event="face">&#xe60c;</span>'
	var elemChatTpl = [ '<div class="layim-chat layim-chat-{{d.data.type}}{{d.first ? " layui-show" : ""}}">', '<div class="layui-unselect layim-chat-title">', '<div class="layim-chat-other">', '<img class="layim-{{ d.data.type }}{{ d.data.id }}" src="{{ d.data.avatar }}"><span class="layim-chat-username" layim-event="{{ d.data.type==="group" ? "groupMembers" : "" }}">{{ d.data.name||d.data.username }} {{d.data.temporary ? "<cite>临时会话</cite>" : ""}} {{# if(d.data.type==="group"){ }} <em class="layim-chat-members"></em><i class="layui-icon">&#xe61a;</i> {{# } }}</span>', '<p class="layim-chat-status"></p>', "</div>", "</div>", '<div class="layim-chat-main">', "<ul></ul>", "</div>", '<div class="layim-chat-footer">', '<div class="layui-unselect layim-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">', "{{# if(d.base && d.base.uploadImage){ }}", '<span class="layui-icon layim-tool-image" title="上传图片" layim-event="image">&#xe60d;<input type="file" name="file"></span>', "{{# }; }}", "{{# if(d.base && d.base.isAudio){ }}", '<span class="layui-icon layim-tool-audio" title="发送短语音消息" layim-event="media" data-action="start" data-type="audio">&#xe6fc;</span>', "{{# }; }}", "{{# layui.each(d.base.tool, function(index, item){ }}", '<span class="layui-icon layim-tool-{{item.alias}}" title="{{item.title}}" layim-event="extend" lay-filter="{{ item.alias }}">{{item.icon}}</span>', "{{# }); }}", "{{# if(d.base && d.base.chatLog){ }}", '<span class="layim-tool-log" layim-event="chatLog"><i class="layui-icon">&#xe60e;</i>聊天记录</span>', "{{# }; }}", "</div>", '<div class="getAudio" style="display:none;" class="luyinbox"><div class="luyinGif"><img src="mx/public/images/luyinxtb.gif" width="10" height="10" /></div><div class="luyinon _recorder_temp"></div>' + '<div class="luyinbtnBox"> <button class="luyinbtn" layim-event="media" data-action="send">发送</button><button class="quxiaobtn" layim-event="media" data-action="stop">取消</button></div></div>  <div class="layim-chat-textarea"><textarea></textarea></div>', '<div class="layim-chat-bottom">', '<div class="layim-chat-send">', "{{# if(!d.base.brief){ }}", "{{# } }}", '<span class="layim-send-btn" layim-event="send">发送</span>', '<span class="layim-send-set" layim-event="setSend" lay-type="show"><em class="layui-edge"></em></span>', '<ul class="layui-anim layim-menu-box">', '<li {{d.local.sendHotKey !== "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend" lay-type="Enter"><i class="layui-icon">&#xe618;</i>按Enter键发送消息</li>', '<li {{d.local.sendHotKey === "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend"  lay-type="Ctrl+Enter"><i class="layui-icon">&#xe618;</i>按Ctrl+Enter键发送消息</li>', "</ul>", "</div>", "</div>", "</div>", "</div>" ].join("");

	//添加好友群组模版
	var elemAddTpl = [ '<div class="layim-add-box">', '<div class="layim-add-img"><img class="layui-circle" src="{{ d.data.avatar }}"><p>{{ d.data.name||"" }}</p></div>', '<div class="layim-add-remark">', '{{# if(d.data.type === "friend" && d.type === "setGroup"){ }}', '<p>选择分组</p>', '{{# } if(d.data.type === "friend"){ }}', '<select class="layui-select" id="LAY_layimGroup">', '{{# layui.each(d.data.group, function(index, item){ }}', '<option value="{{ item.id }}">{{ item.groupname }}</option>', '{{# }); }}', '</select>', '{{# } }}', '{{# if(d.data.type === "group"){ }}', '<p>请输入验证信息</p>', '{{# } if(d.type !== "setGroup"){ }}', '<textarea id="LAY_layimRemark" placeholder="验证信息" class="layui-textarea"></textarea>', '{{# } }}', '</div>', '</div>' ].join('');
	var elemChatSending = '<i class="layui-icon layim-chatmsg-sendstatus"><image src="images/icon/loading.gif" width="20" height="20"></image></i>';
	var elemChatSendFail = '<i class="layui-icon layim-chatmsg-sendstatus layim-resend" title="点击重发" layim-event="resend" layim-type="{{ d.type }}" layim-id="{{ d.id }}"  layim-ts="{{ d.timestamp }}">&#xe609;</i>';

	//聊天内容列表模版
	var elemChatMain = [ '<li {{ d.mine ? "class=layim-chat-mine" : "" }}  {{# if(d.mine){ }}data-cid="{{ d.cid }}"{{# } }}>', '<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>', '{{# if(d.mine){ }}', '<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}', '{{# } else { }}', '{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>', '{{# } }}', '</cite></div>', '<div class="layim-chat-text">{{ layui.data.content(d.msgType, (d.content||"&nbsp") ) }}',
		'{{ d.mine ? d.statusHtml : "" }}</div>', '</li>' ].join('');

	var elemChatList = '<li class="layim-{{ d.data.type }}{{ d.data.id }} layim-chatlist-{{ d.data.type }}{{ d.data.id }} layim-this" layim-event="tabChat"><img src="{{ d.data.avatar }}"><span>{{ d.data.name || d.data.username }}</span>{{# if(!d.base.brief){ }}<i class="layui-icon" layim-event="closeChat">&#x1007;</i>{{# } }}</li>';

	//补齐数位
	var digit = function(num) {
		return num < 10 ? '0' + (num | 0) : num;
	};

	//转换时间
	layui.data.date = function(timestamp) {
		var d = new Date(timestamp || new Date());
		return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate()) +
			' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds());
	};

	var imgTpl = '<img class="layui-layim-photos" style="cursor:pointer;" title="双击查看大图" data-big="{{ d.decrypt }}" width="120" src="{{ d.decrypt }}">';
	var audioTpl = '<div class="layui-unselect layui-layim-audio" layim-event="playAudio"  data-duration="{{ d.duration }}" data-src="{{ d.decrypt }}"><div style="width:{{ (d.duration / 30 * 300) + 47 }}px;height:25px;"><div class="layim-audio-player"></div><span class="layim-audio-duration">{{ d.duration }}\'\'</span></div>';
	var videoTpl = '<div class="layui-unselect layui-layim-video" layim-event="playVideo" data-src="{{ d.decrypt }}"><img title="点击查看视频" src="{{ IM.accessUrl }}{{ d.thumbnail }}" class="layim-video-thumbnail"/><i class="layui-icon">&#xe652;</i></div>';
	var locationTpl = '<div class="layui-unselect layui-layim-location" layim-event="openLocation" data-txt="{{ d.address }}" data-src="{{ d.baseUrl }}?latitude={{ d.latitude }}&longitude={{ d.longitude  }}"><img title="点击打开地图" src="{{ IM.accessUrl }}{{ d.thumbnail }}"/><div>{{ d.address }}</div></div>';

	layui.data.content = function(type, content) {
		var msgType = IMClient.MsgChatType;
		var renderCtn = IMClientPortal.toLayImContent(type, content);
		var result = "";
		switch (type) {
		case msgType.MSG_TYPE_TEXT: // 文字
			result = renderCtn;
			break;
		case msgType.MSG_TYPE_IMAGE: // 图片
			result = laytpl(imgTpl).render(renderCtn);
			break;
		case msgType.MSG_TYPE_AUDIO: // 语音
			result = laytpl(audioTpl).render(renderCtn);
			break;
		case msgType.MSG_TYPE_VIDEO: // 视频
			result = laytpl(videoTpl).render(renderCtn);
			break;
		case msgType.MSG_TYPE_LOCATION: // 位置
			result = laytpl(locationTpl).render(renderCtn);
			break;
		}

		return result;
	}

	//转换内容
	layui.data._content = function(content) {
		//支持的html标签
		var html = function(end) {
			return new RegExp('\\<n></n>*\\[' + (end || '') + '(pre|div|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
		};
		content = (content || '')
			.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/'/g, '&#39;')
			.replace(/"/g, '&quot;') //XSS
			.replace(html(), '\<$1 $2\>')
			.replace(html('/'), '\</$1\>') //转移HTML代码
			.replace(/\n/g, '<br>') //转义换行

		return content;
	};


	//Ajax
	var post = function(options, callback, tips) {
		options = options || {};
		return $.ajax({
			url : options.url,
			type : options.type || 'get',
			data : options.data,
			dataType : options.dataType || 'json',
			cache : false,
			success : function(res) {
				res.code == 0 ?
					callback && callback(res.data || {}) :
					layer.msg(res.msg || ((tips || 'Error') + ': LAYIM_NOT_GET_DATA'), {
						time : 5000
					});
			},
			error : function(err, msg) {
				window.console && MXZH.log && MXZH.errorLog('LAYIM_DATE_ERROR：' + msg);
			}
		});
	};

	//处理初始化信息
	var cache = {
			message : {},
			chat : []
		},
		init = function(options) {
			var init = options.init || {}
			mine = init.mine || {}, local = layui.data('layim')[mine.id] || {}, obj = {
				base : options,
				local : local,
				mine : mine,
				history : local.history || {}
			}, create = function(data) {
				var mine = data.mine || {};
				var local = layui.data('layim')[mine.id] || {},
					obj = {
						base : options, //基础配置信息
						local : local, //本地数据
						mine : mine, //我的用户信息
						friend : data.friend || [], //联系人信息
						group : data.group || [], //群组信息
						history : local.history || {} //历史会话信息
					};
				cache = $.extend(cache, obj);
				popim(laytpl(elemTpl).render(obj));
				if (local.close || options.min) {
					popmin();
				}
				layui.each(call.ready, function(index, item) {
					item && item(obj);
				});
			};
			cache = $.extend(cache, obj);
			if (options.brief) {
				return layui.each(call.ready, function(index, item) {
					item && item(obj);
				});
			}
			;
			init.url ? post(init, create, 'INIT') : create(init);
		};

	//显示主面板
	var layimMain,
		popim = function(content) {
			return layer.open({
				type : 1,
				area : [ '260px', '520px' ],
				skin : 'layui-box layui-layim',
				title : '&#8203;',
				offset : 'rb',
				id : 'layui-layim',
				shade : false,
				anim : 2,
				resize : false,
				content : content,
				success : function(layero) {
					layimMain = layero;

					setSkin(layero);

					if (cache.base.right) {
						layero.css('margin-left', '-' + cache.base.right);
					}
					if (layimClose) {
						layer.close(layimClose.attr('times'));
					}

					//按最新会话重新排列
					var arr = [],
						historyElem = layero.find('.layim-list-history');
					historyElem.find('li').each(function() {
						arr.push($(this).prop('outerHTML'))
					});
					if (arr.length > 0) {
						arr.reverse();
						historyElem.html(arr.join(''));
					}

					banRightMenu();
					events.sign();
				},
				cancel : function(index) {
					popmin();
					var local = layui.data('layim')[cache.mine.id] || {};
					local.close = true;
					layui.data('layim', {
						key : cache.mine.id,
						value : local
					});
					return false;
				}
			});
		};

	//屏蔽主面板右键菜单
	var banRightMenu = function() {
		layimMain.on('contextmenu', function(event) {
			event.cancelBubble = true
			event.returnValue = false;
			return false;
		});

		var hide = function() {
			layer.closeAll('tips');
		};

		//自定义历史会话右键菜单
		layimMain.find('.layim-list-history').on('contextmenu', 'li', function(e) {
			var othis = $(this);
			var html = '<ul data-id="' + othis[0].id + '" data-index="' + othis.data('index') + '"><li layim-event="menuHistory" data-type="one">移除该会话</li><li layim-event="menuHistory" data-type="all">清空全部会话列表</li></ul>';

			if (othis.hasClass('layim-null')) return;

			layer.tips(html, this, {
				tips : 1,
				time : 0,
				anim : 5,
				fixed : true,
				skin : 'layui-box layui-layim-contextmenu',
				success : function(layero) {
					var stopmp = function(e) {
						stope(e);
					};
					layero.off('mousedown', stopmp).on('mousedown', stopmp);
				}
			});
			$(document).off('mousedown', hide).on('mousedown', hide);
			$(window).off('resize', hide).on('resize', hide);

		});
	}

	//主面板最小化状态
	var layimClose,
		popmin = function(content) {
			if (layimClose) {
				layer.close(layimClose.attr('times'));
			}
			if (layimMain) {
				layimMain.hide();
			}
			cache.mine = cache.mine || {};
			return layer.open({
				type : 1,
				title : false,
				id : 'layui-layim-close',
				skin : 'layui-box layui-layim-min layui-layim-close',
				shade : false,
				closeBtn : false,
				anim : 2,
				offset : 'rb',
				resize : false,
				content : '<img src="' + (cache.mine.avatar || (layui.cache.dir + 'images/tx.png')) + '"><span>' + (content || cache.base.title || '即时消息') + '</span>',
				move : '#layui-layim-close img',
				success : function(layero, index) {
					layimClose = layero;
					if (cache.base.right) {
						layero.css('margin-left', '-' + cache.base.right);
					}
					layero.on('click', function() {
						layer.close(index);
						layimMain.show();
						var local = layui.data('layim')[cache.mine.id] || {};
						delete local.close;
						layui.data('layim', {
							key : cache.mine.id,
							value : local
						});
					});
				}
			});
		};

	//显示聊天面板
	var layimChat,
		layimMin,
		chatIndex,
		To = {},
		popchat = function(data) {
			data = data || {};

			var chat = $('#layui-layim-chat'),
				render = {
					data : data,
					base : cache.base,
					local : cache.local
				};

			if (!data.id) {
				return layer.msg('非法用户');
			}else if(data.id == cache.mine.id){
				return layer.msg('抱歉,系统不支持与自己对话!');
			}

			if (chat[0]) {
				var list = layimChat.find('.layim-chat-list');
				var listThat = list.find('.layim-chatlist-' + data.type + data.id);
				var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');
				var chatBox = chat.children('.layim-chat-box');

				//如果是最小化，则还原窗口
				if (layimChat.css('display') === 'none') {
					layimChat.show();
				}

				if (layimMin) {
					layer.close(layimMin.attr('times'));
				}

				//如果出现多个聊天面板
				if (list.find('li').length === 1 && !listThat[0]) {
					hasFull || layimChat.css('width', 800);
					list.css({
						height : layimChat.height()
					}).show();
					chatBox.css('margin-left', '200px');
				}

				//打开的是非当前聊天面板，则新增面板
				if (!listThat[0]) {
					list.append(laytpl(elemChatList).render(render));
					chatBox.append(laytpl(elemChatTpl).render(render));
					syncGray(data);
					resizeChat();
				}

				changeChat(list.find('.layim-chatlist-' + data.type + data.id));
				listThat[0] || viewChatlog();
				setHistory(data);
				hotkeySend();

				return chatIndex;
			}

			render.first = !0;

			var index = chatIndex = layer.open({
				type : 1,
				area : '600px',
				skin : 'layui-box layui-layim-chat',
				id : 'layui-layim-chat',
				title : '&#8203;',
				shade : false,
				maxmin : true,
				offset : data.offset || 'auto',
				anim : data.anim || 0,
				closeBtn : cache.base.brief ? false : 1,
				content : laytpl('<ul class="layui-unselect layim-chat-list">' + elemChatList + '</ul><div class="layim-chat-box">' + elemChatTpl + '</div>').render(render),
				success : function(layero) {
					layimChat = layero;

					layero.css({
						'min-width' : '500px',
						'min-height' : '420px'
					});

					syncGray(data);

					typeof data.success === 'function' && data.success(layero);

					hotkeySend();
					setSkin(layero);
					setHistory(data);

					viewChatlog();
					showOffMessage();

					//聊天窗口的切换监听
					layui.each(call.chatChange, function(index, item) {
						item && item(thisChat());
					});

					//查看大图
					layero.on('dblclick', '.layui-layim-photos', function() {
						var src = $(this).data("big");
						layer.close(popchat.photosIndex);
						layer.photos({
							photos : {
								data : [ {
									"alt" : "大图模式",
									"src" : src
								} ]
							},
							shade : 0.01,
							closeBtn : 2,
							anim : 0,
							resize : false,
							success : function(layero, index) {
								popchat.photosIndex = index;
							}
						});
					});
				},
				full : function(layero) {
					layer.style(index, {
						width : '100%',
						height : '100%'
					}, true);
					resizeChat();
				},
				resizing : resizeChat,
				restore : resizeChat,
				min : function() {
					setChatMin();
					return false;
				},
				end : function() {
					layer.closeAll('tips');
					clearInterval(t);
					recorder && recorder.stop();
					if (recorder) {
						recorder.clear();
					}
					tag = false;
					layimChat = null;
				}
			});
			return index;
		};

	//同步置灰状态
	var syncGray = function(data) {
		$('.layim-' + data.type + data.id).each(function() {
			if ($(this).hasClass('layim-list-gray')) {
				layui.layim.setFriendStatus(data.id, 'offline');
			}
		});
	};

	//重置聊天窗口大小
	var resizeChat = function() {
		var list = layimChat.find('.layim-chat-list'),
			chatMain = layimChat.find('.layim-chat-main'),
			chatHeight = layimChat.height();
		list.css({
			height : chatHeight
		});
		chatMain.css({
			height : chatHeight - 20 - 80 - 158
		})
	};

	//设置聊天窗口最小化 & 新消息提醒
	var setChatMin = function(newMsg) {
		var thatChat = newMsg || thisChat().data,
			base = layui.layim.cache().base;
		if (layimChat && !newMsg) {
			layimChat.hide();
		}
		layer.close(setChatMin.index);
		setChatMin.index = layer.open({
			type : 1,
			title : false,
			skin : 'layui-box layui-layim-min',
			shade : false,
			closeBtn : false,
			anim : thatChat.anim || 2,
			offset : 'b',
			move : '#layui-layim-min',
			resize : false,
			area : [ '182px', '50px' ],
			content : '<img id="layui-layim-min" src="' + thatChat.avatar + '"><span>' + thatChat.name + '</span>',
			success : function(layero, index) {
				if (!newMsg)
					layimMin = layero;

				if (base.minRight) {
					layer.style(index, {
						left : $(window).width() - layero.outerWidth() - parseFloat(base.minRight)
					});
				}

				layero.find('.layui-layer-content span').on('click', function() {
					layer.close(index);
					newMsg ? layui.each(cache.chat, function(i, item) {
						popchat(item);
					}) : layimChat.show();
					if (newMsg) {
						cache.chat = [];
						chatListMore();
					}
				});
				layero.find('.layui-layer-content img').on('click', function(e) {
					stope(e);
				});
			}
		});
	};

	//打开添加好友、群组面板、好友分组面板
	var popAdd = function(data, type) {
		data = data || {};
		layer.close(popAdd.index);
		return popAdd.index = layer.open({
			type : 1,
			area : '430px',
			title : {
					friend : '添加好友',
					group : '加入群组'
				}[data.type] || '',
			shade : false,
			resize : false,
			btn : type ? [ '确认', '取消' ] : [ '发送申请', '关闭' ],
			content : laytpl(elemAddTpl).render({
				data : {
					name : data.username || data.groupname,
					avatar : data.avatar,
					group : data.group || parent.layui.layim.cache().friend || [],
					type : data.type
				},
				type : type
			}),
			yes : function(index, layero) {
				var groupElem = layero.find('#LAY_layimGroup'),
					remarkElem = layero.find('#LAY_layimRemark')
				if (type) {
					data.submit && data.submit(groupElem.val(), index);
				} else {
					data.submit && data.submit(groupElem.val(), remarkElem.val(), index);
				}
			}
		});
	};

	//切换聊天
	var changeChat = function(elem, del) {
		elem = elem || $('.layim-chat-list .' + THIS);
		var index = elem.index() === -1 ? 0 : elem.index();
		var str = '.layim-chat',
			cont = layimChat.find(str).eq(index);
		var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');

		if (del) {

			if ($($(cont[0]).find("div.getAudio")[0]).attr("style") === "" || $($(cont[0]).find("div.getAudio")[0]).attr("style") === "display: block;") {
				clearInterval(t);
				recorder && recorder.stop();
				if (recorder) {
					recorder.clear();
				}
				tag = false;
			}
			//如果关闭的是当前聊天，则切换聊天焦点
			if (elem.hasClass(THIS)) {
				changeChat(index === 0 ? elem.next() : elem.prev());
			}

			var length = layimChat.find(str).length;

			//关闭聊天界面
			if (length === 1) {
				return layer.close(chatIndex);
			}

			elem.remove();
			cont.remove();

			//只剩下1个列表，隐藏左侧区块
			if (length === 2) {
				layimChat.find('.layim-chat-list').hide();
				if (!hasFull) {
					layimChat.css('width', '600px');
				}
				layimChat.find('.layim-chat-box').css('margin-left', 0);
			}

			return false;
		}

		elem.addClass(THIS).siblings().removeClass(THIS);
		cont.addClass(SHOW).siblings(str).removeClass(SHOW);
		cont.find('textarea').focus();

		//聊天窗口的切换监听
		layui.each(call.chatChange, function(index, item) {
			item && item(thisChat());
		});
		showOffMessage();
	};

	//展示存在队列中的消息
	var showOffMessage = function() {
		var thatChat = thisChat();
		var message = cache.message[thatChat.data.type + thatChat.data.id];
		if (message) {
			//展现后，删除队列中消息
			delete cache.message[thatChat.data.type + thatChat.data.id];
		}
	};

	//获取当前聊天面板
	var thisChat = function() {
		if (!layimChat) return;
		var index = $('.layim-chat-list .' + THIS).index();
		var cont = layimChat.find('.layim-chat').eq(index);
		var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
		return {
			elem : cont,
			data : to,
			textarea : cont.find('textarea')
		};
	};

	//记录初始背景
	var setSkin = function(layero) {
		var local = layui.data('layim')[cache.mine.id] || {},
			skin = local.skin;
		layero.css({
			'background-image' : skin ? 'url(' + skin + ')' : function() {
				return cache.base.initSkin ?
					'url(' + (layui.cache.dir + 'css/modules/layim/skin/' + cache.base.initSkin) + ')' :
					'none';
			}()
		});
	};

	//记录历史会话
	var setHistory = function(data) {
		var local = layui.data('layim')[cache.mine.id] || {};
		var obj = {},
			history = local.history || {};
		var is = history[data.type + data.id];

		if (!layimMain) return;

		var historyElem = layimMain.find('.layim-list-history');

		data.historyTime = new Date().getTime();
		history[data.type + data.id] = data;

		local.history = history;

		layui.data('layim', {
			key : cache.mine.id,
			value : local
		});

		if (is) return;

		obj[data.type + data.id] = data;
		var historyList = laytpl(listTpl({
			type : 'history',
			item : 'd.data'
		})).render({
			data : obj
		});
		historyElem.prepend(historyList);
		historyElem.find('.layim-null').remove();
	};

	/**
	 * 获得服务器端时间
	 * */
	var getNowTime = function() {
		var result = -1;
		$.ajax({
			url : "home_now.action",
			dataType : "text",
			type : "post",
			async : false,
			success : function(e) {
				result = parseInt(e);
			},
			error : function(er, thr, xhr) {
				layui.layer.msg("时间获取失败,请重试!");
			}
		});

		return result;
	};

	//发送消息
	var sendMessage = function() {
		var data = {
			username : cache.mine ? cache.mine.username : '访客',
			avatar : cache.mine ? cache.mine.avatar : (layui.cache.dir + 'images/tx.png'),
			id : cache.mine ? cache.mine.id : null,
			mine : true
		};
		var thatChat = thisChat(),
			ul = thatChat.elem.find('.layim-chat-main ul');
		var maxLength = cache.base.maxLength || 120;
		data = $.extend(data, getSendContent(thatChat.textarea)); // 增加msgType,content字段

		if (data.msgType === IMClient.MsgChatType.MSG_TYPE_TEXT) {
			data.content = data.content.trim();
			if (data.content.length > maxLength || data.content.length == 0) {
				layer.msg('消息内容为1到' + maxLength + '个字符');
				return;
			}
		} else {
			data.content = JSON.parse(data.content);
		}

		var timestamp = getNowTime(); // 使用服务器端时间
		if (timestamp < 0) {
			return;
		}

		data.timestamp = timestamp;
		data.cid = timestamp; // 唯一标示该消息
		data.status = sendStatus[0];
		data.statusHtml = elemChatSending; // 设置发送状态

		var result = laytpl(elemChatMain).render(data);
		ul.append(result);

		var param = {
				mine : data,
				to : thatChat.data
			},
			message = {
				username : param.mine.username,
				avatar : param.mine.avatar,
				id : param.to.id,
				type : param.to.type,
				msgType : param.mine.msgType,
				content : param.mine.content,
				timestamp : data.timestamp,
				mine : true,
				status : sendStatus[0] // 标记消息状态 发送中
			};
		pushChatlog(message);

		layui.each(call.sendMessage, function(index, item) {
			item && item(param);
		});

		chatListMore();
		setSendContent(thatChat.textarea, "", "");
	};

	var resendMessage = function(msg) {
		var data = {
			username : cache.mine ? cache.mine.username : '访客',
			avatar : cache.mine ? cache.mine.avatar : (layui.cache.dir + 'css/pc/layim/skin/logo.jpg'),
			id : cache.mine ? cache.mine.id : null,
			mine : true
		};

		var thatChat = thisChat(),
			ul = thatChat.elem.find('.layim-chat-main ul');
		var maxLength = cache.base.maxLength || 3000;
		data.content = msg.content;
		data.msgType = msg.msgType;

		var timestamp = msg.timestamp; // 使用原来的时间
		data.timestamp = timestamp;
		data.cid = timestamp; // 唯一标示该消息
		data.status = sendStatus[0];
		data.statusHtml = elemChatSending; // 设置发送状态

		var param = {
			mine : data,
			to : thatChat.data
		};

		layui.each(call.resendMessage, function(index, item) {
			item && item(param);
		});
	};

	//桌面消息提醒
	var notice = function(data) {
		data = data || {};
		if (window.Notification) {
			if (Notification.permission === 'granted') {
				var notification = new Notification(data.title || '', {
					body : data.content || '',
					icon : data.avatar || 'http://tp2.sinaimg.cn/5488749285/50/5719808192/1'
				});
			} else {
				Notification.requestPermission();
			}
			;
		}
	};

	//消息声音提醒
	var voice = function() {
		if (device.ie && device.ie < 9) return;
		var audio = document.createElement("audio");
		audio.src = layui.cache.dir + 'css/modules/layim/voice/' + cache.base.voice;
		audio.play();
	};

	//接受消息
	var messageNew = {},
		getMessage = function(data) {
			data = data || {};

			var elem = $('.layim-chatlist-' + data.type + data.id);
			var group = {},
				index = elem.index();

			data.timestamp = data.timestamp || new Date().getTime();
			if (data.fromid == cache.mine.id) {
				data.mine = true;
			}
			data.system || pushChatlog(data);
			messageNew = JSON.parse(JSON.stringify(data));

			if (cache.base.voice) {
				voice();
			}

			if ((!layimChat && data.content) || index === -1) {
				if (cache.message[data.type + data.id]) {
					cache.message[data.type + data.id].push(data)
				} else {
					cache.message[data.type + data.id] = [ data ];

					//记录聊天面板队列
					if (data.type === 'friend') {
						var friend;
						layui.each(cache.friend, function(index1, item1) {
							layui.each(item1.list, function(index, item) {
								if (item.id == data.id) {
									item.type = 'friend';
									item.name = item.username;
									cache.chat.push(item);
									return friend = true;
								}
							});
							if (friend) return true;
						});
						if (!friend) {
							data.name = data.username;
							data.temporary = true; //临时会话
							cache.chat.push(data);
						}
					} else if (data.type === 'group') {
						var isgroup;
						layui.each(cache.group, function(index, item) {
							if (item.id == data.id) {
								item.type = 'group';
								item.name = item.groupname;
								cache.chat.push(item);
								return isgroup = true;
							}
						});
						if (!isgroup) {
							data.name = data.groupname;
							cache.chat.push(data);
						}
					} else {
						data.name = data.name || data.username || data.groupname;
						cache.chat.push(data);
					}
				}
				if (data.type === 'group') {
					layui.each(cache.group, function(index, item) {
						if (item.id == data.id) {
							group.avatar = item.avatar;
							return true;
						}
					});
				}
				if (!data.system) {
					/*if (cache.base.notice) {
						notice({
							title : '来自 ' + data.username + ' 的消息',
							content : data.content,
							avatar : group.avatar || data.avatar
						});
					}*/
					return setChatMin({
						name : '收到新消息',
						avatar : group.avatar || data.avatar,
						anim : 6
					});
				}
			}

			if (!layimChat) return;

			//接受到的消息不在当前Tab
			var thatChat = thisChat();
			if (thatChat.data.type + thatChat.data.id !== data.type + data.id) {
				elem.addClass('layui-anim layer-anim-06');
				setTimeout(function() {
					elem.removeClass('layui-anim layer-anim-06')
				}, 300);
			}

			var cont = layimChat.find('.layim-chat').eq(index);
			var ul = cont.find('.layim-chat-main ul');

			//系统消息
			if (data.system) {
				if (index !== -1) {
					ul.append('<li class="layim-chat-system"><span>' + data.content + '</span></li>');
				}
			} else {
				ul.append(laytpl(elemChatMain).render(data));
			}

			chatListMore();
		};

	//消息盒子的提醒
	var ANIM_MSG = 'layui-anim-loop layer-anim-05',
		msgbox = function(num) {
			var msgboxElem = layimMain.find('.layim-tool-msgbox');
			msgboxElem.find('span').addClass(ANIM_MSG).html(num);
		};

	//存储最近MAX_ITEM条聊天记录到本地
	var pushChatlog = function(message) {
		var local = layui.data('layim')[cache.mine.id] || {};
		local.chatlog = local.chatlog || {};
		var thisChatlog = local.chatlog[message.type + message.id];
		if (thisChatlog) {
			//避免浏览器多窗口时聊天记录重复保存
			var nosame;
			layui.each(thisChatlog, function(index, item) {
				if ( (item.timestamp === message.timestamp &&
					item.type === message.type &&
					item.id === message.id &&
					item.content === message.content) ) {
					item.status = message.status; // 直接设置状态
					nosame = true;
				}
			});
			if (!(nosame || message.fromid == cache.mine.id)) {
				thisChatlog.push(message);
			}
			if (thisChatlog.length > MAX_ITEM) {
				thisChatlog.shift();
			}
		} else {
			local.chatlog[message.type + message.id] = [ message ];
		}
		layui.data('layim', {
			key : cache.mine.id,
			value : local
		});
	};

	/**
	 * 更新消息发送状态
	 * */
	var updChatlog = function(message) {
		var local = layui.data('layim')[cache.mine.id] || {};
		local.chatlog = local.chatlog || {};
		var thisChatlog = local.chatlog[message.type + message.id];
		if (thisChatlog) { // 遍历找到对应的消息，更新状态
			layui.each(thisChatlog, function(index, item) {
				if ( (item.timestamp === message.timestamp &&
					item.type === message.type &&
					item.id === message.id) ) {
					item.status = message.status; // 直接设置状态
					return false;
				}
			});
		}
		layui.data('layim', { // 保存至缓存中
			key : cache.mine.id,
			value : local
		});
	};

	/**
	 * 获得给定的通信记录
	 * */
	var getChatlog = function(idObj) {
		var local = layui.data('layim')[cache.mine.id] || {};
		local.chatlog = local.chatlog || {};
		var thisChatlog = local.chatlog[idObj.type + idObj.id];
		var targetLog = null;
		if (thisChatlog) { // 遍历找到对应的消息，更新状态
			layui.each(thisChatlog, function(index, item) {
				if ( (item.timestamp == idObj.timestamp &&
					item.type == idObj.type &&
					item.id == idObj.id) ) {
					targetLog = item;
					return false;
				}
			});
		}
		return targetLog;
	};

	//渲染本地最新聊天记录到相应面板
	var viewChatlog = function() {
		var local = layui.data('layim')[cache.mine.id] || {},
			thatChat = thisChat(),
			chatlog = local.chatlog || {},
			ul = thatChat.elem.find('.layim-chat-main ul');
		layui.each(chatlog[thatChat.data.type + thatChat.data.id], function(index, item) {
			var failHtml = laytpl(elemChatSendFail).render({
				type : thatChat.data.type,
				id : thatChat.data.id,
				timestamp : item.timestamp
			});
			switch (item.status) {
			case sendStatus[0]:
				item.statusHtml = failHtml;
				break;
			case sendStatus[1]:
				item.statusHtml = "";
				break;
			case sendStatus[2]:
				item.statusHtml = failHtml;
				break;
			}
			item.cid = item.timestamp;
			ul.append(laytpl(elemChatMain).render(item));
		});
		chatListMore();
	};


	//添加好友或群
	var addList = function(data) {
		var obj = {},
			has,
			listElem = layimMain.find('.layim-list-' + data.type);

		if (cache[data.type]) {
			if (data.type === 'friend') {
				layui.each(cache.friend, function(index, item) {
					if (data.groupid == item.id) {
						//检查好友是否已经在列表中
						layui.each(cache.friend[index].list, function(idx, itm) {
							if (itm.id == data.id) {
								return has = true
							}
						});
						if (has) return layer.msg('好友 [' + (data.username || '') + '] 已经存在列表中', {
								anim : 6
							});
						cache.friend[index].list = cache.friend[index].list || [];
						obj[cache.friend[index].list.length] = data;
						data.groupIndex = index;
						cache.friend[index].list.push(data); //在cache的friend里面也增加好友
						return true;
					}
				});
			} else if (data.type === 'group') {
				//检查群组是否已经在列表中
				layui.each(cache.group, function(idx, itm) {
					if (itm.id == data.id) {
						return has = true
					}
				});
				if (has) return layer.msg('您已是 [' + (data.groupname || '') + '] 的群成员', {
						anim : 6
					});
				obj[cache.group.length] = data;
				cache.group.push(data);
			}
		}

		if (has) return;

		var list = laytpl(listTpl({
			type : data.type,
			item : 'd.data',
			index : data.type === 'friend' ? 'data.groupIndex' : null
		})).render({
			data : obj
		});

		if (data.type === 'friend') {
			var li = listElem.find('>li').eq(data.groupIndex);
			li.find('.layui-layim-list').append(list);
			li.find('.layim-count').html(cache.friend[data.groupIndex].list.length); //刷新好友数量
			//如果初始没有好友
			if (li.find('.layim-null')[0]) {
				li.find('.layim-null').remove();
			}
		} else if (data.type === 'group') {
			listElem.append(list);
			//如果初始没有群组
			if (listElem.find('.layim-null')[0]) {
				listElem.find('.layim-null').remove();
			}
		}
	};

	//移出好友或群
	var removeList = function(data) {
		var listElem = layimMain.find('.layim-list-' + data.type);
		var obj = {};
		if (cache[data.type]) {
			if (data.type === 'friend') {
				layui.each(cache.friend, function(index1, item1) {
					layui.each(item1.list, function(index, item) {
						if (data.id == item.id) {
							var li = listElem.find('>li').eq(index1);
							var list = li.find('.layui-layim-list>li');
							li.find('.layui-layim-list>li').eq(index).remove();
							cache.friend[index1].list.splice(index, 1); //从cache的friend里面也删除掉好友
							li.find('.layim-count').html(cache.friend[index1].list.length); //刷新好友数量  
							//如果一个好友都没了
							if (cache.friend[index1].list.length === 0) {
								li.find('.layui-layim-list').html('<li class="layim-null">该分组下已无好友了</li>');
							}
							return true;
						}
					});
				});
			} else if (data.type === 'group') {
				layui.each(cache.group, function(index, item) {
					if (data.id == item.id) {
						listElem.find('>li').eq(index).remove();
						cache.group.splice(index, 1); //从cache的group里面也删除掉数据
						//如果一个群组都没了
						if (cache.group.length === 0) {
							listElem.html('<li class="layim-null">暂无群组</li>');
						}
						return true;
					}
				});
			}
		}
	};

	//查看更多记录
	var chatListMore = function() {
		var thatChat = thisChat(),
			chatMain = thatChat.elem.find('.layim-chat-main');
		var ul = chatMain.find('ul');
		var length = ul.find('li').length;

		if (length >= MAX_ITEM) {
			var first = ul.find('li').eq(0);
			if (!ul.prev().hasClass('layim-chat-system')) {
				ul.before('<div class="layim-chat-system"><span layim-event="chatLog">查看更多记录</span></div>');
			}
			if (length > MAX_ITEM) {
				first.remove();
			}
		}
		chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
		chatMain.find('ul li:last').find('img').load(function() {
			chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
		});
	};

	//快捷键发送
	var hotkeySend = function() {
		var thatChat = thisChat(),
			textarea = thatChat.textarea;

		textarea.focus();
		textarea.off('keydown').on('keydown', function(e) {
			var local = layui.data('layim')[cache.mine.id] || {};
			var keyCode = e.keyCode;
			var msgType = IMClient.MsgChatType.MSG_TYPE_TEXT;
			var src_text = textarea.val();
			var text_result = layui.data._content(src_text);
			if (local.sendHotKey === 'Ctrl+Enter') {
				if (e.ctrlKey && keyCode === 13) {
					setSendContent(textarea, msgType, text_result);
					sendMessage();
					thatChat.textarea.val('').focus();
				}
				return;
			}

			if (keyCode === 13) {
				if (e.ctrlKey) {
					return textarea.val(textarea.val() + '\n');
				}
				if (e.shiftKey) return;
				e.preventDefault();
				setSendContent(textarea, msgType, text_result);
				sendMessage();
				thatChat.textarea.val('').focus();
			}
		});
	};

	//表情库
	var faces = function() {
		var alt = [ "[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]" ],
			arr = {};
		layui.each(alt, function(index, item) {
			arr[item] = layui.cache.dir + 'images/face/' + index + '.gif';
		});
		return arr;
	}();


	var stope = layui.stope; //组件事件冒泡

	//在焦点处插入内容
	var focusInsert = function(obj, str) {
		var result,
			val = obj.value;
		obj.focus();
		if (document.selection) { //ie
			result = document.selection.createRange();
			document.selection.empty();
			result.text = str;
		} else {
			result = [ val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd) ];
			obj.focus();
			obj.value = result.join('');
		}
	};

	function setSendContent(textarea, msgType, attachOrTxt) {
		textarea.data("msgType", msgType);
		var content = "";
		if (msgType == IMClient.MsgChatType.MSG_TYPE_TEXT) {
			content = attachOrTxt;
		} else {
			content = JSON.stringify(attachOrTxt);
		}
		textarea.data("content", content);
	}

	function getSendContent(textarea) {
		return {
			msgType : textarea.data("msgType"),
			content : textarea.data("content")
		}
	}

	//事件
	var anim = 'layui-anim-upbit',
		events = {
			api : function(elem){
				/**
				 * 支持从系统其他地方产生事件以打开会话窗口<br />
				 * <button layim-event="api" data-type="friend | group" data-target="username | groupId" />
				 * */
				var type = $(elem).data("type");
				var target = $(elem).data("target");
				$(".layim-list-".concat(type).concat(" .layim-").concat(type).concat(target)).trigger("click");
			},
			resend : function(othis, e) { // 消息重发
				var type = othis.attr("layim-type"),
					id = othis.attr("layim-id"),
					ts = othis.attr("layim-ts");
				var idObj = {
					type : type,
					id : id,
					timestamp : ts
				};
				othis.attr("layim-action", ""); // 清除避免连续点击2次
				othis.replaceWith(elemChatSending); // 设置为发送中
				var targetLog = getChatlog(idObj); // 找到对应的消息

				if (targetLog != null) {
					resendMessage(targetLog);
				}
			},
			//在线状态
			status : function(othis, e) {
				var hide = function() {
					othis.next().hide().removeClass(anim);
				};
				var type = othis.attr('lay-type');
				if (type === 'show') {
					stope(e);
					othis.next().show().addClass(anim);
					$(document).off('click', hide).on('click', hide);
				} else {
					var prev = othis.parent().prev();
					othis.addClass(THIS).siblings().removeClass(THIS);
					prev.html(othis.find('cite').html());
					prev.removeClass('layim-status-' + (type === 'online' ? 'hide' : 'online'))
						.addClass('layim-status-' + type);
					layui.each(call.online, function(index, item) {
						item && item(type);
					});
				}
			}, //编辑签名
			sign : function() {
				var input = layimMain.find('.layui-layim-remark');
				input.on('change', function() {
					var value = this.value;
					layui.each(call.sign, function(index, item) {
						item && item(value);
					});
				});
				input.on('keyup', function(e) {
					var keyCode = e.keyCode;
					if (keyCode === 13) {
						this.blur();
					}
				});
			}, //大分组切换
			tab : function(othis) {
				var index,
					main = '.layim-tab-content';
				var tabs = layimMain.find('.layui-layim-tab>li');
				typeof othis === 'number' ? (
					index = othis, othis = tabs.eq(index)
					) : (
					index = othis.index()
					);
				index > 2 ? tabs.removeClass(THIS) : (
					events.tab.index = index, othis.addClass(THIS).siblings().removeClass(THIS)
					)
				layimMain.find(main).eq(index).addClass(SHOW).siblings(main).removeClass(SHOW);
			}, //展开联系人分组
			spread : function(othis) {
				var type = othis.attr('lay-type');
				var spread = type === 'true' ? 'false' : 'true';
				var local = layui.data('layim')[cache.mine.id] || {};
				othis.next()[type === 'true' ? 'removeClass' : 'addClass'](SHOW);
				local['spread' + othis.parent().index()] = spread;
				layui.data('layim', {
					key : cache.mine.id,
					value : local
				});
				othis.attr('lay-type', spread);
				othis.find('.layui-icon').html(spread === 'true' ? '&#xe61a;' : '&#xe602;');
			}, //搜索
			search : function(othis) {
				var search = layimMain.find('.layui-layim-search');
				var main = layimMain.find('#layui-layim-search');
				var input = search.find('input'),
					find = function(e) {
						var val = input.val().replace(/\s/);
						if (val === '') {
							events.tab(events.tab.index | 0);
						} else {
							var data = [],
								friend = cache.friend || [];
							var group = cache.group || [],
								html = '';
							for (var i = 0; i < friend.length; i++) {
								for (var k = 0; k < (friend[i].list || []).length; k++) {
									if (friend[i].list[k].username.indexOf(val) !== -1) {
										friend[i].list[k].type = 'friend';
										friend[i].list[k].index = i;
										friend[i].list[k].list = k;
										data.push(friend[i].list[k]);
									}
								}
							}
							for (var j = 0; j < group.length; j++) {
								if (group[j].groupname.indexOf(val) !== -1) {
									group[j].type = 'group';
									group[j].index = j;
									group[j].list = j;
									data.push(group[j]);
								}
							}
							if (data.length > 0) {
								for (var l = 0; l < data.length; l++) {
									html += '<li layim-event="chat" data-type="' + data[l].type + '" data-index="' + data[l].index + '" data-list="' + data[l].list + '"><img src="' + data[l].avatar + '"><span>' + (data[l].username || data[l].groupname || '佚名') + '</span><p>' + (data[l].remark || data[l].sign || '') + '</p></li>';
								}
							} else {
								html = '<li class="layim-null">无搜索结果</li>';
							}
							main.html(html);
							events.tab(3);
						}
					};
				if (!cache.base.isfriend && cache.base.isgroup) {
					events.tab.index = 1;
				} else if (!cache.base.isfriend && !cache.base.isgroup) {
					events.tab.index = 2;
				}
				search.show();
				input.focus();
				input.off('keyup', find).on('keyup', find);
			}, //关闭搜索
			closeSearch : function(othis) {
				othis.parent().hide();
				events.tab(events.tab.index | 0);
			}, //消息盒子
			msgbox : function() {
				var msgboxElem = layimMain.find('.layim-tool-msgbox');
				layer.close(events.msgbox.index);
				msgboxElem.find('span').removeClass(ANIM_MSG).html('');
				return events.msgbox.index = layer.open({
					type : 2,
					title : '消息盒子',
					shade : false,
					maxmin : true,
					area : [ '600px', '520px' ],
					skin : 'layui-box layui-layer-border',
					resize : false,
					content : cache.base.msgbox
				});
			}, //弹出查找页面
			find : function() {
				layer.close(events.find.index);
				return events.find.index = layer.open({
					type : 2,
					title : '查找',
					shade : false,
					maxmin : true,
					area : [ '1000px', '520px' ],
					skin : 'layui-box layui-layer-border',
					resize : false,
					content : cache.base.find
				});
			}, //弹出更换背景
			skin : function() {
				layer.open({
					type : 1,
					title : '更换背景',
					shade : false,
					area : '300px',
					skin : 'layui-box layui-layer-border',
					id : 'layui-layim-skin',
					zIndex : 66666666,
					resize : false,
					content : laytpl(elemSkinTpl).render({
						skin : cache.base.skin
					})
				});
			}, //关于
			about : function() {
				layer.alert('版本： ' + v + '<br>版权所有：<a href="http://layim.layui.com" target="_blank">layim.layui.com</a>', {
					title : '关于 LayIM',
					shade : false
				});
			}, //生成换肤
			setSkin : function(othis) {
				var src = othis.attr('src');
				var local = layui.data('layim')[cache.mine.id] || {};
				local.skin = src;
				if (!src)
					delete local.skin;
				layui.data('layim', {
					key : cache.mine.id,
					value : local
				});
				try {
					layimMain.css({
						'background-image' : src ? 'url(' + src + ')' : 'none'
					});
					layimChat.css({
						'background-image' : src ? 'url(' + src + ')' : 'none'
					});
				} catch (e) {}
				layui.each(call.setSkin, function(index, item) {
					var filename = (src || '').replace(layui.cache.dir + 'css/modules/layim/skin/', '');
					item && item(filename, src);
				});
			}, //弹出聊天面板
			chat : function(othis) {
				var local = layui.data('layim')[cache.mine.id] || {};
				var type = othis.data('type'),
					index = othis.data('index');
				var list = othis.attr('data-list') || othis.index(),
					data = {};
				if (type === 'friend') {
					data = cache[type][index].list[list];
				} else if (type === 'group') {
					data = cache[type][list];
				} else if (type === 'history') {
					data = (local.history || {})[index] || {};
				}
				data.name = data.name || data.username || data.groupname;
				if (type !== 'history') {
					data.type = type;
				}
				popchat(data);
			}, //切换聊天
			tabChat : function(othis) {
				changeChat(othis);
			}, //关闭聊天列表
			closeChat : function(othis, e) {
				changeChat(othis.parent(), 1);
				stope(e);
			},
			closeThisChat : function() {
				changeChat(null, 1);
			}, //展开群组成员
			groupMembers : function(othis, e) {
				var icon = othis.find('.layui-icon'),
					hide = function() {
						icon.html('&#xe61a;');
						othis.data('down', null);
						layer.close(events.groupMembers.index);
					},
					stopmp = function(e) {
						stope(e)
					};

				if (othis.data('down')) {
					hide();
				} else {
					icon.html('&#xe619;');
					othis.data('down', true);
					events.groupMembers.index = layer.tips('<ul class="layim-members-list"></ul>', othis, {
						tips : 3,
						time : 0,
						anim : 5,
						fixed : true,
						skin : 'layui-box layui-layim-members',
						success : function(layero) {
							var members = cache.base.members || {},
								thatChat = thisChat(),
								ul = layero.find('.layim-members-list'),
								li = '',
								membersCache = {},
								hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin'),
								listNone = layimChat.find('.layim-chat-list').css('display') === 'none';
							if (hasFull) {
								ul.css({
									width : $(window).width() - 22 - (listNone || 200)
								});
							}
							members.data = $.extend(members.data, {
								id : thatChat.data.id
							});
							post(members, function(res) {
								layui.each(res.list, function(index, item) {
									li += '<li data-uid="' + item.id + '"><a href="javascript:;"><img src="' + item.avatar + '"><cite>' + item.username + '</cite></a></li>';
									membersCache[item.id] = item;
								});
								ul.html(li);

								//获取群员
								othis.find('.layim-chat-members').html(res.members || (res.list || []).length + '人');

								//私聊
								ul.find('li').on('click', function() {
									var uid = $(this).data('uid'),
										info = membersCache[uid];
									var ninfo = {
										type : 'friend'
									};
									for(var j in info){
										ninfo[j] = info[j];
									}
									popchat(ninfo);
									hide();
								});

								layui.each(call.members, function(index, item) {
									item && item(res);
								});
							});
							layero.on('mousedown', function(e) {
								stope(e);
							});
						}
					});
					$(document).off('mousedown', hide).on('mousedown', hide);
					$(window).off('resize', hide).on('resize', hide);
					othis.off('mousedown', stopmp).on('mousedown', stopmp);
				}
			}, //发送聊天内容
			send : function() { // 发送文字消息
				var msgType = IMClient.MsgChatType.MSG_TYPE_TEXT;
				var thatChat = thisChat(),
					textarea = thatChat.textarea;
				var src_text = textarea.val();
				var text_result = layui.data._content(src_text);
				setSendContent(textarea, msgType, text_result);
				sendMessage();
				thatChat.textarea.val('').focus();
			}, //设置发送聊天快捷键
			setSend : function(othis, e) {
				var box = events.setSend.box = othis.siblings('.layim-menu-box'),
					type = othis.attr('lay-type');

				if (type === 'show') {
					stope(e);
					box.show().addClass(anim);
					$(document).off('click', events.setSendHide).on('click', events.setSendHide);
				} else {
					othis.addClass(THIS).siblings().removeClass(THIS);
					var local = layui.data('layim')[cache.mine.id] || {};
					local.sendHotKey = type;
					layui.data('layim', {
						key : cache.mine.id,
						value : local
					});
					events.setSendHide(e, othis.parent());
				}
			},
			setSendHide : function(e, box) {
				(box || events.setSend.box).hide().removeClass(anim);
			}, //表情
			face : function(othis, e) { // 废弃
				layui.layer.msg("表情功能暂不支持!");
				return;

				var content = '',
					thatChat = thisChat();

				for (var key in faces) {
					content += '<li title="' + key + '"><img src="' + faces[key] + '"></li>';
				}
				content = '<ul class="layui-clear layim-face-list">' + content + '</ul>';

				events.face.index = layer.tips(content, othis, {
					tips : 1,
					time : 0,
					fixed : true,
					skin : 'layui-box layui-layim-face',
					success : function(layero) {
						layero.find('.layim-face-list>li').on('mousedown', function(e) {
							stope(e);
						}).on('click', function() {
							focusInsert(thatChat.textarea[0], 'face' + this.title + ' ');
							layer.close(events.face.index);
						});
					}
				});

				$(document).off('mousedown', events.faceHide).on('mousedown', events.faceHide);
				$(window).off('resize', events.faceHide).on('resize', events.faceHide);
				stope(e);

			},
			faceHide : function() { // 废弃
				layer.close(events.face.index);
			}, //图片或一般文件
			image : function(othis) {
				var type = othis.data('type') || 'images',
					api = {
						images : 'uploadImage',
						file : 'uploadFile'
					},
					thatChat = thisChat(),
					upload = cache.base[api[type]] || {};

				var input = othis.find('input');

				othis.undelegate("input", "change").delegate("input", "change", function(e) {
					var f = input[0].files[0];
					var type = Chat.getFileType(f);
					if (type != 1) {
						layui.use('layer', function() {
							var layer = layui.layer;
							layer.open({
								title : "图片格式错误",
								type : 0,
								content : "系统仅支持jpg,jpeg,png,gif,bmp等格式图片!"
							});
						});
					} else {
						//上传图片文件
						var mine = cache.mine,
							to = thatChat.data;
						var uploader = new Chat.Uploader(f, mine, to);
						uploader.getMsgHtml(); // 备用
						uploader.upload(function(msg) {
							var msgType = IMClient.MsgChatType.MSG_TYPE_IMAGE;
							var msgAttach = msg.attachment;
							setSendContent(thatChat.textarea, msgType, msgAttach);
							input.replaceWith('<input type="file" name="file">'); // 清理解决重复上传问题
							sendMessage(); // 发送消息
						}, function(er) {
							input.replaceWith('<input type="file" name="file">'); // 清理解决重复上传问题
							layui.layer.msg("图片上传失败");
						});
					}
				});
			}, //音频和视频
			media : function(othis) {
				//var audio = document.querySelector('audio');
				var thatChat = thisChat();
				var audio = jQuery(".getAudio");
				var index_audo;
				var tage = true;
				var selector = jQuery(".getAudio"),
					durationKey = "duration",
					duration = 0.0;

				var startRecording = function() {
					tag = true;
					var c = 1;
					if (recorder) {
						jQuery(".getAudio").eq(index_audo).show(); //如果元素为隐藏,则将它显现
						jQuery("._recorder_temp").eq(index_audo).text("正在录音:0s");
						recorder.start();
						t = setInterval(function() {
							jQuery("._recorder_temp").eq(index_audo).text("正在录音:" + c + "s");
							c = c + 1;
							if (c >= 20) {
								send();
							}
						}, 920);
						return;
					}

					HZRecorder.get(function(rec) {
						jQuery(".getAudio").eq(index_audo).show(); //如果元素为隐藏,则将它显现
						recorder = rec;
						jQuery("._recorder_temp").eq(index_audo).text("正在录音:0s");
						t = setInterval(function() {
							jQuery("._recorder_temp").eq(index_audo).text("正在录音:" + c + "s");
							c = c + 1;
							if (c >= 20) {
								send();
							}
						}, 920);
						recorder.start();
					}, {
						error : showError
					});
				};
				var obtainRecord = function() {
					if (!recorder) {
						var msg_ = {
							0 : "请先录音"
						};
						showError(msg_);
						return;
					}
					var record = recorder.getBlob();
					if (record.duration !== 0) {
						downloadRecord(record.blob);
					} else {
						var msg_ = {
							0 : "请先录音"
						};
						showError(msg_);
					}
				};

				var downloadRecord = function(record) {
					var save_link = document.createElementNS('mlight', 'a')
					save_link.href = URL.createObjectURL(record);
					var now = new Date;
					save_link.download = now.Format("yyyyMMddhhmmss");
					fake_click(save_link);
				}


				var fake_click = function(obj) {
					var ev = document.createEvent('MouseEvents');
					ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					obj.dispatchEvent(ev);
				}

				var getStr = function() {
					var now = new Date;
					var str = now.toDateString();
				}

				var stopRecord = function() {
					recorder && recorder.stop();
					tag = false;
					if (recorder) {
						recorder.clear();
					}
					clearInterval(t);
					jQuery(".getAudio").fadeOut(400);
				};
				//获取文件名
				var getRecorderName = function() {
					var _ms = duration;
					return "mlight-temp" + new Date().getTime() + "_" + _ms + ".wav";
				}

				var uploadCallback = function(resp) {
					jQuery("._recorder_temp").eq(index_audo).text("发送录音..");
					try {
						var obj = JSON.parse(resp);
						obj = {
							duration : duration.toFixed(1),
							url : obj.oldAddress
						};

						var msgType = IMClient.MsgChatType.MSG_TYPE_AUDIO;
						setSendContent(thatChat.textarea, msgType, obj);
						sendMessage();
					} catch (e) {
						layer.msg("录音上传失败,请重试!");
					}
					duration = 0;
				}

				var errorCallback = function(resp) {
					layer.msg("短语音无法发送,请检查网络状况!");
				}

				//发送音频片段
				//var msgId = 1;
				var send = function() {
					tag = false;
					clearInterval(t);
					jQuery(".getAudio").fadeOut(400);
					if (!recorder) {
						var msg_ = {
							0 : "请先录音"
						};
						showError(msg_);
						return;
					}

					var data = recorder.getBlob();
					if (data.duration == 0) {
						var msg_ = {
							0 : "请先录音"
						};
						showError(msg_);
						return;
					}

					duration = data.duration / 10;

					var formd = new FormData();
					formd.append("file", data.blob);
					formd.append("myFileName", getRecorderName());
					formd.append("fileFileURL", "/temp_file");
					jQuery.ajax({
						url : "home_Recorder_file.action",
						data : formd,
						type : "post",
						processData : false, //  告诉jquery不要处理发送的数据
						contentType : false,
						success : uploadCallback,
						error : errorCallback
					});
					recorder.clear();
				}

				$(document).on("click", ".voiceItem", function() {
					var id = $(this)[0].id;
					var data = msg[id];
					playRecord(data.blob);
				})

				var ct;
				var showError = function(msg) {
					jQuery(".getAudio").fadeOut(10);
					tag = false;
					for (var p1 in msg) {
						if (msg.hasOwnProperty(p1))
							MXZH.log(p1);
						MXZH.log(msg[p1]);
						layer.msg(msg[p1]);
					}
				}


				var playRecord = function(blob) {
					if (!recorder) {
						var msg = {
							0 : "请先录音"
						};
						showError(msg);
						return;
					}
					recorder.play(audio, blob);
				};
				var action = othis.data("action"),
					index_audo = jQuery(".layui-icon.layim-tool-audio").index(othis);
				switch (action) {
				case "start": // 开始
					if (tag) {
						layer.msg("麦克在使用中");
						break;
					} else {
						if (jQuery(".getAudio").eq(index_audo).is(":hidden")) {
							startRecording();
						}
						break;
					}
				case "stop": // 取消
					stopRecord();
					break;
				case "send": // 发送 
					send();
					break;
				}

			},
			//扩展工具栏
			extend : function(othis) {
				var filter = othis.attr('lay-filter'),
					thatChat = thisChat();

				layui.each(call['tool(' + filter + ')'], function(index, item) {
					item && item.call(othis, function(content) {
						focusInsert(thatChat.textarea[0], content);
					}, sendMessage, thatChat);
				});
			}, //播放音频
			playAudio : function(othis) {
				var src = othis.data("src");
				if (src.indexOf("amr") == src.length - 3) {
					var mp3Url = IMClientPortal.getJmPath(src, ""); // 如果是amr获得对应的mp3路径
					if (!mp3Url) {
						layer.msg("收到浏览器不支持的音频格式");
					} else {
						src = mp3Url;
					}
					othis.data("src", mp3Url);
				} else {
					// 已经完成格式转换，直接播放即可
				}


				var audioData = othis.data('audio'),
					audio = audioData || document.createElement('audio'),
					playingClass = "layim-audio-playing",
					playerClass = ".layim-audio-player",
					pause = function() {
						audio.pause();
						othis.removeAttr('status');
						othis.find(playerClass).removeClass(playingClass);
					};
				if (othis.data('error')) {
					return layer.msg('播放音频源异常');
				}
				if (!audio.play) {
					return layer.msg('您的浏览器不支持audio');
				}
				if (othis.attr('status')) {
					pause();
				} else {
					audioData || (audio.src = othis.data('src'));
					audio.play();
					othis.attr('status', 'pause');
					othis.data('audio', audio);
					othis.find(playerClass).addClass(playingClass);
					//播放结束
					audio.onended = function() {
						pause();
					};
					//播放异常
					audio.onerror = function() {
						layer.msg('播放音频源异常');
						othis.data('error', true);
						pause();
					};
				}
			}, //播放视频

			_playAudio : function(othis) {
				var namesrc = othis.data("src");
				var playstr = new Date().getTime();
				var amrid = null;
				var self = ".audioPlay";
				Myemb_stop = function(stopstr) {
					var amrid = document.getElementById("amrid" + stopstr);
					amrid.pause();
					othis.find("i").attr("status", 'pause').html("&#xe652;");
				}

				function play(playstr) {
					var html = "<audio id='amrid" + playstr + "' src=" + result + "  autoplay='true' ></audio>"
					amrid = document.getElementById("amrid" + playstr);
					if (!amrid) {
						jQuery(self).after(jQuery(html));
						amrid = document.getElementById("amrid" + playstr);
					} else {
						//amrid.Play();
						jQuery("#amrid" + playstr).remove();
						jQuery(self).after(jQuery(html));
					}
					othis.find("i").attr("status", 'playing').html("&#xe651;");
					setTimeout("Myemb_stop('" + playstr + "')", playstr);
				}

				jQuery.ajax({
					url : "${basePath}/home_lyPlayer.action",
					data : {
						yy_url : namesrc
					},
					type : "post",
					success : play,
					error : function(error) {
						throw (error);
						throw ('数据请求失败！');
					}
				});
			},
			playAudio_ : function(othis) {
				//这个播放方法只支持ie 其他浏览器 不支持 wxl
				try {
					var iconImg = othis.find("i").attr("status");
					pause = function() {
						othis.find("i").attr("status", 'pause').html("&#xe652;");
					};
					var namesrc = othis.data("src"),
						ms = -1;
					try {
						ms = parseInt(othis.data("duration"));
					} catch (e) {}
					window.interAudio && clearInterval(interAudio);
					if (!iconImg || iconImg == 'pause') {
						begin = 0;
						var strEmbed = '<embed name="embedPlay"  type="audio/x-wav" id="embedPlay_id" src=' + namesrc + ' autostart="true" width="0" height="0"   loop="false"></embed>';
						jQuery(".audioPlay").html("").append(strEmbed);
						embed = document.embedPlay;
						embed.volume = 120;
						othis.find("i").attr("status", 'playing').html("&#xe651;");
						interAudio = setInterval(function() {
							begin >= ms ? (pause(), clearInterval(interAudio)) : begin += 100;
						}, 100);
					} else if (iconImg == 'playing') {
						interAudio && clearInterval(interAudio), begin = 0;
						var a = document.getElementById("embedPlay_id");
						try {
							a.pause(),
							pause();
						} catch (e) {
							MXZH.errorLog("你不是在用的IE啊？换个IE浏览器试试吧");
						}
					}
				} catch (e) {
					this._playAudio(othis);
				}
			},

			playVideo : function(othis) {
				var videoData = othis.data('src'),
					video = document.createElement('video');
				if (!video.play) {
					return layer.msg('您的浏览器不支持video');
				}
				layer.close(events.playVideo.index);
				events.playVideo.index = layer.open({
					type : 1,
					title : '播放视频',
					area : [ '460px', '300px' ],
					maxmin : true,
					shade : false,
					content : '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" src="' + videoData + '" loop="loop" autoplay="autoplay"></video></div>'
				});
			}, //聊天记录

			openLocation : function(othis) { // dl 打开位置
				var src = othis.data("src"),
					txt = othis.data("txt");
				return src ? (layer.close(events.openLocation.index), void (events.openLocation.index = layer.open({
					type : 1,
					title : "位置--" + txt,
					area : [ "460px", "300px" ],
					maxmin : !0,
					shade : !1,
					content : '<iframe width="100%" height="100%" frameborder="0" src="' + src + '"></iframe>'
				}))) : layer.msg("查看位置失败,请重试!")
			},

			chatLog : function(othis) {
				var thatChat = thisChat();
				if (!cache.base.chatLog) {
					return layer.msg('未开启更多聊天记录');
				}
				layer.close(events.chatLog.index);
				return events.chatLog.index = layer.open({
					type : 2,
					maxmin : true,
					title : '与 ' + thatChat.data.name + ' 的聊天记录',
					area : [ '450px', '100%' ],
					shade : false,
					offset : 'rb',
					skin : 'layui-box',
					anim : 2,
					id : 'layui-layim-chatlog',
					content : cache.base.chatLog + '?id=' + thatChat.data.id + '&type=' + thatChat.data.type
				});
			}, //历史会话右键菜单操作
			menuHistory : function(othis, e) {
				var local = layui.data('layim')[cache.mine.id] || {};
				var parent = othis.parent(),
					type = othis.data('type');
				var hisElem = layimMain.find('.layim-list-history');
				var none = '<li class="layim-null">暂无历史会话</li>'

				if (type === 'one') {
					var history = local.history;
					delete history[parent.data('index')];
					local.history = history;
					layui.data('layim', {
						key : cache.mine.id,
						value : local
					});
					$('#' + parent.data('id')).remove();
					if (hisElem.find('li').length === 0) {
						hisElem.html(none);
					}
				} else if (type === 'all') {
					delete local.history;
					layui.data('layim', {
						key : cache.mine.id,
						value : local
					});
					hisElem.html(none);
				}

				layer.closeAll('tips');
			}
		};

	//暴露接口
	exports('layim', new LAYIM());

}).addcss(
	'modules/layim/layim.css?v=3.60Pro', 'skinlayimcss'
);