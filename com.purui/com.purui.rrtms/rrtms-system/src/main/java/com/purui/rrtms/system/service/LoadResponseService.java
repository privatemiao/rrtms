package com.purui.rrtms.system.service;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.purui.rrtms.system.domain.ControlInstruction;
import com.purui.rrtms.system.domain.ControlInstructionDetail;
import com.purui.rrtms.system.domain.ControlInstructionResponse;
import com.purui.rrtms.system.domain.ControlInstructionResult;
import com.purui.rrtms.system.domain.LoadControlApplyParam;
import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.domain.TotalLoad;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class LoadResponseService {
	@Resource
	private MongoDBUtil mongoDBUtil;
	@Resource
	private DashboardService dashboardService;
	@Resource
	private SSLService sslService;
	@Resource
	private SystemService systemService;

	protected Logger logger = LoggerFactory.getLogger(LoadResponseService.class);

	public List<StationRun> areaLoad(String areaName) {
//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);

//		@formatter:off
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		GroupBy groupBy = GroupBy.key("AreaName").initialDocument("{Pe : 0, StationFuHeDatas : {RTSumFuheValue : 0}}").reduceFunction("" +
				"function(object, result) { " +
				"result.Pe += object.Pe; " +
				"result.CityName = object.CityName; " + 
				"result.StationFuHeDatas.RTSumFuheValue += object.StationFuHeDatas.RTSumFuheValue " + 
			"}");
		GroupByResults<StationRun> results = null;
		if (StringUtils.isBlank(areaName)){
			results = mongoTemplate.group("StationRuns", groupBy, StationRun.class);
		}else{
			results = mongoTemplate.group(Criteria.where("AreaName").is(areaName), "StationRuns", groupBy, StationRun.class);
		}
//		@formatter:on
		Iterator<StationRun> i = results.iterator();
		List<StationRun> stationRuns = new ArrayList<>();
		while (i.hasNext()) {
			StationRun stationRun = i.next();
			stationRuns.add(stationRun);
		}

		Collections.sort(stationRuns, new Comparator<StationRun>() {

			@Override
			public int compare(StationRun o1, StationRun o2) {
				return o1.getAreaName().compareTo(o2.getAreaName());
			}
		});

		return stationRuns;
	}

	// 基准值
	public TotalLoad baseTotalLoad(String code, Date startDate, Date endDate) {
//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);

		Calendar start = Calendar.getInstance();
		start.setTime(startDate);
		start.set(Calendar.HOUR_OF_DAY, 0);
		start.set(Calendar.MINUTE, 0);
		start.set(Calendar.SECOND, 0);
		startDate = start.getTime();

		Calendar end = Calendar.getInstance();
		end.setTime(endDate);
		end.set(Calendar.DAY_OF_MONTH, end.get(Calendar.DAY_OF_MONTH) + 1);
		end.set(Calendar.HOUR_OF_DAY, 0);
		end.set(Calendar.MINUTE, 0);
		end.set(Calendar.SECOND, 0);
		endDate = end.getTime();

//		@formatter:off
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		GroupByResults<TotalLoad> results = mongoTemplate.group(Criteria.where("Atime").gte(startDate).andOperator(Criteria.where("Atime").lt(endDate)).and("StationCode").is(code), 
				"TotalFuHe", GroupBy.key("StationCode").initialDocument("{count : 0, totalValue : 0}").reduceFunction("" +
						"function(object, result){" +
							"result.count ++;" +
							"result.totalValue += object.FuHeValue " + 
						"}"), TotalLoad.class);
//		@formatter:on

		Iterator<TotalLoad> i = results.iterator();
		if (i.hasNext()) {
			return i.next();
		} else {
			return null;
		}

	}

	public String submitInstruction(LoadControlApplyParam param) throws Exception {
		if (StringUtils.isBlank(param.getAreaName())) {
			throw new IllegalArgumentException("没有指定区域！");
		}

		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page();
		page.setCount(-1);
		map.put("page", page);
		map.put("areaName", param.getAreaName());
		map.put("trade", true);
		List<StationRun> stations = dashboardService.queryStationByArea(map).getData();
		String guid = UUID.randomUUID().toString();

		ControlInstruction instruction = new ControlInstruction(param);
		instruction.setUserName(systemService.getCurrentUser().getName());
		instruction.setGuid(guid);

		param.setEndDate(new Date(param.getEndDate().getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000));

		List<Map<String, Object>> stationList = new ArrayList<>();
		List<ControlInstructionDetail> details = new ArrayList<>();
		for (StationRun station : stations) {
			TotalLoad baseTotalLoad = baseTotalLoad(station.getStationCode(), param.getStartDate(), param.getEndDate());
			Map<String, Object> stationMap = new HashMap<>();
			stationMap.put("ID", guid);
			stationMap.put("CONS_NO", station.getCronNo());
			stationMap.put("FH", param.getPercent() / 100);// 负荷控制量

			double avg = 0;
			if (baseTotalLoad.getTotalValue() == 0 || baseTotalLoad.getCount() == 0) {
				avg = 0;
			} else {
				avg = baseTotalLoad.getTotalValue() / baseTotalLoad.getCount();
			}
			stationMap.put("AVG_VALUE", avg == 0 ? "-1" : new DecimalFormat("0.000").format(avg));

			stationMap.put("AVG_STARTDATE", new SimpleDateFormat("yyyyMMddHHmmss").format(param.getStartDate()));
			stationMap.put("AVG_ENDDATE", new SimpleDateFormat("yyyyMMddHHmmss").format(param.getEndDate()));
			stationMap.put("START_DATE", new SimpleDateFormat("yyyyMMddHHmmss").format(param.getApplyStartDate()));
			stationMap.put("END_DATE", new SimpleDateFormat("yyyyMMddHHmmss").format(param.getApplyEndDate()));

			stationList.add(stationMap);

			ControlInstructionDetail detail = new ControlInstructionDetail(station);
			detail.setBaseValue(avg);
			detail.setControlValue(avg * param.getPercent() / 100);
			details.add(detail);
		}

		Map<String, Object> submitInstruction = new HashMap<>();
		submitInstruction.put("FUNC_CODE", "0FH");
		submitInstruction.put("GUID", guid);
		submitInstruction.put("DATA_LIST", stationList.toArray());

		ObjectMapper mapper = new ObjectMapper();
		String submitStr = null;
		submitStr = mapper.writeValueAsString(submitInstruction);

		instruction.setDetails(details.toArray(new ControlInstructionDetail[details.size()]));
		String message = sslService.send(submitStr);
		instruction.setResult(message);
		saveControlInstruction(instruction);
		return message;
	}

	public void saveControlInstruction(ControlInstruction instruction) {
//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		mongoTemplate.save(instruction);
	}

	public Paged<ControlInstruction> queryControlInstruction(Map<String, Object> map) {
		final Page page = (Page) map.get("page");
		Boolean history = (Boolean) map.get("history");

//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();

		Query query = new Query();
		if (page.getCount() > 0) {
			query.limit(page.getCount()).skip(page.getSkip());
		}

		Date currentTime = new Date();
		if (history == null) {
			history = Boolean.FALSE;
		}
		if (history) {
			query.addCriteria(Criteria.where("applyEndDate").lte(currentTime));
		} else {
			query.addCriteria(Criteria.where("applyEndDate").gt(currentTime));
		}

		if (!StringUtils.isBlank(page.getOrderBy())) {
			if (StringUtils.isBlank(page.getSortBy())) {
				page.setSortBy("ASC");
			}

			Direction dir = page.getSortBy().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
			query.with(new Sort(dir, page.getOrderBy()));
		}

		Paged<ControlInstruction> paged = new Paged<ControlInstruction>() {

			@Override
			public Class<ControlInstruction> getClazz() {
				return ControlInstruction.class;
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
		paged.setMaxCount((int) mongoTemplate.count(query, ControlInstruction.class));
		paged.setData(mongoTemplate.find(query, ControlInstruction.class));
		return paged;
	}

	public ControlInstruction loadInstruction(String guid) {
//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("guid").is(guid));
		return mongoTemplate.findOne(query, ControlInstruction.class);
	}

	public List<ControlInstructionResult> loadInsResultByGuid(String guid) {
		if (StringUtils.isBlank(guid)) {
			return Collections.emptyList();
		}
//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();

		Query query = new Query();
		query.addCriteria(Criteria.where("guid").is(guid));
		query.with(new Sort(Direction.ASC, "atTime"));
		logger.debug(query.getQueryObject().toString());
		return mongoTemplate.find(query, ControlInstructionResult.class, "FuHeXiangYingExcInfo");
	}

	// 参与企业响应情况
	public List<ControlInstructionResponse> loadInsResponse(String guid) {
		if (StringUtils.isBlank(guid)) {
			return Collections.emptyList();
		}

//		Calendar c = Calendar.getInstance();
//		int year = c.get(Calendar.YEAR);
//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + year);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();

		Query query = new Query();
		query.addCriteria(Criteria.where("guid").is(guid));
		query.with(new Sort(Direction.ASC, "atTime"));
		logger.debug(query.getQueryObject().toString());
		return mongoTemplate.find(query, ControlInstructionResponse.class, "FuHeXiangYingSolutions");
	}
}
