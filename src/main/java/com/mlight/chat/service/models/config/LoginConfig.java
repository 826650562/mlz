package com.mlight.chat.service.models.config;

import com.mlight.chat.service.utils.StringUtil;

import java.util.UUID;

/**
 * 登录配置信息.
 */
public class LoginConfig {
	private static LoginConfig instance = null; // 单例模式
	private String username; // 用户名
	private String password; // 密码
	private Boolean isLogin; // 是否已登录 true:已登录 false:未登录

	private String uid;
	private String token;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setLogin(boolean isLogin) {
		this.isLogin = isLogin;
	}

	public boolean isLogin() {
		return isLogin;
	}

	public String getUid() {
		if (StringUtil.empty(uid)) {
			uid = UUID.randomUUID().toString().replace("-", "");
		}
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public static LoginConfig getLoginConfig() {
		return instance;
	}

	public static void saveLoginConfig(LoginConfig loginConfig) {
		instance = loginConfig;
	}
}