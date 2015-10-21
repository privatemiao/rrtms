package com.purui.rrtms.system.service;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.framework.domain.UserType;
import org.mel.security.domain.CachedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.Warn;
import com.purui.rrtms.system.domain.WarningSearchParam;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class WarningService {
	@Resource
	private MongoDBUtil mongoDBUtil;
	@Resource
	private SystemService systemService;

	protected Logger logger = LoggerFactory.getLogger(WarningService.class);

	public Paged<Warn> queryHistory(Map<String, Object> map) {
		WarningSearchParam param = (WarningSearchParam) map.get("param");
		final Page page = (Page) map.get("page");
		CachedUser user = systemService.getCurrentUser();

		validateParam(param);

		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();

		if (!StringUtils.isBlank(param.getWarnType())) {
			query.addCriteria(Criteria.where("EventTypeName").is(param.getWarnType()));
		} else {
			if (user.getUserType() != UserType.INTERNAL && user.getUserType() != UserType.PROVIDER) {
				query.addCriteria(Criteria.where("EventTypeName").ne("网络事件").andOperator(Criteria.where("EventTypeName").ne("网络通讯")));
			}
		}

		Criteria criteria = Criteria.where("StationCode").in(Arrays.asList(param.getCode()));
		if (param.getStartDate() != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(param.getStartDate());
			calendar.set(Calendar.HOUR_OF_DAY, 0);
			calendar.set(Calendar.MINUTE, 0);
			calendar.set(Calendar.SECOND, 0);
			param.setStartDate(calendar.getTime());
			criteria.and("Atime").gte(param.getStartDate());
		}
		if (param.getEndDate() != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(param.getEndDate());
			calendar.set(Calendar.HOUR_OF_DAY, 0);
			calendar.set(Calendar.MINUTE, 0);
			calendar.set(Calendar.SECOND, 0);
			param.setEndDate(calendar.getTime());

			if (param.getStartDate() != null) {
				criteria.andOperator(Criteria.where("Atime").lt(param.getEndDate()));
			} else {
				criteria.and("Atime").lt(param.getEndDate());
			}
		}

		//是否处理过
		if (param.getConfigured() != null){
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, 2000);
			if (param.getConfigured()){
				criteria.and("ConfigTime").gt(c.getTime());
			}else{
				criteria.and("ConfigTime").lt(c.getTime());
			}
		}
		
//		query.addCriteria(Criteria.where("Atime").gte(param.getStartDate()).andOperator(Criteria.where("Atime").lt(param.getEndDate())).and("StationCode").in(Arrays.asList(param.getCode())));
		query.addCriteria(criteria);
		query.skip(page.getSkip()).limit(page.getCount());

		if (!StringUtils.isBlank(page.getOrderBy())) {
			Direction dir = page.getSortBy().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
			query.with(new Sort(dir, page.getOrderBy()));
		}

		logger.debug(query.getQueryObject().toString());

		Paged<Warn> paged = new Paged<Warn>() {

			@Override
			public Class<Warn> getClazz() {
				return Warn.class;
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

		paged.setMaxCount(new Long(mongoTemplate.count(query, "warns")).intValue());
		paged.setData(mongoTemplate.find(query, Warn.class, "warns"));
		return paged;
	}

	private void validateParam(WarningSearchParam param) {
		if (param == null) {
			throw new IllegalArgumentException("没有提供检索参数");
		}

		if (param.getCode() == null || param.getCode().length == 0) {
			throw new IllegalArgumentException("没有提供检索参数 station code");
		}
	}

	public void configWarning(String guid, Date date, String note) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();

		Warn warn = mongoTemplate.findOne(new Query(Criteria.where("MsgGuid").is(guid)), Warn.class, "warns");

		if (warn == null) {
			throw new RuntimeException("没有找到warn[" + guid + "]");
		}

		warn.setConfigTime(new Date());
		warn.setNote(note);
		mongoTemplate.save(warn, "warns");
	}
}
