package com.mlight.chat.client;

import com.mlight.chat.message.Message;

public interface MessageFilter {
	boolean accept(Message message);
}
