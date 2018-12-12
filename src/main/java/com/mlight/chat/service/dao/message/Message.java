package com.mlight.chat.service.dao.message;

import com.mlight.chat.service.config.Constants;

/**
 * 消息表（聊天消息和聊天通知消息）
 */
public class Message {

	public static final int CHAT_TYPE_CHAT = 0;
	public static final int CHAT_TYPE_GROUP_CHAT = 1;

	public static final int MSG_TYPE_TEXT = 0;
	public static final int MSG_TYPE_IMAGE = 1;
	public static final int MSG_TYPE_AUDIO = 2;
	public static final int MSG_TYPE_VIDEO = 3;
	public static final int MSG_TYPE_LOCATION = 4;
	public static final int MSG_TYPE_CARD = 5;
	public static final int MSG_TYPE_ATTENDANCE = 6;
	public static final int MSG_TYPE_NOTICE = 7;

	public static final int MSG_STATE_RECEIVE = 0;
	public static final int MSG_STATE_SENDING = 1;
	public static final int MSG_STATE_SEND_SUCCESS = 2;
	public static final int MSG_STATE_SEND_FAILURE = 3;

	private long id; // 消息id
	private String user = Constants.CURRENT_USERNAME;
	private String groupId; // 群组id
	private int chatType; // 聊天类型
	private String sender; // 发送人
	private String receiver; // 接收人
	private int type; // 消息类型
	private String content; // 文本消息内容
	private long time; // 发送时间，网络时间
	private int state; // 发送状态
	private String localPath; // 本地图片或音频或视频地址
	private String duration; // 本地音频或视频时长
	private String attachment; // 附加信息，具体规则见协议

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

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public int getChatType() {
		return chatType;
	}

	public void setChatType(int chatType) {
		this.chatType = chatType;
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

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
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

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getLocalPath() {
		return localPath;
	}

	public void setLocalPath(String localPath) {
		this.localPath = localPath;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public String getAttachment() {
		return attachment;
	}

	public void setAttachment(String attachment) {
		this.attachment = attachment;
	}

	public boolean isSend() {
		return user.equals(sender);
	}

}
