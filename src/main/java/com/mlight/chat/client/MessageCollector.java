package com.mlight.chat.client;

import com.mlight.chat.client.exception.NoResponseException;
import com.mlight.chat.client.exception.NotConnectedException;
import com.mlight.chat.message.Message;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * Description: MessageCollector Author: chenzhi Update: chenzhi(2015-09-01
 * 15:05)
 */
public class MessageCollector {

	private final MessageFilter messageFilter;

	private final ArrayBlockingQueue<Message> resultQueue;

	private boolean cancelled = false;

	private Connection connection;

	public MessageCollector(MessageFilter messageFilter, Connection connection) {
		this.messageFilter = messageFilter;
		this.resultQueue = new ArrayBlockingQueue<Message>(10);
		this.connection = connection;
	}

	public void cancel() {
		if (!cancelled) {
			cancelled = true;
			connection.removeCollector(this);
		}
	}

	public void processMessage(Message message) {
		if (messageFilter == null || messageFilter.accept(message)) {
			while (!resultQueue.offer(message)) {
				resultQueue.poll();
			}
		}
	}

	public Message nextResult(long timeout) throws InterruptedException {
		throwIfCancelled();
		Message res;
		long remainingWait = timeout;
		long waitStart = System.currentTimeMillis();
		do {
			res = resultQueue.poll(remainingWait, TimeUnit.MILLISECONDS);
			if (res != null) {
				return res;
			}
			remainingWait = timeout - (System.currentTimeMillis() - waitStart);
		} while (remainingWait > 0);
		return null;
	}

	public Message nextResultOrThrow(long timeout)
			throws InterruptedException, NotConnectedException, NoResponseException {
		Message res = nextResult(timeout);
		cancel();
		if (res == null) {
			if (!connection.isConnected()) {
				throw new NotConnectedException();
			}
			throw new NoResponseException();
		}
		return res;
	}

	private void throwIfCancelled() {
		if (cancelled) {
			throw new IllegalStateException("该收集器已经被取消");
		}
	}
}
