package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class MData {
	@Field("id")
	private String id;

	@Field("TagGuid")
	private String guid;

	@Field("MaxValue")
	private double maxValue;

	@Field("MinValue")
	private double minValue;

	@Field("AvgValue")
	private double avgValue;

	@Field("MaxTime")
	private Date maxTime;

	@Field("MinTime")
	private Date minTime;

	@Field("Atime")
	private Date atTime;

	@Field("mYear")
	private int year;

	@Field("mMonth")
	private int month;

	@Field("mDay")
	private int day;

	@Field("SeeID")
	private int currentId;

	public MData() {
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

	public double getAvgValue() {
		return avgValue;
	}

	public void setAvgValue(double avgValue) {
		this.avgValue = avgValue;
	}

	public Date getMaxTime() {
		return maxTime;
	}

	public void setMaxTime(Date maxTime) {
		this.maxTime = maxTime;
	}

	public Date getMinTime() {
		return minTime;
	}

	public void setMinTime(Date minTime) {
		this.minTime = minTime;
	}

	public Date getAtTime() {
		return atTime;
	}

	public void setAtTime(Date atTime) {
		this.atTime = atTime;
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

	public int getCurrentId() {
		return currentId;
	}

	public void setCurrentId(int currentId) {
		this.currentId = currentId;
	}

	@Override
	public String toString() {
		return "MData [id=" + id + ", guid=" + guid + ", maxValue=" + maxValue + ", minValue=" + minValue + ", avgValue=" + avgValue + ", maxTime=" + maxTime + ", minTime=" + minTime + ", atTime="
				+ atTime + ", year=" + year + ", month=" + month + ", day=" + day + ", currentId=" + currentId + "]";
	}

}
