package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class CompanyShort {
	@Field("CONS_NO")
	private String companyNo;

	@Field("CONS_NAME")
	private String companyName;

	public CompanyShort() {
	}

	public String getCompanyNo() {
		return companyNo;
	}

	public void setCompanyNo(String companyNo) {
		this.companyNo = companyNo;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	@Override
	public String toString() {
		return "CompanyShort [companyNo=" + companyNo + ", companyName="
				+ companyName + "]";
	}

}
