package com.mlight.chat.client.util;

import java.util.concurrent.ThreadFactory;

/**
 * Description: TChatThreadFactory Author: chenzhi Update: chenzhi(2015-09-01
 * 15:54)
 */
public class TChatExecutorThreadFactory implements ThreadFactory {

	private final String name;
	private int count = 0;

	public TChatExecutorThreadFactory(String name) {
		this.name = name;
	}

	@Override
	public Thread newThread(Runnable runnable) {
		Thread thread = new Thread(runnable);
		thread.setName("TChat-" + name + ' ' + count++);
		thread.setDaemon(true);
		return thread;
	}
}
