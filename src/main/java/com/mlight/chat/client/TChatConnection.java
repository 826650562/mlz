package com.mlight.chat.client;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.protobuf.CodedInputStream;
import com.google.protobuf.CodedOutputStream;
import com.mlight.chat.client.exception.*;
import com.mlight.chat.client.ping.PingManager;
import com.mlight.chat.client.request.ResponseFilter;
import com.mlight.chat.client.util.ArrayBlockingQueueWithShutdown;
import com.mlight.chat.client.util.Async;
import com.mlight.chat.client.util.SynchronizationPoint;
import com.mlight.chat.message.*;
import com.mlight.chat.protobuf.MessageProto;
import com.mlight.chat.service.net.result.Result;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Description: TChatConnextion Author: chenzhi Update: chenzhi(2015-09-01
 * 17:16)
 */
public class TChatConnection extends AbstractConnection {

	public TChatConnection(ConnectionConfig config) {
		super(config);
	}

	@Override
	protected String loginInternal(String username, String password, String uid)
			throws LoginErrorException, NotConnectedException, InterruptedException, UserDeletedException {
		Request request = new Request();
		request.setId(UUID.randomUUID().toString());
		request.setUri("/user/login");
		request.setParam("username", username);
		request.setParam("password", password);
		request.setParam("uid", uid);
		Response response;
		MessageCollector collector = new MessageCollector(new ResponseFilter(request), this);
		addCollector(collector);
		sendMessageInternal(request);
		response = (Response) collector.nextResult(config.getDefaultTimeout());
		collector.cancel();
		if (response == null) {
			throw new LoginErrorException("登录无响应");
		} else if (response.getStatusCode() == 500) {
			throw new LoginErrorException(response.getStatusMessage());
		} else if (response.getStatusCode() == 400) {
			throw new LoginErrorException(response.getStatusMessage());
		}
		Gson gson = new Gson();
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		if (!result.isSuccess()) {
			if (result.getMessage().equals("deleted")) {
				throw new UserDeletedException();
			} else {
				throw new LoginErrorException(result.getMessage());
			}
		}
		authenticated = true;
		return result.getData();
	}

	@Override
	protected void authInternal(String username, String uid, String token)
			throws InterruptedException, LoginErrorException, UserDeletedException, AuthorizeFailedException {
		Request request = new Request();
		request.setId(UUID.randomUUID().toString());
		request.setUri("/user/auth");
		request.setParam("uid", uid);
		request.setParam("token", token);
		Response response;
		MessageCollector collector = new MessageCollector(new ResponseFilter(request), this);
		addCollector(collector);
		sendMessageInternal(request);
		response = (Response) collector.nextResult(config.getDefaultTimeout());
		collector.cancel();
		if (response == null) {
			throw new LoginErrorException("登录无响应");
		} else if (response.getStatusCode() == 500) {
			throw new LoginErrorException(response.getStatusMessage());
		} else if (response.getStatusCode() == 400) {
			throw new LoginErrorException(response.getStatusMessage());
		}
		Gson gson = new Gson();
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		if (!result.isSuccess()) {
			if (result.getMessage().equals("deleted")) {
				throw new UserDeletedException();
			} else {
				throw new AuthorizeFailedException();
			}
		}
		authenticated = true;
	}

	@Override
	protected void sendMessageInternal(Message message) throws InterruptedException {
		messageWriter.sendMessage(message);
	}

	private static final int QUEUE_SIZE = 500;

	private static final Logger Log = Logger.getLogger(TChatConnection.class.getName());

	private Socket socket;

	@Override
	protected void connectInternal(String host, int port) throws IOException, KeyStoreException, CertificateException,
			NoSuchAlgorithmException, UnrecoverableKeyException, KeyManagementException {

		// SSL
		KeyStore ks = KeyStore.getInstance("PKCS12");
		KeyStore tks = KeyStore.getInstance("BKS");
		InputStream kIn = TChatConnection.class.getResourceAsStream("/client.p12");
		InputStream tIn = TChatConnection.class.getResourceAsStream("/client.truststore");

		ks.load(kIn, "zxcvbn".toCharArray());
		tks.load(tIn, "zxcvbn".toCharArray());

		KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
		kmf.init(ks, "zxcvbn".toCharArray());

		TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
		tmf.init(tks);

		SSLContext sslContext = SSLContext.getInstance("TLS");
		sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);

