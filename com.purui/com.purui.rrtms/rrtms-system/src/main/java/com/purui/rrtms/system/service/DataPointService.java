package com.purui.rrtms.system.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.dao.BaseDao;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.entity.DataPoint;

@Service
public class DataPointService {
	protected static final Logger logger = LoggerFactory.getLogger(DataPointService.class);

	@Resource
	private BaseDao baseDao;

	public Paged<DataPoint> query(Map<String, Object> map) {
		final Page page = (Page) map.get("page");
		final Long id = (Long) map.get("id");
		final String code = (String) map.get("code");

		if (id == null) {
			throw new IllegalArgumentException("没有指定监测点编号！");
		}
		
		Paged<DataPoint> paged = new Paged<DataPoint>() {

			@Override
			public String getSql() {
				String sql = "FROM DataPoint a WHERE a.point.id = :id ";
				if (!StringUtils.isBlank(code)) {
					sql += " AND a.subTagType.tagType.code = :code";
				}
				return sql;
			}

			@Override
			public String[] getColumns() {
				if (StringUtils.isBlank(code)) {
					return new String[] { "id" };
				} else {
					return new String[] { "id", "code" };
				}
			}

			@Override
			public Object[] getVals() {
				if (StringUtils.isBlank(code)) {
					return new Object[] { id };
				} else {
					return new Object[] { id, code };
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
			public Class<DataPoint> getClazz() {
				return DataPoint.class;
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

	public DataPoint load(Long id) {
		return baseDao.load(DataPoint.class, id);
	}

	public void saveDataPointDefault(Long id) {
		DataPoint dataPoint = load(id);

		List<DataPoint> olderDefaults = findDefaultsByCode(dataPoint.getPoint().getStation().getCode());
		for (DataPoint older : olderDefaults) {
			older.setIsDefault(false);
		}

		dataPoint.setIsDefault(true);
	}

	// just for older version
	@Deprecated
	public List<DataPoint> findDefaultsByCode(String code) {
		return baseDao.findByNamedQuery(DataPoint.class, "DataPoint.findDefaultByCode", new String[] { "code" }, new Object[] { code });
	}

	public DataPoint findDefaultByCode(String code) {
		DataPoint dataPoint = baseDao.findOneByNamedQuery(DataPoint.class, "DataPoint.findDefaultByCode", new String[] { "code" }, new Object[] { code });
		if (dataPoint != null) {
			dataPoint.setParentCurrentId(dataPoint.getPoint().getCurrentId());
			dataPoint.setParentGuid(dataPoint.getPoint().getGuid());
		}
		return dataPoint;
	}

	public List<DataPoint> loadAllDataPointsByPointId(Long pointId) {
		return baseDao.findByNamedQuery(DataPoint.class, "DataPoint.loadByPoint", new String[] { "pointId" }, new Object[] { pointId });
	}
}
