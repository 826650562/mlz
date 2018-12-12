package com.mlight.chat.client.exception;

public class NotLoginException extends Exception {

	public NotLoginException() {
		this("未登录");
	}

	public NotLoginException(String message) {
		super(message);
	}

}
