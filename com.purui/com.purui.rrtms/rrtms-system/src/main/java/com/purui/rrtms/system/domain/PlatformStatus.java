package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class PlatformStatus {

	/*
	 * { "_id": ObjectId("5461cbf5b8434388ccd79aaf"), "SvrName": "dataSvr",
	 * "OnlineStation": NumberLong(36), "EnergyEnableCount": NumberLong(27),
	 * "GoodRunCount": NumberLong(36), "FaultRunCount": NumberLong(0),
	 * "TimeOutCount": NumberLong(0), "RawDataInputSize": "3174 Mb",
	 * "RawEnergyReportSize": "397 Kb | Up:50 | Down:0", "CpuLoad":
	 * 59.495937347412, "RAM": 7089 }
	 */
	@Field("_id")
	private String id;

	@Field("SvrName")
	private String serverName;

	@Field("OnlineStation")
	private int onlineStationCount;

	@Field("EnergyEnableCount")
	private int energyEnableCount;

	@Field("GoodRunCount")
	private int normalStationCount;

	@Field("FaultRunCount")
	private int faultStationCount;

	@Field("TimeOutCount")
	private int timeoutCount;

	@Field("RawDataInputSize")
	private String rawDataInputSize;

	@Field("RawEnergyReportSize")
	private String rawEnergyReportSize;

	@Field("CpuLoad")
	private double cpuLoad;

	@Field("RAM")
	private int ram;

	public PlatformStatus() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getServerName() {
		return serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	public int getOnlineStationCount() {
		return onlineStationCount;
	}

	public void setOnlineStationCount(int onlineStationCount) {
		this.onlineStationCount = onlineStationCount;
	}

	public int getEnergyEnableCount() {
		return energyEnableCount;
	}

	public void setEnergyEnableCount(int energyEnableCount) {
		this.energyEnableCount = energyEnableCount;
	}

	public int getNormalStationCount() {
		return normalStationCount;
	}

	public void setNormalStationCount(int normalStationCount) {
		this.normalStationCount = normalStationCount;
	}

	public int getFaultStationCount() {
		return faultStationCount;
	}

	public void setFaultStationCount(int faultStationCount) {
		this.faultStationCount = faultStationCount;
	}

	public int getTimeoutCount() {
		return timeoutCount;
	}

	public void setTimeoutCount(int timeoutCount) {
		this.timeoutCount = timeoutCount;
	}

	public String getRawDataInputSize() {
		return rawDataInputSize;
	}

	public void setRawDataInputSize(String rawDataInputSize) {
		this.rawDataInputSize = rawDataInputSize;
	}

	public String getRawEnergyReportSize() {
		return rawEnergyReportSize;
	}

	public void setRawEnergyReportSize(String rawEnergyReportSize) {
		this.rawEnergyReportSize = rawEnergyReportSize;
	}

	public double getCpuLoad() {
		return cpuLoad;
	}

	public void setCpuLoad(double cpuLoad) {
		this.cpuLoad = cpuLoad;
	}

	public int getRam() {
		return ram;
	}

	public void setRam(int ram) {
		this.ram = ram;
	}

	@Override
	public String toString() {
		return "PlatformStatus [id=" + id + ", serverName=" + serverName + ", onlineStationCount=" + onlineStationCount + ", energyEnableCount=" + energyEnableCount + ", normalStationCount="
				+ normalStationCount + ", faultStationCount=" + faultStationCount + ", timeoutCount=" + timeoutCount + ", rawDataInputSize=" + rawDataInputSize + ", rawEnergyReportSize="
				+ rawEnergyReportSize + ", cpuLoad=" + cpuLoad + ", ram=" + ram + "]";
	}

}
