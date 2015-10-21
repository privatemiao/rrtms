package com.purui.rrtms.system.service;

import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.dao.BaseDao;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.framework.domain.SecurityCodeType;
import org.mel.security.domain.CachedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.purui.rrtms.system.domain.DataPointCompare;
import com.purui.rrtms.system.domain.EnergyEntity;
import com.purui.rrtms.system.domain.EnergyOfMonth;
import com.purui.rrtms.system.domain.HDataMon;
import com.purui.rrtms.system.domain.PositionArea;
import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.domain.SwitchInstruction;
import com.purui.rrtms.system.domain.TotalLoad;
import com.purui.rrtms.system.domain.TotalLoadOfMonth;
import com.purui.rrtms.system.entity.Chart;
import com.purui.rrtms.system.entity.Point;
import com.purui.rrtms.system.entity.SecurityCode;
import com.purui.rrtms.system.entity.Station;
import com.purui.rrtms.system.entity.User;
import com.purui.rrtms.system.entity.UserDataPoint;
import com.purui.rrtms.system.entity.Video;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class StationService {
	protected static Logger logger = LoggerFactory.getLogger(StationService.class);

	@Resource
	private BaseDao baseDao;
	@Resource
	private SystemService systemService;
	@Resource
	private MongoDBUtil mongoDBUtil;

	@Resource
	private SSLService sslService;

	public Paged<Station> query(Map<String, Object> map) {
		final Page page = (Page) map.get("page");
		final String param = (String) map.get("param");

		Paged<Station> paged = new Paged<Station>() {

			@Override
			public String getSql() {
				StringBuffer buffer = new StringBuffer();

				// @formatter:off

				if (StringUtils.isBlank(param)) {
					buffer.append("FROM Station a WHERE 1 = 1 ");
				} else {
					buffer.append("SELECT a FROM Station a ").append("LEFT JOIN a.company b ").append("LEFT JOIN a.province c ").append("LEFT JOIN a.city d ").append("LEFT JOIN a.dist e WHERE (")

					.append("a.name like :param OR ").append("a.address like :param OR ").append("a.contact like :param OR ").append("a.code like :param OR ").append("b.name like :param OR ")
							.append("c.name like :param OR ").append("d.name like :param OR ").append("e.name like :param) ");
				}
				// @formatter:on

				return buffer.toString();
			}

			@Override
			public String[] getColumns() {
				if (StringUtils.isBlank(param)) {
					return null;
				} else {
					return new String[] { "param" };
				}
			}

			@Override
			public Object[] getVals() {
				if (StringUtils.isBlank(param)) {
					return null;
				} else {
					return new Object[] { '%' + param + '%' };
				}
			}

			@Override
			public String getOrderBy() {
				return page.getOrderBy();
			}

			@Override
			public String getSortBy() {
				return page.getSortBy();
			}

			@Override
			public Class<Station> getClazz() {
				return Station.class;
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
		baseDao.search(paged);
		return paged;
	}

	public Paged<Station> queryByUser(Map<String, Object> map) {
		final Page page = (Page) map.get("page");
		final String param = (String) map.get("param");
		final PositionArea positions = (PositionArea) map.get("positions");
		final Long userId = (Long) map.get("userId");

		Paged<Station> paged = new Paged<Station>() {

			@Override
			public String getSql() {
				StringBuffer buffer = new StringBuffer();
				String positionCondition = null;

				// @formatter:off
				if (positions != null) {
					StringBuffer sb = new StringBuffer();
					sb.append(" ( a.lon >= ").append(positions.getPositions().get(0).getLng()).append(" AND a.lon <= ").append(positions.getPositions().get(1).getLng()).append(" AND a.lat >= ")
							.append(positions.getPositions().get(0).getLat()).append(" AND a.lat <= ").append(positions.getPositions().get(1).getLat()).append(" )");
					positionCondition = sb.toString();
				}

				buffer.append("SELECT a FROM Station a LEFT JOIN a.users f ");

				if (!StringUtils.isBlank(param)) {
					buffer.append("LEFT JOIN a.company b ").append("LEFT JOIN a.province c ").append("LEFT JOIN a.city d ").append("LEFT JOIN a.dist e WHERE (")

					.append("a.name like :param OR ").append("a.address like :param OR ").append("a.contact like :param OR ").append("a.code like :param OR ").append("b.name like :param OR ")
							.append("c.name like :param OR ").append("d.name like :param OR ").append("e.name like :param) ");
				} else {
					buffer.append(" WHERE 1 = 1");
				}
				buffer.append(" AND f.id = :userId ");

				if (!StringUtils.isBlank(positionCondition)) {
					buffer.append(" AND ").append(positionCondition);
				}
				// @formatter:on
				return buffer.toString();
			}

			@Override
			public String[] getColumns() {
				if (StringUtils.isBlank(param)) {
					return new String[] { "userId" };
				} else {
					return new String[] { "param", "userId" };
				}
			}

			@Override
			public Object[] getVals() {
				if (StringUtils.isBlank(param)) {
					return new Object[] { userId };
				} else {
					return new Object[] { '%' + param + '%', userId };
				}
			}

			@Override
			public String getOrderBy() {
				return page.getOrderBy();
			}

			@Override
			public String getSortBy() {
				return page.getSortBy();
			}

			@Override
			public Class<Station> getClazz() {
				return Station.class;
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
		baseDao.search(paged);
		return paged;
	}

	public Station loadStationByCode(String code) {
		Station station = baseDao.findOneByNamedQuery(Station.class, "Station.loadByCode", new String[] { "code" }, new Object[] { code });
		fetchPoints(station.getPoints(), false);
		return station;
	}

	public Station loadStation(Long id) {
		Station station = baseDao.load(Station.class, id);
		fetchPoints(station.getPoints(), false);
		return station;
	}

	private void fetchPoints(List<Point> points, boolean needDataPoint) {
		for (Point point : points) {
			if (needDataPoint) {
				point.getDataPoints().size();
				Collections.sort(point.getDataPoints(), new DataPointCompare());
			}
			fetchPoints(point.getChildren(), needDataPoint);
		}
	}

	public Station loadDataPointHierarchy(String code) {
		Station station = baseDao.findOneByNamedQuery(Station.class, "Station.loadByCode", new String[] { "code" }, new Object[] { code });
		fetchPoints(station.getPoints(), true);
		return station;
	}

	public List<Chart> loadChartsByCode(String code) {
		return baseDao.findByNamedQuery(Chart.class, "Chart.findByCode", new String[] { "code" }, new Object[] { code });
	}

	public void saveChart(Chart chart) {
		Date currentDate = new Date();
		chart.setUserId(systemService.getCurrentUser().getSecurityUser().getId());
		chart.setUpdateTime(currentDate);
		if (chart.getId() == null) {
			chart.setInsertTime(currentDate);
			baseDao.persist(chart);
		} else {
			Chart older = loadChart(chart.getId());
			chart.setInsertTime(older.getInsertTime());
			baseDao.merge(chart);
		}
	}

	public Chart loadChart(Long id) {
		return baseDao.load(Chart.class, id);
	}

	public void removeChart(Long id) {
		baseDao.remove(Chart.class, id);
	}

	public List<HDataMon> getDataPointHistory(String code, Date startDate, Date endDate, String guid) {
		if (startDate == null) {
			throw new IllegalArgumentException("没有开始日期");
		}
		if (endDate == null) {
			throw new IllegalArgumentException("没有结束日期");
		}
		if (endDate.getTime() - startDate.getTime() < 0) {
			throw new IllegalArgumentException("结束日期不能早于开始日期");
		}

		Calendar startCalendar = Calendar.getInstance();
		startCalendar.setTime(startDate);
		int year = startCalendar.get(Calendar.YEAR);
		int month = startCalendar.get(Calendar.MONTH) + 1;
		int startDay = startCalendar.get(Calendar.DAY_OF_MONTH);

		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(endDate);
		int endDay = endCalendar.get(Calendar.DAY_OF_MONTH);

		Query query = new Query(Criteria.where("TagGuid").is(guid).and("mDay").gte(startDay).lte(endDay).and("mMonth").is(month));
		logger.debug(query.getQueryObject().toString() + ">>guid>>" + guid + ">>year>>" + year + ">>month>>" + month + ">>startDay>>" + startDay + ">>endDay>>" + endDay);
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate(code + "_" + year);
		List<HDataMon> list = mongoTemplate.find(query, HDataMon.class, "Hdata" + (month < 10 ? "0" + month : month));
		return list;
	}

	public void saveUserDataPoint(String code, UserDataPoint[] userDataPoints) {
		CachedUser currentUser = systemService.getCurrentUser();
		User user = (User) currentUser.getData(User.class.getCanonicalName());
		baseDao.executeByNamedQuery("UserDataPoint.removeByUserId", new String[] { "userId", "code" }, new Object[] { user.getId(), code });

		if (userDataPoints == null || userDataPoints.length == 0) {
			return;
		}

		for (UserDataPoint userDataPoint : userDataPoints) {
			userDataPoint.setId(null);
			if (userDataPoint.getDataPointId() == null) {
				throw new IllegalArgumentException("检测点不能为空!");
			}
			userDataPoint.setUserId(user.getId());
			if (StringUtils.isBlank(userDataPoint.getParentName())) {
				throw new IllegalArgumentException("检测点上一节点名称不能为空！");
			}
			if (StringUtils.isBlank(userDataPoint.getCode())) {
				throw new IllegalArgumentException("站点代码不能为空！");
			}
			baseDao.persist(userDataPoint);
		}

	}

	public List<UserDataPoint> getUserDataPoint(String code) {
		CachedUser currentUser = systemService.getCurrentUser();
		User user = (User) currentUser.getData(User.class.getCanonicalName());
		return baseDao.findByNamedQuery(UserDataPoint.class, "UserDataPoint.findByUserId", new String[] { "userId", "code" }, new Object[] { user.getId(), code });
	}

	public String triggerSwitch(String code, String tagId, String operate, String note, String password) throws Exception {
		if (StringUtils.isBlank(code) || StringUtils.isBlank(tagId) || StringUtils.isBlank(operate) || StringUtils.isBlank(password)) {
			throw new IllegalArgumentException("参数错误 code=" + code + ", tagId=" + tagId + ", operate=" + operate);
		}

		validateTriggerSwitchPassword(password);

		tagId = "7f4ea853-07b8-44f8-98aa-8eec606d36c8";
		logger.error("触发开关已经写死用于测试");

		// 只有系统管理员一个人才能有次操作权限
		if (!systemService.isAdmin()) {
			throw new Exception("没有权限！-请联系管理员！");
		}

		String guid = UUID.randomUUID().toString();
		Map<String, String> map = new HashMap<>();

		map.put("FUNC_CODE", "FFH");
		map.put("GUID", guid);
		map.put("STATIONCODE", code);
		map.put("TAGID", tagId);
		map.put("OPTYPE", operate + "");

		ObjectMapper mapper = new ObjectMapper();
		String submitStr = null;
		submitStr = mapper.writeValueAsString(map);
		String result = sslService.send(submitStr);
		SwitchInstruction ins = new SwitchInstruction();
		ins.setCode(code);
		ins.setGuid(guid);
		ins.setTagId(tagId);
		ins.setNote(note);
		ins.setOperate(operate);
		ins.setResult(result);
		saveSwitchInstruction(ins);
		return result;
	}

	private void validateTriggerSwitchPassword(String password) {
		SecurityCode securityCode = baseDao.findOneByNamedQuery(SecurityCode.class, "SecurityCode.findByType", new String[] { "type" }, new Object[] { SecurityCodeType.SWITCH });
		if (securityCode == null) {
			throw new IllegalArgumentException("没有找到该操作类型");
		}

		if (!securityCode.getPassword().equals(password)) {
			throw new IllegalArgumentException("口令错误！");
		}

	}

	private void saveSwitchInstruction(SwitchInstruction ins) {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		mongoTemplate.save(ins);
	}

	public List<Video> getVideosByCode(String code) {
		return baseDao.findByNamedQuery(Video.class, "Video.findByCode", new String[] { "code" }, new Object[] { code });
	}

	public StationRun getStationRun(String code) {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		return mongoTemplate.findOne(new Query(Criteria.where("StationCode").is(code)), StationRun.class, "StationRuns");
	}

	public EnergyEntity maxEnergyOfDay(String code, Date date) {
		Date yesterday = new Date(date.getTime() - 86400000);
		EnergyEntity todayMaxEnergy = getMaxEnergyEntity(code, date);
		EnergyEntity yesterdayMaxEnergy = getMaxEnergyEntity(code, yesterday);

		todayMaxEnergy.getData().setValue(todayMaxEnergy.getData().getValue() - yesterdayMaxEnergy.getData().getValue());
		return todayMaxEnergy;
	}

	private EnergyEntity getMaxEnergyEntity(String code, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);

		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;
		int day = c.get(Calendar.DAY_OF_MONTH);

		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("StationCode").is(code).and("Data.mYear").is(year).and("Data.mMonth").is(month).and("Data.mDay").is(day)).with(new Sort(Sort.Direction.DESC, "LastDevValue"));

		System.out.println(query.toString());

		return mongoTemplate.findOne(query, EnergyEntity.class, "TotalEnergy");

	}

	public TotalLoad maxLoadOfDay(String code, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);

		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;
		int day = c.get(Calendar.DAY_OF_MONTH);

		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("StationCode").is(code).and("mYear").is(year).and("mMonth").is(month).and("mDay").is(day)).with(new Sort(Sort.Direction.DESC, "FuHeValue"));

		System.out.println(query.toString());

		return mongoTemplate.findOne(query, TotalLoad.class, "TotalFuHe");
	}

	public EnergyOfMonth energyOfMonth(String code, Date date) {
		EnergyEntity min = getMinEnergyOfMonth(code, date);
		EnergyEntity max = getMaxEnergyOfMonth(code, date);

		EnergyOfMonth energyOfMonth = new EnergyOfMonth();
		energyOfMonth.setAreaName(max.getAreaName());
		energyOfMonth.setCompanyName(max.getCompanyName());
		energyOfMonth.setHangyeCode(max.getHangyeCode());
		energyOfMonth.setStationCode(max.getStationCode());
		energyOfMonth.setMaxValue(max.getData().getValue());
		energyOfMonth.setMinValue(min.getData().getValue());

		return energyOfMonth;
	}

	private EnergyEntity getMinEnergyOfMonth(String code, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);

		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;

//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("StationCode").is(code).and("Data.mYear").is(year).and("Data.mMonth").is(month)).with(new Sort(Sort.Direction.ASC, "Data.LastDevValue"));

		System.out.println(query.toString());

		return mongoTemplate.findOne(query, EnergyEntity.class, "TotalEnergy");
	}

	private EnergyEntity getMaxEnergyOfMonth(String code, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);

		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;

//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("StationCode").is(code).and("Data.mYear").is(year).and("Data.mMonth").is(month)).with(new Sort(Sort.Direction.DESC, "Data.LastDevValue"));

		System.out.println(query.toString());

		return mongoTemplate.findOne(query, EnergyEntity.class, "TotalEnergy");
	}

	public TotalLoadOfMonth getTotalLoadOfMonth(String code, Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);

		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;

//		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate("PUHUA_" + c.get(Calendar.YEAR));
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.addCriteria(Criteria.where("StationCode").is(code).and("mYear").is(year).and("mMonth").is(month)).with(new Sort(Sort.Direction.DESC, "FuHeValue"));

		System.out.println(query.toString());

		return mongoTemplate.findOne(query, TotalLoadOfMonth.class, "TotalFuHe");
	}

	public List<Point> getPoints(String code) {
		return baseDao.findByNamedQuery(Point.class, "Point.findByCode", new String[] { "code" }, new String[] { code });
	}

}