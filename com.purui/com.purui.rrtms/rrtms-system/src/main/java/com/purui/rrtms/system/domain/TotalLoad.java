package com.purui.rrtms.system.domain;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class TotalLoad {
	@Field("StationCode")
	private String stationCode;

	@Field("CompanyName")
	private String companyName;

	@Field("AreaName")
	private String areaName;

	@Field("HangyeCode")
	private String industry;

	@Field("FuHeValue")
	private double load;

	@Field("Atime")
	private Date atTime;

	@Field("mYear")
	private int year;

	@Field("mMonth")
	private int month;

	@Field("mDay")
	private int day;

	private int count = 0;

	private double totalValue = 0;

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

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public double getLoad() {
		return load;
	}

	public void setLoad(double load) {
		this.load = load;
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

	public TotalLoad() {
	}

	public String getStationCode() {
		return stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public double getTotalValue() {
		return totalValue;
	}

	public void setTotalValue(double totalValue) {
		this.totalValue = totalValue;
	}

	@Override
	public String toString() {
		return "TotalLoad [stationCode=" + stationCode + ", companyName=" + companyName + ", areaName=" + areaName + ", industry=" + industry + ", load=" + load + ", atTime=" + atTime + ", year="
				+ year + ", month=" + month + ", day=" + day + ", count=" + count + ", totalValue=" + totalValue + "]";
	}
	
	public String toCSVString(){
		return stationCode + ", " + companyName + ", " + areaName + ", " + industry + ", " + load + ", " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(atTime) + ", "
				+ year + ", " + month + ", " + day + ", " + count + ", " + totalValue;
	}


}
