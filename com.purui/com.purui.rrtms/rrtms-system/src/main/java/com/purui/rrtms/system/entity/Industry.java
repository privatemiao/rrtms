package com.purui.rrtms.system.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "D_INDUSTRY")
@NamedQuery(name="Industry.findAll", query="FROM Industry")
public class Industry {
	@Id
	@Column(name = "CODE", length = 10)
	private String code;
	@Column(name = "NAME", length = 50)
	private String name;

	public Industry() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Industry [code=" + code + ", name=" + name + "]";
	}

}
