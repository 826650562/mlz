package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.dao.user.User;
import com.mlight.chat.service.net.NetUserManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.UpdateTimeResult;
import com.mlight.chat.service.net.result.UserListResult;
import com.mlight.chat.service.net.result.UserResult;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class NetUserManagerImpl implements NetUserManager {

	private final static String REQUEST_URI_USER_LIST = "/user/list";
	private final static String REQUEST_URI_USER_INFO = "/user/info";
	private final static String REQUEST_URI_USER_UPDATE = "/user/update";

	private TChatConnection connection;

	public NetUserManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public List<User> fetchUsers() throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_USER_LIST);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		UserListResult userListResult = gson.fromJson(responseString, UserListResult.class);
		if (userListResult != null && userListResult.isSuccess()) {
			return userListResult.getData();
		} else {
			return null;
		}
	}

	@Override
	public List<User> fetchUsers(long updateTime) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_USER_LIST);
		request.setParam("updateTime", String.valueOf(updateTime));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		UserListResult userListResult = gson.fromJson(responseString, UserListResult.class);
		if (userListResult != null && userListResult.isSuccess()) {
			return userListResult.getData();
		} else {
			return null;
		}
	}

	@Override
	public User getUserInfoByUsername(String username) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_USER_INFO);
		request.setParam("username", username);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		UserResult userResult = gson.fromJson(responseString, UserResult.class);
		if (userResult != null && userResult.isSuccess()) {
			return userResult.getData();
		} else {
			return null;
		}
	}

	@Override
	public long updateUser(User user) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("username", user.getUsername());
		if (user.getName() != null)
			params.put("name", user.getName());
		if (user.getMobilePhone() != null)
			params.put("mobilePhone", user.getMobilePhone());
		if (user.getPhone() != null)
			params.put("phone", user.getPhone());
		if (user.getEmail() != null)
			params.put("email", user.getEmail());
		if (user.getAvatar() != null)
			params.put("avatar", user.getAvatar());
		if (user.getOriginalAvatar() != null)
			params.put("originalAvatar", user.getOriginalAvatar());
		request.setParams(params);
		request.setUri(REQUEST_URI_USER_UPDATE);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		UpdateTimeResult updateTimeResult = gson.fromJson(responseString, UpdateTimeResult.class);
		if (updateTimeResult != null && updateTimeResult.isSuccess()) {
			return updateTimeResult.getData();
		} else {
			throw new NetException("更新失败");
		}
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onStop() {

	}
}