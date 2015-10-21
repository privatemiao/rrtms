package com.purui.rrtms.system.service;

import java.util.List;

import javax.annotation.Resource;

import org.mel.framework.dao.BaseDao;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.entity.Industry;
import com.purui.rrtms.system.entity.Org;

@Service
public class DicService {
	@Resource
	private BaseDao baseDao;

	public List<Industry> getIndustry() {
		return baseDao.findByNamedQuery(Industry.class, "Industry.findAll");
	}

	public List<Org> getOrg() {
		return baseDao.findByNamedQuery(Org.class, "Org.findAll");
	}
}
