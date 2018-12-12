package com.mlight.chat.service.dao.sysnotice;

import com.mlight.chat.service.config.Constants;

/**
 * 系统广播.
 */

public class SysNotice {

	private long id; // 系统广播id
	private String user = Constants.CURRENT_USERNAME;
	private String sender; // 发送人
	private String receiver; // 接受人
	private String content; // 广播内容
	private long time; // 广播发送时间

	public SysNotice() {
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

}
