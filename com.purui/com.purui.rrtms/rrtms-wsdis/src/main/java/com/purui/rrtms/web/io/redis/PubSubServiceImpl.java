package com.purui.rrtms.web.io.redis;

import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
 * 
 * 发布与订阅 <code>Redis<code> 服务
 * 
 * @author Mel
 * 
 */
@Component("pubSubService")
public class PubSubServiceImpl implements PubSubService {
	protected static final Logger logger = LoggerFactory.getLogger(PubSubServiceImpl.class);
	@Resource
	private JedisPool jedisPool;
	private Jedis subscriber;
	private Jedis publisher;
	private SubscribeListener listener = new SubscribeListener();

	STATUS status = STATUS.WAIT_FOR_INIT;

	/**
	 * 订阅一个主题
	 * 
	 * @param channel
	 *            主题
	 */
	@Override
	public void subscribe(final String channel) {
		if (!status.equals(STATUS.READY)) {
			recover();
			try {
				Thread.sleep(2);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		if (!listener.isSubscribed()) {
			throw new RuntimeException("Redis listener unvalidable!");
		}
		try {
			Thread.sleep(1);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		try {
			logger.debug("Call listener.subscribe - " + channel);
			listener.subscribe(channel);
		} catch (Exception e) {
			status = STATUS.BROKEN;
			logger.error(e.getMessage(), e);
		}
	}

	public void recoverEnforce() {
		this.status = STATUS.INIT;
		recover();
	}

	public synchronized void recover() {
		logger.debug("recover...");
		if (status.equals(STATUS.READY)) {
			logger.debug("The redis's status is ready, return void.");
			return;
		}
		jedisPool.returnBrokenResource(subscriber);
		subscriber = null;
		subscriber = jedisPool.getResource();
		status = STATUS.INIT;
		new Thread(new Runnable() {

			@Override
			public void run() {
				try {
					logger.debug("重新预订阅主题...");
					subscriber.subscribe(listener, "~~~~~~~");
				} catch (Exception e) {
					logger.error(e.getMessage(), e);
					logger.error("预订阅退出...");
					status = STATUS.BROKEN;
				}
			}
		}).start();
		status = STATUS.READY;
		logger.debug("recover done");
	}

	/**
	 * 按照匹配模式订阅主题<br>
	 * <code>XXX.*</code> 可以订阅所有以 <code>XXX.</code> 开头的主题
	 * 
	 * @param pattern
	 *            regex
	 */
	@Override
	public void subscribePattern(final String pattern) {
		if (!status.equals(STATUS.READY)) {
			recover();
			try {
				Thread.sleep(2);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		if (!listener.isSubscribed()) {
			throw new RuntimeException("Redis listener unavailable!");
		}
		try {
			Thread.sleep(1);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		try {
			logger.debug("Call listener.psubscribe - " + pattern);
			listener.psubscribe(pattern);
		} catch (Exception e) {
			status = STATUS.BROKEN;
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 发布信息
	 * 
	 * @param channel
	 *            主题
	 * @param message
	 *            内容
	 */
	@Override
	public void publish(String channel, String message) {
		if (message == null) {
			message = "";
		}

		try {
			publisher = jedisPool.getResource();
			publisher.publish(channel, message);
		} finally {
			if (publisher != null) {
				jedisPool.returnResource(publisher);
			}
		}
	}

	@PostConstruct
	protected void init() {
		subscriber = jedisPool.getResource();
		status = STATUS.INIT;
		new Thread(new Runnable() {

			@Override
			public void run() {
				try {
					logger.debug("预订阅主题...");
					subscriber.subscribe(listener, "~~~~~~~");
				} catch (Exception e) {
					logger.error(e.getMessage(), e);
					logger.error("预订阅退出...");
					status = STATUS.BROKEN;
				}
			}
		}).start();
		status = STATUS.READY;
	}

	@PreDestroy
	protected void destroy() {
		if (subscriber != null) {
			jedisPool.returnResource(subscriber);
		}
		if (publisher != null) {
			jedisPool.returnResource(publisher);
		}
	}

	@Override
	public int subscribe() {
		return this.listener.getSubscribedChannels();
	}

	@Override
	public void unsubscribe(String... channels) {
		if (channels != null) {
			listener.unsubscribe(channels);
		}
	}

	@Override
	public void unsubscribePattern(String... patterns) {
		if (patterns != null) {
			listener.punsubscribe(patterns);
		}
	}

	enum STATUS {
		WAIT_FOR_INIT, INIT, READY, BROKEN
	}

	public void status() {
		System.out.println(status);
	}

	@Override
	public String getRedisData(String subject) {
		Jedis resource = null;
		String result = null;
		try {
			resource = jedisPool.getResource();
			result = resource.get(subject);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			jedisPool.returnBrokenResource(resource);
		} finally {
			if (resource != null) {
				jedisPool.returnResource(resource);
			}
		}
		return result;
	}

	@Override
	public void addClientId(String clientId) {
		Jedis resource = null;
		try {
			resource = jedisPool.getResource();
			resource.sadd("clientId", clientId);
			Set<String> list = resource.smembers("clientId");
			for (String s : list) {
				System.out.println(">>>>" + s);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			jedisPool.returnBrokenResource(resource);
		} finally {
			if (resource != null) {
				jedisPool.returnResource(resource);
			}
		}
	}

}
