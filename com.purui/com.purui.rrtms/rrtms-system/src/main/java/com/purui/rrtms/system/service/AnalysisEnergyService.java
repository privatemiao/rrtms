package com.purui.rrtms.system.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.dao.BaseDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.AnalysisActionParam;
import com.purui.rrtms.system.domain.AnalysisEnergyParam;
import com.purui.rrtms.system.domain.AnalysisEnergyWrapper;
import com.purui.rrtms.system.domain.MData;
import com.purui.rrtms.system.domain.TotalEnergy;
import com.purui.rrtms.system.entity.DataPoint;
import com.purui.rrtms.system.entity.Point;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class AnalysisEnergyService {
	@Resource
	protected MongoDBUtil mongoDBUtil;
	@Resource
	protected BaseDao baseDao;

	protected final String COMPARE_DATE_TYPE_DAY = "day";
	protected final String COMPARE_DATE_TYPE_MONTH = "month";
	protected final String COMPARE_DATE_TYPE_YEAR = "year";

	protected final String COMPARE_BY_TYPE_AREA = "area";
	protected final String COMPARE_BY_TYPE_INDUSTRY = "industry";
	protected final String COMPARE_BY_TYPE_CODE = "code";

	protected Logger logger = LoggerFactory.getLogger(AnalysisEnergyService.class);

	// 负荷对比
	public List<AnalysisEnergyWrapper> compareEnergy(AnalysisActionParam param) {

		List<AnalysisEnergyWrapper> wrappers = new ArrayList<>();
//		if (param.getCompareBy().equalsIgnoreCase("area")) {
//			param.setCompareBy("AreaName");
//		} else {
//			param.setCompareBy("HangyeCode");
//		}

		switch (param.getCompareBy().toLowerCase()) {
		case "area":
			param.setCompareBy("AreaName");
			break;
		case "industry":
			param.setCompareBy("HangyeCode");
			break;
		case "code":
			param.setCompareBy("StationCode");
			break;
		}

		switch (param.getType()) {
		case COMPARE_DATE_TYPE_DAY:
			if (param.getCompareByValue() == null || param.getCompareByValue().length == 0) {
				// 比对所有区域的不同两个日期的值
				wrappers.add(loadOneDay(param.getCompareBy(), null, param.getStartDate()));
				wrappers.add(loadOneDay(param.getCompareBy(), null, param.getEndDate()));
			} else if (param.getCompareByValue().length == 1) {
				// 比对某一个且仅有一个区域不同一天的值
				wrappers.add(loadOneDay(param.getCompareBy(), param.getCompareByValue()[0], param.getStartDate()));
				wrappers.add(loadOneDay(param.getCompareBy(), param.getCompareByValue()[0], param.getEndDate()));
			} else {
				// param.getCompareByValue().length > 1
				// 对比多个不同区域某一日期的值
				for (String val : param.getCompareByValue()) {
					wrappers.add(loadOneDay(param.getCompareBy(), val, param.getStartDate()));
				}
			}
			return wrappers;

		case COMPARE_DATE_TYPE_MONTH:
			if (param.getCompareByValue() == null || param.getCompareByValue().length == 0) {
				// 比对所有区域的不同两个日期的值
				wrappers.add(loadOneMonth(param.getCompareBy(), null, param.getStartDate()));
				wrappers.add(loadOneMonth(param.getCompareBy(), null, param.getEndDate()));
			} else if (param.getCompareByValue().length == 1) {
				// 比对某一个且仅有一个区域不同一天的值
				wrappers.add(loadOneMonth(param.getCompareBy(), param.getCompareByValue()[0], param.getStartDate()));
				wrappers.add(loadOneMonth(param.getCompareBy(), param.getCompareByValue()[0], param.getEndDate()));
			} else {
				// param.getCompareByValue().length > 1
				// 对比多个不同区域某一日期的值
				for (String val : param.getCompareByValue()) {
					wrappers.add(loadOneMonth(param.getCompareBy(), val, param.getStartDate()));
				}
			}
			return wrappers;
		case COMPARE_DATE_TYPE_YEAR:
			if (param.getCompareByValue() == null || param.getCompareByValue().length == 0) {
				// 比对所有区域的不同两个日期的值
				wrappers.add(loadOneYear(param.getCompareBy(), null, param.getStartDate()));
				wrappers.add(loadOneYear(param.getCompareBy(), null, param.getEndDate()));
			} else if (param.getCompareByValue().length == 1) {
				// 比对某一个且仅有一个区域不同一天的值
				wrappers.add(loadOneYear(param.getCompareBy(), param.getCompareByValue()[0], param.getStartDate()));
				wrappers.add(loadOneYear(param.getCompareBy(), param.getCompareByValue()[0], param.getEndDate()));
			} else {
				// param.getCompareByValue().length > 1
				// 对比多个不同区域某一日期的值
				for (String val : param.getCompareByValue()) {
					wrappers.add(loadOneYear(param.getCompareBy(), val, param.getStartDate()));
				}
			}
			return wrappers;
		default:
			return null;
		}

	}

	private TotalEnergy groupTotalEnergy(MongoTemplate mongoTemplate, Criteria criteria, String groupBy, String groupByValue) {
//		@formatter:off
		GroupBy group = GroupBy.key(groupBy).initialDocument("{count : 0, totalValue : 0}").reduceFunction("" +
				"function(object, result){" +
					"result.count ++;" +
					"result.totalValue += object.Data.ChangeValue " + 
				"}");
//		@formatter:on

		GroupByResults<TotalEnergy> results = mongoTemplate.group(criteria, "TotalEnergy", group, TotalEnergy.class);
		Iterator<TotalEnergy> iterator = results.iterator();

		TotalEnergy energy = null;
		if (StringUtils.isBlank(groupByValue)) {
			energy = new TotalEnergy();
			while (iterator.hasNext()) {
				TotalEnergy next = iterator.next();
				energy.setCount(energy.getCount() + next.getCount());
				energy.setTotalValue(energy.getTotalValue() + next.getTotalValue());
			}
		} else {
			if (iterator.hasNext()) {
				energy = iterator.next();
			} else {
				energy = new TotalEnergy();
			}
		}

		return energy;
	}

	private AnalysisEnergyWrapper loadOneYear(String groupBy, String groupByValue, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);

		AnalysisEnergyWrapper wrapper = new AnalysisEnergyWrapper();
		List<TotalEnergy> energys = new ArrayList<>();

		for (int i = 1; i <= 12; i++) {
			Criteria criteria = Criteria.where("Data.mMonth").is(i);
			if (!StringUtils.isBlank(groupByValue)) {
				criteria.and(groupBy).is(groupByValue);
			}
//			MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
			MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
			energys.add(groupTotalEnergy(mongoTemplate, criteria, groupBy, groupByValue));
		}

		wrapper.setName(groupByValue == null ? "总平台" : groupByValue);
		wrapper.setTotalEnergys(energys);
		wrapper.setDate(date);
		return wrapper;
	}

	private AnalysisEnergyWrapper loadOneMonth(String groupBy, String groupByValue, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);

		AnalysisEnergyWrapper wrapper = new AnalysisEnergyWrapper();
		List<TotalEnergy> energys = new ArrayList<>();

		for (int i = 1; i <= c.getActualMaximum(Calendar.DAY_OF_MONTH); i++) {
			Criteria criteria = Criteria.where("Data.mMonth").is(c.get(Calendar.MONTH) + 1).and("Data.mDay").is(i);
			if (!StringUtils.isBlank(groupByValue)) {
				criteria.and(groupBy).is(groupByValue);
			}
//			MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
			MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
			energys.add(groupTotalEnergy(mongoTemplate, criteria, groupBy, groupByValue));
		}

		wrapper.setName(groupByValue == null ? "总平台" : groupByValue);
		wrapper.setTotalEnergys(energys);
		wrapper.setDate(date);
		return wrapper;
	}

	/*
	 * 某一区域一天的24条记录 如果区域为空，则合并所有区域
	 */
	private AnalysisEnergyWrapper loadOneDay(String groupBy, String groupByValue, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);

		Calendar base = Calendar.getInstance();
		base.setTime(date);
		List<TotalEnergy> energys = new ArrayList<>();
		AnalysisEnergyWrapper wrapper = new AnalysisEnergyWrapper();

		for (int i = 0; i < 24; i++) {
			base.set(Calendar.HOUR_OF_DAY, i);
			Date _startDate = base.getTime();
			base.set(Calendar.HOUR_OF_DAY, i + 1);
			Date _endDate = base.getTime();

			Criteria criteria = Criteria.where("Data.Atime").gte(_startDate).andOperator(Criteria.where("Data.Atime").lt(_endDate));
			if (!StringUtils.isBlank(groupByValue)) {
				criteria.and(groupBy).is(groupByValue);
			}
//			logger.debug("SQL>>" + new Query(criteria).getQueryObject().toString());
//			MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
			MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
			energys.add(groupTotalEnergy(mongoTemplate, criteria, groupBy, groupByValue));

		}
		wrapper.setName(groupByValue == null ? "总平台" : groupByValue);
		wrapper.setTotalEnergys(energys);
		wrapper.setDate(date);
		return wrapper;
	}

	public List<Point> searchPointMData(AnalysisEnergyParam param) {
		List<Point> points = new ArrayList<>();
		for (Long id : param.getPointIds()) {
			points.add(baseDao.load(Point.class, id));
		}

		Calendar c = Calendar.getInstance();
		c.setTime(param.getDate());
		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;
		int day = c.get(Calendar.DAY_OF_MONTH);

		List<String> codeFilter = calcCodeFilter(param);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate(param.getCode() + '_' + year);

		for (Point point : points) {
			for (int i = point.getDataPoints().size() - 1; i >= 0; i--) {
				Query query = null;
				DataPoint dp = point.getDataPoints().get(i);
				if (!codeFilter.contains(dp.getSubTagType().getCode())) {
					point.getDataPoints().remove(i);
					continue;
				}

				switch (param.getType()) {
				case "day":
					logger.debug("按日查询 - " + dp.getGuid());
					query = new Query(Criteria.where("TagGuid").is(dp.getGuid()).and("mDay").is(day)).with(new Sort(Sort.Direction.ASC, "Atime"));
					logger.debug(query.getQueryObject().toString());
					dp.setmDatas(mongoTemplate.find(query, MData.class, "Mdata" + (month < 10 ? "0" + month : month)));
					logger.debug(dp.getmDatas().size() + "");
					break;
				case "month":
					logger.debug("按月查询 - " + dp.getGuid());
					query = new Query(Criteria.where("TagGuid").is(dp.getGuid()).and("mMonth").is(month)).with(new Sort(Sort.Direction.ASC, "Atime"));
					logger.debug(query.getQueryObject().toString());
					dp.setmDatas(mongoTemplate.find(query, MData.class, "Mdata" + (month < 10 ? "0" + month : month)));
					logger.debug(dp.getmDatas().size() + "");
					break;
				case "year":
					logger.debug("按年查询 - " + dp.getGuid());
					List<MData> array = new ArrayList<>();
					for (int n = 1; n <= 12; n++) {
						query = new Query(Criteria.where("TagGuid").is(dp.getGuid())).with(new Sort(Sort.Direction.ASC, "Atime"));
						array.addAll(mongoTemplate.find(query, MData.class, "Mdata" + (n < 10 ? "0" + n : n)));
					}
					dp.setmDatas(array);
					logger.debug(dp.getmDatas().size() + "");
					break;
				}

			}
		}

		return points;
	}

	private List<String> calcCodeFilter(AnalysisEnergyParam param) {
		List<String> codeFilter = new ArrayList<>();

		switch (param.getCurve()) {
		case 1:
			switch (param.getKind()) {
			case "A":
				codeFilter.add("4");
				break;
			case "B":
				codeFilter.add("5");
				break;
			case "C":
				codeFilter.add("6");
				break;
			default:
				break;
			}
			break;
		case 2:
			switch (param.getKind()) {
			case "A":
				codeFilter.add("1");
				break;
			case "B":
				codeFilter.add("2");
				break;
			case "C":
				codeFilter.add("3");
				break;
			default:
				break;
			}
			break;
		case 3:
			switch (param.getKind()) {
			case "A":
				codeFilter.add("10");
				break;
			case "B":
				codeFilter.add("11");
				break;
			case "C":
				codeFilter.add("12");
				break;
			case "D":
				codeFilter.add("18");
				break;
			default:
				break;
			}
			break;
		case 4:
			switch (param.getKind()) {
			case "A":
				codeFilter.add("7");
				break;
			case "B":
				codeFilter.add("8");
				break;
			case "C":
				codeFilter.add("9");
				break;
			case "D":
				codeFilter.add("17");
				break;
			default:
				break;
			}
			break;
		default:
			break;
		}
		return codeFilter;
	}

}
