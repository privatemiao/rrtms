package com.purui.rrtms.system.domain;

import java.util.Arrays;
import java.util.Date;

public class AnalysisPowerIndicatorParam {
	private String code;// 站点代码
	private Date date;// 需要分析的日期 yyyy-MM-dd
	private String curve;// 曲线: [电压曲线, 电流曲线, 功率因数曲线, 负荷曲线]
	private String[] kinds;// 用电项：[A, B, C]
	private Long pointId;

	public AnalysisPowerIndicatorParam() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * 曲线: [1:电压曲线, 2:电流曲线, 3:功率因数曲线, 4:负荷曲线]
	 * 
	 * @return
	 */
	public String getCurve() {
		return curve;
	}

	public void setCurve(String curve) {
		this.curve = curve;
	}

	public Long getPointId() {
		return pointId;
	}

	public void setPointId(Long pointId) {
		this.pointId = pointId;
	}

	/**
	 * 用电项：[A, B, C]
	 * 
	 * @return
	 */
	public String[] getKinds() {
		return kinds;
	}

	public void setKinds(String[] kinds) {
		this.kinds = kinds;
	}

	@Override
	public String toString() {
		return "AnalysisPowerIndicatorParam [code=" + code + ", date=" + date + ", curve=" + curve + ", kinds=" + Arrays.toString(kinds) + ", pointId=" + pointId + "]";
	}

}
