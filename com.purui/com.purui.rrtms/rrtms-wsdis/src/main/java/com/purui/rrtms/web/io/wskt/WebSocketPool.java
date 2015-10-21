package com.purui.rrtms.web.io.wskt;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.purui.rrtms.web.io.redis.PubSubService;

@Component("webSocketPool")
public class WebSocketPool {
	protected final static Logger logger = LoggerFactory.getLogger(WebSocketPool.class);
	@Resource
	private PubSubService pubSubService;

	private Map<String, ConcurrentLinkedQueue<GenericWebSocket>> indexedByChannel = new ConcurrentHashMap<String, ConcurrentLinkedQueue<GenericWebSocket>>();
	private Map<GenericWebSocket, String[]> indexedByWebSocket = new ConcurrentHashMap<GenericWebSocket, String[]>();

	public void bind(String[] channels, GenericWebSocket socket) {
		logger.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Binding...");

		String[] existChannels = indexedByWebSocket.get(socket);
		if (existChannels == null) {
			indexedByWebSocket.put(socket, channels);
		} else {
			List<String> existArray = new ArrayList<>(Arrays.asList(existChannels));
			for (String newChannel : channels) {
				if (!existArray.contains(newChannel)) {
					existArray.add(newChannel);
				}
			}
			indexedByWebSocket.put(socket, existArray.toArray(new String[] {}));
		}

		for (final String channel : channels) {
			ConcurrentLinkedQueue<GenericWebSocket> wss = indexedByChannel.get(channel);
			if (wss == null) {
				wss = new ConcurrentLinkedQueue<>();
				indexedByChannel.put(channel, wss);
			}
			try {
				logger.debug("提交订阅主题 - " + channel);
				if (channel.indexOf('*') == -1) {
					pubSubService.subscribe(channel);
				} else {
					pubSubService.subscribePattern(channel);
				}
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
			if (!wss.contains(socket)) {
				wss.add(socket);
			}
		}
		logger.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Bind success.");

	}

	public void unbind(GenericWebSocket socket) {
		String[] channels = indexedByWebSocket.get(socket);
		if (channels != null) {
			for (String channel : channels) {
				ConcurrentLinkedQueue<GenericWebSocket> wss = indexedByChannel.get(channel);
				if (wss != null) {
					wss.remove(socket);
				}
			}
		}
		indexedByWebSocket.remove(socket);

	}

	public void unbind(String[] channels, GenericWebSocket socket) {
		if (channels == null) {
			return;
		}
		for (String channel : channels) {
			if ("*".equals(channel)) {
				unbind(socket);
				return;
			}
			ConcurrentLinkedQueue<GenericWebSocket> wss = indexedByChannel.get(channel);
			if (wss == null) {
				continue;
			}
			wss.remove(socket);
		}
	}

	public int writerMessage(String channel, String message) {
		int count = 0;
		ConcurrentLinkedQueue<GenericWebSocket> wss = indexedByChannel.get(channel);
		if (wss == null) {
			return 0;
		}
		for (GenericWebSocket socket : wss) {
			count++;
			socket.writeMessage(message);
		}
		return count;
	}
}
