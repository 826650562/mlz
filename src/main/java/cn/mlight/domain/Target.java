package cn.mlight.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class Target implements Serializable {
	private Long id;
	private String mb_name;
	private String mb_remark;
	private String mb_image;
	private String task_content;
	private String rwid;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getMb_name() {
		return mb_name;
	}
	public void setMb_name(String mb_name) {
		this.mb_name = mb_name;
	}
	public String getMb_remark() {
		return mb_remark;
	}
	public void setMb_remark(String mb_remark) {
		this.mb_remark = mb_remark;
	}
	public String getMb_image() {
		return mb_image;
	}
	public void setMb_image(String mb_image) {
		this.mb_image = mb_image;
	}
	public String getTask_content() {
		return task_content;
	}
	public void setTask_content(String task_content) {
		this.task_content = task_content;
	}
	public String getRwid() {
		return rwid;
	}
	public void setRwid(String rwid) {
		this.rwid = rwid;
	}
	

}
