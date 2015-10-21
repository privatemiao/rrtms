package com.purui.rrtms.system.ctrl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.JsonResponse;
import org.mel.framework.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.Warn;
import com.purui.rrtms.system.domain.WarningSearchParam;
import com.purui.rrtms.system.service.WarningService;

@Controller
@RequestMapping("/system/warning/")
public class WarningAction {
	@Resource
	private WarningService warningService;

	@RequestMapping("history")
	@ResponseBody
	public JSonPageWrapper<Warn> queryHistory(WarningSearchParam param, Page page) {
		Map<String, Object> map = new HashMap<>();
		map.put("page", page);
		map.put("param", param);
		return new JSonPageWrapper<>(warningService.queryHistory(map));
	}

	@RequestMapping("configwarning")
	@ResponseBody
	public JsonResponse configWarning(String guid, Date date, String note) {
		warningService.configWarning(guid, date, note);
		return new JsonResponse(JsonResponse.MESSAGE_EXECUTE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}
}
