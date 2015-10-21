package com.purui.rrtms.system.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "T_USER_DATA_POINT")
@NamedQueries({ @NamedQuery(name = "UserDataPoint.removeByUserId", query = "DELETE FROM UserDataPoint a WHERE a.userId=:userId and code=:code"),
		@NamedQuery(name = "UserDataPoint.findByUserId", query = "FROM UserDataPoint a WHERE a.userId=:userId and code=:code") })
public class UserDataPoint {
	@Id
	@Column(name = "ID")
	@GeneratedValue
	private Long id;

	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@Column(name = "DATA_POINT_ID", nullable = false)
	private Long dataPointId;

	@Column(name = "PARENT_NAME", nullable = false, length = 50)
	private String parentName;

	@Column(name = "CODE", nullable = false, length = 20)
	private String code;

	public UserDataPoint() {
	}

	public UserDataPoint(Long id, Long userId, Long dataPointId, String parentName, String code) {
		this.id = id;
		this.userId = userId;
		this.dataPointId = dataPointId;
		this.parentName = parentName;
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getDataPointId() {
		return dataPointId;
	}

	public void setDataPointId(Long dataPointId) {
		this.dataPointId = dataPointId;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	@Override
	public String toString() {
		return "UserDataPoint [id=" + id + ", userId=" + userId + ", dataPointId=" + dataPointId + ", parentName=" + parentName + ", code=" + code + "]";
	}

}
