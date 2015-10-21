package org.mel.security.service;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.security.entity.SecurityRight;
import org.mel.security.entity.SecurityRole;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class RoleServiceTest {
	@Resource
	RightService rightService;
	@Resource
	RoleService roleService;

	List<SecurityRight> rights;

	@Before
	public void setUp() throws Exception {
		rights = rightService.findAll();
	}

	@Test
	public void testSave() {
		SecurityRole role = new SecurityRole("管理员", "所有权限");
		roleService.save(role);

		SecurityRole role2 = new SecurityRole("一般用户", "只读权限");
		role2.addRight(rights.get(5));
		role2.addRight(rights.get(6));
		role2.addRight(rights.get(7));
		role2.addRight(rights.get(8));
		role2.addRight(rights.get(9));
		roleService.save(role2);
	}

	@Test
	public void testFindAllRoles() {
		List<SecurityRole> roles = roleService.findAllRoles();
		for (SecurityRole role : roles) {
			System.out.println(role);
			if (role.getRights().size() > 0){
				for (SecurityRight right : role.getRights()){
					System.out.println("\t" + right);
				}
			}
		}
	}

	@Test
	public void testRemove() {
			roleService.remove(1L);
	}

	@Test
	public void testRemoveRight(){
		rightService.removeRight(1L);
	}
}
