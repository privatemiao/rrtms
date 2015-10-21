package com.purui.rrtms.system.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Field;

public class LineStopInfo {
	@Field("ID")
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

	@Field("RANGE")
	private String range;

	@Field("SUB_LIST")
	private List<CompanyShort> companys = new ArrayList<>();

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public LineStopInfo() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public String getRange() {
		return range;
	}

	public void setRange(String range) {
		this.range = range;
	}

	public List<CompanyShort> getCompanys() {
		return companys;
	}

	public void setCompanys(List<CompanyShort> companys) {
		this.companys = companys;
	}

	@Override
	public String toString() {
		return "LineStopInfo [id=" + id + ", no=" + no + ", startDate="
				+ startDate + ", endDate=" + endDate + ", area=" + area
				+ ", line=" + line + ", range=" + range + ", companys="
				+ companys + "]";
	}

}
