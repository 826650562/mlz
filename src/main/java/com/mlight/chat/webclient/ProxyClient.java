package com.mlight.chat.webclient;

import cn.mlight.listener.SessionUtil;
import com.google.gson.Gson;
import com.mlight.chat.client.*;
import com.mlight.chat.client.exception.*;
import com.mlight.chat.client.request.RequestHandler;
import com.mlight.chat.message.NormalMessage;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.dao.group.GroupInfo;
import com.mlight.chat.service.dao.message.Message;
import com.mlight.chat.service.net.NetMessageManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.impl.NetMessageManagerImpl;
import com.mlight.chat.service.net.listeners.NetEventListener;
import com.mlight.chat.service.net.message.MessageBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class ProxyClient extends TimerTask {
	private static final Logger LOGGER = LoggerFactory.getLogger(ProxyClient.class);
	// 从服务器端发送过来的消息暂时存储在这个位置
	public ConcurrentLinkedQueue<Message> mailbox = new ConcurrentLinkedQueue<Message>();
	// 曾经发送失败的消息，暂存在这个位置
	public ConcurrentLinkedQueue<Message> resendBox = new ConcurrentLinkedQueue<Message>();
	public static final int MAX_MSG = 200; // 至多在缓存中缓存200条消息
	private TChatConnection connection;
	private Timer timer = new Timer();
	private static long REFRESH_TIMEOUT = 4000; // 超过5秒未刷新则认为客户端断开连接
	private RequestPacketListener requestListener;
	private CloseRequestHandler closeRequestHandler;
	private ChatMessagePacketListener chatMessageListener;
	private GroupChatMessageListener groupChatMessageListener;
	private NetMessageManager messageManager;
	private String user, pswd, token, uid;
	private List<NetEventListener> mListeners = new CopyOnWriteArrayList<NetEventListener>();
	private AtomicBoolean synced = new AtomicBoolean(false); // 同步，完成消息接收准备
	private ConnectionListener defaultListener;
	private AtomicLong lastTime;

	public ProxyClient(ConnectionConfig config, String user, String pswd) {
		this.user = user;
		this.pswd = pswd;
		this.connection = new TChatConnection(config);
		this.messageManager = new NetMessageManagerImpl(this.connection);
	}

	public String getUid() {
		if (uid == null) {
			uid = UUID.randomUUID().toString().replace("-", "");
		}
		return uid;
	}

	public void login() throws NetException {
		try {
			if (connection.isConnected()) {
				connection.disconnect();
			}

			try {
				connection.connect();
			} catch (AlreadyConnectedException ignore) {
			} catch (UnrecoverableKeyException | CertificateException | NoSuchAlgorithmException | KeyStoreException
					| KeyManagementException e) {
				LOGGER.error("JDK密钥配置错误", e);
			}
			this.token = connection.login(user, pswd, getUid());
			SessionUtil.setSessionUserToken(token);
			this.synced.set(true);
		} catch (final LoginErrorException e) {
			e.printStackTrace();
		} catch (AlreadyLoggedInException e) {
			LOGGER.error("用户已登录", e);
		} catch (InterruptedException | NotConnectedException | IOException e) {
			LOGGER.error("其他错误", e);
		} catch (UserDeletedException e) {
			LOGGER.error("用户已被删除", e);
		}
	}

	private synchronized void setSynced(boolean flag) {
		this.synced.set(flag);
		if (flag) {
			this.sendCacheMessage();
		}
	}

	public synchronized int getSynced() {
		if (this.synced.get()) {
			return 1;
		} else {
			return 0;
		}
	}

	public void addListener(NetEventListener listener) {
		if (listener == null) {
			throw new IllegalArgumentException("监听器不可为空");
		}
		mListeners.add(listener);
	}

	public void removeListener(com.mlight.chat.service.net.listeners.NetEventListener listener) {
		mListeners.remove(listener);
	}

	private void fire(Message object) {
		// for (com.mlight.chat.client.service.net.listeners.NetEventListener
		// listener : mListeners) {
		// listener.handleEvent(object);
		// }

		// 将消息放入队列中
		// TODO 存在内存溢出风险
		mailbox.add(object);
	}

	public void onStart() {
		while (!this.synced.get()) {
			try {
				this.login();
			} catch (NetException e) {
				e.printStackTrace();
			}

			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// 重连直到连上为止
		}

		startTimer();
		defaultListener = new DefaultConnectionListener();
		connection.addConnectionListener(defaultListener);

		closeRequestHandler = new CloseRequestHandler();
		connection.addRequestHandler(closeRequestHandler);

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

		try {
			this.messageManager.receiveMessage();
		} catch (NetException e) {
			LOGGER.error("网络错误", e);
		}
	}

	private void stopTimer() {
		if (timer != null) {
			timer.cancel();
			timer = null;
		}
	}

	private void startTimer() {
		if (timer != null) {
			timer.cancel();
			timer = null;
		}
		timer = new Timer();
		timer.schedule(this, REFRESH_TIMEOUT, REFRESH_TIMEOUT);
	}

	public void onStop() {
		stopTimer();

		this.connection.disconnect();
		connection.removeRequestHandler(closeRequestHandler);
		connection.removeMessageListener(requestListener);
		connection.removeMessageListener(chatMessageListener);
		connection.removeMessageListener(groupChatMessageListener);
	}

	@Override
	public void run() {
		if (this.lastTime != null) { // 认为客户端已断开
			long delta = System.currentTimeMillis() - this.lastTime.get();
			LOGGER.debug("delta -> " + delta);
			if (delta > REFRESH_TIMEOUT * 2) {
				this.onStop();
				return;
			}
		}
	}

	// 刷新时间戳
	public void refresh(long t) {
		if (this.lastTime == null) {
			this.lastTime = new AtomicLong();
		}
		this.lastTime.set(t);
	}

	private class CloseRequestHandler implements RequestHandler {
		@Override
		public Mode getMode() {
			return Mode.ASYNC;
		}

		@Override
		public String getHandleUri() {
			return "/close";
		}

		@Override
		public Response handler(Request request) {
			if (connection.isConnected()) {
				connection.disconnect();
			}
			return null;
		}
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
				// fire(group);
			}
			if (request.getUri().equals("/group/delete")) { // 删除群组同步请求
				// fire(Long.valueOf(request.getParam("groupId")));
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
				message1.setReceiver(user);
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
				message1.setReceiver(user);
				if (!message1.getSender().equals(message1.getReceiver())) { // 过滤自己发的群消息
					fire(message1);
				}
			}
		}
	}

	private class DefaultConnectionListener extends ConnectionListenerAdapter {
		@Override
		public void connectionClosed(Connection connection) {
			setSynced(false);
		}

		@Override
		public void connectionClosedOnError(Exception e) {
			setSynced(false);
		}

		@Override
		public void connected(Connection connection) {

		}

		@Override
		public void authenticated(Connection connection) {
			setSynced(true);
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

	/**
	 * 发送新消息 如果发送失败,则回收该消息<br/>
	 * 并返回false
	 */
	public boolean sendFreshMessage(Message message) {
		boolean flag = false;
		try {
			this.messageManager.sendMessage(message);
			flag = true;
		} catch (NetException e) {
			flag = false;
			this.setSynced(false);
			this.resendBox.add(message);
			LOGGER.error(e.getLocalizedMessage(), e.getCause());
		}

		return flag;
	}

	/**
	 * 发送缓存消息 如果发送失败,则回收该消息<br/>
	 * 缓存消息全部发送完成后，设置为true，可以加入新消息
	 */
	public boolean sendCacheMessage() {
		boolean flag = true;
		while (!resendBox.isEmpty() && flag) {
			Message msg = resendBox.peek();
			if (msg != null) {
				try {
					this.messageManager.sendMessage(msg);
					resendBox.poll(); // 如果发送成功则从重发队列中删除
				} catch (NetException e) {
					LOGGER.error(e.getLocalizedMessage(), e.getCause());
					flag = false;
				}
			}
		}
		return flag;
	}

	public synchronized List<Message> receiveMessage() {
		this.refresh(System.currentTimeMillis());
		List<Message> list = new LinkedList<Message>();

		for (int i = 0; i < 20; i++) {
			Message message = mailbox.poll();
			if (message != null) {
				list.add(message);
			} else {
				break;
			}
		}

		return list;
	}
}
