package com.mlight.chat.service.net;

import com.mlight.chat.service.dao.department.Department;
import com.mlight.chat.service.net.exceptions.NetException;

import java.util.List;

public interface NetDepartmentManager extends BaseNet {

	/**
	 * 从服务器端获取所有部门信息
	 *
	 * @return 部门列表信息
	 */
	List<Department> fetchDepartments() throws NetException;

	/**
	 * 从服务器获取同步时间在updateTime之后的所有部门信息
	 *
	 * @param updateTime
	 *            请求同步时间
	 * @return 部门列表信息
	 */
	List<Department> fetchDepartments(long updateTime) throws NetException;
}
