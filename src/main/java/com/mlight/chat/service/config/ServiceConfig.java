package com.mlight.chat.service.config;

import com.mlight.chat.client.ConnectionConfig;

public class ServiceConfig {

	private static volatile ServiceConfig instance;

	public static ServiceConfig getInstance() {
		if (instance == null) {
			synchronized (ServiceConfig.class) {
				instance = new ServiceConfig();
			}
		}
		return instance;
	}

	private String uploadURL;
	private String accessURL;

	public String getArcgisURL() {
		return arcgisURL;
	}

	public void setArcgisURL(String arcgisURL) {
		this.arcgisURL = arcgisURL;
	}

	private String arcgisURL;

	private ConnectionConfig getConnectionConfig() {
		return ConnectionConfig.getInstance();
	}

	public String getUploadURL() {
		return uploadURL;
	}

	public void setUploadURL(String uploadURL) {
		this.uploadURL = uploadURL;
	}

	public String getAccessURL() {
		return accessURL;
	}

	public void setAccessURL(String accessURL) {
		this.accessURL = accessURL;
	}

	public String getHost() {
		return getConnectionConfig().getHost();
	}

	public void setHost(String host) {
		getConnectionConfig().setHost(host);
	}

	public int getPort() {
		return getConnectionConfig().getPort();
	}

	public void setPort(int port) {
		getConnectionConfig().setPort(port);
	}

	public int getConnectTimeout() {
		return getConnectionConfig().getConnectTimeout();
	}

	public void setConnectTimeout(int connectTimeout) {
		getConnectionConfig().setConnectTimeout(connectTimeout);
	}

	public int getDefaultTimeout() {
		return getConnectionConfig().getDefaultTimeout();
	}

	public void setDefaultTimeout(int defaultTimeout) {
		getConnectionConfig().setDefaultTimeout(defaultTimeout);
	}

	public boolean isPing() {
		return getConnectionConfig().isPing();
	}

	public void setPing(boolean ping) {
		getConnectionConfig().setPing(ping);
	}

	public int getPingInternal() {
		return getConnectionConfig().getPingInternal();
	}

	public void setPingInternal(int pingInternal) {
		getConnectionConfig().setPingInternal(pingInternal);
	}
}
