package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class CuoFengStopInfo {
	@Field("_id")
	private String id;

	@Field("NO_ID")
	private String no;

	@Field("START_DATE")
	private Date startDate;

	@Field("END_DATE")
	private Date endDate;

	@Field("AREA")
	private String area;

	@Field("LINE")
	private String line;

	@Field("RELEASE")
	private String release;

	@Field("TYPE")
	private String type;

	@Field("CAPACITY")
	private String capacity;

	@Field("UNIT_NAME")
	private String unitName;

	@Field("SUB_LIST")
	private CompanyShort[] companys;

	public CuoFengStopInfo() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getLine() {
		return line;
	}

	public void setLine(String line) {
		this.line = line;
	}

	public String getRelease() {
		return release;
	}

	public void setRelease(String release) {
		this.release = release;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCapacity() {
		return capacity;
	}

	public void setCapacity(String capacity) {
		this.capacity = capacity;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public CompanyShort[] getCompanys() {
		return companys;
	}

	public void setCompanys(CompanyShort[] companys) {
		this.companys = companys;
	}

	@Override
	public String toString() {
		return "CuoFengStopInfo [id=" + id + ", no=" + no + ", startDate="
				+ startDate + ", endDate=" + endDate + ", area=" + area
				+ ", line=" + line + ", release=" + release + ", type=" + type
				+ ", capacity=" + capacity + ", unitName=" + unitName
				+ ", companys=" + Arrays.toString(companys) + "]";
	}

}
