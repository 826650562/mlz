package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.net.NetAccountManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.Result;

import java.util.LinkedHashMap;
import java.util.Map;

public class NetAccountManagerImpl implements NetAccountManager {

	private final static String CHANGE_PASSWORD = "/user/changepassword";

	TChatConnection connection;

	public NetAccountManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public boolean changePassword(String username, String oldPassword, String newPassword) throws NetException {

		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("username", username);
		params.put("oldPassword", oldPassword);
		params.put("newPassword", newPassword);
		request.setParams(params);
		request.setUri(CHANGE_PASSWORD);
		Response response = simpleClient.execute(request);
		Gson gson = new Gson();
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		return result != null && result.isSuccess();
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onStop() {

	}
}
