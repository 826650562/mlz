package com.mlight.chat.service.net.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mlight.chat.client.SimpleClient;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.message.NormalMessage;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.dao.message.Message;
import com.mlight.chat.service.models.message.*;
import com.mlight.chat.service.net.NetMessageManager;
import com.mlight.chat.service.net.exceptions.NetException;
import com.mlight.chat.service.net.message.Attachment;
import com.mlight.chat.service.net.message.MessageBody;
import com.mlight.chat.service.net.result.Result;

import java.util.UUID;

public class NetMessageManagerImpl implements NetMessageManager {

	private static final String REQUEST_URI_MESSAGE_SYNC = "/message/sync";

	private TChatConnection connection;

	public NetMessageManagerImpl(TChatConnection connection) {
		this.connection = connection;
	}

	@Override
	public void sendMessage(Message message) throws NetException {
		if (message.getChatType() == Message.CHAT_TYPE_CHAT) {
			sendChatMessage(message);
		} else {
			sendGroupChatMessage(message, message.getGroupId());
		}
	}

	@Override
	public void receiveMessage() throws NetException {
		SimpleClient simpleClient = new SimpleClient(connection);
		Request request = new Request();
		request.setUri(REQUEST_URI_MESSAGE_SYNC);
		Response response = simpleClient.execute(request);
		Gson gson = new Gson();
		Result<String> result = gson.fromJson(response.getBody(), new TypeToken<Result<String>>() {
		}.getType());
		if (!result.isSuccess()) {
			throw new NetException(result.getMessage());
		}
	}

	private void sendChatMessage(Message message) throws NetException {
		Gson gson = new Gson();
		String bodyString = gson.toJson(convertMessage(message), MessageBody.class);
		NormalMessage normalMessage = new NormalMessage();
		normalMessage.setFrom(message.getSender());
		normalMessage.setTo(message.getReceiver());
		normalMessage.setParamType("chat");
		normalMessage.setBody(bodyString);
		normalMessage.setId(UUID.randomUUID().toString());
		try {
			connection.sendMessage(normalMessage);
		} catch (Exception e) {
			throw new NetException(e.getMessage());
		}
	}

	private void sendGroupChatMessage(Message message, String groupId) throws NetException {
		Gson gson = new Gson();
		String bodyString = gson.toJson(convertMessage(message), MessageBody.class);
		NormalMessage normalMessage = new NormalMessage();
		normalMessage.setFrom(message.getSender());
		normalMessage.setTo(message.getGroupId());
		normalMessage.setParamType("groupchat");
		normalMessage.setBody(bodyString);
		normalMessage.setId(UUID.randomUUID().toString());
		try {
			connection.sendMessage(normalMessage);
		} catch (Exception e) {
			throw new NetException(e.getMessage());
		}
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onStop() {

	}

	private MessageBody convertMessage(Message message) {
		MessageBody body = new MessageBody();
		if (message.getGroupId() == null) {
			body.setChatType(MessageBody.CHAT);
		} else {
			body.setGroupId(message.getGroupId());
			body.setChatType(MessageBody.GROUP_CHAT);
		}
		body.setSender(message.getSender());
		body.setReceiver(message.getReceiver());
		body.setTime(message.getTime());
		body.setType(message.getType());
		Attachment attachment = new Attachment();
		if (message.getType() == Message.MSG_TYPE_TEXT) {
			body.setContent(message.getContent());
		} else if (message.getType() == Message.MSG_TYPE_IMAGE) {
			Gson gson = new Gson();
			ImageInfo imageInfo = gson.fromJson(message.getAttachment(), ImageInfo.class);
			attachment.put("thumbnail", imageInfo.getThumbnail());
			attachment.put("thumbWidth", imageInfo.getThumbWidth());
			attachment.put("thumbHeight", imageInfo.getThumbHeight());
			attachment.put("original", imageInfo.getOriginal());
			attachment.put("originalWidth", imageInfo.getOriginalWidth());
			attachment.put("originalHeight", imageInfo.getOriginalHeight());
			attachment.put("imageType", imageInfo.getImageType() + "");
			attachment.put("area", imageInfo.getArea());

			body.setAttachment(attachment);
		} else if (message.getType() == Message.MSG_TYPE_AUDIO) {
			Gson gson = new Gson();
			AudioInfo audioInfo = gson.fromJson(message.getAttachment(), AudioInfo.class);
			attachment.put("url", audioInfo.getUrl());
			attachment.put("duration", audioInfo.getDuration());
			body.setAttachment(attachment);
		} else if (message.getType() == Message.MSG_TYPE_VIDEO) {
			Gson gson = new Gson();
			VideoInfo videoInfo = gson.fromJson(message.getAttachment(), VideoInfo.class);
			attachment.put("thumbnail", videoInfo.getThumbnail());
			attachment.put("url", videoInfo.getUrl());
			attachment.put("duration", videoInfo.getDuration());
			body.setAttachment(attachment);
		} else if (message.getType() == Message.MSG_TYPE_LOCATION) {
			Gson gson = new Gson();
			LocationInfo locationInfo = gson.fromJson(message.getAttachment(), LocationInfo.class);
			attachment.put("thumbnail", locationInfo.getThumbnail());
			attachment.put("latitude", locationInfo.getLatitude());
			attachment.put("longitude", locationInfo.getLongitude());
			attachment.put("address", locationInfo.getAddress());
			body.setAttachment(attachment);
		} else if (message.getType() == Message.MSG_TYPE_CARD) {
			Gson gson = new Gson();
			CardInfo cardInfo = gson.fromJson(message.getAttachment(), CardInfo.class);
			attachment.put("username", cardInfo.getUsername());
			body.setAttachment(attachment);
		} else if (message.getType() == Message.MSG_TYPE_ATTENDANCE) {
			// Gson gson = new Gson();
			// AttendanceInfo attendanceInfo =
			// gson.fromJson(message.getAttachment(), AttendanceInfo.class);
			// attachment.put("username", attendanceInfo.getUsername());
			// attachment.put("address", attendanceInfo.getAddress());
			// attachment.put("latitude", attendanceInfo.getLatitude());
			// attachment.put("longitude", attendanceInfo.getLongitude());
			// attachment.put("remark", attendanceInfo.getRemark());
			// attachment.put("type", attendanceInfo.getType() + "");
			// attachment.put("sendTime", attendanceInfo.getSendTime() + "");
			// body.setAttachment(attachment);
		}
		return body;
	}
}
