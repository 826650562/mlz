package com.mlight.chat.client;

public interface ConnectionListener {
	void connected(Connection connection);

	void authenticated(Connection connection);

	void connectionClosed(Connection connection);

	void connectionClosedOnError(Exception e);
}
