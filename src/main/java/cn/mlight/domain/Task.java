package cn.mlight.domain;// default package

import java.sql.Timestamp;

/**
 * Task entity. @author MyEclipse Persistence Tools
 */

public class Task implements java.io.Serializable {

	// Fields

	private Long id;
	private String taskId;
	private String taskName;
	private String targetName;
	private String taskContent;
	private String bz;
	private String state;
	private String stateDetail;
	private Timestamp startTime;
	private Timestamp endTime;
	private String relateActor;
	private Long msgId;
	private String groups;

	// Constructors

	/** default constructor */
	public Task() {
	}

	/** minimal constructor */
	public Task(String taskId) {
		this.taskId = taskId;
	}

	/** full constructor */
	public Task(String taskId, String taskName, String targetName, String taskContent, String bz, String state,
			String stateDetail, Timestamp startTime, Timestamp endTime, String relateActor, Long msgId) {
		this.taskId = taskId;
		this.taskName = taskName;
		this.targetName = targetName;
		this.taskContent = taskContent;
		this.bz = bz;
		this.state = state;
		this.stateDetail = stateDetail;
		this.startTime = startTime;
		this.endTime = endTime;
		this.relateActor = relateActor;
		this.msgId = msgId;
	}

	// Property accessors

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTaskId() {
		return this.taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getTaskName() {
		return this.taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getTargetName() {
		return this.targetName;
	}

	public void setTargetName(String targetName) {
		this.targetName = targetName;
	}

	public String getTaskContent() {
		return this.taskContent;
	}

	public void setTaskContent(String taskContent) {
		this.taskContent = taskContent;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getStateDetail() {
		return this.stateDetail;
	}

	public void setStateDetail(String stateDetail) {
		this.stateDetail = stateDetail;
	}

	public Timestamp getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public String getRelateActor() {
		return this.relateActor;
	}

	public void setRelateActor(String relateActor) {
		this.relateActor = relateActor;
	}

	public Long getMsgId() {
		return this.msgId;
	}

	public void setMsgId(Long msgId) {
		this.msgId = msgId;
	}

	public String getGroups() {
		return groups;
	}

	public void setGroups(String groups) {
		this.groups = groups;
	}
}