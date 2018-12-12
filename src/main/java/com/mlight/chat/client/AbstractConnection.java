package com.mlight.chat.client;

import com.mlight.chat.client.exception.*;
import com.mlight.chat.client.request.RequestHandler;
import com.mlight.chat.client.request.ResponseFilter;
import com.mlight.chat.client.util.TChatExecutorThreadFactory;
import com.mlight.chat.message.*;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Level;
import java.util.logging.Logger;

public abstract class AbstractConnection implements Connection {

	private static final Logger logger = Logger.getLogger(AbstractConnection.class.getName());

	protected final Lock connectionLock = new ReentrantLock();

	public Lock getConnectionLock() {
		return connectionLock;
	}

	private int replyTimeout;

	public int getReplyTimeout() {
		return replyTimeout;
	}

	// 连接

	protected final ConnectionConfig config;

	protected AbstractConnection(ConnectionConfig config) {
		this.config = config;
		this.replyTimeout = config.getDefaultTimeout();
		this.host = config.getHost();
		this.port = config.getPort();
	}

	public ConnectionConfig getConfig() {
		return config;
	}

	protected String host;
	protected int port;
	protected boolean connected = false;

	@Override
	public String getHost() {
		return host;
	}

	@Override
	public int getPort() {
		return port;
	}

	@Override
	public boolean isConnected() {
		return connected;
	}

	protected final Set<ConnectionListener> connectionListeners = new CopyOnWriteArraySet<ConnectionListener>();

	@Override
	public void addConnectionListener(ConnectionListener listener) {
		if (listener == null) {
			return;
		}
		connectionListeners.add(listener);
	}

	@Override
	public void removeConnectionListener(ConnectionListener listener) {
		connectionListeners.remove(listener);
	}

