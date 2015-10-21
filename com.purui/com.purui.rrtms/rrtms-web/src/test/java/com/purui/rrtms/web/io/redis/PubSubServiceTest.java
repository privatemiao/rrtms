package com.purui.rrtms.web.io.redis;

import org.junit.Test;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class PubSubServiceTest {
	protected static final String SUBJECT = "MEL-1";

	@Test
	public void publisher() {
		JedisPoolConfig poolConfig = new JedisPoolConfig();
		JedisPool jedisPool = new JedisPool(poolConfig, "localhost", 6379, 0);
		final Jedis publisher = jedisPool.getResource();

		new Thread(new Runnable() {

			@Override
			public void run() {

				while (true) {
					publisher.publish(SUBJECT, "" + System.currentTimeMillis());
					try {
						Thread.sleep(1000);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}

			}
		}).start();

		while (true) {
			try {
				Thread.sleep(Long.MAX_VALUE);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	@Test
	public void testGet(){
		Jedis j = new Jedis("192.168.1.211");
		String string = j.get("PUHUA.rt.1");
		System.out.println(string);
	}

}
