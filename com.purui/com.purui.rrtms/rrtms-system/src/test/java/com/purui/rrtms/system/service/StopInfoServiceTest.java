package com.purui.rrtms.system.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.CuoFengStopInfo;
import com.purui.rrtms.system.domain.LineStopInfo;
import com.purui.rrtms.system.utils.MongoDBUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class StopInfoServiceTest {
	@Resource
	StopInfoService stopInfoService;

	@Resource
	MongoDBUtil mongoDBUtil;

	@Test
	public void testQueryLineStopInfo() throws ParseException {
		Map<String, Object> map = new HashMap<>();
		map.put("page", new Page());
		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2014-01-01");
		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2014-02-01");
		map.put("startDate", startDate);
		map.put("endDate", endDate);
		Paged<LineStopInfo> paged = stopInfoService.queryLineStopInfo(map);

		for (LineStopInfo info : paged.getData()) {
			System.out.println(info);
		}
		System.out.println(paged.getData().size());

	}

	@Test
	public void testQueryCuoFengStopInfo() {
		Map<String, Object> map = new HashMap<>();
		map.put("page", new Page());
		Paged<CuoFengStopInfo> paged = stopInfoService
				.queryCuoFengStopInfo(map);

		for (CuoFengStopInfo info : paged.getData()) {
			System.out.println(info);
		}
		System.out.println(paged.getData().size());

	}
	
	@Test
	public void testAvailableLine() throws ParseException{
		Date current = new SimpleDateFormat("yyyy-MM-dd").parse("2014-03-04");
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query(Criteria.where("END_DATE").gt(current));
		List<LineStopInfo> infos = mongoTemplate.find(query, LineStopInfo.class, "LineStopInfo");
		System.out.println(infos.size());
	}

}
