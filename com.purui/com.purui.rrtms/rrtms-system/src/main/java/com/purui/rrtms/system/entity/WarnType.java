package com.purui.rrtms.system.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "D_WARN_TYPE")
@NamedQuery(name = "WarnType.findAll", query = "FROM WarnType a")
public class WarnType {
	@Id
	@Column(name = "ID")
	@GeneratedValue
	private Long id;

	@Column(name = "NAME")
	private String name;

	public WarnType() {
	}

	public WarnType(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "WarnType [id=" + id + ", name=" + name + "]";
	}

}
