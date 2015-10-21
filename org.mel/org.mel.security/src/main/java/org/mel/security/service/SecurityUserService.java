package org.mel.security.service;

import javax.annotation.Resource;

import org.mel.framework.dao.BaseDao;
import org.mel.security.entity.SecurityUser;
import org.springframework.stereotype.Service;

@Service
public class SecurityUserService {
	@Resource
	private BaseDao baseDao;

	public void save(SecurityUser user) {
		if (user.getId() == null) {
			baseDao.persist(user);
		} else {
			baseDao.merge(user);
		}
	}
	
	public SecurityUser load(String loginId){
		return baseDao.findOneByNamedQuery(SecurityUser.class, "SecurityUser.findByLoginId", new String[]{"loginId"}, new Object[]{loginId});
	}
	
	
	
}
