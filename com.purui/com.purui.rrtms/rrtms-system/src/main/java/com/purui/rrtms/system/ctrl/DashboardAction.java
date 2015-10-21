package com.purui.rrtms.system.ctrl;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.service.DashboardService;

@Controller
@RequestMapping("/system/dashboard/")
public class DashboardAction {
	@Resource
	DashboardService dashboardService;

	@RequestMapping("stationbyarea")
	@ResponseBody
	public JSonPageWrapper<StationRun> stationByArea(String areaName, Boolean trade, Page page) {
		Map<String, Object> map = new HashMap<>();
		map.put("page", page);
		map.put("areaName", areaName);
		map.put("trade", trade);
		return new JSonPageWrapper<StationRun>(dashboardService.queryStationByArea(map));
	}

}