	public synchronized void connect() throws AlreadyConnectedException, IOException, UnrecoverableKeyException,
			CertificateException, NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
		throwAlreadyConnectedExceptionIfAppropriate();
		connectInternal(host, port);
	}

	protected abstract void connectInternal(String host, int port) throws IOException, KeyStoreException,
			CertificateException, NoSuchAlgorithmException, UnrecoverableKeyException, KeyManagementException;

	// 断开连接

	public synchronized void disconnect() {
		if (connected) {
			shutdown();
			fireConnectionClosedListener();
		}
	}

	protected abstract void shutdown();

	// 登录

	private String username;

	@Override
	public String getUser() {
		return username;
	}

	protected boolean authenticated = false;

	@Override
	public boolean isAuthenticated() {
		return authenticated;
	}

	public synchronized String login(String username, String password, String uid) throws NotConnectedException,
			AlreadyLoggedInException, LoginErrorException, InterruptedException, UserDeletedException {
		throwNotConnectedExceptionIfAppropriate();
		throwAlreadyLoggedInExceptionIfAppropriate();
		this.username = username;
		String token = loginInternal(username, password, uid);
		fireConnectionAuthenticatedListener();
		return token;
	}

	public synchronized void auth(String username, String uid, String token)
			throws NotConnectedException, AlreadyLoggedInException, InterruptedException, LoginErrorException,
			AuthorizeFailedException, UserDeletedException {
		throwNotConnectedExceptionIfAppropriate();
		throwAlreadyLoggedInExceptionIfAppropriate();
		this.username = username;
		authInternal(username, uid, token);
		fireConnectionAuthenticatedListener();
	}

	protected abstract String loginInternal(String username, String password, String uid)
			throws LoginErrorException, NotConnectedException, InterruptedException, UserDeletedException;

	protected abstract void authInternal(String username, String uid, String token)
			throws InterruptedException, LoginErrorException, UserDeletedException, AuthorizeFailedException;

	// 消息处理

	// 1. 消息响应监听

	private final Collection<MessageCollector> collectors = new LinkedBlockingQueue<>();

	@Override
	public MessageCollector createMessageCollectorAndSend(Request request)
			throws NotConnectedException, InterruptedException {
		request.setId(UUID.randomUUID().toString());
		ResponseFilter filter = new ResponseFilter(request);
		return createMessageCollectorAndSend(filter, request);
	}

	@Override
	public MessageCollector createMessageCollectorAndSend(MessageFilter filter, Message message)
			throws NotConnectedException, InterruptedException {
		throwNotConnectedExceptionIfAppropriate();
		MessageCollector collector = new MessageCollector(filter, this);
		collectors.add(collector);
		sendMessage(message);
		return collector;
	}

	protected void addCollector(MessageCollector collector) {
		collectors.add(collector);
	}

	@Override
	public void removeCollector(MessageCollector collector) {
		collectors.remove(collector);
	}

	// 2. 消息监听

	private final Map<MessageListener, ListenerWrapper> messageListeners = new LinkedHashMap<MessageListener, ListenerWrapper>();

	@Override
	public void addMessageListener(MessageListener listener, MessageFilter filter) {
		if (listener == null) {
			throw new NullPointerException("消息监听器为null");
		}
		ListenerWrapper listenerWrapper = new ListenerWrapper(listener, filter);
		synchronized (messageListeners) {
			messageListeners.put(listener, listenerWrapper);
		}
	}

	@Override
	public void removeMessageListener(MessageListener listener) {
		synchronized (messageListeners) {
			messageListeners.remove(listener);
		}
	}

	// 3. 请求处理

	private final Map<String, RequestHandler> requestHandlers = new LinkedHashMap<String, RequestHandler>();

	@Override
	public void addRequestHandler(RequestHandler handler) {
		if (handler == null) {
			throw new NullPointerException("请求处理器为null");
		}
		synchronized (requestHandlers) {
			requestHandlers.put(handler.getHandleUri(), handler);
		}
	}

	@Override
	public void removeRequestHandler(RequestHandler handler) {
		synchronized (requestHandlers) {
			requestHandlers.remove(handler.getHandleUri());
		}
	}

	// 4. 消息处理

	private final ThreadPoolExecutor executorService = new ThreadPoolExecutor(1, 1, 0, TimeUnit.SECONDS,
			new ArrayBlockingQueue<Runnable>(100), new TChatExecutorThreadFactory("Incoming Processor"));

	private final ExecutorService cachedExecutorService = Executors
			.newCachedThreadPool(new TChatExecutorThreadFactory("Cached Executor"));

	private final ExecutorService singleThreadedExecutorService = Executors
			.newSingleThreadExecutor(new TChatExecutorThreadFactory("Single Thread Executor"));

	protected void processMessage(final Message message) {
		assert (message != null);
		executorService.submit(new Runnable() {
			@Override
			public void run() {
				invokeCollectorsAndListeners(message);
			}
		});
	}

	protected void invokeCollectorsAndListeners(final Message message) {
		// 请求处理
		if (message instanceof Request) {
			final Request request = (Request) message;
			final RequestHandler requestHandler;
			synchronized (requestHandlers) {
				requestHandler = requestHandlers.get(request.getUri());
			}
			if (requestHandler == null) {
				logger.warning("无法找到uri为" + request.getUri() + "的请求的handler");
				return;
			}
			ExecutorService executorService;
			if (requestHandler.getMode() == RequestHandler.Mode.SYNC) {
				executorService = singleThreadedExecutorService;
			} else {
				executorService = cachedExecutorService;
			}
			executorService.execute(new Runnable() {
				@Override
				public void run() {
					Response response = requestHandler.handler(request);
					if (response == null) {
						logger.warning("请求无响应内容");
						return;
					}
					try {
						sendMessage(response);
					} catch (NotConnectedException | InterruptedException e) {
						logger.log(Level.WARNING, "请求响应发送失败", e);
					}
				}
			});
		} else if (message instanceof NormalMessage) {
			ReplyMessage replyMessage = new ReplyMessage();
			replyMessage.setId(((NormalMessage) message).getId());
			try {
				sendMessage(replyMessage);
			} catch (NotConnectedException | InterruptedException e) {
				logger.warning(e.getMessage());
			}
		}

		for (MessageCollector collector : collectors) {
			collector.processMessage(message);
		}

		Collection<MessageListener> listenerNotify = new LinkedList<MessageListener>();
		synchronized (messageListeners) {
			for (ListenerWrapper listenerWrapper : messageListeners.values()) {
				if (listenerWrapper.getMessageFilter() == null || listenerWrapper.getMessageFilter().accept(message)) {
					listenerNotify.add(listenerWrapper.getMessageListener());
				}
			}
		}

		for (final MessageListener listener : listenerNotify) {
			ExecutorService executorService;
			if (listener.getMode() == MessageListener.Mode.SYNC) {
				executorService = singleThreadedExecutorService;
			} else {
				executorService = cachedExecutorService;
			}
			executorService.execute(new Runnable() {
				@Override
				public void run() {
					listener.processMessage(message);
				}
			});
		}
	}

	// 5. 消息发送
	@Override
	public void sendMessage(Message message) throws NotConnectedException, InterruptedException {
		throwNotConnectedExceptionIfAppropriate();
		sendMessageInternal(message);
	}

	protected abstract void sendMessageInternal(Message message) throws InterruptedException;

	// 6. 触发监听器

	protected void fireConnectionConnectedListener() {
		for (ConnectionListener listener : connectionListeners) {
			listener.connected(this);
		}
	}

	protected void fireConnectionAuthenticatedListener() {
		for (ConnectionListener listener : connectionListeners) {
			listener.authenticated(this);
		}
	}

	protected void fireConnectionClosedListener() {
		for (ConnectionListener listener : connectionListeners) {
			listener.connectionClosed(this);
		}
	}

	protected void fireConnectionClosedOnErrorListener(Exception e) {
		logger.log(Level.WARNING, "Connection " + this + " closed with error", e);
		for (ConnectionListener listener : connectionListeners) {
			try {
				listener.connectionClosedOnError(e);
			} catch (Exception e2) {
				// Catch and print any exception so we can recover
				// from a faulty listener
				logger.log(Level.SEVERE, "Error in listener while closing connection", e2);
			}
		}
	}

	protected void throwNotConnectedExceptionIfAppropriate() throws NotConnectedException {
		if (!isConnected()) {
			throw new NotConnectedException();
		}
	}

	protected void throwAlreadyConnectedExceptionIfAppropriate() throws AlreadyConnectedException {
		if (isConnected()) {
			throw new AlreadyConnectedException();
		}
	}

	protected void throwAlreadyLoggedInExceptionIfAppropriate() throws AlreadyLoggedInException {
		if (isAuthenticated()) {
			throw new AlreadyLoggedInException();
		}
	}

	protected static class ListenerWrapper {
		private final MessageListener messageListener;
		private final MessageFilter messageFilter;

		public ListenerWrapper(MessageListener messageListener, MessageFilter messageFilter) {
			this.messageFilter = messageFilter;
			this.messageListener = messageListener;
		}

		public MessageFilter getMessageFilter() {
			return messageFilter;
		}

		public MessageListener getMessageListener() {
			return messageListener;
		}
	}
}
