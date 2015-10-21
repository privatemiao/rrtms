package com.purui.rrtms.system.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.Gender;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.framework.domain.UserStatus;
import org.mel.framework.domain.UserType;
import org.mel.security.entity.SecurityRole;
import org.mel.security.entity.SecurityUser;
import org.mel.security.service.RoleService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.entity.Company;
import com.purui.rrtms.system.entity.User;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class UserServiceTest {
	@Resource
	UserService userService;
	@Resource
	RoleService roleService;
	@Resource
	CompanyService companyService;

	List<SecurityRole> roles = null;
	List<Company> companys = null;

	@Before
	public void setUp() throws Exception {
		roles = roleService.findAllRoles();

		Map<String, Object> map = new HashMap<>();
		map.put("page", new Page(null, null, 100, 0));
		Paged<Company> query = companyService.query(map);
		companys = query.getData();
	}

	@Test
	public void testSaveAdmin() {
		User user = new User();
		user.setAddress("苏州市盘门路");
		user.setBirthday(new Date());
		user.setEmail("privatemiao@gmail.com");
		user.setGender(Gender.MALE);
		user.setHireDate(new Date());
		user.setInsertTime(new Date());
		user.setMobile("13451567003");
		user.setName("刘淼");
		user.setUpdateTime(new Date());
		user.setUserType(UserType.GOVERNMENT);

		SecurityUser securityUser = new SecurityUser("admin", "admin", UserStatus.NORMAL, new Date());
		securityUser.setStatus(UserStatus.NORMAL);
		for (SecurityRole role : roles) {
			securityUser.addRole(role);
		}

		user.setSecurityUser(securityUser);

		if (companys.size() > 0) {
			user.setCompany(companys.get(((int) (Math.random() * companys.size() - 1))));
		}
		
		userService.save(user);
	}

	@Test
	public void testSaves() {
		for (int i = 1; i <= 100; i++) {
			userService.save(generateUser(i));
		}

		// userService.save(generateUser(1));
	}

	public User generateUser(int i) {
		User user = new User();
		user.setAddress("苏州市盘门路" + i);
		user.setBirthday(new Date());
		user.setEmail("privatemiao" + i + "@gmail.com");
		if ((int) (Math.random() * 2) == 0) {
			user.setGender(Gender.FEMALE);
		} else {
			user.setGender(Gender.MALE);
		}
		user.setHireDate(new Date());
		user.setInsertTime(new Date());
		user.setMobile("13451567003" + i);
		user.setName("刘淼" + i);
		user.setUpdateTime(new Date());
		switch ((int) (Math.random() * 2)) {
		case 0:
			user.setUserType(UserType.ENTERPRISE);
			break;
		case 1:
			user.setUserType(UserType.INTERNAL);
			break;
		case 2:
			user.setUserType(UserType.GOVERNMENT);
			break;
		default:
			user.setUserType(UserType.GOVERNMENT);
			break;
		}

		SecurityUser securityUser = new SecurityUser("privatemiao" + i, "P@ssw0rd", UserStatus.NORMAL, new Date());
		switch ((int) (Math.random() * 5)) {
		case 0:
			securityUser.setStatus(UserStatus.NORMAL);
			break;
		case 1:
			securityUser.setStatus(UserStatus.AUDIT);
			break;
		case 2:
			securityUser.setStatus(UserStatus.DEPARTURE);
			break;
		case 3:
			securityUser.setStatus(UserStatus.FORBID);
			break;
		case 4:
			securityUser.setStatus(UserStatus.PURGED);
			break;
		default:
			securityUser.setStatus(UserStatus.NORMAL);
			break;
		}

		for (SecurityRole role : roles) {
			securityUser.addRole(role);
		}

		user.setSecurityUser(securityUser);

		if (companys.size() > 0) {
			user.setCompany(companys.get(((int) (Math.random() * companys.size() - 1))));
		}

		return user;
	}

	@Test
	public void testFindByEmail() {
	}

	@Test
	public void testFindByLoginId() {
	}

	@Test
	public void testRemove() {
	}

	@Test
	public void testQuery() {
		Map<String, Object> map = new HashMap<>();
		map.put("param", "苏州");
		Page page = new Page(null, null, 10, 0);
		map.put("page", page);
		Paged<User> paged = userService.query(map);
		for (User user : paged.getData()) {
			System.out.println(user);
		}
		System.out.println("MAXCOUNT>>" + paged.getMaxCount());
	}

	public static void main(String[] args) {
		for (int i = 0; i < 100; i++)
			System.out.println((int) (Math.random() * 5));
	}
}
