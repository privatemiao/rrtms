package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class LoadData {
	@Field("RTSumFuheValue")
	private double realtimeSumValue;

	@Field("HistoryMaxValue")
	private double historyMaxValue;

	@Field("HistoryMinValue")
	private double historyMinValue;

	@Field("MonthMaxValue")
	private double monthMaxValue;

	@Field("MonthMinValue")
	private double monthMinValue;

	@Field("_5MinAvgValue")
	private double fiveMinAvgValue;

	@Field("_10MinAvgValue")
	private double tenMinAvgValue;

	public LoadData() {
	}

	public double getRealtimeSumValue() {
		return realtimeSumValue;
	}

	public void setRealtimeSumValue(double realtimeSumValue) {
		this.realtimeSumValue = realtimeSumValue;
	}

	public double getHistoryMaxValue() {
		return historyMaxValue;
	}

	public void setHistoryMaxValue(double historyMaxValue) {
		this.historyMaxValue = historyMaxValue;
	}

	public double getHistoryMinValue() {
		return historyMinValue;
	}

	public void setHistoryMinValue(double historyMinValue) {
		this.historyMinValue = historyMinValue;
	}

	public double getMonthMaxValue() {
		return monthMaxValue;
	}

	public void setMonthMaxValue(double monthMaxValue) {
		this.monthMaxValue = monthMaxValue;
	}

	public double getMonthMinValue() {
		return monthMinValue;
	}

	public void setMonthMinValue(double monthMinValue) {
		this.monthMinValue = monthMinValue;
	}

	public double getFiveMinAvgValue() {
		return fiveMinAvgValue;
	}

	public void setFiveMinAvgValue(double fiveMinAvgValue) {
		this.fiveMinAvgValue = fiveMinAvgValue;
	}

	public double getTenMinAvgValue() {
		return tenMinAvgValue;
	}

	public void setTenMinAvgValue(double tenMinAvgValue) {
		this.tenMinAvgValue = tenMinAvgValue;
	}

	@Override
	public String toString() {
		return "LoadData [realtimeSumValue=" + realtimeSumValue + ", historyMaxValue=" + historyMaxValue + ", historyMinValue=" + historyMinValue + ", monthMaxValue=" + monthMaxValue
				+ ", monthMinValue=" + monthMinValue + ", fiveMinAvgValue=" + fiveMinAvgValue + ", tenMinAvgValue=" + tenMinAvgValue + "]";
	}

}
