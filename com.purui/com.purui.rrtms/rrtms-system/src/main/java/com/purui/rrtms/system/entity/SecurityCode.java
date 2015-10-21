package com.purui.rrtms.system.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.mel.framework.domain.SecurityCodeType;

@Entity
@Table(name = "T_SECURITY_CODE")
@NamedQueries({ @NamedQuery(name = "SecurityCode.findByType", query = "FROM SecurityCode a WHERE a.type = :type"), @NamedQuery(name = "SecurityCode.findAll", query = "FROM SecurityCode") })
public class SecurityCode {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "TYPE", length = 10)
	@Enumerated(EnumType.STRING)
	private SecurityCodeType type;

	@Column(name = "PASSWORD")
	private String password;

	public SecurityCode() {
	}

	public SecurityCode(SecurityCodeType type, String password) {
		super();
		this.type = type;
		this.password = password;
	}

	public SecurityCode(Long id, SecurityCodeType type, String password) {
		this.id = id;
		this.type = type;
		this.password = password;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SecurityCodeType getType() {
		return type;
	}

	public void setType(SecurityCodeType type) {
		this.type = type;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "SecurityCode [id=" + id + ", type=" + type + ", password=" + password + "]";
	}

}
