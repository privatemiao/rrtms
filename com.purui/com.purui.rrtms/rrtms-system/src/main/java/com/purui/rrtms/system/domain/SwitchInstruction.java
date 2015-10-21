package com.purui.rrtms.system.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class SwitchInstruction {
	@Field("guid")
	private String guid;

	@Field("tagId")
	private String tagId;

	@Field("code")
	private String code;

	@Field("operate")
	private String operate;

	@Field("note")
	private String note;

	@Field("result")
	private String result;

	public SwitchInstruction() {
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getTagId() {
		return tagId;
	}

	public void setTagId(String tagId) {
		this.tagId = tagId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getOperate() {
		return operate;
	}

	public void setOperate(String operate) {
		this.operate = operate;
	}

	@Override
	public String toString() {
		return "SwitchInstruction [guid=" + guid + ", tagId=" + tagId + ", code=" + code + ", operate=" + operate + ", note=" + note + ", result=" + result + "]";
	}

}
