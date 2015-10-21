package org.mel.security.service;

import java.util.List;

import javax.annotation.Resource;

import org.mel.framework.dao.BaseDao;
import org.mel.security.entity.SecurityRight;
import org.mel.security.entity.SecurityRole;
import org.springframework.stereotype.Service;

@Service
public class RightService {
	@Resource
	private BaseDao baseDao;

	public void save(SecurityRight right) {
		if (right.getId() == null) {
			baseDao.persist(right);
		} else {
			baseDao.merge(right);
		}
	}

	public SecurityRight load(String aid) {
		return baseDao.findOneByNamedQuery(SecurityRight.class, "SecurityRight.findByAid", new String[] { "aid" }, new Object[] { aid });
	}

	public SecurityRight load(Long id) {
		return baseDao.load(SecurityRight.class, id);
	}

	public void removeRight(Long id) {
		SecurityRight right = load(id);
		for (SecurityRole role : right.getRole()){
			role.removeRight(right);
		}
		baseDao.remove(SecurityRight.class, id);
	}

	public List<SecurityRight> findAll() {
		return baseDao.findByNamedQuery(SecurityRight.class, "SecurityRight.findAll");
	}

	public void save(List<SecurityRight> rights) {
		List<SecurityRight> removeableRights = findAll();

		if (rights != null && !rights.isEmpty()) {
			for (SecurityRight right : rights) {
				for (int i = removeableRights.size() - 1; i >= 0; i--) {
					SecurityRight removeableRight = removeableRights.get(i);
					if (removeableRight.equals(right)) {
						right.setId(removeableRight.getId());
						removeableRights.remove(i);
						break;
					}
				}
				save(right);
				System.out.println("SAVE>>" + right.toString());
			}
		}

		for (SecurityRight right : removeableRights) {
			removeRight(right.getId());
			System.out.println("REMOVE>>" + right.toString());
		}
	}
}
