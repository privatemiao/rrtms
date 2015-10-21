package com.purui.rrtms.system.ctrl;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.JsonResponse;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.security.domain.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.UserProfile;
import com.purui.rrtms.system.entity.User;
import com.purui.rrtms.system.service.SystemService;
import com.purui.rrtms.system.service.UserService;

@Controller
@RequestMapping("/system/user/")
public class UserAction {
	@Resource
	private UserService userService;

	@Resource
	private SystemService systemService;

	@RequestMapping("userpage")
	public String userPage() {
		return "system/user";
	}

	@Authentication(value = "com.purui.rrtms.system.station.view", desc = "用户列表")
	@RequestMapping("users")
	@ResponseBody
	public JSonPageWrapper<User> query(Page page, String param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("param", param);
		Paged<User> paged = userService.query(map);
		return new JSonPageWrapper<>(paged);
	}

	@Authentication(value = "com.purui.rrtms.system.user.new", desc = "新增用户")
	@RequestMapping("new")
	@ResponseBody
	public JsonResponse newUser(User user) {
		userService.save(user);
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, null, JsonResponse.STATUS.SUCCESS);
	}

	@Authentication(value = "com.purui.rrtms.system.user.modify", desc = "编辑用户")
	@RequestMapping("modify")
	@ResponseBody
	public JsonResponse modifyUser(User user) {
		return newUser(user);
	}

	@Authentication(value = "com.purui.rrtms.system.user.remove", desc = "删除用户")
	@RequestMapping("remove")
	@ResponseBody
	public JsonResponse removeUser(Long... ids) {
		if (ids == null) {
			return new JsonResponse("没有要删除的项！", null, JsonResponse.STATUS.SUCCESS);
		}
		userService.remove(ids);
		return new JsonResponse(JsonResponse.MESSAGE_REMOVE_SUCCESS, null, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("current")
	@ResponseBody
	public User loadCurrentUser() {
		return userService.findByLoginId(systemService.getCurrentUser().getSecurityUser().getLoginId());
	}

	@RequestMapping(value = "profile", method = RequestMethod.POST)
	@ResponseBody
	public JsonResponse changeProfile(UserProfile profile) {
		userService.saveProfile(profile);
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}
}
