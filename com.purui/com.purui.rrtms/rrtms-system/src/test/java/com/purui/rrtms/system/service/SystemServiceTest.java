package com.purui.rrtms.system.service;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.entity.City;
import com.purui.rrtms.system.entity.District;
import com.purui.rrtms.system.entity.Province;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class SystemServiceTest {
	@Resource
	SystemService systemService;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testLoadAllProvinces() {
		List<Province> provinces = systemService.loadAllProvinces();
		for (Province province : provinces) {
			System.out.println(province);
		}
	}

	@Test
	public void testLoadProvince() {
		Province province = systemService.loadProvince(1L);
		System.out.println(province);
		for (City city : province.getCities()) {
			System.out.println(city);
		}

	}

	@Test
	public void testLoadCity() {
		City city = systemService.loadCity(804L);
		System.out.println(city);
		for (District dis : city.getDistricts()) {
			System.out.println(dis);
		}
	}

}
