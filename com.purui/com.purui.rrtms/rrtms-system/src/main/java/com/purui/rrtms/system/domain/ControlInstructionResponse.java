package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

// 负荷响应
// FuHeXiangYingSolution
public class ControlInstructionResponse {
	@Field("id")
	private String id;

	@Field("guid")
	private String guid;

	@Field("StationCode")
	private String stationCode;

	@Field("ControlMode")
	private String mode;

	@Field("Atime")
	private Date atTime;

	@Field("FuHeJob")
	private ResponseJob job;

	@Field("CronName")
	private String companyName;

	public ControlInstructionResponse() {
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getStationCode() {
		return stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public Date getAtTime() {
		return atTime;
	}

	public void setAtTime(Date atTime) {
		this.atTime = atTime;
	}

	public ResponseJob getJob() {
		return job;
	}

	public void setJob(ResponseJob job) {
		this.job = job;
	}

}
