package com.purui.rrtms.system.domain;

import java.util.Date;

public class LoadControlApplyParam {
	private Date applyStartDate;
	private Date applyEndDate;
	private Date startDate;
	private Date endDate;
	private float percent;
	private String areaName;

	public LoadControlApplyParam() {
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
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

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	@Override
	public String toString() {
		return "LoadControlApplyParam [applyStartDate=" + applyStartDate + ", applyEndDate=" + applyEndDate + ", startDate=" + startDate + ", endDate=" + endDate + ", percent=" + percent
				+ ", areaName=" + areaName + "]";
	}

}
