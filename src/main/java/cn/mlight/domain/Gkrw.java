package cn.mlight.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class Gkrw<T> implements Serializable {
	private String rwid;
	private String rwbh;
	private String task_name;
	private String task_content;
	private String level;
	private String level_name;
	private String state;
	private String state_name;
	private String fzr_id;
	private String fzr_name;
	private Date start_time;
	private Date end_time;
	private List<T> target;
	public String getRwid() {
		return rwid;
	}
	public void setRwid(String rwid) {
		this.rwid = rwid;
	}
	public String getRwbh() {
		return rwbh;
	}
	public void setRwbh(String rwbh) {
		this.rwbh = rwbh;
	}
	public String getTask_name() {
		return task_name;
	}
	public void setTask_name(String task_name) {
		this.task_name = task_name;
	}
	public String getTask_content() {
		return task_content;
	}
	public void setTask_content(String task_content) {
		this.task_content = task_content;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getLevel_name() {
		return level_name;
	}
	public void setLevel_name(String level_name) {
		this.level_name = level_name;
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
	public String getFzr_id() {
		return fzr_id;
	}
	public void setFzr_id(String fzr_id) {
		this.fzr_id = fzr_id;
	}
	public String getFzr_name() {
		return fzr_name;
	}
	public void setFzr_name(String fzr_name) {
		this.fzr_name = fzr_name;
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
	public List<T> getTarget() {
		return target;
	}
	public void setTarget(List<T> target) {
		this.target = target;
	}

}
