package com.purui.rrtms.system.ctrl;

import java.util.List;

import javax.annotation.Resource;

import org.mel.framework.domain.JsonResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.entity.SecurityCode;
import com.purui.rrtms.system.service.SystemService;

@Controller
@RequestMapping("system/security/")
public class SecurityCodeAction {
	@Resource
	private SystemService systemService;

	@RequestMapping("page")
	public String securityPage() {
		return "system/security";
	}

	@RequestMapping("securitycodes")
	@ResponseBody
	public List<SecurityCode> getAllSecurityCode() {
		return systemService.getAllSecurityCode();
	}

	@RequestMapping("new")
	@ResponseBody
	public JsonResponse saveSecurityCode(SecurityCode code) {
		systemService.saveSecurityCode(code);
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}
	
	@RequestMapping("modify")
	@ResponseBody
	public JsonResponse modifySecurityCode(SecurityCode code) {
		saveSecurityCode(code);
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("remove")
	@ResponseBody
	public JsonResponse removeSecurityCode(Long... id) {
		systemService.removeSecurityCode(id);
		return new JsonResponse(JsonResponse.MESSAGE_REMOVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}
}
