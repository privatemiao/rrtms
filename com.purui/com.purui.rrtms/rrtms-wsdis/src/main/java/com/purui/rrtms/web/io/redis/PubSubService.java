package com.purui.rrtms.web.io.redis;

public interface PubSubService {

	/**
	 * 订阅一个主题
	 * 
	 * @param channel
	 *            主题
	 */
	public abstract void subscribe(String channel);

	public abstract void unsubscribe(String... channels);

	/**
	 * 按照匹配模式订阅主题<br>
	 * <code>PUHUA.*</code> 可以订阅所以以 <code>PUHUA.</code> 开头的主题
	 * 
	 * @param pattern
	 *            regex
	 */
	public abstract void subscribePattern(String pattern);

	public abstract void unsubscribePattern(String... patterns);

	/**
	 * 发布信息
	 * 
	 * @param channel
	 *            主题
	 * @param message
	 *            内容
	 */
	public abstract void publish(String channel, String message);

	public abstract int subscribe();

	public abstract void status();

	public abstract void recoverEnforce();

	public abstract String getRedisData(String subject);
	
	public abstract void addClientId(String clientId);

}