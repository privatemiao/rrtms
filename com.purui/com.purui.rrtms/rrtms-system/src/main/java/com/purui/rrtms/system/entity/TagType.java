package com.purui.rrtms.system.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "D_TAG_TYPE")
@NamedQueries({ @NamedQuery(name = "TagType.loadAll", query = "FROM TagType"), @NamedQuery(name = "TagType.findByCode", query = "FROM TagType a WHERE a.code = :code") })
public class TagType {
	@Id
	@Column(name = "CODE", length = 50, nullable = false)
	private String code;

	@Column(name = "NAME", length = 50, nullable = false)
	private String name;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@OneToMany(cascade = { CascadeType.REFRESH }, mappedBy = "tagType")
	@JsonIgnore
	private List<SubTagType> subTagType = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public TagType() {
	}

	public List<SubTagType> getSubTagType() {
		return subTagType;
	}

	public void setSubTagType(List<SubTagType> subTagType) {
		this.subTagType = subTagType;
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
		return "TagType [code=" + code + ", name=" + name + "]";
	}

}
