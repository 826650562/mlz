package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.dao.department.Department;
import com.mlight.chat.service.net.NetDepartmentManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.result.DepartmentListResult;

import java.util.ArrayList;
import java.util.List;

public class NetDepartmentManagerImpl implements NetDepartmentManager {

	private static final String REQUEST_URI_ORG_LIST = "/department/list";

	private TChatConnection connection;

	public NetDepartmentManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public List<Department> fetchDepartments() throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_ORG_LIST);
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		DepartmentListResult departmentListResult = gson.fromJson(responseString, DepartmentListResult.class);
		List<Department> departments = new ArrayList<Department>();
		if (departmentListResult.getData() != null && departmentListResult.getData().size() > 0) {
			for (Department department : departmentListResult.getData()) {
				departments.add(department);
			}
		}
		return departments;
	}

	@Override
	public List<Department> fetchDepartments(long updateTime) throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_ORG_LIST);
		request.setParam("updateTime", String.valueOf(updateTime));
		Response response = simpleClient.execute(request);
		String responseString = response.getBody();
		Gson gson = new Gson();
		DepartmentListResult departmentListResult = gson.fromJson(responseString, DepartmentListResult.class);
		List<Department> departments = new ArrayList<Department>();
		if (departmentListResult.getData() != null && departmentListResult.getData().size() > 0) {
			for (Department department : departmentListResult.getData()) {
				departments.add(department);
			}
		}

		return departments;
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onStop() {

	}
}