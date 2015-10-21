package org.mel.security.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.mel.framework.domain.UserStatus;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

@Entity
@Table(name = "T_SECURITY_USER")
@NamedQueries({ @NamedQuery(name = "SecurityUser.findByLoginId", query = "FROM SecurityUser a WHERE a.loginId = :loginId") })
public class SecurityUser {
	@Id
	@GeneratedValue
	@Column(name = "ID")
	private Long id;

	@Column(name = "LOGIN_ID", length = 20, nullable = false, unique = true)
	private String loginId;

	@Column(name = "PASSWORD", length = 20, nullable = false)
	private String password;

	@Column(name = "STATUS", length = 10, nullable = false)
	@Enumerated(EnumType.STRING)
	private UserStatus status;

	@Column(name = "LAST_LOGIN")
	@DateTimeFormat(iso = ISO.DATE_TIME)
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastLogin;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@ManyToMany(cascade = { CascadeType.REFRESH })
	@JoinTable(name = "T_SECURITY_USER_ROLE", joinColumns = @JoinColumn(name = "USER_ID"), inverseJoinColumns = @JoinColumn(name = "ROLE_ID"))
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<SecurityRole> roles = new ArrayList<>();

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	public void addRole(SecurityRole role) {
		if (!roles.contains(role)) {
			roles.add(role);
		}
	}

	public void removeRole(SecurityRole role) {
		roles.remove(role);
	}

	public List<SecurityRole> getRoles() {
		return roles;
	}

	public void setRoles(List<SecurityRole> roles) {
		this.roles = roles;
	}

	public SecurityUser() {
	}
	
	

	public SecurityUser(String loginId, String password, UserStatus status, List<SecurityRole> roles) {
		super();
		this.loginId = loginId;
		this.password = password;
		this.status = status;
		this.roles = roles;
	}

	
	public SecurityUser(String loginId, String password, UserStatus status) {
		this.loginId = loginId;
		this.password = password;
		this.status = status;
	}

	public SecurityUser(String loginId, String password, UserStatus status, Date lastLogin) {
		super();
		this.loginId = loginId;
		this.password = password;
		this.status = status;
		this.lastLogin = lastLogin;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public UserStatus getStatus() {
		return status;
	}

	public void setStatus(UserStatus status) {
		this.status = status;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	@Override
	public String toString() {
		return "SecurityUser [id=" + id + ", loginId=" + loginId + ", password=" + password + ", status=" + status + ", lastLogin=" + lastLogin + "]";
	}

}
