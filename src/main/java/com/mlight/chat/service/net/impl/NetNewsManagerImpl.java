package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.models.news.News;
import com.mlight.chat.service.net.NetNewsManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.NewsListResult;
import com.mlight.chat.service.net.result.NewsResult;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class NetNewsManagerImpl implements NetNewsManager {

	private final static String REQUEST_URI_NEWS_LIST = "/news/list";
	private final static String REQUEST_URI_NEWS_INFO = "/news/info";

	private TChatConnection connection;

	public NetNewsManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public List<News> fetchNewsList(int pageNo, int pageSize) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new com.mlight.chat.message.Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("pageNo", String.valueOf(pageNo));
		params.put("pageSize", String.valueOf(pageSize));
		request.setParams(params);
		request.setUri(REQUEST_URI_NEWS_LIST);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		NewsListResult newsListResult = gson.fromJson(responseString, NewsListResult.class);
		if (newsListResult != null && newsListResult.isSuccess()) {
			return newsListResult.getData();
		} else {
			return null;
		}
	}

	@Override
	public News getNewsInfoById(long id) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_NEWS_INFO);
		request.setParam("id", String.valueOf(id));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		NewsResult newsResult = gson.fromJson(responseString, NewsResult.class);
		if (newsResult != null && newsResult.isSuccess()) {
			return newsResult.getData();
		} else {
			return null;
		}
	}
}
