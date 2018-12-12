package com.mlight.chat.service.net;

import com.mlight.chat.service.dao.user.User;
import com.mlight.chat.service.net.exceptions.NetException;

import java.util.List;

public interface NetUserManager extends BaseNet {

	/**
	 * 从服务器端获取所有用户信息
	 *
	 * @return 用户列表信息
	 */
	List<User> fetchUsers() throws NetException;

	/**
	 * 从服务器端获取更新时间在updateTime之后的所有用户信息
	 *
	 * @param updateTime
	 *            创建用户时间
	 * @return 用户信息
	 */
	List<User> fetchUsers(long updateTime) throws NetException;

	/**
	 * 查询用户信息
	 *
	 * @param username
	 *            用户名
	 * @return 用户列表信息
	 */
	User getUserInfoByUsername(String username) throws NetException;

	/**
	 * 更新用户信息
	 *
	 * @param user
	 *            用户信息
	 * @return 最后更新时间
	 */
	long updateUser(User user) throws NetException;

}
