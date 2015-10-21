package com.purui.rrtms.system.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.purui.rrtms.system.domain.AreaType;

@Entity
@Table(name = "D_AREA")
@NamedQuery(name = "City.findById", query = "FROM City a WHERE a.id = :id")
public class City {
	@Id
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 20)
	private String name;

	@Column(name = "TYPE")
	@Enumerated(EnumType.STRING)
	private final AreaType type = AreaType.CITY;

	// =========================================================================
	@ManyToOne(cascade = { CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_ID")
	@JsonIgnore
	private Province province;

	@OneToMany(cascade = { CascadeType.REFRESH }, mappedBy = "city")
	private List<District> districts = new ArrayList<>();

	public List<District> getDistricts() {
		return districts;
	}

	public void setDistricts(List<District> districts) {
		this.districts = districts;
	}

	public Province getProvince() {
		return province;
	}

	public void setProvince(Province province) {
		this.province = province;
	}

	// =========================================================================
	public City() {
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

	public AreaType getType() {
		return type;
	}

	@Override
	public String toString() {
		return "City [id=" + id + ", name=" + name + ", type=" + type + "]";
	}

}
