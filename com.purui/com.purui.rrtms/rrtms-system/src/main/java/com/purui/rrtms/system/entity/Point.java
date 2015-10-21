package com.purui.rrtms.system.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "T_POINT")
@NamedQueries({ @NamedQuery(name = "Point.findByCode", query = "FROM Point a WHERE a.station.code = :code ORDER BY parentPoint.currentId")})
public class Point implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "ID", length = 50)
	private Long id;

	@Column(name = "NAME", length = 50, nullable = false)
	private String name;

	@Column(name = "SEE_ID", length = 50)
	private String currentId;

	@Column(name = "PLATFORM_ID")
	private Long platformId;

	// 额定功率
	@Column(name = "UE")
	private Double ue;

	@Column(name = "GUID", length = 50)
	private String guid;

	@Transient
	private final String type = "POINT";
	// ==================================================================================
	@ManyToOne(cascade = { CascadeType.REFRESH }, optional = true)
	@JoinColumn(name = "ENERGY_CODE")
	private EnergyType energyType;

	@ManyToOne(cascade = { CascadeType.REFRESH }, optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "STATION_CODE", referencedColumnName = "CODE")
	@JsonIgnore
	private Station station;

	@ManyToOne(cascade = { CascadeType.REFRESH }, optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "UPSEE_ID", referencedColumnName = "SEE_ID")
	@JsonIgnore
	private Point parentPoint;

	@OneToMany(cascade = { CascadeType.REFRESH, CascadeType.REMOVE }, mappedBy = "parentPoint", fetch = FetchType.EAGER)
	private List<Point> children = new ArrayList<>();

	@OneToMany(cascade = { CascadeType.REFRESH, CascadeType.REMOVE }, mappedBy = "point")
	private List<DataPoint> dataPoints = new ArrayList<>();

	// ==================================================================================
	public List<DataPoint> getDataPoints() {
		return dataPoints;
	}

	public void setDataPoints(List<DataPoint> dataPoints) {
		this.dataPoints = dataPoints;
	}

	public Point() {
	}

	public EnergyType getEnergyType() {
		return energyType;
	}

	public void setEnergyType(EnergyType energyType) {
		this.energyType = energyType;
	}

	public Station getStation() {
		return station;
	}

	public void setStation(Station station) {
		this.station = station;
	}

	public Point getParentPoint() {
		return parentPoint;
	}

	public void setParentPoint(Point parentPoint) {
		this.parentPoint = parentPoint;
	}

	public List<Point> getChildren() {
		return children;
	}

	public void setChildren(List<Point> children) {
		this.children = children;
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

	public String getCurrentId() {
		return currentId;
	}

	public void setCurrentId(String currentId) {
		this.currentId = currentId;
	}

	public Long getPlatformId() {
		return platformId;
	}

	public void setPlatformId(Long platformId) {
		this.platformId = platformId;
	}

	public Double getUe() {
		return ue;
	}

	public void setUe(Double ue) {
		this.ue = ue;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getType() {
		return type;
	}

	@Override
	public String toString() {
		return "Point [id=" + id + ", name=" + name + ", currentId=" + currentId + ", platformId=" + platformId + ", ue=" + ue + ", guid=" + guid + ", type=" + type + "]";
	}

}
