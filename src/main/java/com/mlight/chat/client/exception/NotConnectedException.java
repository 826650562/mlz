package com.mlight.chat.client.exception;

public class NotConnectedException extends Exception {

	public NotConnectedException() {
		this("连接未建立");
	}

	public NotConnectedException(String message) {
		super(message);
	}

}
