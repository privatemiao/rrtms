package org.mel.security.filter;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.mel.framework.util.SpringContextUtil;
import org.mel.security.service.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SecuritySessionListener implements HttpSessionListener {
	private Logger logger = LoggerFactory.getLogger(SecuritySessionListener.class);

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		logger.debug(">>>>>>>>>Session Create<<<<<<<<<<<");
		logger.debug("create session " + event.getSession().getId());
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		logger.debug(">>>>>>>>>Session Destroy<<<<<<<<<<<");
		logger.debug("remove session " + event.getSession().getId());
		((SecurityService) SpringContextUtil.getBean("securityService")).logout(event.getSession().getId());
	}

}
