package com.mlight.chat.message;

/**
 * Description: Pong Author: chenzhi Update: chenzhi(2015-09-01 17:06)
 */
public class Pong extends AbstractMessage {

	@Override
	public Type getType() {
		return Type.PONG;
	}
}
