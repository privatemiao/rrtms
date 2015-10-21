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

import com.purui.rrtms.system.domain.Warn;
import com.purui.rrtms.system.domain.WarningSearchParam;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class WarningServiceTest {
	@Resource
	WarningService warningService;
	@Test
	public void testQueryHistory() {
		String[]codes = {"XQDX"};
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page();
		page.setSkip(10);
		map.put("page", page);
		WarningSearchParam param = new WarningSearchParam();
		param.setCode(codes);
		param.setStartDate(new Date());
		param.setEndDate(new Date());
		map.put("param", param);
		Paged<Warn> paged = warningService.queryHistory(map);
		System.out.println("Count>>" + paged.getCount());
		System.out.println("Maxcounr>>" + paged.getMaxCount());
		System.out.println("Skip>>" + paged.getStartPosition());
		System.out.println("DataSize>>" + paged.getData().size());
		
		for (Warn warn : paged.getData()){
			System.out.println(warn);
		}
		
	}

}
