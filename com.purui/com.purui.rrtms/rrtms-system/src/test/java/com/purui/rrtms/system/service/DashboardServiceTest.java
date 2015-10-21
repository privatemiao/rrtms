package com.purui.rrtms.system.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.StationRun;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class DashboardServiceTest {

	@Resource
	DashboardService dashboardService;

	@Test
	public void testQueryStationByArea() {
		Map<String, Object> map = new HashMap<>();
		Page page = new Page();
		map.put("areaName", "吴中区");
		map.put("page", page);
		Paged<StationRun> paged = dashboardService.queryStationByArea(map);
		for (StationRun station : paged.getData()) {
			System.out.println(station);
		}
		System.out.println("SIZE>>" + paged.getMaxCount());
	}
	
}
