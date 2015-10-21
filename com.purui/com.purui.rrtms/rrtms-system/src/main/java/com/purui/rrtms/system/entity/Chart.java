package com.purui.rrtms.system.entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "T_CHART")
@NamedQuery(name = "Chart.findByCode", query = "FROM Chart a WHERE a.station.code = :code")
public class Chart {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 50, nullable = false)
	private String name;

	@Column(name = "DATA", nullable = false)
	@Lob
	private String data;

	@Column(name = "HEIGHT")
	private boolean heigh = true;

	@Column(name = "SUMMARY")
	@Lob
	private String summary = null;

	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@Column(name = "INSERT_TIME", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date insertTime = null;

	@Column(name = "UPDATE_TIME", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date updateTime = null;

	// =========================================
	@ManyToOne(cascade = { CascadeType.REFRESH })
	@JoinColumn(name = "STATION_CODE", referencedColumnName = "CODE")
	private Station station = null;

	// =========================================
	public Station getStation() {
		return station;
	}

	public void setStation(Station station) {
		this.station = station;
	}

	public Chart() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public boolean isHeigh() {
		return heigh;
	}

	public void setHeigh(boolean heigh) {
		this.heigh = heigh;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Date getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(Date insertTime) {
		this.insertTime = insertTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public String toString() {
		return "Chart [id=" + id + ", name=" + name + ", data=" + data + ", heigh=" + heigh + ", summary=" + summary + ", userId=" + userId + ", insertTime=" + insertTime + ", updateTime="
				+ updateTime + "]";
	}

}
