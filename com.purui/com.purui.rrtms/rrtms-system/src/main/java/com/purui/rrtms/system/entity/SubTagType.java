package com.purui.rrtms.system.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "D_SUB_TAG_TYPE")
public class SubTagType {
	@Id
	@Column(name = "CODE", length = 50, nullable = false)
	private String code;

	@Column(name = "NAME", length = 50, nullable = false)
	private String name;

	@Column(name = "UNIT", length = 50)
	private String unit;
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "PARENT_ID")
	private TagType tagType;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public SubTagType() {
	}

	public TagType getTagType() {
		return tagType;
	}

	public void setTagType(TagType tagType) {
		this.tagType = tagType;
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

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Override
	public String toString() {
		return "SubTagType [code=" + code + ", name=" + name + ", unit=" + unit + "]";
	}

}
