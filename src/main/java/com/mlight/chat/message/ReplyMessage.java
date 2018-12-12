package com.mlight.chat.message;

/**
 * Description: ReplyMessage Author: chenzhi Update: chenzhi(2015-09-01 14:25)
 */
public class ReplyMessage extends AbstractMessage {

	@Override
	public Type getType() {
		return Type.REPLY;
	}

}
