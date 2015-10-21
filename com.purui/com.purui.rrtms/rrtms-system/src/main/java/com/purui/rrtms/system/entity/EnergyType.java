package com.purui.rrtms.system.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "D_ENERGY_TYPE")
@NamedQueries({ @NamedQuery(name = "EnergyType.loadAll", query = "FROM EnergyType"), @NamedQuery(name = "EnergyType.findByCode", query = "FROM EnergyType a WHERE a.code = :code") })
public class EnergyType {
	@Id
	@Column(name = "CODE", length = 50, nullable = false)
	private String code;

	@Column(name = "NAME", length = 50, nullable = false)
	private String name;

	@Column(name = "TYPE", length = 50, nullable = false)
	private String type;

	@Column(name = "UNIT", length = 50)
	private String unit;

	@Column(name = "TEC")
	private Double tec;

	public EnergyType() {
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getTec() {
		return tec;
	}

	public void setTec(Double tec) {
		this.tec = tec;
	}

	@Override
	public String toString() {
		return "EnergyType [code=" + code + ", name=" + name + ", type=" + type + ", unit=" + unit + ", tec=" + tec + "]";
	}

}
