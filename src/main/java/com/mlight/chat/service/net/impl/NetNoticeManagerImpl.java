package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.models.notice.Notice;
import com.mlight.chat.service.net.NetNoticeManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.NoticeListResult;
import com.mlight.chat.service.net.result.NoticeResult;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class NetNoticeManagerImpl implements NetNoticeManager {

	private final static String REQUEST_URI_NOTICE_LIST = "/notice/list";
	private final static String REQUEST_URI_NOTICE_INFO = "/notice/info";

	private TChatConnection connection;

	public NetNoticeManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public List<Notice> fetchNoticeList(int pageNo, int pageSize) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("pageNo", String.valueOf(pageNo));
		params.put("pageSize", String.valueOf(pageSize));
		request.setParams(params);
		request.setUri(REQUEST_URI_NOTICE_LIST);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		NoticeListResult noticeListResult = gson.fromJson(responseString, NoticeListResult.class);
		if (noticeListResult != null && noticeListResult.isSuccess()) {
			return noticeListResult.getData();
		} else {
			return null;
		}
	}

	@Override
	public Notice getNoticeInfoById(long id) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_NOTICE_INFO);
		request.setParam("id", String.valueOf(id));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		NoticeResult noticeResult = gson.fromJson(responseString, NoticeResult.class);
		if (noticeResult != null && noticeResult.isSuccess()) {
			return noticeResult.getData();
		} else {
			return null;
		}
	}
}
