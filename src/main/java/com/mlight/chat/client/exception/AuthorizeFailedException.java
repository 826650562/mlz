package com.mlight.chat.client.exception;

/**
 * Created by chenzhi on 16/3/7.
 */
public class AuthorizeFailedException extends Exception {

	public AuthorizeFailedException() {
		super("授权验证失败,请重新登录");
	}

}
