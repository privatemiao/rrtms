package com.purui.rrtms.system.service;

import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.security.domain.CachedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.domain.Message;
import com.purui.rrtms.system.utils.MongoDBUtil;

@Service
public class MessageService {
	@Resource
	private MongoDBUtil mongoDBUtil;
	@Resource
	private SystemService systemService;

	protected static final Logger logger = LoggerFactory.getLogger(DataPointService.class);
	
	public void saveMessage(Message message){
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		message.setInsertTime(new Date());
		CachedUser user = systemService.getCurrentUser();
		message.setName(user.getName());
		message.setUserId(user.getSecurityUser().getId());
		mongoTemplate.save(message);
	}
	
	public Paged<Message> search(Map<String, Object> map){
		final Page page = (Page) map.get("page");
		
		page.setOrderBy("insertTime");
		page.setSortBy("DESC");
		
		Paged<Message> paged = new Paged<Message>() {

			@Override
			public Class<Message> getClazz() {
				return Message.class;
			}

			@Override
			public int getCount() {
				return page.getCount();
			}

			@Override
			public int getStartPosition() {
				return page.getSkip();
			}

			@Override
			public String getOrderBy() {
				return page.getOrderBy();
			}

			@Override
			public String getSortBy() {
				return page.getSortBy();
			}
			
		};
		
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query();
		query.skip(page.getSkip()).limit(page.getCount());
		query.with(new Sort(Sort.Direction.DESC, page.getOrderBy()));
		logger.debug("SQL>>" + query.getQueryObject());
		paged.setMaxCount(new Long(mongoTemplate.count(query, Message.class)).intValue());
		paged.setData(mongoTemplate.find(query, Message.class));
		return paged;
	}
}
