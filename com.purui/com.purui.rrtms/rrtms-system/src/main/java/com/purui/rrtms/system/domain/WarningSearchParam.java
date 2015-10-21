package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

public class WarningSearchParam {
	private String warnType;
	private Date startDate;
	private Date endDate;
	private String[] code;
	private Boolean configured;

	public WarningSearchParam() {
	}


	public WarningSearchParam(String warnType, Date startDate, Date endDate, String[] code, Boolean configured) {
		super();
		this.warnType = warnType;
		this.startDate = startDate;
		this.endDate = endDate;
		this.code = code;
		this.configured = configured;
	}


	public String getWarnType() {
		return warnType;
	}

	public void setWarnType(String warnType) {
		this.warnType = warnType;
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

	public String[] getCode() {
		return code;
	}

	public void setCode(String[] code) {
		this.code = code;
	}


	public Boolean getConfigured() {
		return configured;
	}


	public void setConfigured(Boolean configured) {
		this.configured = configured;
	}


	@Override
	public String toString() {
		return "WarningSearchParam [warnType=" + warnType + ", startDate=" + startDate + ", endDate=" + endDate + ", code=" + Arrays.toString(code) + ", configured=" + configured + "]";
	}

}
