package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class ControlInstructionResult {
	@Field("id")
	private String id;

	@Field("guid")
	private String guid;

	@Field("StationCode")
	private String stationCode;

	@Field("StationName")
	private String stationName;

	@Field("Atime")
	private Date atTime;

	@Field("Conent")
	private String content;

	@Field("ControlMode")
	private String mode;

	public ControlInstructionResult() {
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

	public String getStationName() {
		return stationName;
	}

	public void setStationName(String stationName) {
		this.stationName = stationName;
	}

	public Date getAtTime() {
		return atTime;
	}

	public void setAtTime(Date atTime) {
		this.atTime = atTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	@Override
	public String toString() {
		return "ControlInstructionResult [id=" + id + ", guid=" + guid + ", stationCode=" + stationCode + ", stationName=" + stationName + ", atTime=" + atTime + ", content=" + content + ", mode="
				+ mode + "]";
	}

}
