package com.mlight.chat.service.dao.user;

import com.mlight.chat.service.config.Constants;
import com.mlight.chat.service.utils.StringUtil;

/**
 * 用户信息.
 */
public class User implements Comparable<User> {

	private long id; // 用户id，同步服务器端用户id
	private String user = Constants.CURRENT_USERNAME;
	private String username; // 用户名
	private String name; // 姓名
	private String pinyin; // 姓名全拼
	private String mobilePhone; // 手机号码
	private String phone; // 电话号码
	private String email; // 电子邮箱
	private String avatar; // 头像缩略图
	private String originalAvatar; // 头像原图
	private String remarks; // 备注
	private String other; // 其他
	private long organizationId = 0; // 所属组织id
	private long departmentId = 0; // 所属部门id
	private long sequence; // 次序
	private long updateTime; // 最后修改时间
	private boolean deleted = false; // 删除标志

	public User() {

	}

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

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public String getOriginalAvatar() {
		return originalAvatar;
	}

	public void setOriginalAvatar(String originalAvatar) {
		this.originalAvatar = originalAvatar;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getOther() {
		return other;
	}

	public void setOther(String other) {
		this.other = other;
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

	/**
	 * 截取拼音首字母，并转换成大写
	 *
	 * @return
	 */
	public String getFirstLetter() {
		if (StringUtil.empty(this.pinyin)) {
			return "";
		} else {
			return this.pinyin.substring(0, 1).toUpperCase();
		}
	}

	@Override
	public int compareTo(User another) {
		if (this.sequence - another.getSequence() > 0) {
			return 1;
		}
		if (this.sequence - another.getSequence() < 0) {
			return -1;
		}
		return 0;
	}
}
