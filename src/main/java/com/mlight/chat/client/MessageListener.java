package com.mlight.chat.client;

import com.mlight.chat.message.Message;

public interface MessageListener {
	Mode getMode();

	void processMessage(Message message);

	enum Mode {
		SYNC, ASYNC
	}
}
