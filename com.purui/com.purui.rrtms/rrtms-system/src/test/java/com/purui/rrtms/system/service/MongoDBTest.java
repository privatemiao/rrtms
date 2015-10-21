package com.purui.rrtms.system.service;

import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.domain.TotalLoad;
import com.purui.rrtms.system.utils.MongoDBUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class MongoDBTest {
	@Resource
	private MongoDBUtil mongoDBUtil;

	@Test
	public void test() {
		// @formatter:off
		MongoTemplate mongoTemplate = mongoDBUtil
				.getMongoTemplate("PUHUA_2014");
		Criteria c = Criteria.where("mMonth").is(6);
		GroupByResults<TotalLoad> results = mongoTemplate
				.group(c,
						"TotalFuHe",
						GroupBy.key("StationCode")
								.initialDocument("{count : 0, totalValue : 0}")
								.reduceFunction(
										""
												+ "function(object, result){"
												+ "result.count ++;"
												+ "result.totalValue += object.FuHeValue "
												+ "}"), TotalLoad.class);
		// @formatter:on

		System.out.println(results.getRawResults().toString());
		Iterator<TotalLoad> i = results.iterator();
		while (i.hasNext()) {
			System.out.println(i.next());
		}

	}

	@Test
	public void testSearch() {
		MongoTemplate mongoTemplate = mongoDBUtil
				.getMongoTemplate("PUHUA_2014");
		Query query = new Query();

		Criteria criteria = Criteria.where("year").is(2014);
		criteria.and("month").is(7);

		query.addCriteria(criteria);
		List<TotalLoad> list = mongoTemplate.find(query, TotalLoad.class,
				"TotalFuHe");
		for (TotalLoad load : list) {
			System.out.println(load);
		}
		System.out.println(list.size());
		System.out.println(query.getQueryObject().toString());
	}

	@Test
	public void testGetCodeByAreaNames() {
		List<String> codes = mongoDBUtil
				.getStationCodesByAreaNames(new String[] { "工业园区" });
		System.out.println(codes.size());
	}

	@Test
	public void testCount() {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("AreaName").is("吴中区"));
		// query.skip(10).limit(10);
		// query.addCriteria(Criteria.where("FuheTradingEnable").is(true));
		System.out.println(query.getQueryObject().toString());
		long count = mongoTemplate.count(query, "StationRuns");
		System.out.println(count);
		List<StationRun> stations = mongoTemplate.find(query, StationRun.class,
				"StationRuns");
		System.out.println("Station SIze >> " + stations.size());
	}

	@Test
	public void testSavePerson() {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("TEST");
		for (int i = 1; i <= 100; i++) {
			mongoTemplate.save(new Person("Mel" + i, i, i));
		}
	}

	@Test
	public void testFind() {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("TEST");
		Query query = new Query();
		query.addCriteria(Criteria.where("AGE").is(10));
		query.addCriteria(Criteria.where("COUNT").is(10));
		List<Person> persons = mongoTemplate.find(query, Person.class);
		for (Person person : persons){
			System.out.println(person);
		}
	}
}
