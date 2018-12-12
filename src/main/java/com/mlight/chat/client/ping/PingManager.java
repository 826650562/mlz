package com.mlight.chat.client.ping;

import com.mlight.chat.client.MessageFilter;
import com.mlight.chat.client.MessageListener;
import com.mlight.chat.client.TChatConnection;
import com.mlight.chat.client.exception.NotConnectedException;
import com.mlight.chat.client.exception.PingTimeoutException;
import com.mlight.chat.message.Message;
import com.mlight.chat.message.Ping;
import com.mlight.chat.message.Pong;

import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class PingManager implements MessageListener, MessageFilter {

	private TChatConnection connection;

	public PingManager(TChatConnection connection, int internal, int timeout) {
		this.connection = connection;
		this.internal = internal;
		this.timeout = timeout;
	}

	private Timer timer;
	private int internal;
	private int timeout;
	private volatile int timeoutTimes = 0;
	private Map<String, TimerTask> pendingPings;

	public void start() {
		timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				if (pendingPings.size() == 0)
					sendPing();
			}
		}, internal, internal);
		pendingPings = new ConcurrentHashMap<String, TimerTask>();
		connection.addMessageListener(this, this);
	}

	private void timeout(String id) {
		TimerTask task = pendingPings.remove(id);
		if (task != null) {
			timeoutTimes++;
			if (timeoutTimes > 2) {
				connection.disconnectForError(new PingTimeoutException());
			} else {
				sendPing();
			}
		}
	}

	private class TimeoutTask extends TimerTask {

		private Ping ping;

		public TimeoutTask(Ping ping) {
			this.ping = ping;
		}

		@Override
		public void run() {
			timeout(ping.getId());
		}
	}

	private void sendPing() {
		try {
			final String id = UUID.randomUUID().toString();
			Ping ping = new Ping();
			ping.setId(id);
			TimerTask task = new TimeoutTask(ping);
			pendingPings.put(id, task);
			timer.schedule(task, timeout);
			connection.sendMessage(ping);
		} catch (NotConnectedException | InterruptedException e) {
			e.printStackTrace();
		}
	}

	public void stop() {
		connection.removeMessageListener(this);
		timer.cancel();
		timer = null;
		pendingPings.clear();
		timeoutTimes = 0;
	}

	@Override
	public boolean accept(Message message) {
		boolean accept = false;
		if (message instanceof Ping || message instanceof Pong) {
			accept = true;
		}
		return accept;
	}

	@Override
	public Mode getMode() {
		return Mode.ASYNC;
	}

	@Override
	public void processMessage(Message message) {
		if (message instanceof Pong) {
			String id = ((Pong) message).getId();
			TimerTask task = pendingPings.remove(id);
			if (task != null) {
				task.cancel();
				timeoutTimes = 0;
			}
		}
		if (message instanceof Ping) {
			Ping ping = (Ping) message;
			Pong pong = new Pong();
			pong.setId(ping.getId());
			try {
				connection.sendMessage(pong);
			} catch (NotConnectedException | InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}
