package com.purui.rrtms.system.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;

@Entity
@Table(name = "T_COMPANY")
public class Company {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 100, nullable = false, unique = true)
	private String name;

	@Column(name = "SUMMARY")
	@Lob
	private String summary;

	@Column(name = "ADDRESS", length = 500)
	private String address;

	@Column(name = "NO", length = 16)
	private String no;// 企业编号

	@Column(name = "CARDINAL_INCLUDE")
	private Float cardinalInclude;// 功率因数标准

	@Column(name = "CNO", length = 50)
	private String cno;// 营销号

	@Column(name = "CONTRACT_CAPACITY")
	private Float contractCapacity;// 合同容量

	@Column(name = "OPERATING_CAPACITY")
	private Float operatingCapacity;// 运行容量

	@Column(name = "VOLTAGE_LEVEL", length = 50)
	private String voltageLevel;// 电压等级

	@Transient
	private final String type = "COMPANY";
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@ManyToOne(cascade = { CascadeType.REFRESH })
	@JoinColumn(name = "ORG_CODE")
	private Org org;

	// 所属行业
	@ManyToOne(cascade = { CascadeType.REFRESH })
	@JoinColumn(name = "INDUSTRY")
	private Industry industry;

	@OneToMany(cascade = { CascadeType.REFRESH }, mappedBy = "company")
	@JsonIgnore
	private List<User> users = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public String getNo() {
		return no;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public Float getCardinalInclude() {
		return cardinalInclude;
	}

	public void setCardinalInclude(Float cardinalInclude) {
		this.cardinalInclude = cardinalInclude;
	}

	public String getCno() {
		return cno;
	}

	public void setCno(String cno) {
		this.cno = cno;
	}

	public Float getContractCapacity() {
		return contractCapacity;
	}

	public void setContractCapacity(Float contractCapacity) {
		this.contractCapacity = contractCapacity;
	}

	public Float getOperatingCapacity() {
		return operatingCapacity;
	}

	public void setOperatingCapacity(Float operatingCapacity) {
		this.operatingCapacity = operatingCapacity;
	}

	public String getVoltageLevel() {
		return voltageLevel;
	}

	public void setVoltageLevel(String voltageLevel) {
		this.voltageLevel = voltageLevel;
	}

	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}

	public Company() {
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

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Industry getIndustry() {
		return industry;
	}

	public void setIndustry(Industry industry) {
		this.industry = industry;
	}

	public String getType() {
		return type;
	}

	@Override
	public String toString() {
		return "Company [id=" + id + ", name=" + name + ", summary=" + summary + ", address=" + address + ", no=" + no + ", cardinalInclude=" + cardinalInclude + ", cno=" + cno
				+ ", contractCapacity=" + contractCapacity + ", operatingCapacity=" + operatingCapacity + ", voltageLevel=" + voltageLevel + ", org=" + org + ", industry=" + industry + "]";
	}
}
