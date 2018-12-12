package com.mlight.chat.client.exception;

import com.mlight.chat.client.AbstractConnection;

/**
 * Description: NoResponseException Author: chenzhi Update: chenzhi(2015-09-01
 * 16:56)
 */
public class NoResponseException extends Exception {

	private AbstractConnection connection;
	private String waitFor;

	public AbstractConnection getConnection() {
		return connection;
	}

	public String getWaitFor() {
		return waitFor;
	}

	public static NoResponseException newWith(AbstractConnection connection, String waitFor) {
		NoResponseException exception = new NoResponseException();
		exception.connection = connection;
		exception.waitFor = waitFor;
		return exception;
	}
}
