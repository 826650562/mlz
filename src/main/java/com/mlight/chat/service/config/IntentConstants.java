package com.mlight.chat.service.config;

/**
 * Intent相关常量值，命名规则： 1. intent的action以 ACTION_ 开头； 2. intent的extra以 EXTRA_ 开头；
 */
public class IntentConstants {

	/**
	 * ACTION_
	 */
	public static final String ACTION_BROADCAST_CONNECTION_STATE_CHANGE = "connection_state_change_broadcast";
	public static final String ACTION_BROADCAST_LOGIN_STATE_CHANGE = "login_state_change";

	/**
	 * EXTRA_
	 */
	public static final String EXTRA_INT_CONNECTION_STATE = "extra_int_connection_state";
	public static final String EXTRA_BOOLEAN_LOGIN_STATE = "extra_login_state";
}