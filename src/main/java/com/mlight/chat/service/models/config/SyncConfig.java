package com.mlight.chat.service.models.config;

/**
 * 同步数据配置信息.
 */
public class SyncConfig {

	private String username;
	private long addressBookLastSyncTime;
	private long departLastSyncTime;
	private long groupLastSyncTime;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public long getAddressBookLastSyncTime() {
		return addressBookLastSyncTime;
	}

	public void setAddressBookLastSyncTime(long addressBookLastSyncTime) {
		this.addressBookLastSyncTime = addressBookLastSyncTime;
	}

	public long getDepartLastSyncTime() {
		return departLastSyncTime;
	}

	public void setDepartLastSyncTime(long departLastSyncTime) {
		this.departLastSyncTime = departLastSyncTime;
	}

	public long getGroupLastSyncTime() {
		return groupLastSyncTime;
	}

	public void setGroupLastSyncTime(long groupLastSyncTime) {
		this.groupLastSyncTime = groupLastSyncTime;
	}
}
