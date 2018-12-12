package com.mlight.chat.message;

/**
 * Description: ${NAME} Author: chenzhi Update: chenzhi(2015-09-01 14:06)
 */

public abstract class AbstractReqResMessage extends AbstractMessage {

	public static final String PARAM_URI = "uri";

	public void setUri(String uri) {
		setParam(PARAM_URI, uri);
	}

	public String getUri() {
		return getParam(PARAM_URI);
	}

}
