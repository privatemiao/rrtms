package org.mel.security.service;

import java.util.List;

import javax.annotation.Resource;

import org.mel.framework.dao.BaseDao;
import org.mel.security.entity.SecurityRole;
import org.mel.security.entity.SecurityUser;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
	@Resource
	private BaseDao baseDao;

	public void save(SecurityRole role) {
		if (role.getId() == null) {
			baseDao.persist(role);
		} else {
			baseDao.merge(role);
		}
	}

	public void remove(Long... ids) {
		if (ids == null){
			return;
		}
		
		for (Long id : ids){
			SecurityRole role = load(id);
			for (SecurityUser user : role.getUsers()){
				user.removeRole(role);
			}
			baseDao.remove(SecurityRole.class, id);
		}
	}
	
	public SecurityRole load(Long id){
		return baseDao.load(SecurityRole.class, id);
	}

	public List<SecurityRole> findAllRoles() {
		return baseDao.findByNamedQuery(SecurityRole.class, "Role.findAll");
	}
}
