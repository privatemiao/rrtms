package com.purui.rrtms.system.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Field;

public class Message {
	@Field("id")
	public String id;

	@Field("title")
	public String title;

	@Field("content")
	private String content;

	@Field("insertTime")
	private Date insertTime;

	@Field("name")
	private String name;

	@Field("userId")
	private Long userId;

	public Message() {
	}

	public Message(String title, String content) {
		this.title = title;
		this.content = content;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(Date insertTime) {
		this.insertTime = insertTime;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "Message [id=" + id + ", title=" + title + ", content=" + content + ", insertTime=" + insertTime + "]";
	}

}
