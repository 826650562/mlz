package com.mlight.chat.client;

import com.mlight.chat.client.exception.NotConnectedException;
import com.mlight.chat.client.request.RequestHandler;
import com.mlight.chat.message.Message;
import com.mlight.chat.message.Request;

public interface Connection {

	String getHost();

	String getUser();

	int getPort();

	boolean isAuthenticated();

	boolean isConnected();

	void addConnectionListener(ConnectionListener listener);

	void removeConnectionListener(ConnectionListener listener);

	void addMessageListener(MessageListener listener, MessageFilter filter);

	void removeMessageListener(MessageListener listener);

	void addRequestHandler(RequestHandler handler);

	void removeRequestHandler(RequestHandler handler);

	MessageCollector createMessageCollectorAndSend(Request request) throws NotConnectedException, InterruptedException;

	MessageCollector createMessageCollectorAndSend(MessageFilter filter, Message message)
			throws NotConnectedException, InterruptedException;

	void removeCollector(MessageCollector collector);

	void sendMessage(Message message) throws NotConnectedException, InterruptedException;
}
