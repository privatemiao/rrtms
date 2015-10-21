package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class ResponseSolution {
	@Field("Tid")
	private int id;

	@Field("Seeid")
	private int currentId;

	@Field("Seename")
	private String name;

	@Field("Upseeid")
	private int parentId;

	@Field("Energyitemcode")
	private String energyItemCode;

	@Field("EnergyitemcodeName")
	private String energyItemCodeName;

	@Field("Pe")
	private double pe;

	@Field("Seedecribe")
	private String seedecribe;

	@Field("Guid")
	private String guid;

	@Field("OnWork")
	private boolean work;

	public ResponseSolution() {
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getCurrentId() {
		return currentId;
	}

	public void setCurrentId(int currentId) {
		this.currentId = currentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getParentId() {
		return parentId;
	}

	public void setParentId(int parentId) {
		this.parentId = parentId;
	}

	public String getEnergyItemCode() {
		return energyItemCode;
	}

	public void setEnergyItemCode(String energyItemCode) {
		this.energyItemCode = energyItemCode;
	}

	public String getEnergyItemCodeName() {
		return energyItemCodeName;
	}

	public void setEnergyItemCodeName(String energyItemCodeName) {
		this.energyItemCodeName = energyItemCodeName;
	}

	public double getPe() {
		return pe;
	}

	public void setPe(double pe) {
		this.pe = pe;
	}

	public String getSeedecribe() {
		return seedecribe;
	}

	public void setSeedecribe(String seedecribe) {
		this.seedecribe = seedecribe;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public boolean isWork() {
		return work;
	}

	public void setWork(boolean work) {
		this.work = work;
	}

	@Override
	public String toString() {
		return "ResponseSolution [id=" + id + ", currentId=" + currentId + ", name=" + name + ", parentId=" + parentId + ", energyItemCode=" + energyItemCode + ", energyItemCodeName="
				+ energyItemCodeName + ", pe=" + pe + ", seedecribe=" + seedecribe + ", guid=" + guid + ", work=" + work + "]";
	}

}
