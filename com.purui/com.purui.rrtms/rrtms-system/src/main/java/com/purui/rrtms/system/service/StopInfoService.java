package com.purui.rrtms.system.service;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.CuoFengStopInfo;
import com.purui.rrtms.system.domain.LineStopInfo;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class StopInfoService {
	@Resource
	MongoDBUtil mongoDBUtil;

	public Paged<LineStopInfo> queryLineStopInfo(Map<String, Object> map) {
		final Page page = (Page) map.get("page");

		Date startDate = (Date) map.get("startDate");
		Date endDate = (Date) map.get("endDate");
		Boolean available = (Boolean) map.get("available");
		if (available == null) {
			available = Boolean.FALSE;
		}

		MongoTemplate mongoTemplate = null;

		if (startDate != null) {
			Calendar c = Calendar.getInstance();
			c.setTime(startDate);
//			mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
			mongoTemplate = mongoDBUtil.getMongoTemplate();

			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			startDate = c.getTime();
		}

		if (endDate != null) {
			Calendar c = Calendar.getInstance();
			c.setTime(endDate);

			if (startDate == null) {
				mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_"
						+ c.get(Calendar.YEAR));
			}

			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) + 1);
			endDate = c.getTime();
		}

		if (mongoTemplate == null) {
			mongoTemplate = mongoDBUtil.getMongoTemplate();
		}

		Criteria c = null;
		if (startDate != null) {
			c = Criteria.where("START_DATE").gte(startDate);
		}

		if (endDate != null) {
			if (startDate != null) {
				c = c.and("END_DATE").lt(endDate);
			} else {
				c = Criteria.where("END_DATE").lt(endDate);
			}
		}

		Query query = new Query();
		if (startDate != null || endDate != null) {
			query.addCriteria(c);
		}

		if (page.getCount() > 0) {
			query.limit(page.getCount());
		}
		query.skip(page.getSkip());
		if (!StringUtils.isBlank(page.getOrderBy())) {
			Direction dir = page.getSortBy().equalsIgnoreCase("ASC") ? Sort.Direction.ASC
					: Sort.Direction.DESC;
			query.with(new Sort(dir, page.getOrderBy()));
		}

		if (available) {
			query.addCriteria(Criteria.where("END_DATE").gt(new Date()));
		}

		Paged<LineStopInfo> paged = new Paged<LineStopInfo>() {

			@Override
			public Class<LineStopInfo> getClazz() {
				return LineStopInfo.class;
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

		paged.setMaxCount((int) mongoTemplate.count(query, "LineStopInfo"));
		paged.setData(mongoTemplate.find(query, LineStopInfo.class,
				"LineStopInfo"));

		return paged;
	}

	public Paged<CuoFengStopInfo> queryCuoFengStopInfo(Map<String, Object> map) {
		final Page page = (Page) map.get("page");

		Date startDate = (Date) map.get("startDate");
		Date endDate = (Date) map.get("endDate");

		Boolean available = (Boolean) map.get("available");
		if (available == null) {
			available = Boolean.FALSE;
		}

		MongoTemplate mongoTemplate = null;

		if (startDate != null) {
			Calendar c = Calendar.getInstance();
			c.setTime(startDate);
//			mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
			mongoTemplate = mongoDBUtil.getMongoTemplate();

			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			startDate = c.getTime();
		}

		if (endDate != null) {
			Calendar c = Calendar.getInstance();
			c.setTime(endDate);

			if (startDate == null) {
				mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_"
						+ c.get(Calendar.YEAR));
			}

			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) + 1);
			endDate = c.getTime();
		}

		if (mongoTemplate == null) {
			mongoTemplate = mongoDBUtil.getMongoTemplate();
		}

		Criteria c = null;
		if (startDate != null) {
			c = Criteria.where("START_DATE").gte(startDate);
		}

		if (endDate != null) {
			if (startDate != null) {
				c = c.and("END_DATE").lt(endDate);
			} else {
				c = Criteria.where("END_DATE").lt(endDate);
			}
		}

		Query query = new Query();
		if (startDate != null || endDate != null) {
			query.addCriteria(c);
		}

		if (page.getCount() > 0) {
			query.limit(page.getCount());
		}
		query.skip(page.getSkip());
		if (!StringUtils.isBlank(page.getOrderBy())) {
			Direction dir = page.getSortBy().equalsIgnoreCase("ASC") ? Sort.Direction.ASC
					: Sort.Direction.DESC;
			query.with(new Sort(dir, page.getOrderBy()));
		}

		if (available) {
			query.addCriteria(Criteria.where("END_DATE").gt(new Date()));
		}

		Paged<CuoFengStopInfo> paged = new Paged<CuoFengStopInfo>() {

			@Override
			public Class<CuoFengStopInfo> getClazz() {
				return CuoFengStopInfo.class;
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

		paged.setMaxCount((int) mongoTemplate.count(query, "CuoFengStopInfo"));
		paged.setData(mongoTemplate.find(query, CuoFengStopInfo.class,
				"CuoFengStopInfo"));

		return paged;
	}

}
