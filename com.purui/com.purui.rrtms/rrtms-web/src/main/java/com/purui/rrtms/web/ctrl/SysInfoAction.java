package com.purui.rrtms.web.ctrl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.mel.security.domain.IUser;
import org.mel.security.service.SecurityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/sysinfo")
public class SysInfoAction {
	@Resource
	private SecurityService securityService;

	@RequestMapping("session")
	@ResponseBody
	public List<IUser> cachedUser() {
		Map<String, IUser> cachedUser = securityService.getCachedUser();
		List<IUser> users = new ArrayList<>();
		
		Set<String> keys = cachedUser.keySet();
		for (String key : keys){
			users.add(cachedUser.get(key));
		}
		return users;
	}
}
