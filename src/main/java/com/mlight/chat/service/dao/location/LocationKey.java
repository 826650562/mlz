package com.mlight.chat.service.dao.location;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by li wei on 2016/5/16.
 */
public class LocationKey implements Serializable {
	private Long id;

	private Date standardTime;

	private static final long serialVersionUID = 1L;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getStandardTime() {
		return standardTime;
	}

	public void setStandardTime(Date standardTime) {
		this.standardTime = standardTime;
	}
}