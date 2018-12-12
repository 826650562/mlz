package cn.mlight.domain;

import java.io.Serializable;
import java.util.List;
//好友列表  group 中type 为2  对应于t_department
public class LayFriend implements Serializable {
	


	private String id;
	private String groupname;
	private List<LayUser> list;
	
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
	public List<LayUser> getList() {
		return list;
	}
	public void setList(List<LayUser> list) {
		this.list = list;
	}

	

	
}
