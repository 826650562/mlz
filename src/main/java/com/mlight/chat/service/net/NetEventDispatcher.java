package com.mlight.chat.service.net;

import com.mlight.chat.service.net.listeners.NetEventListener;

public interface NetEventDispatcher extends BaseNet {

	void addListener(NetEventListener listener);

	void removeListener(NetEventListener listener);

}
