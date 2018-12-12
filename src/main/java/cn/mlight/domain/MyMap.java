package cn.mlight.domain;

import java.util.Date;

public class MyMap {
	private Long id;
	private Long seqno;
	private String userid;
	private Double lat;
	private Double lon;
	private String username;
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	private Date standard_time;
	private String signalsource;

	public MyMap() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getSeqno() {
		return seqno;
	}

	public void setSeqno(Long seqno) {
		this.seqno = seqno;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getSignalsource() {
		return signalsource;
	}

	public void setSignalsource(String signalsource) {
		this.signalsource = signalsource;
	}

	public Date getStandard_time() {
		return standard_time;
	}

	public void setStandard_time(Date standard_time) {
		this.standard_time = standard_time;
	}

}
