package org.mel.security.domain;

import java.util.HashMap;
import java.util.Map;

import org.mel.framework.domain.UserType;
import org.mel.security.entity.SecurityUser;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CachedUser implements IUser {
	// 姓名
	private String name;
	private SecurityUser securityUser;
	// 菜单
	private Menu menu;
	private UserType userType;
	// 用户权限索引
	@JsonIgnore
	private Map<String, Node> rightIndex = new HashMap<String, Node>();
	@JsonIgnore
	private Map<String, Object> userData = new HashMap<>();

	public Menu getMenu() {
		return menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}

	public Map<String, Node> getRightIndex() {
		return rightIndex;
	}

	public void setRightIndex(Map<String, Node> rightIndex) {
		this.rightIndex = rightIndex;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setSecurityUser(SecurityUser securityUser) {
		this.securityUser = securityUser;
	}

	@Override
	public SecurityUser getSecurityUser() {
		return securityUser;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	public void addData(String key, Object val) {
		this.userData.put(key, val);
	}

	public Object getData(String key) {
		return this.userData.get(key);
	}

	public boolean isAdmin() {
		return securityUser.getLoginId().equals("admin");
	}

	public boolean isInternal() {
		return userType == UserType.INTERNAL;
	}

}
