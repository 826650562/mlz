package com.mlight.chat.service.dao.department;

import com.mlight.chat.service.config.Constants;

/**
 * 部门信息.
 */
public class Department {

	private long id; // 部门id
	private String user = Constants.CURRENT_USERNAME;
	private long organizationId; // 所属组织id
	private String name; // 部门名称
	private long sequence; // 组内排序
	private long updateTime; // 最后修改时间
	private boolean deleted = false; // 删除标志

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

	public long getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(long organizationId) {
		this.organizationId = organizationId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getSequence() {
		return sequence;
	}

	public void setSequence(long sequence) {
		this.sequence = sequence;
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

	public int describeContents() {
		return 0;
	}
}