		SSLSocketFactory socketFactory = sslContext.getSocketFactory();

		// 建立tcp连接
		int timeout = getConfig().getConnectTimeout();
		socket = socketFactory.createSocket();
		InetSocketAddress address = new InetSocketAddress(host, port);
		socket.connect(address, timeout);

		// 初始化连接
		initConnection();
		connected = true;

		// 触发监听
		fireConnectionConnectedListener();
	}

	@Override
	protected void shutdown() {
		if (pingManager != null) {
			pingManager.stop();
		}
		if (messageWriter != null) {
			messageWriter.shutdown();
		}
		if (messageReader != null) {
			messageReader.shutdown();
		}
		try {
			socket.close();
		} catch (IOException e) {
			Log.log(Level.WARNING, "shut down", e);
		}
		connected = false;
		authenticated = false;
		messageReader = null;
		messageWriter = null;
		pingManager = null;
		socket = null;
	}

	private MessageReader messageReader;

	private MessageWriter messageWriter;

	private PingManager pingManager;

	private void initConnection() throws IOException {
		InputStream is = socket.getInputStream();
		OutputStream os = socket.getOutputStream();

		messageReader = new MessageReader(is);
		messageWriter = new MessageWriter(os);

		messageReader.init();
		messageWriter.init();

		pingManager = new PingManager(this, config.getPingInternal(), config.getDefaultTimeout());
		pingManager.start();
	}

	public void disconnectForError(Exception e) {
		notifyConnectionError(e);
	}

	protected class MessageReader {

		MessageReader(InputStream is) {
			this.is = is;
		}

		InputStream is;

		private volatile boolean done;

		void init() {
			done = false;
			Async.go(new Runnable() {
				@Override
				public void run() {
					parseMessage();
				}
			}, "TChat Message Reader");
		}

		void shutdown() {
			done = true;
		}

		private byte[] temp = new byte[1024];

		private int tempLength = 0;

		private void extendTemp() {
			byte[] newTemp = new byte[temp.length + 1024];
			System.arraycopy(temp, 0, newTemp, 0, tempLength);
			temp = newTemp;
		}

		private int availableTemp() {
			return temp.length - tempLength;
		}

		private void parseMessage() {
			try {
				while (!done) {
					byte[] buffer = new byte[1024];
					int read = is.read(buffer);
					if (read == -1) {
						break;
					}
					if (availableTemp() < read) {
						extendTemp();
					}
					System.arraycopy(buffer, 0, temp, tempLength, read);
					tempLength = tempLength + read;
					boolean done = false;
					while (!done && tempLength >= 5) {
						for (int i = 0; i < 5; i++) {
							if (temp[i] >= 0) {
								int length = CodedInputStream.newInstance(temp, 0, i + 1).readRawVarint32();
								if (length < 0) {
									throw new CorruptedFrameException("negative length: " + length);
								}
								if (tempLength - i >= length) {
									byte[] messageBytes = new byte[length];
									System.arraycopy(temp, i + 1, messageBytes, 0, length);
									MessageProto.Message message = MessageProto.Message.parseFrom(messageBytes);
									AbstractMessage abstractMessage;
									switch (message.getType()) {
									case MESSAGE:
										abstractMessage = new NormalMessage();
										break;
									case REPLY:
										abstractMessage = new ReplyMessage();
										break;
									case REQUEST:
										abstractMessage = new Request();
										break;
									case RESPONSE:
										abstractMessage = new Response();
										break;
									case PING:
										abstractMessage = new Ping();
										break;
									case PONG:
										abstractMessage = new Pong();
										break;
									default:
										abstractMessage = new NormalMessage();
										break;
									}
									abstractMessage.setBody(message.getBody());
									if (message.getParamFieldCount() > 0) {
										for (MessageProto.Message.ParamFieldEntry entry : message.getParamFieldList()) {
											abstractMessage.setParam(entry.getName(), entry.getValue());
										}
									}
									processMessage(abstractMessage);
									System.arraycopy(temp, length + i + 1, temp, 0, tempLength - length - i - 1);
									tempLength = tempLength - length - i - 1;
								} else {
									done = true;
								}
								break;
							}
						}
					}
				}
			} catch (Exception e) {
				if (!(done || messageWriter.queue.isShutdown())) {
					// Close the connection and notify connection listeners of
					// the
					// error.
					notifyConnectionError(e);
				}
			}
		}
	}

	private synchronized void notifyConnectionError(Exception e) {
		// Listeners were already notified of the exception, return right here.
		if ((messageReader == null || messageReader.done) && (messageWriter == null || messageWriter.done()))
			return;

		shutdown();

		// Notify connection listeners of the error.
		fireConnectionClosedOnErrorListener(e);
	}

	protected class MessageWriter {

		public static final int QUEUE_SIZE = TChatConnection.QUEUE_SIZE;

		private final ArrayBlockingQueueWithShutdown<Message> queue = new ArrayBlockingQueueWithShutdown<Message>(
				QUEUE_SIZE, true);

		MessageWriter(OutputStream os) {
			this.os = os;
		}

		OutputStream os;

		protected volatile Long shutdownTimestamp = null;

		void init() {
			shutdownDone.init();
			shutdownTimestamp = null;
			queue.start();
			Async.go(new Runnable() {
				@Override
				public void run() {
					writeMessages();
				}
			}, "TChat Message Writer");
		}

		private boolean done() {
			return shutdownTimestamp != null;
		}

		protected void sendMessage(Message message) throws InterruptedException {
			if (message.getParams() != null) {
				message.getParams().put("begin", String.valueOf(System.currentTimeMillis()));
			}
			queue.put(message);
		}

		protected void throwNotConnectedExceptionIfDone() throws NotConnectedException {
			boolean done = done();
			if (done)
				throw new NotConnectedException();
		}

		private SynchronizationPoint<NoResponseException> shutdownDone = new SynchronizationPoint<NoResponseException>(
				TChatConnection.this, "shutdown completed");

		void shutdown() {
			queue.shutdown();
			shutdownTimestamp = System.currentTimeMillis();
			try {
				shutdownDone.checkIfSuccessOrWait();
			} catch (NoResponseException e) {
				e.printStackTrace();
				Log.log(Level.WARNING, "shutdownDone was not marked as successful by the writer thread", e);
			} catch (InterruptedException e) {
				e.printStackTrace();
				Log.log(Level.WARNING, "shutdownDone was not marked as successful by the writer thread", e);
			}
		}

		void writeMessages() {
			try {
				while (!done()) {
					Message message = nextMessage();
					if (message == null) {
						continue;
					}
					if (message.getParams() != null) {
						long time = Long.valueOf(message.getParams().get("begin"));
						System.out.println(
								message.getParams().get("id") + " 发送消息耗时: " + (System.currentTimeMillis() - time));
					}
					MessageProto.Message.Builder builder = MessageProto.Message.newBuilder();
					builder.setType(MessageProto.Message.Type.valueOf(message.getType().getValue()));
					for (Map.Entry<String, String> entry : message.getParams().entrySet()) {
						builder.addParamField(MessageProto.Message.ParamFieldEntry.newBuilder().setName(entry.getKey())
								.setValue(entry.getValue()));
					}
					if (message.getBody() != null) {
						builder.setBody(message.getBody());
					}
					byte[] body = builder.build().toByteArray();
					int bodyLen = body.length;
					int headLen = CodedOutputStream.computeRawVarint32Size(bodyLen);
					byte[] head = new byte[headLen];
					CodedOutputStream headerOut = CodedOutputStream.newInstance(head);
					headerOut.writeRawVarint32(bodyLen);
					headerOut.flush();
					os.write(head);
					os.write(body);
					os.flush();
				}
				System.out.println("MessageWriter is close!");
			} catch (Exception e) {
				if (!(done() || queue.isShutdown())) {
					notifyConnectionError(e);
				} else {
					Log.log(Level.FINE, "Ignoring Exception in writeMessages()", e);
				}
				System.out.println("MessageWriter is close!");
			} finally {
				shutdownDone.reportSuccess();
			}
		}

		private Message nextMessage() {
			Message message = null;
			try {
				message = queue.take();
			} catch (InterruptedException e) {
				if (!queue.isShutdown()) {
					// Users shouldn't try to interrupt the packet writer thread
					Log.log(Level.WARNING,
							"Message writer thread was interrupted. Don't do that. Use disconnect() instead.", e);
				}
			}
			return message;
		}
	}

}
