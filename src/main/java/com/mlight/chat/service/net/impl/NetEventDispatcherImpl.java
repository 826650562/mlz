package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.mlight.chat.client.MessageFilter;
import com.mlight.chat.client.MessageListener;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.NormalMessage;
import com.mlight.chat.service.config.Constants;
import com.mlight.chat.service.dao.group.GroupInfo;
import com.mlight.chat.service.dao.message.Message;
import com.mlight.chat.service.dao.sysnotice.SysNotice;
import com.mlight.chat.service.models.news.News;
import com.mlight.chat.service.models.notice.Notice;
import com.mlight.chat.service.net.NetEventDispatcher;
import com.mlight.chat.service.net.message.MessageBody;
import com.mlight.chat.service.net.message.PushMessageBody;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class NetEventDispatcherImpl implements NetEventDispatcher {

	private TChatConnection connection;
	private RequestPacketListener requestListener;
	private ChatMessagePacketListener chatMessageListener;
	private GroupChatMessageListener groupChatMessageListener;
	private NormalMessagePacketListener normalMessageListener;
	private AnnouncementMessagePacketListener announcementMessageListener;
	private NewsMessagePacketListener newsMessageListener;

	public NetEventDispatcherImpl(TChatConnection connection) {
		this.connection = connection;
	}

	private List<com.mlight.chat.service.net.listeners.NetEventListener> mListeners = new CopyOnWriteArrayList<com.mlight.chat.service.net.listeners.NetEventListener>();

	@Override
	public void addListener(com.mlight.chat.service.net.listeners.NetEventListener listener) {
		if (listener == null) {
			throw new IllegalArgumentException("监听器不可为空");
		}
		mListeners.add(listener);
	}

	@Override
	public void removeListener(com.mlight.chat.service.net.listeners.NetEventListener listener) {
		mListeners.remove(listener);
	}

	private void fire(Object object) {
		for (com.mlight.chat.service.net.listeners.NetEventListener listener : mListeners) {
			listener.handleEvent(object);
		}
	}

	@Override
	public void onStart() {
		requestListener = new RequestPacketListener();
		connection.addMessageListener(requestListener, new MessageFilter() {
			@Override
			public boolean accept(com.mlight.chat.message.Message message) {
				return message.getType() == com.mlight.chat.message.Message.Type.REQUEST;

			}
		});
		chatMessageListener = new ChatMessagePacketListener();
		connection.addMessageListener(chatMessageListener, new MessageFilter() {
			@Override
			public boolean accept(com.mlight.chat.message.Message message) {
				return message.getType() == com.mlight.chat.message.Message.Type.NORMAL;

			}
		});
		groupChatMessageListener = new GroupChatMessageListener();
		connection.addMessageListener(groupChatMessageListener, new MessageFilter() {
			@Override
			public boolean accept(com.mlight.chat.message.Message message) {
				return message.getType() == com.mlight.chat.message.Message.Type.NORMAL;

			}
		});
		normalMessageListener = new NormalMessagePacketListener();
		connection.addMessageListener(normalMessageListener, new MessageFilter() {
			@Override
			public boolean accept(com.mlight.chat.message.Message message) {
				return message.getType() == com.mlight.chat.message.Message.Type.NORMAL;

			}
		});
		announcementMessageListener = new AnnouncementMessagePacketListener();
		connection.addMessageListener(announcementMessageListener, new MessageFilter() {
			@Override
			public boolean accept(com.mlight.chat.message.Message message) {
				return message.getType() == com.mlight.chat.message.Message.Type.NORMAL;

			}
		});
		newsMessageListener = new NewsMessagePacketListener();
		connection.addMessageListener(newsMessageListener, new MessageFilter() {
			@Override
			public boolean accept(com.mlight.chat.message.Message message) {
				return message.getType() == com.mlight.chat.message.Message.Type.NORMAL;

			}
		});
	}

	@Override
	public void onStop() {
		connection.removeMessageListener(requestListener);
		connection.removeMessageListener(chatMessageListener);
		connection.removeMessageListener(groupChatMessageListener);
		connection.removeMessageListener(normalMessageListener);
		connection.removeMessageListener(announcementMessageListener);
		connection.removeMessageListener(newsMessageListener);
	}

	private class RequestPacketListener implements MessageListener {

		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public void processMessage(com.mlight.chat.message.Message message) {
			com.mlight.chat.message.Request request = (com.mlight.chat.message.Request) message;
			if (request.getUri().equals("/group/add")) { // 添加群组同步请求
				GroupInfo group = new GroupInfo();
				group.setId(Long.valueOf(request.getParam("groupId")));
				group.setName(request.getParam("name"));
				group.setType(Integer.valueOf(request.getParam("type")));
				group.setCreator(request.getParam("creator"));
				group.setLogo(request.getParam("logo"));
				group.setDepartmentId(Long.valueOf(request.getParam("orgId")));
				group.setUpdateTime(Long.valueOf(request.getParam("updateTime")));
				group.setDeleted(false);
				fire(group);
			}
			if (request.getUri().equals("/group/delete")) { // 删除群组同步请求
				fire(Long.valueOf(request.getParam("groupId")));
			}
		}
	}

	private class ChatMessagePacketListener implements MessageListener {

		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public void processMessage(com.mlight.chat.message.Message message) {
			NormalMessage normalMessage = (NormalMessage) message;
			if (normalMessage.getParamType().equals("chat")) {
				String bodyString = message.getBody();
				Gson gson = new Gson();
				MessageBody body = gson.fromJson(bodyString, MessageBody.class);
				Message message1 = convertBody(body);
				message1.setReceiver(Constants.CURRENT_USERNAME);
				fire(message1);
			}
		}
	}

	private class GroupChatMessageListener implements MessageListener {

		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public void processMessage(com.mlight.chat.message.Message message) {
			NormalMessage normalMessage = (NormalMessage) message;
			if (normalMessage.getParamType().equals("groupchat")) {
				String bodyString = message.getBody();
				Gson gson = new Gson();
				MessageBody body = gson.fromJson(bodyString, MessageBody.class);
				Message message1 = convertBody(body);
				message1.setReceiver(Constants.CURRENT_USERNAME);
				if (!message1.getSender().equals(message1.getReceiver())) { // 过滤自己发的群消息
					fire(message1);
				}
			}
		}
	}

	private class NormalMessagePacketListener implements MessageListener {

		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public void processMessage(com.mlight.chat.message.Message message) {
			NormalMessage normalMessage = (NormalMessage) message;
			if (normalMessage.getParamType().equals("normal")) {
				String bodyString = message.getBody();
				Gson gson = new Gson();
				PushMessageBody pushMessageBody = gson.fromJson(bodyString, PushMessageBody.class);
				if (pushMessageBody.getUri().equals("/sys/notice")) {
					SysNotice sysNotice = new SysNotice();
					sysNotice.setContent(pushMessageBody.getData().getContent());
					sysNotice.setTime(pushMessageBody.getData().getTime());
					fire(sysNotice);
				}
			}
		}
	}

	public class AnnouncementMessagePacketListener implements MessageListener {

		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public void processMessage(com.mlight.chat.message.Message message) {
			NormalMessage normalMessage = (NormalMessage) message;
			if (normalMessage.getParamType().equals("normal")) {
				String bodyString = message.getBody();
				Gson gson = new Gson();
				PushMessageBody pushMessageBody = gson.fromJson(bodyString, PushMessageBody.class);
				if (pushMessageBody.getUri().equals("/notice")) {
					Notice notice = new Notice();
					notice.setTitle(pushMessageBody.getData().getTitle());
					notice.setCreateTime(pushMessageBody.getData().getTime());
					notice.setUpdateTime(pushMessageBody.getData().getTime());
					fire(notice);
				}
			}
		}
	}

	public class NewsMessagePacketListener implements MessageListener {

		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public void processMessage(com.mlight.chat.message.Message message) {
			NormalMessage normalMessage = (NormalMessage) message;
			if (normalMessage.getParamType().equals("normal")) {
				String bodyString = message.getBody();
				Gson gson = new Gson();
				PushMessageBody pushMessageBody = gson.fromJson(bodyString, PushMessageBody.class);
				if (pushMessageBody.getUri().equals("/news")) {
					News news = new News();
					news.setTitle(pushMessageBody.getData().getTitle());
					news.setCreateTime(pushMessageBody.getData().getTime());
					news.setUpdateTime(pushMessageBody.getData().getTime());
					fire(news);
				}
			}
		}
	}

	private Message convertBody(MessageBody body) {
		Message message = new Message();
		if (body.getChatType().equals(MessageBody.CHAT)) {
			message.setChatType(Message.CHAT_TYPE_CHAT);
		} else if (body.getChatType().equals(MessageBody.GROUP_CHAT)) {
			message.setChatType(Message.CHAT_TYPE_GROUP_CHAT);
		}
		message.setSender(body.getSender());
		message.setReceiver(body.getReceiver());
		message.setTime(body.getTime());
		message.setGroupId(body.getGroupId());
		message.setType(body.getType());
		message.setContent(body.getContent());
		Gson gson = new Gson();
		message.setAttachment(gson.toJson(body.getAttachment()));
		return message;
	}

}
