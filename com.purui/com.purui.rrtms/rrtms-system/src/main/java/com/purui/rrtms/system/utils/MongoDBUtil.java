package com.purui.rrtms.system.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import com.mongodb.Mongo;
import com.purui.rrtms.system.domain.TotalLoad;

@Service
public class MongoDBUtil {
	protected Logger logger = LoggerFactory.getLogger(MongoDBUtil.class);
	@Resource
	Mongo mongo;

	public MongoTemplate getMongoTemplate(String dbName) {
		return new MongoTemplate(mongo, dbName);
	}

	public MongoTemplate getMongoTemplate() {
		return getMongoTemplate("purui");
	}

	@SuppressWarnings("deprecation")
	public synchronized GridFsOperations getGridFS(String dbName) {
		SimpleMongoDbFactory mongoDbFactory = new SimpleMongoDbFactory(mongo, dbName);
		return new GridFsTemplate(mongoDbFactory, new MappingMongoConverter(mongoDbFactory, new MongoMappingContext()));
	}

	public List<String> getStationCodesByAreaNames(String... areaNames) {
		MongoTemplate mongoTemplate = this.getMongoTemplate();

		Criteria criteria = null;
		if (areaNames != null && areaNames.length > 0) {
			criteria = Criteria.where("AreaName").in(Arrays.asList(areaNames));
		}

//		@formatter:off
		GroupByResults<TotalLoad> results = mongoTemplate.group(criteria, 
				"TotalFuHe", GroupBy.key("StationCode").initialDocument("{}").reduceFunction("" +
						"function(object, result){" +
						"}"), TotalLoad.class);
//		@formatter:on
		List<String> stationCodes = new ArrayList<>();
		Iterator<TotalLoad> i = results.iterator();
		while (i.hasNext()) {
			stationCodes.add(i.next().getStationCode());
		}

		return stationCodes;
	}

}
