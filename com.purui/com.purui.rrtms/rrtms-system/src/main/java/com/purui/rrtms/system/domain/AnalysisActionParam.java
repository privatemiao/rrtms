package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

public class AnalysisActionParam {
	private String type;// 年、月、日
	private Date startDate;// 开始日期
	private Date endDate;// 结束日期
	private String compareBy;// 区域：area; 行业：industry
	private String[] compareByValue;// 区域名称；行业代码

	public AnalysisActionParam() {
	}

	/**
	 * 年、月、日
	 * 
	 * @return
	 */
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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

	/**
	 * 区域：area; 行业：industry
	 * 
	 * @return
	 */
	public String getCompareBy() {
		return compareBy;
	}

	public void setCompareBy(String compareBy) {
		this.compareBy = compareBy;
	}

	/**
	 * 区域名称；行业代码
	 * 
	 * @return
	 */
	public String[] getCompareByValue() {
		return compareByValue;
	}

	public void setCompareByValue(String[] compareByValue) {
		this.compareByValue = compareByValue;
	}

	@Override
	public String toString() {
		return "AnalysisActionCompareByLoadParam [type=" + type
				+ ", startDate=" + startDate + ", endDate=" + endDate
				+ ", compareBy=" + compareBy + ", compareByValue="
				+ Arrays.toString(compareByValue) + "]";
	}

}
