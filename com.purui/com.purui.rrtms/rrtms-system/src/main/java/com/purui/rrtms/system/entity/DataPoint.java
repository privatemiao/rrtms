package com.purui.rrtms.system.entity;

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
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.purui.rrtms.system.domain.MData;

@Entity
@Table(name = "T_DATA_POINT")
@NamedQueries({ @NamedQuery(name = "DataPoint.findDefault", query = "FROM DataPoint a WHERE a.isDefault = true AND a.point.id = :id"),
		@NamedQuery(name = "DataPoint.findDefaultByCode", query = "FROM DataPoint a WHERE a.isDefault = true AND a.point.station.code = :code"),
		@NamedQuery(name = "DataPoint.findById", query = "FROM DataPoint a WHERE a.id = :id"), @NamedQuery(name = "DataPoint.loadByPoint", query = "FROM DataPoint a WHERE a.point.id=:pointId") })
public class DataPoint {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", nullable = false, length = 50)
	private String name;

	@Column(name = "UNIT", length = 20)
	private String unit;

	@Column(name = "GUID", length = 50)
	private String guid;

	@Column(name = "IS_DEFAULT")
	private Boolean isDefault = false;

	@Transient
	private final String type = "DATAPOINT";

	@Transient
	private String parentCurrentId;
	@Transient
	private String parentGuid;
	@Transient
	private List<MData> mDatas = new ArrayList<>();
	// =================================================================
	@ManyToOne(cascade = { CascadeType.REFRESH }, optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "POINT_ID")
	@JsonIgnore
	private Point point;

	@ManyToOne(cascade = { CascadeType.REFRESH }, optional = false)
	@JoinColumn(name = "TAG_CODE")
	private SubTagType subTagType;

	// =================================================================

	public Point getPoint() {
		return point;
	}

	public List<MData> getmDatas() {
		return mDatas;
	}

	public void setmDatas(List<MData> mDatas) {
		this.mDatas = mDatas;
	}

	public SubTagType getSubTagType() {
		return subTagType;
	}

	public void setSubTagType(SubTagType subTagType) {
		this.subTagType = subTagType;
	}

	public void setPoint(Point point) {
		this.point = point;
	}

	public DataPoint() {
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

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public Boolean getIsDefault() {
		return isDefault;
	}

	public void setIsDefault(Boolean isDefault) {
		this.isDefault = isDefault;
	}

	public String getType() {
		return type;
	}

	public String getParentCurrentId() {
		return parentCurrentId;
	}

	public void setParentCurrentId(String parentCurrentId) {
		this.parentCurrentId = parentCurrentId;
	}

	public String getParentGuid() {
		return parentGuid;
	}

	public void setParentGuid(String parentGuid) {
		this.parentGuid = parentGuid;
	}

	@Override
	public String toString() {
		return "DataPoint [id=" + id + ", name=" + name + ", unit=" + unit + ", guid=" + guid + ", isDefault=" + isDefault + ", type=" + type + "]";
	}

}
