package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.net.NetFeedbackManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.Result;

public class NetFeedbackManagerImpl implements NetFeedbackManager {

	private final static String REQUEST_URI_FEEDBACK_SUBMIT = "/feedback/submit";

	private TChatConnection connection;

	public NetFeedbackManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public boolean submit(String feedback) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_FEEDBACK_SUBMIT);
		request.setParam("feedback", feedback);
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
