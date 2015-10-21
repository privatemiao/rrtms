package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

public class DataPointHistoryParam {
	private String[] guids;
	private Date date;

	public DataPointHistoryParam() {
	}

	public String[] getGuids() {
		return guids;
	}

	public void setGuids(String[] guids) {
		this.guids = guids;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "DataPointHistoryParam [guids=" + Arrays.toString(guids) + ", date=" + date + "]";
	}

}
