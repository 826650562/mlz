package com.mlight.chat.client.exception;

/**
 * Created by chenzhi on 15/10/20.
 */
public class LoginErrorException extends Exception {

	public LoginErrorException() {
		this("登录错误！");
	}

	public LoginErrorException(String message) {
		super(message);
	}

}
