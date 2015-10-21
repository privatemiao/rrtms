package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class EnergyEntity {
	@Field("id")
	private String id;

	@Field("StationCode")
	private String stationCode;
	
	@Field("CompanyName")
	private String companyName;
	
	@Field("AreaName")
	private String areaName;
	
	@Field("HangyeCode")
	private String hangyeCode;
	
	@Field("Data")
	private EnergyData data;

	public EnergyEntity() {
	}

	public EnergyEntity(String id, String stationCode, String companyName, String areaName, String hangyeCode, EnergyData data) {
		this.id = id;
		this.stationCode = stationCode;
		this.companyName = companyName;
		this.areaName = areaName;
		this.hangyeCode = hangyeCode;
		this.data = data;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getStationCode() {
		return stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getHangyeCode() {
		return hangyeCode;
	}

	public void setHangyeCode(String hangyeCode) {
		this.hangyeCode = hangyeCode;
	}

	public EnergyData getData() {
		return data;
	}

	public void setData(EnergyData data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "EnergyEntity [id=" + id + ", stationCode=" + stationCode + ", companyName=" + companyName + ", areaName=" + areaName + ", hangyeCode=" + hangyeCode + "]";
	}
	
	
}
