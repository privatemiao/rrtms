package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

public class AnalysisEnergyParam {
	private String code;
	private Long[] pointIds;
	private String type;
	private Date date;
	private int curve;
	private String kind;

	public AnalysisEnergyParam() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Long[] getPointIds() {
		return pointIds;
	}

	public void setPointIds(Long[] pointIds) {
		this.pointIds = pointIds;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public int getCurve() {
		return curve;
	}

	public void setCurve(int curve) {
		this.curve = curve;
	}

	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	@Override
	public String toString() {
		return "AnalysisEnergyParam [code=" + code + ", pointIds=" + Arrays.toString(pointIds) + ", type=" + type + ", date=" + date + ", curve=" + curve + ", kind=" + kind + "]";
	}

}
