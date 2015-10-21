package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class StationRun {
	@Field("id")
	private String id;

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

	@Field("LineName")
	private String[] lineName;

	@Field("Pe")
	private double pe;

	@Field("RunStatus")
	private int runStatus;

	@Field("EnergyEnable")
	private boolean energyEnable;

	@Field("FuheTradingEnable")
	private boolean tradeEnable;

	@Field("StationFuHeDatas")
	private LoadData loadData;

	@Field("EnergyChangeValue")
	private double energyChangeValue;
	
	@Field("EnergyFValue")
	private double feng;
	
	@Field("EnergyGValue")
	private double gu;
	
	@Field("EnergyPValue")
	private double ping;
	
	@Field("EnergyTimeStr")
	private String energyTime;

	@Field("Atime")
	private Date atTime;

	public StationRun() {
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

	public String[] getLineName() {
		return lineName;
	}

	public void setLineName(String[] lineName) {
		this.lineName = lineName;
	}

	public double getPe() {
		return pe;
	}

	public void setPe(double pe) {
		this.pe = pe;
	}

	public int getRunStatus() {
		return runStatus;
	}

	public void setRunStatus(int runStatus) {
		this.runStatus = runStatus;
	}

	public boolean isEnergyEnable() {
		return energyEnable;
	}

	public void setEnergyEnable(boolean energyEnable) {
		this.energyEnable = energyEnable;
	}

	public boolean isTradeEnable() {
		return tradeEnable;
	}

	public void setTradeEnable(boolean tradeEnable) {
		this.tradeEnable = tradeEnable;
	}

	public LoadData getLoadData() {
		return loadData;
	}

	public void setLoadData(LoadData loadData) {
		this.loadData = loadData;
	}

	public double getEnergyChangeValue() {
		return energyChangeValue;
	}

	public void setEnergyChangeValue(double energyChangeValue) {
		this.energyChangeValue = energyChangeValue;
	}

	public Date getAtTime() {
		return atTime;
	}

	public void setAtTime(Date atTime) {
		this.atTime = atTime;
	}

	public String getStationName() {
		return stationName;
	}

	public void setStationName(String stationName) {
		this.stationName = stationName;
	}
	
	

	public double getFeng() {
		return feng;
	}

	public void setFeng(double feng) {
		this.feng = feng;
	}

	public double getGu() {
		return gu;
	}

	public void setGu(double gu) {
		this.gu = gu;
	}

	public double getPing() {
		return ping;
	}

	public void setPing(double ping) {
		this.ping = ping;
	}

	public String getEnergyTime() {
		return energyTime;
	}

	public void setEnergyTime(String energyTime) {
		this.energyTime = energyTime;
	}

	@Override
	public String toString() {
		return "StationRun [id=" + id + ", stationCode=" + stationCode + ", stationName=" + stationName + ", cronNo=" + cronNo + ", industryCode=" + industryCode + ", cityName=" + cityName
				+ ", areaName=" + areaName + ", lineName=" + Arrays.toString(lineName) + ", pe=" + pe + ", runStatus=" + runStatus + ", energyEnable=" + energyEnable + ", tradeEnable=" + tradeEnable
				+ ", energyChangeValue=" + energyChangeValue + ", atTime=" + atTime + "]";
	}

}
