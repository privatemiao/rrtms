package com.purui.rrtms.system.ctrl;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.JsonResponse;
import org.mel.framework.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.Message;
import com.purui.rrtms.system.service.MessageService;

@Controller
@RequestMapping("/system/message/")
public class MessageAction {
	@Resource
	private MessageService messageService;

	@RequestMapping("publish")
	@ResponseBody
	public JsonResponse publish(Message message) {
		messageService.saveMessage(message);
		return new JsonResponse("发布成功！", message, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("list")
	@ResponseBody
	public JSonPageWrapper<Message> list(Page page) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		return new JSonPageWrapper<>(messageService.search(map));
	}

}