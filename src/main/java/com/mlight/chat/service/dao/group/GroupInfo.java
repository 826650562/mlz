package com.mlight.chat.service.dao.group;

import com.mlight.chat.service.config.Constants;

/**
 * 群信息.共分为4类: 群类型type=0(普通群,多个,由移动端创建) 群类型type=1(固定群,多个,由管理端创建)
 * 群类型type=2(部门群,仅有一个,由管理端创建) 群类型type=3(组织群,仅有一个,由管理端创建)
 */
public class GroupInfo {

	public static final int GROUP_TYPE_NORMAL = 0;
	public static final int GROUP_TYPE_FIXED = 1;
	public static final int GROUP_TYPE_DEPART = 2;
	public static final int GROUP_TYPE_ORG = 3;

	private long id; // 群id
	private String user = Constants.CURRENT_USERNAME;
	private String name; // 群名称
	private int type; // 群类型
	private String creator; // 群创建人
	private String logo; // 群头像
	private long organizationId; // 所属组织id
	private long departmentId; // 所属部门id
	private long updateTime; // 最后修改时间
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public long getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(long organizationId) {
		this.organizationId = organizationId;
	}

	public long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(long departmentId) {
		this.departmentId = departmentId;
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
