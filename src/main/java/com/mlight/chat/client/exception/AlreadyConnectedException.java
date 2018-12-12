package com.mlight.chat.client.exception;

public class AlreadyConnectedException extends Exception {
	public AlreadyConnectedException() {
		this("已连接");
	}

	public AlreadyConnectedException(String message) {
		super(message);
	}
}
