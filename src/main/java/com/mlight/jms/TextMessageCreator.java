package com.mlight.jms;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.springframework.jms.core.MessageCreator;

public class TextMessageCreator implements MessageCreator {
	private String msg;

	public TextMessageCreator(String msg) {
		this.msg = msg;
	}

	@Override
	public Message createMessage(Session session) throws JMSException {
		TextMessage txtMsg = session.createTextMessage(msg);
		return txtMsg;
	}
}
