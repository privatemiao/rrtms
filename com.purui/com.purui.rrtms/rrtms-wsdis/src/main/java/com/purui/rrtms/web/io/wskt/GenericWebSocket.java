package com.purui.rrtms.web.io.wskt;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.WsOutbound;
import org.apache.commons.lang3.StringUtils;
import org.mel.framework.util.SpringContextUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.purui.rrtms.web.io.redis.PubSubService;

public class GenericWebSocket extends MessageInbound {
	final static Logger logger = LoggerFactory.getLogger(GenericWebSocket.class);
	private String sessionId;

	public GenericWebSocket(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	private boolean validateCommand(Command cmd) {
		if (cmd == null) {
			writeMessage(-1, "UNKNOWN", "请检测参数！");
			return false;
		}

		if (StringUtils.isBlank(cmd.getActionType())) {
			writeMessage(-1, "UNKNOWN", "ActionTyoe can not be null!");
			return false;
		}

		if ((cmd.getChannel() == null || cmd.getChannel().length == 0) && !cmd.getActionType().equals(Command.HEART_BEAT)) {
			writeMessage(-1, cmd.getActionType(), "Channel can not be null");
			return false;
		}

		return true;
	}

	public void writeMessage(int result, String actionType, String message) {
		StringBuffer buffer = new StringBuffer();
		if ("RECEIVE".equals(actionType)) {
			buffer.append(message);
		} else {
			buffer.append("{").append("\"result\" : ").append(result).append(", ").append("\"actionType\" : \"").append(actionType).append("\", ").append("\"message\" : \"").append(message)
					.append("\"}");
		}
//		logger.debug("Write Message {}", buffer.toString());
		try {
			this.getWsOutbound().writeTextMessage(CharBuffer.wrap(buffer.toString()));
			this.getWsOutbound().flush();
		} catch (IOException e) {
			logger.debug(e.getMessage(), e);
		}
	}

	public void writeMessage(String message) {
		writeMessage(1, "RECEIVE", message);
	}

	@Override
	protected void onBinaryMessage(ByteBuffer message) throws IOException {
	}

	@Override
	protected void onTextMessage(CharBuffer message) throws IOException {
		logger.debug("OnText - " + message);
		ObjectMapper mapper = new ObjectMapper();
		Command cmd;
		try {
			cmd = mapper.readValue(message.toString(), Command.class);
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}

		if (!validateCommand(cmd)) {
			return;
		}

		if (cmd != null) {
			logger.debug(cmd.toString());
		}

		switch (cmd.getActionType()) {
		case Command.SUBSCRIBE:
			((WebSocketPool) SpringContextUtil.getBean("webSocketPool")).bind(cmd.getChannel(), this);
			writeMessage(1, Command.SUBSCRIBE, "订阅成功！");
			break;
		case Command.UNSUBSCRIBE:
			((WebSocketPool) SpringContextUtil.getBean("webSocketPool")).unbind(cmd.getChannel(), this);
			writeMessage(1, Command.SUBSCRIBE, "取消订阅成功！");
			break;
		case Command.PUBLISH:
			for (String channel : cmd.getChannel()) {
				((PubSubService) SpringContextUtil.getBean("pubSubService")).publish(channel, cmd.getMessage());
			}
			writeMessage(1, Command.PUBLISH, "发布成功！");
			break;
		case Command.HEART_BEAT:
			writeMessage(1, Command.HEART_BEAT, "链接成功！");
			break;
		default:
			writeMessage(-1, cmd.getActionType(), "未知命令！");
			break;
		}
	}

	@Override
	protected void onOpen(WsOutbound outbound) {
		logger.debug("WebSocket on open");
		writeMessage(1, "CONNECT", "连接成功！");
	}

	@Override
	protected void onClose(int status) {
		logger.debug("WebSocket onClose");
		((WebSocketPool) SpringContextUtil.getBean("webSocketPool")).unbind(this);
	}

}
