package com.mlight.chat.message;

/**
 * Description: NormalMessage Author: chenzhi Update: chenzhi(2015-09-01 14:20)
 */
public class NormalMessage extends AbstractMessage {

	private static final String PARAM_FROM = "from";
	private static final String PARAM_TO = "to";
	private static final String PARAM_TYPE = "type";

	@Override
	public Type getType() {
		return Type.NORMAL;
	}

	public String getFrom() {
		return getParam(PARAM_FROM);
	}

	public void setFrom(String from) {
		setParam(PARAM_FROM, from);
	}

	public String getTo() {
		return getParam(PARAM_TO);
	}

	public void setTo(String to) {
		setParam(PARAM_TO, to);
	}

	public String getParamType() {
		return getParam(PARAM_TYPE);
	}

	/**
	 * 消息类型
	 * 
	 * @param type
	 *            normal, chat, groupchat
	 */
	public void setParamType(String type) {
		setParam(PARAM_TYPE, type);
	}
}
