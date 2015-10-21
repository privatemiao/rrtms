package com.purui.rrtms.system.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.mel.framework.domain.Gender;
import org.mel.framework.domain.UserType;
import org.mel.security.entity.SecurityUser;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

@Entity
@Table(name = "T_USER")
@NamedQueries({ @NamedQuery(name = "User.findByEmail", query = "FROM User a WHERE a.email = :email"),
		@NamedQuery(name = "User.findByLoginId", query = "FROM User a WHERE a.securityUser.loginId=:loginId") })
public class User {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 50, nullable = false)
	private String name;

	@Column(name = "GENDER", length = 10)
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(name = "BIRTHDAY")
	@DateTimeFormat(iso = ISO.DATE)
	@Temporal(TemporalType.DATE)
	private Date birthday;

	@Column(name = "HIRE_DATE")
	@DateTimeFormat(iso = ISO.DATE)
	@Temporal(TemporalType.DATE)
	private Date hireDate;

	@Column(name = "EMAIL", length = 50)
	private String email;

	@Column(name = "MOBILE", length = 50)
	private String mobile;

	@Column(name = "ADDRESS", length = 500)
	private String address;

	@Column(name = "INSERT_TIME", length = 50, nullable = false)
	@DateTimeFormat(iso = ISO.DATE_TIME)
	@Temporal(TemporalType.TIMESTAMP)
	private Date insertTime;

	@Column(name = "UPDATE_TIME", length = 50, nullable = false)
	@DateTimeFormat(iso = ISO.DATE_TIME)
	@Temporal(TemporalType.TIMESTAMP)
	private Date updateTime;

	@Column(name = "USER_TYPE", length = 20, nullable = false)
	@Enumerated(EnumType.STRING)
	private UserType userType;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@OneToOne(cascade = { CascadeType.ALL })
	@JoinColumn(name = "SECURITY_ID", nullable = false)
	private SecurityUser securityUser;

	@ManyToOne(cascade = { CascadeType.REFRESH })
	@JoinColumn(name = "COMPANY_ID")
	private Company company;

	@ManyToMany(cascade = { CascadeType.REFRESH }, fetch = FetchType.EAGER)
	@JoinTable(name = "T_USER_STATION", joinColumns = @JoinColumn(name = "USER_ID"), inverseJoinColumns = @JoinColumn(name = "STATION_ID"))
	private List<Station> stations = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public void addStation(Station station) {
		if (!stations.contains(station)) {
			stations.add(station);
		}
	}

	public void removeStation(Station station) {
		stations.remove(station);
	}

	public List<Station> getStations() {
		return stations;
	}

	public void setStations(List<Station> stations) {
		this.stations = stations;
	}

	public User() {
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public SecurityUser getSecurityUser() {
		return securityUser;
	}

	public void setSecurityUser(SecurityUser securityUser) {
		this.securityUser = securityUser;
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

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public Date getHireDate() {
		return hireDate;
	}

	public void setHireDate(Date hireDate) {
		this.hireDate = hireDate;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", gender=" + gender + ", birthday=" + birthday + ", hireDate=" + hireDate + ", email=" + email + ", mobile=" + mobile + ", address=" + address
				+ ", insertTime=" + insertTime + ", updateTime=" + updateTime + ", userType=" + userType + "]";
	}

}
