package com.purui.rrtms.system.service;

import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.dao.BaseDao;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.entity.Company;

@Service
public class CompanyService {
	@Resource
	private BaseDao baseDao;

	public Paged<Company> query(Map<String, Object> map) {
		final Page page = (Page) map.get("page");
		Paged<Company> paged = new Paged<Company>() {

			@Override
			public Class<Company> getClazz() {
				return Company.class;
			}

			@Override
			public String getSql() {
				return "FROM Company";
			}

			@Override
			public int getCount() {
				return page.getCount();
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
			public int getStartPosition() {
				return page.getSkip();
			}
		};
		baseDao.search(paged);
		return paged;
	}
}
