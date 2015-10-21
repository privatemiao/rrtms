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

import com.purui.rrtms.system.entity.DataPoint;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class DataPointServiceTest {

	@Resource
	DataPointService dataPointService;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testQuery() {
		Page page = new Page();
		page.setCount(-1);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("id", 1L);
		Paged<DataPoint> paged = dataPointService.query(map);
		for (DataPoint dataPoint : paged.getData()) {
			System.out.println(dataPoint);
		}
	}

	@Test
	public void testLoad() {
		System.out.println(dataPointService.load(78195L));
	}

	@Test
	public void testSaveDataPointDefault() {
		dataPointService.saveDataPointDefault(78195L);
	}

	@Test
	public void testFindDefaultByCode() {
		System.out.println(dataPointService.findDefaultByCode("PUHUA"));
	}
	
	@Test
	public void testLoadAllDataPoints(){
	}
}
