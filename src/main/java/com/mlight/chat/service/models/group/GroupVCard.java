package com.mlight.chat.service.models.group;

import com.mlight.chat.service.config.Constants;

/**
 * 群成员名片信息.
 */
public class GroupVCard {

	private long id; // 群组成员关系id
	private String user = Constants.CURRENT_USERNAME;
	private long groupId; // 群id
	private String username; // 用户名
	private String name; // 昵称
	private String avatar; // 头像
	private long enterTime; // 入群时间
	private long updateTime; // 最后更新时间
	private boolean deleted; // 删除标志

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public long getGroupId() {
		return groupId;
	}

	public void setGroupId(long groupId) {
		this.groupId = groupId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public long getEnterTime() {
		return enterTime;
	}

	public void setEnterTime(long enterTime) {
		this.enterTime = enterTime;
	}

	public long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

}
