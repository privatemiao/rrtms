package org.mel.security.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "T_SECURITY_RIGHT")
@NamedQueries({ @NamedQuery(name = "SecurityRight.findByAid", query = "FROM SecurityRight a WHERE a.aid=:aid"), @NamedQuery(name = "SecurityRight.findAll", query = "FROM SecurityRight") })
public class SecurityRight {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "AID", length = 200, nullable = false, unique = true)
	private String aid;

	@Column(name = "NAME", length = 20, nullable = false)
	private String name;

	@Column(name = "RIGHT_DESC", length = 20)
	private String desc;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@ManyToMany(cascade = { CascadeType.REFRESH }, mappedBy = "rights")
	@JsonIgnore
	private List<SecurityRole> role = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public List<SecurityRole> getRole() {
		return role;
	}

	public void setRole(List<SecurityRole> role) {
		this.role = role;
	}

	public SecurityRight() {
	}

	public SecurityRight(String aid, String name, String desc) {
		super();
		this.aid = aid;
		this.name = name;
		this.desc = desc;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAid() {
		return aid;
	}

	public void setAid(String aid) {
		this.aid = aid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((aid == null) ? 0 : aid.hashCode());
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
		SecurityRight other = (SecurityRight) obj;
		if (aid == null) {
			if (other.aid != null)
				return false;
		} else if (!aid.equals(other.aid))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "SecurityRight [id=" + id + ", aid=" + aid + ", name=" + name + ", desc=" + desc + "]";
	}

}
