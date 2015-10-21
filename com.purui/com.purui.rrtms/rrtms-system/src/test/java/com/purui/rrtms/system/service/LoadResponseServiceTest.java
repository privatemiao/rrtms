package com.purui.rrtms.system.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.ControlInstruction;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class LoadResponseServiceTest {
	@Resource
	LoadResponseService loadResponseService;

	@Test
	public void testAreaLoad() {
		loadResponseService.areaLoad(null);
	}
	
	
	@Test
	public void testBaseTotalLoad(){
		loadResponseService.baseTotalLoad("PUHUA", new Date(), new Date());
	}
	
	@Test
	public void testqueryControlInstruction(){
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page();
		page.setCount(1);
		map.put("page", page);
		
		Paged<ControlInstruction> paged = loadResponseService.queryControlInstruction(map);
		System.out.println(paged.getMaxCount());
		for (ControlInstruction i : paged.getData()){
			System.out.println(i);
		}
	}

}
