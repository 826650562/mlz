package cn.mlight.domain;

import java.io.Serializable;
import java.util.List;
//好友列表
public class LayGroup implements Serializable {
	
	private String id;
	private String groupname;
	private String avatar;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getGroupname() {
		return groupname;
	}
	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}
	public String getAvatar() {
		return avatar;
	}
	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	

	
}
