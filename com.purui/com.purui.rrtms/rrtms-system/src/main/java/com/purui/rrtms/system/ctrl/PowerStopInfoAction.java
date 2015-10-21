package com.purui.rrtms.system.ctrl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.CuoFengStopInfo;
import com.purui.rrtms.system.domain.LineStopInfo;
import com.purui.rrtms.system.service.StopInfoService;

/**
 * 停电信息查询
 * 
 * @author mel
 *
 */
@Controller
@RequestMapping("/system/powerstopinfo/")
public class PowerStopInfoAction {
	@Resource
	StopInfoService stopInfoService;

	@RequestMapping("page")
	public String linePage() {
		return "system/powerstopinfo/page";
	}

	@RequestMapping("queryline")
	@ResponseBody
	public Paged<LineStopInfo> queryLineStopInfo(Page page, Date startDate,
			Date endDate, Boolean available) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("startDate", startDate);
		map.put("endDate", endDate);
		map.put("available", available);

		return stopInfoService.queryLineStopInfo(map);
	}

	@RequestMapping("querycuofeng")
	@ResponseBody
	public Paged<CuoFengStopInfo> queryCuoFengStopInfo(Page page,
			Date startDate, Date endDate, Boolean available) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("startDate", startDate);
		map.put("endDate", endDate);
		map.put("available", available);
		return stopInfoService.queryCuoFengStopInfo(map);
	}
}
