package com.purui.rrtms.system.domain;

import org.mel.framework.domain.UserType;
import org.springframework.data.mongodb.core.mapping.Field;

public class ClientInfo {
	@Field("code")
	private String code;

	@Field("clientId")
	private String clientId;

	@Field("loginId")
	private String loginId;

	@Field("name")
	private String name;

	@Field("devType")
	private String devType;

	@Field("userType")
	private UserType userType;

	public ClientInfo() {
	}

	public ClientInfo(String code, String clientId, String loginId, String name, String devType, UserType userType) {
		super();
		this.code = code;
		this.clientId = clientId;
		this.loginId = loginId;
		this.name = name;
		this.devType = devType;
		this.userType = userType;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDevType() {
		return devType;
	}

	public void setDevType(String devType) {
		this.devType = devType;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	@Override
	public String toString() {
		return "ClientInfo [code=" + code + ", clientId=" + clientId + ", loginId=" + loginId + ", name=" + name + ", devType=" + devType + ", userType=" + userType + "]";
	}

}
