package com.mlight.chat.client.request;

import com.mlight.chat.client.MessageFilter;
import com.mlight.chat.message.Message;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;

/**
 * Description: ResponseFilter Author: chenzhi Update: chenzhi(2015-09-01 15:23)
 */
public class ResponseFilter implements MessageFilter {

	private Request request;

	public ResponseFilter(Request request) {
		this.request = request;
	}

	@Override
	public boolean accept(Message message) {
		boolean accept = false;
		if (message instanceof Response) {
			Response response = (Response) message;
			if (response.getId() != null && response.getId().equals(request.getId())) {
				accept = true;
			}
		}
		return accept;
	}
}
