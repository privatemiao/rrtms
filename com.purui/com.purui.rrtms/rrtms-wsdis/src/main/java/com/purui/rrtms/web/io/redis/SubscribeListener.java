package com.purui.rrtms.web.io.redis;

import org.mel.framework.util.SpringContextUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import redis.clients.jedis.JedisPubSub;

import com.purui.rrtms.web.io.wskt.WebSocketPool;

public class SubscribeListener extends JedisPubSub {
	protected static final Logger logger = LoggerFactory.getLogger(SubscribeListener.class);

	@Override
	public void onMessage(String channel, String message) {
		int count = 0;
		try {
			count = ((WebSocketPool) SpringContextUtil.getBean("webSocketPool")).writerMessage(channel, message);
			logger.debug(channel + ">>" + message);
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
		}
		if (count == 0) {
			logger.debug(channel + ">>Count>>0>>unsubscribe.");
			this.unsubscribe(channel);
		}
	}

	@Override
	public void onPMessage(String pattern, String channel, String message) {
		int count = 0;
		try {
			count = ((WebSocketPool) SpringContextUtil.getBean("webSocketPool")).writerMessage(pattern, message);
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
		}
		if (count == 0) {
			logger.debug(pattern + ">>Count>>0>>punsubscribe.");
			this.punsubscribe(pattern);
		}
	}

	@Override
	public void onSubscribe(String channel, int subscribedChannels) {
		logger.debug("onSubscribe>>" + channel + ">> 共计订阅 " + subscribedChannels);
	}

	@Override
	public void onUnsubscribe(String channel, int subscribedChannels) {
		logger.debug("onUnsubscribe>>" + channel + ">> 共计取消订阅 " + subscribedChannels);
	}

	@Override
	public void onPUnsubscribe(String pattern, int subscribedChannels) {
		logger.debug("onPUnsubscribe>>" + pattern + ">> 共计取消订阅 " + subscribedChannels);
	}

	@Override
	public void onPSubscribe(String pattern, int subscribedChannels) {
		logger.debug("onPSubscribe>>" + pattern + ">> 共计订阅 " + subscribedChannels);
	}

}
