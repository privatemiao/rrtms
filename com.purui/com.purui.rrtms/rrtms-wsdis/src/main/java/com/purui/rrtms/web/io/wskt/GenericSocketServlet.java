package com.purui.rrtms.web.io.wskt;

import javax.servlet.http.HttpServletRequest;

import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GenericSocketServlet extends WebSocketServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected Logger logger = LoggerFactory.getLogger(GenericSocketServlet.class);

	@Override
	protected StreamInbound createWebSocketInbound(String subProtocol, HttpServletRequest request) {
		 return new GenericWebSocket(request.getSession().getId());
	}
	
	


}