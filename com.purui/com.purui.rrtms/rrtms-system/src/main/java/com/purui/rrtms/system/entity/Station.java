package com.purui.rrtms.system.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "T_STATION")
@NamedQuery(name = "Station.loadByCode", query = "FROM Station a WHERE a.code = :code")
public class Station implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "ID", length = 11)
	private Long id;

	@Column(name = "NAME", length = 50)
	private String name;// 站点名称

	@Column(name = "CODE", length = 20, unique = true, nullable = false)
	private String code;// 子站代码

	@Column(name = "LON")
	private Double lon;// 经度

	@Column(name = "LAT")
	private Double lat;// 纬度

	@Column(name = "LEVEL", length = 20)
	private String level;// 电压等级

	@Column(name = "BUILD_DATE")
	@DateTimeFormat(iso = ISO.DATE)
	@Temporal(TemporalType.DATE)
	private Date buildDate;// 创建日期

	@Column(name = "UPDATE_DATE")
	@DateTimeFormat(iso = ISO.DATE)
	@Temporal(TemporalType.DATE)
	private Date updateDate;// 更新日期

	@Column(name = "COMPLETED_DATE")
	@DateTimeFormat(iso = ISO.DATE)
	@Temporal(TemporalType.DATE)
	private Date completedDate;// 完成日期 - 用户输入

	@Column(name = "CONTACT", length = 20)
	private String contact;// 联系人

	@Column(name = "TEL", length = 20)
	private String tel;// 联系人电话

	@Column(name = "ADDRESS", length = 500)
	private String address;// 安装地址

	@Column(name = "STATUS", length = 20)
	private String status;// 状态 （设计、施工、竣工、运行、抢修、故障）

	@Column(name = "DESIGNKW")
	private Float designkw;// 设计容量

	@Column(name = "CURRENTKW")
	private Float currentkw;// 当前负荷

	@Column(name = "ACCESS")
	private Boolean access;// 是否接入

	@Column(name = "SUMMARY", columnDefinition = "TEXT")
	private String summary;

	@Transient
	private final String type = "STATION";

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@ManyToOne
	@JoinColumn(name = "COMPANY_ID")
	private Company company;

	@OneToOne
	@JoinColumn(name = "PROVINCE")
	private Province province;

	@OneToOne
	@JoinColumn(name = "CITY")
	private City city;

	@OneToOne
	@JoinColumn(name = "DIST")
	private District dist;

	@OneToMany(cascade = { CascadeType.REFRESH, CascadeType.REMOVE }, mappedBy = "station")
	@Where(clause = "UPSEE_ID IS NULL")
	private List<Point> points = new ArrayList<>();

	@ManyToMany(cascade = { CascadeType.REFRESH }, mappedBy = "stations")
	@JsonIgnore
	private List<User> users = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public Company getCompany() {
		return company;
	}

	public List<Point> getPoints() {
		return points;
	}

	public void setPoints(List<Point> points) {
		this.points = points;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public Province getProvince() {
		return province;
	}

	public void setProvince(Province province) {
		this.province = province;
	}

	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	public District getDist() {
		return dist;
	}

	public void setDist(District dist) {
		this.dist = dist;
	}

	public Station() {
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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Double getLon() {
		return lon;
	}

	public void setLon(Double lon) {
		this.lon = lon;
	}

	public Double getLat() {
		return lat;
	}

	public void setLat(Double lat) {
		this.lat = lat;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public Date getBuildDate() {
		return buildDate;
	}

	public void setBuildDate(Date buildDate) {
		this.buildDate = buildDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Date getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(Date completedDate) {
		this.completedDate = completedDate;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Float getDesignkw() {
		return designkw;
	}

	public void setDesignkw(Float designkw) {
		this.designkw = designkw;
	}

	public Float getCurrentkw() {
		return currentkw;
	}

	public void setCurrentkw(Float currentkw) {
		this.currentkw = currentkw;
	}

	public Boolean getAccess() {
		return access;
	}

	public void setAccess(Boolean access) {
		this.access = access;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getType() {
		return type;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Station other = (Station) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Station [id=" + id + ", name=" + name + ", code=" + code + ", lon=" + lon + ", lat=" + lat + ", level=" + level + ", buildDate=" + buildDate + ", updateDate=" + updateDate
				+ ", completedDate=" + completedDate + ", contact=" + contact + ", tel=" + tel + ", address=" + address + ", status=" + status + ", designkw=" + designkw + ", currentkw=" + currentkw
				+ ", access=" + access + ", summary=" + summary + ", type=" + type + "]";
	}

}
