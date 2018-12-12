package com.mlight.chat.service.dao.location;

import java.util.Date;
import java.util.List;

public class Location {

	public Location() {
	}

	private String id;

	private Long seqNo;

	private String name;

	private Long userId;

	private String userName;

	private String groupName;

	private Double lat;

	private Double lon;

	private String signalSource;

	private Date bdtime;

	private Double bdlat;

	private Double bdlon;

	private Date phoneTime;

	private String description;

	private Double radius;

	private String addr;

	private Double speed;

	private Integer satellite;

	private Double height;

	private Double direction;

	private String operator;

	private String status;

	private String statusMessage;

	private String locationDescribe;

	private static final long serialVersionUID = 1L;

	public Long getSeqNo() {
		return seqNo;
	}

	public void setSeqNo(Long seqNo) {
		this.seqNo = seqNo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName == null ? null : userName.trim();
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName == null ? null : groupName.trim();
	}

	public Double getLat() {
		return lat;
	}

	public void setLat(Double lat) {
		this.lat = lat;
	}

	public Double getLon() {
		return lon;
	}

	public void setLon(Double lon) {
		this.lon = lon;
	}

	public String getSignalSource() {
		if (isEmpty(signalSource)) {
			return "";
		}
		return signalSource;
	}

	public void setSignalSource(String signalSource) {
		this.signalSource = signalSource == null ? null : signalSource.trim();
	}

	public Date getBdtime() {
		return bdtime;
	}

	public void setBdtime(Date bdtime) {
		this.bdtime = bdtime;
	}

	public Double getBdlat() {
		return bdlat;
	}

	public void setBdlat(Double bdlat) {
		this.bdlat = bdlat;
	}

	public Double getBdlon() {
		return bdlon;
	}

	public void setBdlon(Double bdlon) {
		this.bdlon = bdlon;
	}

	public Date getPhoneTime() {
		return phoneTime;
	}

	public void setPhoneTime(Date phoneTime) {
		this.phoneTime = phoneTime;
	}

	public String getDescription() {
		if (isEmpty(description)) {
			description = "";
		}
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public Double getRadius() {
		return radius;
	}

	public void setRadius(Double radius) {
		this.radius = radius;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr == null ? null : addr.trim();
	}

	public Double getSpeed() {
		if (isEmpty(speed)) {
			return 0.0;
		}
		return speed;
	}

	public void setSpeed(Double speed) {
		this.speed = speed;
	}

	public Integer getSatellite() {
		if (isEmpty(satellite)) {
			return 0;
		}
		return satellite;
	}

	public void setSatellite(Integer satellite) {
		this.satellite = satellite;
	}

	public Double getHeight() {
		if (isEmpty(height)) {
			return 0.0;
		}
		return height;
	}

	public void setHeight(Double height) {
		this.height = height;
	}

	public Double getDirection() {
		if (isEmpty(direction)) {
			return 0.0;
		}
		return direction;
	}

	public void setDirection(Double direction) {
		this.direction = direction;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator == null ? null : operator.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getStatusMessage() {
		return statusMessage;
	}

	public void setStatusMessage(String statusMessage) {
		this.statusMessage = statusMessage == null ? null : statusMessage.trim();
	}

	public String getLocationDescribe() {
		return locationDescribe;
	}

	public void setLocationDescribe(String locationDescribe) {
		this.locationDescribe = locationDescribe == null ? null : locationDescribe.trim();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Location(String id, Long seqNo, String name, Long userId, String userName, String groupName, Double lat,
			Double lon, String signalSource, Date bdtime, Double bdlat, Double bdlon, Date phoneTime,
			String description, Double radius, String addr, Double speed, Integer satellite, Double height,
			Double direction, String operator, String status, String statusMessage, String locationDescribe) {
		this.id = id;
		this.seqNo = seqNo;
		this.name = name;
		this.userId = userId;
		this.userName = userName;
		this.groupName = groupName;
		this.lat = lat;
		this.lon = lon;
		this.signalSource = signalSource;
		this.bdtime = bdtime;
		this.bdlat = bdlat;
		this.bdlon = bdlon;
		this.phoneTime = phoneTime;
		this.description = description;
		this.radius = radius;
		this.addr = addr;
		this.speed = speed;
		this.satellite = satellite;
		this.height = height;
		this.direction = direction;
		this.operator = operator;
		this.status = status;
		this.statusMessage = statusMessage;
		this.locationDescribe = locationDescribe;
	}

	public static boolean isEmpty(Object obj) {
		if (obj instanceof String) {
			return obj == null || ((String) obj).length() == 0;
		} else if (obj instanceof Object[]) {
			Object[] temp = (Object[]) obj;
			for (int i = 0; i < temp.length; i++) {
				if (!isEmpty(temp[i])) {
					return false;
				}
			}
			return true;
		} else if (obj instanceof List) {
			return obj == null || ((List) obj).isEmpty();
		}
		return obj == null;
	}
}
