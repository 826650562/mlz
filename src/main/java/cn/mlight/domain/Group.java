package cn.mlight.domain;

import java.io.Serializable;
import java.util.Date;

public class Group implements Serializable {

	private Long id;
	private Integer organization_id;
	private int department_id;
	private String name;
	private int type;
	private String creator;
	private String owner;
	private String logo;
	private String logo_info;
	private int max_members;
	private Date create_time;
	private Date update_time;
	private Date delete_time;
	private int deleted;

	/*
	 * private Set<User> users = new HashSet<User>(); private Set<Message>
	 * messages = new HashSet<Message>();
	 */
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getOrganization_id() {
		return organization_id;
	}

	public void setOrganization_id(Integer organization_id) {
		this.organization_id = organization_id;
	}

	public int getDepartment_id() {
		return department_id;
	}

	public void setDepartment_id(int department_id) {
		this.department_id = department_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getLogo_info() {
		return logo_info;
	}

	public void setLogo_info(String logo_info) {
		this.logo_info = logo_info;
	}

	public int getMax_members() {
		return max_members;
	}

	public void setMax_members(int max_members) {
		this.max_members = max_members;
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

	public Date getDelete_time() {
		return delete_time;
	}

	public void setDelete_time(Date delete_time) {
		this.delete_time = delete_time;
	}

	public int getDeleted() {
		return deleted;
	}

	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}

}
