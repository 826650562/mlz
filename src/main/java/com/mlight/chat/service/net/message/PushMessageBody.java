package com.mlight.chat.service.net.message;

public class PushMessageBody {

	private String uri;
	private Data data;

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public Data getData() {
		return data;
	}

	public void setData(Data data) {
		this.data = data;
	}
}
