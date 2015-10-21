package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class EnergyData{
	@Field("LastDevValue")
	private double value;
	
	@Field("ChangeValue")
	private double changeValue;
	
	@Field("Atime")
	private Date atTime;
	
	@Field("mYear")
	private int year;
	
	@Field("mMonth")
	private int month;
	
	@Field("mDay")
	private int day;
	
	@Field("InitOK")
	private boolean initOk;

	public EnergyData() {
	}

	public EnergyData(double value, double changeValue, Date atTime, int year, int month, int day, boolean initOk) {
		this.value = value;
		this.changeValue = changeValue;
		this.atTime = atTime;
		this.year = year;
		this.month = month;
		this.day = day;
		this.initOk = initOk;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public double getChangeValue() {
		return changeValue;
	}

	public void setChangeValue(double changeValue) {
		this.changeValue = changeValue;
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

	public boolean isInitOk() {
		return initOk;
	}

	public void setInitOk(boolean initOk) {
		this.initOk = initOk;
	}

	@Override
	public String toString() {
		return "EnergyData [value=" + value + ", changeValue=" + changeValue + ", atTime=" + atTime + ", year=" + year + ", month=" + month + ", day=" + day + ", initOk=" + initOk + "]";
	}
	
	
}
