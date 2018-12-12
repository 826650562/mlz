package com.mlight.chat.client.exception;

public class AlreadyLoggedInException extends Exception {

	public AlreadyLoggedInException() {
		this("已登陆");
	}

	public AlreadyLoggedInException(String message) {
		super(message);
	}

}
