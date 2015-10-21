package org.mel.security.service;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class SecurityServiceTest {

	@Resource
	SecurityService securityService;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testSaveRights() {
	}

	@Test
	public void testGetAllMenu() {
	}

	@Test
	public void testGetPersonalMenu() {
	}

	@Test
	public void testRemoveRole() {
		securityService.removeRole(2L);
	}

}
