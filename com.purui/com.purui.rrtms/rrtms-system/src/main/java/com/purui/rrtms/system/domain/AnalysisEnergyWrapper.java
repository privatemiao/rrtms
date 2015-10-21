package com.purui.rrtms.system.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AnalysisEnergyWrapper {
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

	private List<TotalEnergy> totalEnergys = new ArrayList<>();

	public AnalysisEnergyWrapper() {
	}

	public List<TotalEnergy> getTotalEnergys() {
		return totalEnergys;
	}

	public void setTotalEnergys(List<TotalEnergy> totalEnergys) {
		this.totalEnergys = totalEnergys;
	}

}
