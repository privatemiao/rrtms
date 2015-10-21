package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class TotalLoadOfMonth {
	@Field("StationCode")
	private String code;
	
	@Field("CompanyName")
	private String companyName;
	
	@Field("AreaName")
	private String areaName;
	
	@Field("HangyeCode")
	private String hangyeCode;
	
	@Field("FuHeValue")
	private double value;
	
	@Field("Atime")
	private Date atTime;
	
	@Field("mYear")
	private int year;
	
	@Field("mMonth")
	private int month;
	
	@Field("mDay")
	private int day;

	public TotalLoadOfMonth() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
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

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
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

	@Override
	public String toString() {
		return "TotalLoadOfMonth [code=" + code + ", companyName=" + companyName + ", areaName=" + areaName + ", hangyeCode=" + hangyeCode + ", value=" + value + ", atTime=" + atTime + ", year="
				+ year + ", month=" + month + ", day=" + day + "]";
	}

}
