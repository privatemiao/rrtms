package com.purui.rrtms.system.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AnalysisLoadWrapper {
	private String name;

	private Date date;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	private List<TotalLoad> totalLoads = new ArrayList<>();

	public AnalysisLoadWrapper() {
	}

	public List<TotalLoad> getTotalLoads() {
		return totalLoads;
	}

	public void setTotalLoads(List<TotalLoad> totalLoads) {
		this.totalLoads = totalLoads;
	}

}
