package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class ControlInstructionDetail {

	@Field("StationCode")
	private String stationCode;

	@Field("StationName")
	private String stationName;

	@Field("CronNo")
	private String cronNo;

	@Field("HangYeCode")
	private String industryCode;

	@Field("CityName")
	private String cityName;

	@Field("AreaName")
	private String areaName;

	@Field("Pe")
	private double pe;

	@Field("baseValue")
	private double baseValue;

	@Field("controlValue")
	private double controlValue;

	public ControlInstructionDetail() {
	}

	public ControlInstructionDetail(StationRun station) {
		this.areaName = station.getAreaName();
		this.cityName = station.getCityName();
		this.cronNo = station.getCronNo();
		this.industryCode = station.getIndustryCode();
		this.pe = station.getPe();
		this.stationCode = station.getStationCode();
		this.stationName = station.getStationName();
	}

	public String getStationCode() {
		return stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public String getStationName() {
		return stationName;
	}

	public void setStationName(String stationName) {
		this.stationName = stationName;
	}

	public String getCronNo() {
		return cronNo;
	}

	public void setCronNo(String cronNo) {
		this.cronNo = cronNo;
	}

	public String getIndustryCode() {
		return industryCode;
	}

	public void setIndustryCode(String industryCode) {
		this.industryCode = industryCode;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public double getPe() {
		return pe;
	}

	public void setPe(double pe) {
		this.pe = pe;
	}

	public double getBaseValue() {
		return baseValue;
	}

	public void setBaseValue(double baseValue) {
		this.baseValue = baseValue;
	}

	public double getControlValue() {
		return controlValue;
	}

	public void setControlValue(double controlValue) {
		this.controlValue = controlValue;
	}

}
