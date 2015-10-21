package com.purui.rrtms.system.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.purui.rrtms.system.domain.AreaType;

@Entity
@Table(name = "D_AREA")
@NamedQueries({ @NamedQuery(name = "Province.loadAll", query = "FROM Province a WHERE a.type = 'PROVINCE'"), @NamedQuery(name = "Province.findById", query = "FROM Province a WHERE a.id=:id") })
public class Province {
	@Id
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 20)
	private String name;

	@Column(name = "TYPE")
	@Enumerated(EnumType.STRING)
	private final AreaType type = AreaType.PROVINCE;

	// =========================================================================
	@OneToMany(cascade = { CascadeType.REFRESH }, mappedBy = "province")
	private List<City> cities = new ArrayList<>();

	public List<City> getCities() {
		return cities;
	}

	public void setCities(List<City> cities) {
		this.cities = cities;
	}

	// =========================================================================
	public Province() {
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
		return "Province [id=" + id + ", name=" + name + ", type=" + type + "]";
	}

}
