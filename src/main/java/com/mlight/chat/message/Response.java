package com.mlight.chat.message;

public class Response extends AbstractReqResMessage {

	public static final String PARAM_STATUS_CODE = "status_code";
	public static final String PARAM_STATUS_MESSAGE = "status_message";

	@Override
	public Message.Type getType() {
		return Message.Type.RESPONSE;
	}

	public int getStatusCode() {
		String statusCode = getParam(PARAM_STATUS_CODE);
		if (statusCode != null) {
			return Integer.valueOf(statusCode);
		} else {
			return 0;
		}
	}

	public void setStatusCode(int statusCode) {
		setParam(PARAM_STATUS_CODE, String.valueOf(statusCode));
	}

	public String getStatusMessage() {
		return getParam(PARAM_STATUS_MESSAGE);
	}

	public void setStatusMessage(String statusMessage) {
		setParam(PARAM_STATUS_MESSAGE, statusMessage);
	}
}
