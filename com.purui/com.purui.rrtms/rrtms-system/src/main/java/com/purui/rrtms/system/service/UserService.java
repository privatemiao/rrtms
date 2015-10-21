package com.purui.rrtms.system.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.dao.BaseDao;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.security.entity.SecurityRole;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.UserProfile;
import com.purui.rrtms.system.entity.User;

@Service
public class UserService {
	@Resource
	private BaseDao baseDao;

	public void save(User user) {
		Date updateTime = new Date();
		List<SecurityRole> roles = user.getSecurityUser().getRoles();
		if (roles == null || roles.size() == 0) {
			user.getSecurityUser().setRoles(null);
		}
		if (user.getCompany() == null || user.getCompany().getId() == null) {
			user.setCompany(null);
		}

		System.out.println("NEW");
		System.out.println(user.toString());
		System.out.println(user.getSecurityUser().toString());

		if (user.getId() == null) {
			if (StringUtils.isBlank(user.getSecurityUser().getPassword())) {
				user.getSecurityUser().setPassword("111111");
			}
			user.setInsertTime(updateTime);
			user.setUpdateTime(updateTime);
			baseDao.persist(user);
		} else {
			User older = baseDao.load(User.class, user.getId());

			System.out.println("OLDER");
			System.out.println(older.toString());
			System.out.println(older.getSecurityUser().toString());

			if (StringUtils.isBlank(user.getSecurityUser().getPassword())) {
				System.out.println("new user password is empty");

				user.getSecurityUser().setPassword(
						older.getSecurityUser().getPassword());
			}
			user.setInsertTime(older.getInsertTime());
			user.setUpdateTime(updateTime);
			baseDao.merge(user);
		}
	}

	public User findByEmail(String email) {
		return baseDao.findOneByNamedQuery(User.class, "User.findByEmail",
				new String[] { "email" }, new Object[] { email });
	}

	public User findByLoginId(String loginId) {
		return baseDao.findOneByNamedQuery(User.class, "User.findByLoginId",
				new String[] { "loginId" }, new Object[] { loginId });
	}

	public void remove(Long... ids) {
		if (ids == null) {
			return;
		}
		for (Long id : ids) {
			baseDao.remove(User.class, id);
		}
	}

	public Paged<User> query(Map<String, Object> map) {
		final Page page = (Page) map.get("page");
		final String param = (String) map.get("param");
		Paged<User> paged = new Paged<User>() {

			@Override
			public Class<User> getClazz() {
				return User.class;
			}

			@Override
			public String getSql() {
				if (StringUtils.isBlank(param)) {
					return "FROM User a";
				}
				// @formatter:off
				StringBuffer buffer = new StringBuffer();

				buffer.append(
						"SELECT a FROM User a LEFT JOIN a.company b WHERE ")
						.append(" a.name LIKE :param ")
						.append(" OR a.securityUser.loginId LIKE :param")
						.append(" OR a.email LIKE :param ")
						.append(" OR a.address LIKE :param ")
						.append(" OR b.name LIKE :param ")
						.append(" OR CASE ")
						.append(" WHEN a.securityUser.status='AUDIT' THEN '审核'  ")
						.append(" WHEN a.securityUser.status='NORMAL' THEN '正常'  ")
						.append(" WHEN a.securityUser.status='FORBID' THEN '禁用'  ")
						.append(" WHEN a.securityUser.status='DEPARTURE' THEN '离职'  ")
						.append(" WHEN a.securityUser.status='PURGED' THEN '已删除'  ")
						.append(" END LIKE :param ").append(" OR CASE ")
						.append(" WHEN a.userType='GOVERNMENT' THEN '政府用户' ")
						.append(" WHEN a.userType='ENTERPRISE' THEN '企业用户' ")
						.append(" WHEN a.userType='INTERNAL' THEN '内部用户' ")
						.append(" END LIKE :param ").append(" OR CASE ")
						.append(" WHEN a.gender = 'MALE' THEN '男' ")
						.append(" WHEN a.gender = 'FEMALE' THEN '女' ")
						.append(" END LIKE :param");
				// @formatter:on
				return buffer.toString();
			}

			@Override
			public String[] getColumns() {
				if (StringUtils.isBlank(param)) {
					return null;
				}
				return new String[] { "param" };
			}

			@Override
			public Object[] getVals() {
				if (StringUtils.isBlank(param)) {
					return null;
				}
				return new Object[] { '%' + param + '%' };
			}

			@Override
			public int getCount() {
				return page.getCount();
			}

			@Override
			public int getStartPosition() {
				return page.getSkip();
			}

			@Override
			public String getOrderBy() {
				return page.getOrderBy();
			}

			@Override
			public String getSortBy() {
				return page.getSortBy();
			}

		};
		baseDao.search(paged);
		return paged;
	}

	public void saveProfile(UserProfile profile) {
		if (profile.getId() == null) {
			throw new IllegalArgumentException("没有找到用户[ID>" + profile.getId()
					+ ']');
		}

		User user = baseDao.load(User.class, profile.getId());

		user.setName(profile.getName());
		user.setEmail(profile.getEmail());
		user.setMobile(profile.getMobile());
		if (!StringUtils.isBlank(profile.getPassword())) {
			user.getSecurityUser().setPassword(profile.getPassword());
		}

		save(user);
	}

}
