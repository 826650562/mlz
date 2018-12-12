package com.mlight.chat.client.exception;

/**
 * Created by chenzhi on 16/1/13.
 */
public class UserDeletedException extends Exception {

	public UserDeletedException() {
		this("该用户已被注销!");
	}

	public UserDeletedException(String message) {
		super(message);
	}

}
