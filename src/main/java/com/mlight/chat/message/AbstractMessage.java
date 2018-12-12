package com.mlight.chat.message;

import com.google.protobuf.MessageLite;
import com.mlight.chat.protobuf.MessageProto;

import java.util.LinkedHashMap;
import java.util.Map;

public abstract class AbstractMessage implements Message {

	public static final String PARAM_ID = "id";

	private String body;
	private Map<String, String> params = new LinkedHashMap<String, String>();

	@Override
	public String getBody() {
		return body;
	}

	@Override
	public Map<String, String> getParams() {
		return params;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public void setParams(Map<String, String> params) {
		this.params = params;
	}

	public void setParam(String name, String value) {
		this.params.put(name, value);
	}

	public String getParam(String name) {
		return this.params.get(name);
	}

	public String getId() {
		return getParam(PARAM_ID);
	}

	public void setId(String id) {
		setParam(PARAM_ID, id);
	}

	public MessageLite.Builder toProtoBuilder() {
		MessageProto.Message.Builder builder = MessageProto.Message.newBuilder();
		for (Map.Entry<String, String> entry : params.entrySet()) {
			builder.addParamField(MessageProto.Message.ParamFieldEntry.newBuilder().setName(entry.getKey())
					.setValue(entry.getValue()));
		}
		builder.setType(MessageProto.Message.Type.valueOf(getType().getValue()));
		if (body != null) {
			builder.setBody(body);
		}
		return builder;
	}
}
