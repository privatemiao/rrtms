package com.purui.rrtms.system.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "T_VIDEO")
@NamedQuery(name = "Video.findByCode", query = "FROM Video a WHERE LOWER(a.code) = LOWER(:code)")
public class Video {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "STATION_NAME")
	private String stationName;

	@Column(name = "CODE")
	private String code;

	@Column(name = "VIDEO_NAME")
	private String videoName;

	@Column(name = "IP")
	private String ip;

	@Column(name = "LOGIN_ID")
	private String loginId;

	@Column(name = "PASSWORD")
	private String password;

	@Column(name = "MANUFACTURER")
	private String manufacturer;

	public Video() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStationName() {
		return stationName;
	}

	public void setStationName(String stationName) {
		this.stationName = stationName;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getVideoName() {
		return videoName;
	}

	public void setVideoName(String videoName) {
		this.videoName = videoName;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	@Override
	public String toString() {
		return "Video [id=" + id + ", stationName=" + stationName + ", code=" + code + ", videoName=" + videoName + ", ip=" + ip + ", loginId=" + loginId + ", password=" + password
				+ ", manufacturer=" + manufacturer + "]";
	}

}
