package com.purui.rrtms.system.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.entity.Company;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class CompanyServiceTest {
	@Resource
	CompanyService companyService;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testQuery() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", new Page(null, null, 10, 0));
		Paged<Company> paged = companyService.query(map);
		for (Company company : paged.getData()) {
			System.out.println(company);
		}
	}

}
