package com.mlight.chat.message;

import java.util.Map;

public interface Message {

	Type getType();

	Map<String, String> getParams();

	String getBody();

	enum Type {
		NORMAL(0), REPLY(1), REQUEST(2), RESPONSE(3), PING(4), PONG(5);

		private int value;

		Type(int value) {
			this.value = value;
		}

		public int getValue() {
			return value;
		}
	}
}