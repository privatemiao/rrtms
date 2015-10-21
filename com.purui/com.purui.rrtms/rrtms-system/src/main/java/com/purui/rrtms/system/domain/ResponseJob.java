package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class ResponseJob {
	@Field("guid")
	private String guid;

	@Field("StationCode")
	private String stationCode;

	@Field("ExcBeforeFuHeValue")
	private double beforeValue;

	@Field("ExcFinishFuHeValue")
	private double afterValue;

	@Field("ID")
	private String id;

	@Field("CONS_NO")
	private String consNo;

	@Field("FH")
	private double load;

	@Field("START_DATE")
	private Date startDate;

	@Field("END_DATE")
	private Date endDate;

	@Field("FromWhere")
	private int from;

	@Field("Mode")
	private int mode;

	// 评估
	@Field("EvalFH")
	private double evalLoad;

	@Field("EvalTime")
	private Date evalTime;

	@Field("RunStatus")
	private int runStatus;

	@Field("EvalNodes")
	private String evalNode;

	@Field("mFinished")
	private boolean finished;

	@Field("mOpTime")
	// 执行耗时
	private int opTime;

	@Field("CompleteRate")
	private double completeRate;

	@Field("Solutions")
	private ResponseSolution[] responseSolutions;

	public ResponseJob() {
	}

	public double getCompleteRate() {
		return completeRate;
	}

	public void setCompleteRate(double completeRate) {
		this.completeRate = completeRate;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getStationCode() {
		return stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public double getBeforeValue() {
		return beforeValue;
	}

	public void setBeforeValue(double beforeValue) {
		this.beforeValue = beforeValue;
	}

	public double getAfterValue() {
		return afterValue;
	}

	public void setAfterValue(double afterValue) {
		this.afterValue = afterValue;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getConsNo() {
		return consNo;
	}

	public void setConsNo(String consNo) {
		this.consNo = consNo;
	}

	public double getLoad() {
		return load;
	}

	public void setLoad(double load) {
		this.load = load;
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

	public int getFrom() {
		return from;
	}

	public void setFrom(int from) {
		this.from = from;
	}

	public int getMode() {
		return mode;
	}

	public void setMode(int mode) {
		this.mode = mode;
	}

	public double getEvalLoad() {
		return evalLoad;
	}

	public void setEvalLoad(double evalLoad) {
		this.evalLoad = evalLoad;
	}

	public Date getEvalTime() {
		return evalTime;
	}

	public void setEvalTime(Date evalTime) {
		this.evalTime = evalTime;
	}

	public int getRunStatus() {
		return runStatus;
	}

	public void setRunStatus(int runStatus) {
		this.runStatus = runStatus;
	}

	public String getEvalNode() {
		return evalNode;
	}

	public void setEvalNode(String evalNode) {
		this.evalNode = evalNode;
	}

	public boolean isFinished() {
		return finished;
	}

	public void setFinished(boolean finished) {
		this.finished = finished;
	}

	public int getOpTime() {
		return opTime;
	}

	public void setOpTime(int opTime) {
		this.opTime = opTime;
	}

	public ResponseSolution[] getResponseSolutions() {
		return responseSolutions;
	}

	public void setResponseSolutions(ResponseSolution[] responseSolutions) {
		this.responseSolutions = responseSolutions;
	}

}
