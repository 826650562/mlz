package com.mlight.chat.service.net;

import com.mlight.chat.service.dao.group.GroupInfo;
import com.mlight.chat.service.models.group.GroupVCard;
import com.mlight.chat.service.models.user.UserAbs;
import com.mlight.chat.service.net.exceptions.NetException;

import java.util.List;

public interface NetGroupManager extends BaseNet {

	/**
	 * 从服务器获取所有群组列表信息
	 *
	 * @return 群组列表信息
	 * @throws NetException
	 */
	List<GroupInfo> fetchGroups() throws NetException;

	/**
	 * 从服务器获取最近同步时间updateTime之后的所有群组列表信息
	 *
	 * @param updateTime
	 * @return 群组列表信息
	 * @throws NetException
	 */
	List<GroupInfo> fetchGroups(long updateTime) throws NetException;

	/**
	 * 查询群详细信息
	 *
	 * @param groupId
	 *            群id
	 * @return 群详细信息
	 * @throws NetException
	 */
	GroupInfo getGroupInfo(long groupId) throws NetException;

	/**
	 * 更新群名称
	 *
	 * @param groupId
	 *            群id
	 * @param newName
	 *            群名称
	 * @return 版本号
	 * @throws NetException
	 */
	long updateGroupName(long groupId, String newName) throws NetException;

	/**
	 * 创建群组
	 *
	 * @param name
	 *            群名称
	 * @param members
	 *            用户列表信息
	 * @return 群信息
	 * @throws NetException
	 */
	GroupInfo createGroup(String name, List<String> members) throws NetException;

	/**
	 * 加入群
	 *
	 * @param groupId
	 *            群id
	 * @return 群信息
	 * @throws NetException
	 */
	GroupInfo joinGroup(long groupId) throws NetException;

	/**
	 * 从服务器查询当前非群成员用户列表信息
	 *
	 * @param groupId
	 *            群id
	 * @return 用户简要信息列表
	 * @throws NetException
	 */
	List<UserAbs> getUsersNotInGroup(long groupId) throws NetException;

	/**
	 * 添加群成员
	 *
	 * @param groupId
	 *            群id
	 * @param members
	 *            添加用户列表信息
	 * @return 群信息
	 * @throws NetException
	 */
	void addGroupMembers(long groupId, List<String> members) throws NetException;

	/**
	 * 删除群成员
	 *
	 * @param groupId
	 *            群id
	 * @param members
	 *            删除群成员列表
	 * @return 群信息
	 * @throws NetException
	 */
	void deleteGroupMembers(long groupId, List<String> members) throws NetException;

	/**
	 * 从服务器获取群成员列表信息
	 *
	 * @param groupId
	 *            群id
	 * @return 群成员列表信息
	 * @throws NetException
	 */
	List<GroupVCard> getGroupMembers(long groupId) throws NetException;

	/**
	 * 退出群组
	 *
	 * @param groupId
	 *            群id
	 * @return true:退出成功 false:退出失败
	 * @throws NetException
	 */
	boolean exitGroup(long groupId) throws NetException;

	/**
	 * 解散群组
	 *
	 * @param groupId
	 *            群id
	 * @return true:解散成功 false:解散失败
	 * @throws NetException
	 */
	boolean dissolveGroup(long groupId) throws NetException;

	/**
	 * 查询用户是否在此讨论组中已经被删除
	 * 
	 * @param groupId
	 * @return
	 * @throws NetException
	 */
	boolean groupMemberExisted(long groupId) throws NetException;

}
