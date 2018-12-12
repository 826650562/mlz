package com.mlight.chat.service.dao.schedule;

import com.mlight.chat.service.config.Constants;

public class Schedule {

	public static final int SCHEDULE_DAY_FLAG_OFF = 0;
	public static final int SCHEDULE_DAY_FLAG_ON = 1;

	public static final int SCHEDULE_DELETE_FLAG_NO = 0;
	public static final int SCHEDULE_DELETE_FLAG_YES = 1;

	public static final boolean SCHEDULE_WARNING_FLAG_OFF = false;
	public static final boolean SCHEDULE_WARNING_FLAG_ON = true;

	private long id;
	private String user = Constants.CURRENT_USERNAME;
	private String subject;
	private String description;

	/**
	 * 格式：yyyy-MM-dd
	 */
	private String date;
	private long startTime;
	private long endTime;
	private String address;
	private int dayFlag;
	private long preNotifyTime;
	private String tags;
	private long createTime;
	private long updateTime;
	private boolean isWarning = SCHEDULE_WARNING_FLAG_ON;

	public String getShareMember() {
		return shareMember;
	}

	public void setShareMember(String shareMember) {
		this.shareMember = shareMember;
	}

	private String shareMember;

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

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public long getEndTime() {
		return endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public int getDayFlag() {
		return dayFlag;
	}

	public void setDayFlag(int dayFlag) {
		this.dayFlag = dayFlag;
	}

	public long getPreNotifyTime() {
		return preNotifyTime;
	}

	public void setPreNotifyTime(long preNotifyTime) {
		this.preNotifyTime = preNotifyTime;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}

	public boolean isWarning() {
		return isWarning;
	}

	public void setWarning(boolean isWarning) {
		this.isWarning = isWarning;
	}

}
