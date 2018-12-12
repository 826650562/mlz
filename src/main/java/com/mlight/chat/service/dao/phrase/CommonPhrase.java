package com.mlight.chat.service.dao.phrase;

import com.mlight.chat.service.config.Constants;

/**
 * 常用短语.
 */

public class CommonPhrase {

	private long id; // 短语id
	private String user = Constants.CURRENT_USERNAME;
	private String content; // 短语内容
	private long createTime; // 短语创建时间
	private int usageCount = 0; // 短语使用频数

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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public int getUsageCount() {
		return usageCount;
	}

	public void setUsageCount(int usageCount) {
		this.usageCount = usageCount;
	}
}
