package org.mel.security.service;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.UserStatus;
import org.mel.security.entity.SecurityRole;
import org.mel.security.entity.SecurityUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class UserServiceTest {
	@Resource
	SecurityUserService securityUserService;
	@Resource
	RoleService roleService;

	List<SecurityRole> roles = null;

	@Before
	public void setUp() throws Exception {
		roles = roleService.findAllRoles();
	}

	@Test
	public void testSave() {
		SecurityUser user = new SecurityUser("privatemiao", "P@ssw0rd", UserStatus.NORMAL, new Date());
		System.out.println("ROLE-SIZE>>" + roles.size());
		for (SecurityRole role : roles) {
			user.addRole(role);
		}
		securityUserService.save(user);
	}

	@Test
	public void testMergeUser() {
		SecurityUser user = securityUserService.load("privatemiao");
		if (user == null) {
			System.out.println("没找到>>privatemiao");
			return;
		}
		user.setRoles(null);
		securityUserService.save(user);
	}

	@Test
	public void testLoad() {
	}

}
