package org.mel.framework.dao;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.Paged;
import org.mel.framework.exception.DBAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class BaseDao {
	protected Logger logger = LoggerFactory.getLogger(BaseDao.class);
	@PersistenceContext
	private EntityManager em;

	public void persist(Object o) {
		em.persist(o);
	}

	public void merge(Object o) {
		em.merge(o);
	}

	public <T> T load(Class<T> clazz, Serializable id) {
		return em.find(clazz, id);
	}

	public <T> void remove(Class<T> clazz, Serializable id) {
		em.remove(em.getReference(clazz, id));
	}

	public void remove(Object obj) {
		em.remove(obj);
	}

	public <T> List<T> findByNamedQuery(Class<T> clazz, String queryName) {
		return findByNamedQuery(clazz, queryName, null, null);
	}

	public <T> List<T> findByNamedQuery(Class<T> clazz, String queryName, String[] params, Object[] vals) {
		TypedQuery<T> query = em.createNamedQuery(queryName, clazz);
		if (params != null && params.length != 0) {
			if (params.length != vals.length) {
				throw new DBAccessException("Param's amount must equals Values's!");
			}
			int index = 0;
			for (String param : params) {
				query.setParameter(param, vals[index++]);
			}
		}
		return query.getResultList();
	}

	public <T> T findOneByNamedQuery(Class<T> clazz, String queryName) {
		return findOneByNamedQuery(clazz, queryName, null, null);
	}

	public <T> T findOneByNamedQuery(Class<T> clazz, String queryName, String[] params, Object[] vals) {
		TypedQuery<T> query = em.createNamedQuery(queryName, clazz);
		if (params != null && params.length != 0) {
			if (params.length != vals.length) {
				throw new DBAccessException("Param's amount must equals Values's!");
			}
			int index = 0;
			for (String param : params) {
				query.setParameter(param, vals[index++]);
			}
		}
		List<T> list = query.getResultList();

		if (list == null || list.size() == 0) {
			return null;
		}

		if (list.size() > 1) {
			throw new DBAccessException("There are multile result!");
		}

		return list.get(0);
	}

	public void executeByNamedQuery(String queryName, String[] params, Object[] vals) {
		Query query = em.createNamedQuery(queryName);
		if (params != null && params.length != 0) {
			if (params.length != vals.length) {
				throw new DBAccessException("Param's amount must equals Values's!");
			}
			int index = 0;
			for (String param : params) {
				query.setParameter(param, vals[index++]);
			}
		}
		query.executeUpdate();
	}

	public <T> void search(Paged<T> paged) {
		fetchMaxCount(paged);
		TypedQuery<T> query = em.createQuery(paged.getSql() + (StringUtils.isBlank(paged.getOrderBy()) ? "" : (" ORDER BY " + paged.getOrderBy() + " " + paged.getSortBy())), paged.getClazz());
		logger.debug("BaseDao>>search>>SQL>>" + paged.getSql());
		if (paged.getColumns() != null && paged.getColumns().length != 0) {
			if (paged.getColumns().length != paged.getVals().length) {
				throw new DBAccessException("Param's amount must equals Values's!");
			}
			int index = 0;
			for (String param : paged.getColumns()) {
				query.setParameter(param, paged.getVals()[index++]);
			}
		}
		query.setFirstResult(paged.getStartPosition());
		if (paged.getCount() != -1) {
			query.setMaxResults(paged.getCount());
		}

		paged.setData(query.getResultList());
	}

	public <T> void fetchMaxCount(Paged<T> paged) {
		String sql = paged.getSql().trim();
		int fromIndex = sql.toLowerCase().indexOf("from");
		if (fromIndex != -1) {
			sql = sql.substring(fromIndex);
		}

		TypedQuery<Long> query = em.createQuery("SELECT COUNT (*) " + sql, Long.class);
		if (paged.getColumns() != null && paged.getColumns().length != 0) {
			if (paged.getColumns().length != paged.getVals().length) {
				throw new DBAccessException("Param's amount must equals Values's!");
			}
			int index = 0;
			for (String param : paged.getColumns()) {
				query.setParameter(param, paged.getVals()[index++]);
			}
		}
		paged.setMaxCount(query.getSingleResult().intValue());
	}

	public static void main(String[] args) {
		String sql = " SELECT a FROM User u";
		System.out.println(sql.substring(sql.indexOf("FROM")));
	}

}
