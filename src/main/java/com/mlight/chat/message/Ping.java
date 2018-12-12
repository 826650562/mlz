package com.mlight.chat.message;

/**
 * Description: Ping Author: chenzhi Update: chenzhi(2015-09-01 17:03)
 */
public class Ping extends AbstractMessage {

	@Override
	public Type getType() {
		return Type.PING;
	}
}
