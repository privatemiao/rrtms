package com.purui.rrtms.system.ctrl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.framework.util.GlobalVariables;
import org.mel.security.domain.CachedUser;
import org.mel.security.domain.Menu;
import org.mel.security.entity.SecurityRole;
import org.mel.security.service.SecurityService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.PlatformStatus;
import com.purui.rrtms.system.entity.City;
import com.purui.rrtms.system.entity.Company;
import com.purui.rrtms.system.entity.Industry;
import com.purui.rrtms.system.entity.Province;
import com.purui.rrtms.system.entity.TagType;
import com.purui.rrtms.system.entity.User;
import com.purui.rrtms.system.entity.WarnType;
import com.purui.rrtms.system.service.CompanyService;
import com.purui.rrtms.system.service.DicService;
import com.purui.rrtms.system.service.SystemService;

@Controller
@RequestMapping("/system/")
public class SystemAction {
	@Resource
	private SecurityService securityService;
	@Resource
	private CompanyService companyService;
	@Resource
	private SystemService systemService;
	@Resource
	private DicService dicService;
	@Resource
	private GlobalVariables globalVariables;

	@RequestMapping(value = "menus", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Menu getPersonalMenu() {
		return securityService.getPersonalMenu();
	}

	@RequestMapping(value = "allmenus", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Menu getAllMenu() {
		return securityService.getAllMenu();
	}

	@RequestMapping("companys")
	@ResponseBody
	public JSonPageWrapper<Company> companys(Page page) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);

		Paged<Company> paged = companyService.query(map);

		return new JSonPageWrapper<>(paged);
	}

	@RequestMapping("roles")
	@ResponseBody
	public List<SecurityRole> getAllRoles() {
		return securityService.getAllRoles();
	}

	@RequestMapping("provinces")
	@ResponseBody
	public List<Province> getAllProvinces() {
		return systemService.loadAllProvinces();
	}

	@RequestMapping("province/{id}")
	@ResponseBody
	public Province loadProvince(@PathVariable("id") Long id) {
		return systemService.loadProvince(id);
	}

	@RequestMapping("city/{id}")
	@ResponseBody
	public City loadCity(@PathVariable("id") Long id) {
		return systemService.loadCity(id);
	}

	@RequestMapping("tagtypes")
	@ResponseBody
	public List<TagType> loadTagTypes() {
		return systemService.loadTagTypes();
	}

	@RequestMapping("current")
	@ResponseBody
	public User getCurrentUser() {
		CachedUser cachedUser = systemService.getCurrentUser();
		User user = (User) cachedUser.getData(User.class.getCanonicalName());
		return user;
	}

	@RequestMapping("warntypes")
	@ResponseBody
	public List<WarnType> getAllWarnType() {
		return systemService.getAllWarnType();
	}

	@RequestMapping("industries")
	@ResponseBody
	public List<Industry> getIndustry() {
		return dicService.getIndustry();
	}

	@RequestMapping("globalvariables")
	@ResponseBody
	public GlobalVariables globalVariables() {

		return globalVariables;
	}

	@RequestMapping("platformstatus")
	@ResponseBody
	public PlatformStatus platformStatus() {
		return systemService.platformStatus();
	}
	
	@RequestMapping("stationcount")
	@ResponseBody
	public int stationCount(){
		return systemService.stationCount();
	}
	
}
