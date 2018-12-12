package com.mlight.chat.service.net;

import com.mlight.chat.service.dao.message.Message;
import com.mlight.chat.service.net.exceptions.NetException;

public interface NetMessageManager extends BaseNet {

	void sendMessage(Message message) throws NetException;

	void receiveMessage() throws NetException;
}
