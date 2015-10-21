package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class ControlInstruction {
	@Field("guid")
	private String guid;

	@Field("applyStartDate")
	private Date applyStartDate;

	@Field("applyEndDate")
	private Date applyEndDate;

	@Field("startDate")
	private Date startDate;

	@Field("endDate")
	private Date endDate;

	@Field("percent")
	private float percent;

	@Field("areaName")
	private String areaName;

	@Field("userName")
	private String userName;

	@Field("insertTime")
	private Date insertTime = new Date();

	@Field("details")
	private ControlInstructionDetail[] details;

	@Field("result")
	private String result;

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public ControlInstructionDetail[] getDetails() {
		return details;
	}

	public void setDetails(ControlInstructionDetail[] details) {
		this.details = details;
	}

	public ControlInstruction() {
	}

	public ControlInstruction(LoadControlApplyParam param) {
		this.applyStartDate = param.getApplyStartDate();
		this.applyEndDate = param.getApplyEndDate();
		this.startDate = param.getStartDate();
		this.endDate = param.getEndDate();
		this.percent = param.getPercent();
		this.areaName = param.getAreaName();
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public Date getApplyStartDate() {
		return applyStartDate;
	}

	public void setApplyStartDate(Date applyStartDate) {
		this.applyStartDate = applyStartDate;
	}

	public Date getApplyEndDate() {
		return applyEndDate;
	}

	public void setApplyEndDate(Date applyEndDate) {
		this.applyEndDate = applyEndDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public float getPercent() {
		return percent;
	}

	public void setPercent(float percent) {
		this.percent = percent;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Date getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(Date insertTime) {
		this.insertTime = insertTime;
	}

	@Override
	public String toString() {
		return "ControlInstruction [guid=" + guid + ", applyStartDate=" + applyStartDate + ", applyEndDate=" + applyEndDate + ", startDate=" + startDate + ", endDate=" + endDate + ", percent="
				+ percent + ", areaName=" + areaName + ", userName=" + userName + ", insertTime=" + insertTime + "]";
	}

}
