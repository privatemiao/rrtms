package com.purui.rrtms.system.service;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.dao.BaseDao;
import org.mel.framework.domain.Paged;
import org.mel.framework.domain.SecurityCodeType;
import org.mel.framework.exception.LoginException;
import org.mel.security.domain.CachedUser;
import org.mel.security.service.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.ClientInfo;
import com.purui.rrtms.system.domain.PlatformStatus;
import com.purui.rrtms.system.entity.City;
import com.purui.rrtms.system.entity.Province;
import com.purui.rrtms.system.entity.SecurityCode;
import com.purui.rrtms.system.entity.Station;
import com.purui.rrtms.system.entity.TagType;
import com.purui.rrtms.system.entity.User;
import com.purui.rrtms.system.entity.WarnType;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class SystemService {
	@Resource
	private UserService userService;
	@Resource
	private SecurityService securityService;
	@Resource
	private BaseDao baseDao;

	@Resource
	private MongoDBUtil mongoDBUtil;

	protected Logger logger = LoggerFactory.getLogger(SystemService.class);

	public void login(String loginId, String password) {
		if (StringUtils.isBlank(loginId) || StringUtils.isBlank(password)) {
			throw new LoginException("用户名或者口令不能为空！");
		}
		User user = userService.findByLoginId(loginId);
		if (user == null || !user.getSecurityUser().getPassword().equals(password)) {
			throw new LoginException("用户名或者口令错误！");
		}
		CachedUser cachedUser = new CachedUser();
		cachedUser.setName(user.getName());
		cachedUser.setUserType(user.getUserType());
		cachedUser.setSecurityUser(user.getSecurityUser());
		cachedUser.addData(User.class.getCanonicalName(), user);
		securityService.cacheSession(cachedUser);
	}

	public void logout() {
		securityService.removeCurrentUser();
	}

	public CachedUser getCurrentUser() {
		return (CachedUser) securityService.getCurrentUser();
	}

	public User findUserByLoginId(String loginId) {
		return userService.findByLoginId(loginId);
	}

	public List<Province> loadAllProvinces() {
		return baseDao.findByNamedQuery(Province.class, "Province.loadAll");
	}

	public Province loadProvince(Long id) {
		Province province = baseDao.findOneByNamedQuery(Province.class, "Province.findById", new String[] { "id" }, new Object[] { id });
		province.getCities().size();
		return province;
	}

	public City loadCity(Long id) {
		City city = baseDao.findOneByNamedQuery(City.class, "City.findById", new String[] { "id" }, new Object[] { id });
		city.getDistricts().size();
		return city;
	}

	public List<TagType> loadTagTypes() {
		return baseDao.findByNamedQuery(TagType.class, "TagType.loadAll");
	}

	public List<WarnType> getAllWarnType() {
		return baseDao.findByNamedQuery(WarnType.class, "WarnType.findAll");
	}

	public boolean isAdmin() {
		return securityService.isAdmin();
	}

	public void saveSecurityCode(SecurityCode code) {
		if (code.getId() == null) {
			SecurityCode older = findByType(code.getType());
			if (older != null) {
				throw new IllegalArgumentException("该类型已经存在！");
			}
			baseDao.persist(code);
		} else {
			baseDao.merge(code);
		}
	}

	public SecurityCode findByType(SecurityCodeType type) {
		return baseDao.findOneByNamedQuery(SecurityCode.class, "SecurityCode.findByType", new String[] { "type" }, new Object[] { type });
	}

	public void removeSecurityCode(Long... id) {
		if (id == null) {
			return;
		}
		for (Long _id : id) {
			baseDao.remove(SecurityCode.class, _id);
		}
	}

	public List<SecurityCode> getAllSecurityCode() {
		return baseDao.findByNamedQuery(SecurityCode.class, "SecurityCode.findAll");
	}

	public PlatformStatus platformStatus() {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		PlatformStatus platformStatus = mongoTemplate.findOne(new BasicQuery("{}"), PlatformStatus.class, "server_run_status");
		return platformStatus;
	}

	public int stationCount() {
		Paged<Station> paged = new Paged<Station>() {

			@Override
			public Class<Station> getClazz() {
				return Station.class;
			}

			@Override
			public int getCount() {
				return 1;
			}

			@Override
			public int getStartPosition() {
				return 0;
			}

			@Override
			public String getSql() {
				return "FROM Station";
			}

		};
		baseDao.fetchMaxCount(paged);
		return paged.getMaxCount();
	}

	public void removeClient(String clientId) {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		mongoTemplate.remove(new Query(Criteria.where("clientId").is(clientId)), ClientInfo.class);
	}

	public void saveClient(String clientId, String devType) {
		removeClient(clientId);
		CachedUser cachedUser = (CachedUser) securityService.getCurrentUser();
		User user = (User) cachedUser.getData(User.class.getCanonicalName());
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		for (Station station : user.getStations()) {
			mongoTemplate.save(new ClientInfo(station.getCode(), clientId, user.getSecurityUser().getLoginId(), user.getName(), devType, user.getUserType()));
		}
	}

}
