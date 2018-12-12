package com.mlight.chat.service.models.notice;

public class Notice implements Comparable<Notice> {

	private long id;
	private String title;
	private String content;
	private long createTime;
	private long updateTime;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public int compareTo(Notice another) {
		if (this.createTime < another.createTime) {
			return -1;
		}
		if (this.createTime > another.createTime) {
			return 1;
		}
		return 0;
	}
}
