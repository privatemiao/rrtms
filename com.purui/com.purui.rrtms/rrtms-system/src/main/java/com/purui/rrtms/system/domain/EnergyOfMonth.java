package com.purui.rrtms.system.domain;


public class EnergyOfMonth {
	private String stationCode;

	private String companyName;

	private String areaName;

	private String hangyeCode;
	
	private double maxValue;
	
	private double minValue;
	
	public EnergyOfMonth(){
		
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

	public double getMaxValue() {
		return maxValue;
	}

	public void setMaxValue(double maxValue) {
		this.maxValue = maxValue;
	}

	public double getMinValue() {
		return minValue;
	}

	public void setMinValue(double minValue) {
		this.minValue = minValue;
	}

	@Override
	public String toString() {
		return "EnergyOfMonth [stationCode=" + stationCode + ", companyName=" + companyName + ", areaName=" + areaName + ", hangyeCode=" + hangyeCode + ", maxValue=" + maxValue + ", minValue="
				+ minValue + "]";
	}

	
	
}
