package org.mel.security.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "T_SECURITY_ROLE")
@NamedQueries(@NamedQuery(name = "Role.findAll", query = "FROM SecurityRole a"))
public class SecurityRole {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "NAME", length = 50, nullable = false, unique = true)
	private String name;

	@Column(name = "ROLE_DESC", length = 100)
	private String desc;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@ManyToMany(cascade = { CascadeType.REFRESH })
	@JoinTable(name = "T_SECURITY_ROLE_RIGHT", joinColumns = @JoinColumn(name = "ROLE_ID"), inverseJoinColumns = @JoinColumn(name = "RIGHT_ID"))
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<SecurityRight> rights = new ArrayList<>();

	@ManyToMany(cascade = { CascadeType.REFRESH }, mappedBy = "roles")
	@JsonIgnore
	private List<SecurityUser> users = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public List<SecurityUser> getUsers() {
		return users;
	}

	public void setUsers(List<SecurityUser> users) {
		this.users = users;
	}

	public void addRight(SecurityRight right) {
		if (!rights.contains(right)) {
			rights.add(right);
		}
	}

	public void removeRight(SecurityRight right) {
		rights.remove(right);
	}

	public List<SecurityRight> getRights() {
		return rights;
	}

	public void setRights(List<SecurityRight> rights) {
		this.rights = rights;
	}

	public SecurityRole() {
	}

	public SecurityRole(String name, String desc) {
		this.name = name;
		this.desc = desc;
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

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	@Override
	public String toString() {
		return "SecurityRole [id=" + id + ", name=" + name + ", desc=" + desc + "]";
	}

}
