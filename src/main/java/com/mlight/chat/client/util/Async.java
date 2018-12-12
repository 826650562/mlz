package com.mlight.chat.client.util;

/**
 * Description: Async Author: chenzhi Update: chenzhi(2015-09-02 14:38)
 */

public class Async {

	/**
	 * Creates a new thread with the given Runnable, marks it daemon, starts it
	 * and returns the started thread.
	 *
	 * @param runnable
	 *            task
	 * @return the started thread.
	 */
	public static Thread go(Runnable runnable) {
		Thread thread = daemonThreadFrom(runnable);
		thread.start();
		return thread;
	}

	/**
	 * Creates a new thread with the given Runnable, marks it daemon, sets the
	 * name, starts it and returns the started thread.
	 *
	 * @param runnable
	 *            task
	 * @param threadName
	 *            the thread name.
	 * @return the started thread.
	 */
	public static Thread go(Runnable runnable, String threadName) {
		Thread thread = daemonThreadFrom(runnable);
		thread.setName(threadName);
		thread.start();
		return thread;
	}

	public static Thread daemonThreadFrom(Runnable runnable) {
		Thread thread = new Thread(runnable);
		thread.setDaemon(true);
		return thread;
	}
}
