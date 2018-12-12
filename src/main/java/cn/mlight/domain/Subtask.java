package cn.mlight.domain;

import java.io.Serializable;
import java.util.Date;

public class Subtask implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long id;
	private String fid;
	private String rwid;
	private String xz_id;
	private String xz_name;
	private String zz_id;
	private String zz_name;
	private String mb_name;
	private Date start_time;
	private Date end_time;
	private String state;
	private String state_name;
	private String content;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFid() {
		return fid;
	}

	public void setFid(String fid) {
		this.fid = fid;
	}

	public String getRwid() {
		return rwid;
	}

	public void setRwid(String rwid) {
		this.rwid = rwid;
	}

	public String getXz_id() {
		return xz_id;
	}

	public void setXz_id(String xz_id) {
		this.xz_id = xz_id;
	}

	public String getXz_name() {
		return xz_name;
	}

	public void setXz_name(String xz_name) {
		this.xz_name = xz_name;
	}

	public String getZz_id() {
		return zz_id;
	}

	public void setZz_id(String zz_id) {
		this.zz_id = zz_id;
	}

	public String getZz_name() {
		return zz_name;
	}

	public void setZz_name(String zz_name) {
		this.zz_name = zz_name;
	}

	public String getMb_name() {
		return mb_name;
	}

	public void setMb_name(String mb_name) {
		this.mb_name = mb_name;
	}

	public Date getStart_time() {
		return start_time;
	}

	public void setStart_time(Date start_time) {
		this.start_time = start_time;
	}

	public Date getEnd_time() {
		return end_time;
	}

	public void setEnd_time(Date end_time) {
		this.end_time = end_time;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getState_name() {
		return state_name;
	}

	public void setState_name(String state_name) {
		this.state_name = state_name;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
