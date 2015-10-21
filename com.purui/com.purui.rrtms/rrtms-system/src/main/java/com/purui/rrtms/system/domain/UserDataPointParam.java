package com.purui.rrtms.system.domain;

import com.purui.rrtms.system.entity.UserDataPoint;

public class UserDataPointParam {
	private UserDataPoint[] userDataPoints;

	public UserDataPointParam() {
	}

	public UserDataPoint[] getUserDataPoints() {
		return userDataPoints;
	}

	public void setUserDataPoints(UserDataPoint[] userDataPoints) {
		this.userDataPoints = userDataPoints;
	}

}
