package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class HDataMon {
	private String id;
	@Field("TagGuid")
	private String tagGuid;
	@Field("TagValue")
	private Double tagValue;
	@Field("nValue")
	private Double nValue;
	@Field("Atime")
	private Date atTime;
	@Field("DataType")
	private int dataType;
	@Field("WarnStatus")
	private int warnStatus;
	@Field("mYear")
	private int year;
	@Field("mMonth")
	private int month;
	@Field("mDay")
	private int day;
	@Field("SeeID")
	private int seeId;

	public HDataMon() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTagGuid() {
		return tagGuid;
	}

	public void setTagGuid(String tagGuid) {
		this.tagGuid = tagGuid;
	}

	public Double getTagValue() {
		return tagValue;
	}

	public void setTagValue(Double tagValue) {
		this.tagValue = tagValue;
	}

	public Double getnValue() {
		return nValue;
	}

	public void setnValue(Double nValue) {
		this.nValue = nValue;
	}

	public Date getAtTime() {
		return atTime;
	}

	public void setAtTime(Date atTime) {
		this.atTime = atTime;
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}

	public int getWarnStatus() {
		return warnStatus;
	}

	public void setWarnStatus(int warnStatus) {
		this.warnStatus = warnStatus;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public int getDay() {
		return day;
	}

	public void setDay(int day) {
		this.day = day;
	}

	public int getSeeId() {
		return seeId;
	}

	public void setSeeId(int seeId) {
		this.seeId = seeId;
	}

	@Override
	public String toString() {
		return "HDataMon [id=" + id + ", tagGuid=" + tagGuid + ", tagValue=" + tagValue + ", nValue=" + nValue + ", atTime=" + atTime + ", dataType=" + dataType + ", warnStatus=" + warnStatus
				+ ", year=" + year + ", month=" + month + ", day=" + day + ", seeId=" + seeId + "]";
	}
}
