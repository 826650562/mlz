package cn.mlight.domain;

import java.io.Serializable;
import java.util.Date;

public class Device implements Serializable {

	private Long id;
	private Long user_id;
	private String uid;
	private String brand;
	private String model_number;
	private String os_type;
	private String os_version;
	private String os_sub_type;
	private String os_sub_version;
	private String token;
	private Date last_login_time;
	private Date create_time;
	private Date update_time;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModel_number() {
		return model_number;
	}

	public void setModel_number(String model_number) {
		this.model_number = model_number;
	}

	public String getOs_type() {
		return os_type;
	}

	public void setOs_type(String os_type) {
		this.os_type = os_type;
	}

	public String getOs_version() {
		return os_version;
	}

	public void setOs_version(String os_version) {
		this.os_version = os_version;
	}

	public String getOs_sub_type() {
		return os_sub_type;
	}

	public void setOs_sub_type(String os_sub_type) {
		this.os_sub_type = os_sub_type;
	}

	public String getOs_sub_version() {
		return os_sub_version;
	}

	public void setOs_sub_version(String os_sub_version) {
		this.os_sub_version = os_sub_version;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Date getLast_login_time() {
		return last_login_time;
	}

	public void setLast_login_time(Date last_login_time) {
		this.last_login_time = last_login_time;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public Date getUpdate_time() {
		return update_time;
	}

	public void setUpdate_time(Date update_time) {
		this.update_time = update_time;
	}
}
