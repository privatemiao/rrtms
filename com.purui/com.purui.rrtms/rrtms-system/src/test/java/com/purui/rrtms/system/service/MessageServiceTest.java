package com.purui.rrtms.system.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.Message;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class MessageServiceTest {
	@Resource
	MessageService messageService;

	@Test
	public void testSaveMessage() {
		Message message = new Message("Here is Title", "Here is content!");
		messageService.saveMessage(message);
		System.out.println(message);
	}
	
	@Test
	public void testSearch(){
		Map<String, Object> map = new HashMap<>();
		Page page = new Page();
		page.setSkip(10);
		page.setOrderBy("insertTime");
		map.put("page", page);
		
		Paged<Message> paged = messageService.search(map);
		for (Message message : paged.getData()){
			System.out.println(message);
		}
	}

}
