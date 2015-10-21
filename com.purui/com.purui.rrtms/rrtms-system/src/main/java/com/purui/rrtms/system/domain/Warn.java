package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class Warn {
	@Field("id")
	private String id;

	@Field("StationCode")
	private String code;

	@Field("MsgGuid")
	private String messageId;

	@Field("TagGuid")
	private String tagGUID;

	@Field("SeeID")
	private int currentId;

	@Field("SeeName")
	private String name;

	@Field("EventTypeName")
	private String eventName;

	@Field("Atime")
	private Date atTime;

	@Field("LogTime")
	private Date logTime;

	@Field("ConfigTime")
	private Date configTime;

	@Field("")
	private int warnLevel;

	@Field("WarnContent")
	private String warnContent;

	@Field("note")
	private String note;

	public Warn() {
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getTagGUID() {
		return tagGUID;
	}

	public void setTagGUID(String tagGUID) {
		this.tagGUID = tagGUID;
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

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public Date getAtTime() {
		return atTime;
	}

	public void setAtTime(Date atTime) {
		this.atTime = atTime;
	}

	public Date getLogTime() {
		return logTime;
	}

	public void setLogTime(Date logTime) {
		this.logTime = logTime;
	}

	public Date getConfigTime() {
		return configTime;
	}

	public void setConfigTime(Date configTime) {
		this.configTime = configTime;
	}

	public int getWarnLevel() {
		return warnLevel;
	}

	public void setWarnLevel(int warnLevel) {
		this.warnLevel = warnLevel;
	}

	public String getWarnContent() {
		return warnContent;
	}

	public void setWarnContent(String warnContent) {
		this.warnContent = warnContent;
	}

	@Override
	public String toString() {
		return "Warn [id=" + id + ", code=" + code + ", messageId=" + messageId + ", tagGUID=" + tagGUID + ", currentId=" + currentId + ", name=" + name + ", eventName=" + eventName + ", atTime="
				+ atTime + ", logTime=" + logTime + ", configTime=" + configTime + ", warnLevel=" + warnLevel + ", warnContent=" + warnContent + "]";
	}
}
