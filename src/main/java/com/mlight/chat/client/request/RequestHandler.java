package com.mlight.chat.client.request;

import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;

public interface RequestHandler {
	Mode getMode();

	String getHandleUri();

	Response handler(Request request);

	enum Mode {
		SYNC, ASYNC
	}
}
