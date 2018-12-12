package com.mlight.chat.service.net;

import com.mlight.chat.service.net.exceptions.NetException;

public interface NetFeedbackManager extends BaseNet {

	boolean submit(String feedback) throws NetException;
}
