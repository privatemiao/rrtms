package org.mel.security.domain;

import org.mel.framework.domain.UserType;
import org.mel.security.entity.SecurityUser;

public interface IUser {
	public SecurityUser getSecurityUser();

	public String getName();
	
	public UserType getUserType();

}
