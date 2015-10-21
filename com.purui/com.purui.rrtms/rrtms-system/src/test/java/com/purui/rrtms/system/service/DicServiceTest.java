package com.purui.rrtms.system.service;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.entity.Industry;
import com.purui.rrtms.system.entity.Org;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class DicServiceTest {
	@Resource
	DicService dicService;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testGetIndustry() {
		List<Industry> industrys = dicService.getIndustry();
		System.out.println("Industry-SIZE>>" + industrys.size());
		for (Industry industry : industrys) {
			System.out.println(industry);
		}
	}

	@Test
	public void testGetOrg() {
		List<Org> orgs = dicService.getOrg();
		System.out.println("Org-SIZE>>" + orgs.size());
		for (Org org : orgs) {
			System.out.println(org);
		}
	}

}
