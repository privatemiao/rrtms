package com.purui.rrtms.web.io.wskt;

import java.io.Serializable;
import java.util.Arrays;

public class Command implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String SUBSCRIBE = "SUBSCRIBE";
	public static final String UNSUBSCRIBE = "UNSUBSCRIBE";
	public static final String PUBLISH = "PUBLISH";
	public static final String HEART_BEAT = "HEARTBEAT";
	private String actionType;
	private String[] channel;
	private String message;

	public Command() {
	}

	public String[] getChannel() {
		return channel;
	}

	public void setChannel(String[] channel) {
		this.channel = channel;
	}

	public String getActionType() {
		return actionType;
	}

	public void setActionType(String actionType) {
		this.actionType = actionType;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "Command [actionType=" + actionType + ", channel=" + Arrays.toString(channel) + ", message=" + message + "]";
	}

}
