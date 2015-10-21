package com.purui.rrtms.system.domain;

public class UserProfile {
	private Long id;
	private String password;
	private String name;
	private String email;
	private String mobile;

	public UserProfile() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "UserProfile [id=" + id + ", password=" + password + ", name=" + name + ", email=" + email + ", mobile=" + mobile + "]";
	}

}
