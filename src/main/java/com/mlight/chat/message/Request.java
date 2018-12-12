package com.mlight.chat.message;

public class Request extends AbstractReqResMessage {
	@Override
	public Type getType() {
		return Type.REQUEST;
	}
}
