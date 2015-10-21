package com.purui.rrtms.system.ctrl;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.JsonResponse;
import org.mel.security.domain.Authentication;
import org.mel.security.entity.SecurityRole;
import org.mel.security.service.SecurityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/system/role")
public class RoleAction {
	@Resource
	private SecurityService securityService;

	@RequestMapping("rolepage")
	public String showRolePage() {
		return "system/role";
	}

	@Authentication(value = "org.mel.generic.security.role", desc = "角色列表")
	@RequestMapping("roles")
	@ResponseBody
	public JSonPageWrapper<SecurityRole> roles() {
		return new JSonPageWrapper<SecurityRole>(securityService.getAllRoles());
	}

	@Authentication(value = "org.mel.generic.security.role.new", desc = "新增角色")
	@RequestMapping("new")
	@ResponseBody
	public JsonResponse newRole(SecurityRole role) {
		securityService.saveRole(role);
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}

	@Authentication(value = "org.mel.generic.security.role.modify", desc = "编辑角色")
	@RequestMapping("modify")
	@ResponseBody
	public JsonResponse modifyRole(SecurityRole role) {
		return newRole(role);
	}

	@Authentication(value = "org.mel.generic.security.role.remove", desc = "删除角色")
	@RequestMapping("remove")
	@ResponseBody
	public JsonResponse removeRole(Long... ids) {
		if (ids == null) {
			return new JsonResponse("没有要删除的项！", JsonResponse.STATUS.FAILURE);
		}
		securityService.removeRole(ids);
		return new JsonResponse(JsonResponse.MESSAGE_REMOVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}

}
