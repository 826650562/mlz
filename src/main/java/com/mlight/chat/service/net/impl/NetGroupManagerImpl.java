package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.dao.group.GroupInfo;
import com.mlight.chat.service.models.group.GroupVCard;
import com.mlight.chat.service.models.user.UserAbs;
import com.mlight.chat.service.net.NetGroupManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class NetGroupManagerImpl implements NetGroupManager {

	private final static String REQUEST_URI_GROUP_LIST = "/group/list";
	private final static String REQUEST_URI_GROUP_INFO = "/group/info";
	private final static String REQUEST_URI_GROUP_CREATE = "/group/create";
	private final static String REQUEST_URI_GROUP_UPDATE = "/group/update";
	private final static String REQUEST_URI_GROUP_JOIN = "/group/join";
	private final static String REQUEST_URI_GROUP_MEMBER_NOT_JOINED = "/group/member/not-joined";
	private final static String REQUEST_URI_GROUP_MEMBER_ADD = "/group/member/add";
	private final static String REQUEST_URI_GROUP_MEMBER_DELETE = "/group/member/delete";
	private final static String REQUEST_URI_GROUP_MEMBER_LIST = "/group/member/list";
	private final static String REQUEST_URI_GROUP_EXIT = "/group/exit";
	private final static String REQUEST_URI_GROUP_CANCEL = "/group/dissolve";
	private final static String REQUEST_URI_GROUP_EXISTED = "/group/groupMemberExisted";

	private TChatConnection connection;

	public NetGroupManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public List<GroupInfo> fetchGroups() throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_LIST);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		GroupListResult groupListResult = gson.fromJson(responseString, GroupListResult.class);
		if (groupListResult != null && groupListResult.isSuccess()) {
			return groupListResult.getData();
		}
		return null;
	}

	@Override
	public List<GroupInfo> fetchGroups(long updateTime) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_LIST);
		request.setParam("updateTime", String.valueOf(updateTime));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		GroupListResult groupListResult = gson.fromJson(responseString, GroupListResult.class);
		if (groupListResult != null && groupListResult.isSuccess()) {
			return groupListResult.getData();
		}
		return null;
	}

	@Override
	public GroupInfo getGroupInfo(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_INFO);
		request.setParam("groupId", String.valueOf(groupId));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		GroupInfoResult groupInfoResult = gson.fromJson(responseString, GroupInfoResult.class);
		if (groupInfoResult != null && groupInfoResult.isSuccess()) {
			return groupInfoResult.getData();
		}
		return null;
	}

	@Override
	public long updateGroupName(long groupId, String newName) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("groupId", String.valueOf(groupId));
		params.put("name", newName);
		request.setParams(params);
		request.setUri(REQUEST_URI_GROUP_UPDATE);
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
	public GroupInfo createGroup(String name, List<String> members) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("name", name);
		Gson gson = new Gson();
		String membersString = gson.toJson(members);
		params.put("users", membersString);
		request.setParams(params);
		request.setUri(REQUEST_URI_GROUP_CREATE);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		GroupResult groupResult = gson.fromJson(responseString, GroupResult.class);
		if (groupResult != null && groupResult.isSuccess()) {
			return groupResult.getData();
		}
		return null;
	}

	@Override
	public GroupInfo joinGroup(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_JOIN);
		request.setParam("groupId", String.valueOf(groupId));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		GroupResult groupResult = gson.fromJson(responseString, GroupResult.class);
		if (groupResult != null && groupResult.isSuccess()) {
			return groupResult.getData();
		}
		return null;
	}

	@Override
	public List<UserAbs> getUsersNotInGroup(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_MEMBER_NOT_JOINED);
		request.setParam("groupId", String.valueOf(groupId));
		Gson gson = new Gson();
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		UserListNotInGroupResult result = gson.fromJson(responseString, UserListNotInGroupResult.class);
		if (result != null && result.isSuccess()) {
			return result.getData();
		} else {
			return null;
		}
	}

	@Override
	public void addGroupMembers(long groupId, List<String> members) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("groupId", String.valueOf(groupId));
		Gson gson = new Gson();
		String membersString = gson.toJson(members);
		params.put("users", membersString);
		request.setParams(params);
		request.setUri(REQUEST_URI_GROUP_MEMBER_ADD);
		Response response = simpleClient.execute(request);
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		if (!result.isSuccess()) {
			throw new NetException("添加失败");
		}
	}

	@Override
	public void deleteGroupMembers(long groupId, List<String> members) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("groupId", String.valueOf(groupId));
		Gson gson = new Gson();
		String membersString = gson.toJson(members);
		params.put("users", membersString);
		request.setParams(params);
		request.setUri(REQUEST_URI_GROUP_MEMBER_DELETE);
		Response response = simpleClient.execute(request);
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		if (!result.isSuccess()) {
			throw new NetException("删除失败");
		}
	}

	@Override
	public List<GroupVCard> getGroupMembers(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("groupId", String.valueOf(groupId));
		request.setParams(params);
		request.setUri(REQUEST_URI_GROUP_MEMBER_LIST);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		GroupVCardListResult groupVCardListResult = gson.fromJson(responseString, GroupVCardListResult.class);
		if (groupVCardListResult != null && groupVCardListResult.isSuccess()) {
			return groupVCardListResult.getData();
		} else {
			throw new NetException(groupVCardListResult.getMessage());
		}
	}

	@Override
	public boolean exitGroup(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_EXIT);
		request.setParam("groupId", String.valueOf(groupId));
		Response response = simpleClient.execute(request);
		Gson gson = new Gson();
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		return result != null && result.isSuccess();
	}

	@Override
	public boolean dissolveGroup(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_CANCEL);
		request.setParam("groupId", String.valueOf(groupId));
		Response response = simpleClient.execute(request);
		Gson gson = new Gson();
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		return result != null && result.isSuccess();
	}

	@Override
	public boolean groupMemberExisted(long groupId) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_GROUP_EXISTED);
		request.setParam("groupId", String.valueOf(groupId));
		Response response = simpleClient.execute(request);
		Gson gson = new Gson();
		Result<Map<String, Boolean>> result = gson.fromJson(response.getBody(),
				new TypeToken<Result<Map<String, Boolean>>>() {
				}.getType());
		Map<String, Boolean> map = result.getData();
		boolean existed = map.get("existed");
		return existed;
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onStop() {

	}
}
