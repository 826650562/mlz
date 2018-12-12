package com.mlight.chat.service.models.news;

public class News implements Comparable<News> {

	private long id;
	private String title;
	private String content;
	private String picture;
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

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
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
	public int compareTo(News another) {
		if (this.createTime < another.createTime) {
			return -1;
		}
		if (this.createTime > another.createTime) {
			return 1;
		}
		return 0;
	}
}
