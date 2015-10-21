package com.purui.rrtms.system.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.purui.rrtms.system.domain.AreaType;

@Entity
@Table(name = "D_AREA")
public class District {
	@Id
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 20)
	private String name;

	@Column(name = "TYPE")
	@Enumerated(EnumType.STRING)
	private final AreaType type = AreaType.DISTRICT;

	// =========================================================================
	@ManyToOne(cascade = { CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_ID")
	@JsonIgnore
	private City city;

	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	// =========================================================================
	public District() {
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
		return "District [id=" + id + ", name=" + name + ", type=" + type + "]";
	}

}
