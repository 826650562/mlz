package com.mlight.chat.client;

public class ConnectionConfig {

	private static volatile ConnectionConfig instance;

	public static ConnectionConfig getInstance() {
		if (instance == null) {
			synchronized (ConnectionConfig.class) {
				instance = new ConnectionConfig();
			}
		}
		return instance;
	}

	private String host;
	private int port;
	private int connectTimeout = 30000;
	private int defaultTimeout = 30000;
	private boolean ping = true;
	private int pingInternal = 30000;

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public int getConnectTimeout() {
		return connectTimeout;
	}

	public void setConnectTimeout(int connectTimeout) {
		this.connectTimeout = connectTimeout;
	}

	public int getDefaultTimeout() {
		return defaultTimeout;
	}

	public void setDefaultTimeout(int defaultTimeout) {
		this.defaultTimeout = defaultTimeout;
	}

	public boolean isPing() {
		return ping;
	}

	public void setPing(boolean ping) {
		this.ping = ping;
	}

	public int getPingInternal() {
		return pingInternal;
	}

	public void setPingInternal(int pingInternal) {
		this.pingInternal = pingInternal;
	}
}
