package com.purui.rrtms.system.service;

import java.util.Calendar;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class DashboardService {
	@Resource
	private MongoDBUtil mongoDBUtil;

	protected Logger logger = LoggerFactory.getLogger(DashboardService.class);

	public Paged<StationRun> queryStationByArea(Map<String, Object> map) {
		Calendar c = Calendar.getInstance();
		String areaName = (String) map.get("areaName");
		final Page page = (Page) map.get("page");
		Boolean trade = (Boolean) map.get("trade");

		c.setTimeInMillis(System.currentTimeMillis());
//		int year = c.get(Calendar.YEAR);

//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();

		if (!StringUtils.isBlank(areaName)) {
			query.addCriteria(Criteria.where("AreaName").is(areaName));
		}
		if (trade != null){
			query.addCriteria(Criteria.where("FuheTradingEnable").is(trade));
		}
		if (page.getCount() > 0){
			query.skip(page.getSkip()).limit(page.getCount());
		}
		
		if (!StringUtils.isBlank(page.getOrderBy())) {
			if (StringUtils.isBlank(page.getSortBy())) {
				page.setSortBy("ASC");
			}

			Direction dir = page.getSortBy().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
			query.with(new Sort(dir, page.getOrderBy()));
		}
		
		logger.debug("loadbyarea>>" + query.getQueryObject().toString());

		Paged<StationRun> paged = new Paged<StationRun>() {

			@Override
			public Class<StationRun> getClazz() {
				return StationRun.class;
			}

			@Override
			public int getCount() {
				return page.getCount();
			}

			@Override
			public int getStartPosition() {
				return page.getSkip();
			}
		};
		
		paged.setMaxCount(new Long(mongoTemplate.count(query, "StationRuns")).intValue());
		paged.setData(mongoTemplate.find(query, StationRun.class, "StationRuns"));

		return paged;
	}

}
