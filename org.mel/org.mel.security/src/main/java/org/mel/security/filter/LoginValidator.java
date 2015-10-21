package org.mel.security.filter;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mel.framework.exception.DirtySessionException;
import org.mel.framework.exception.SessionTimeoutException;
import org.mel.framework.util.GenericMethod;
import org.mel.security.service.SecurityService;
import org.slf4j.Logger;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class LoginValidator implements HandlerInterceptor {
	private Logger logger = org.slf4j.LoggerFactory.getLogger(LoginValidator.class);
	private List<String> ignoreUri = new ArrayList<String>();
	private String defaultPage;

	@Resource
	private SecurityService securityService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		String uri = request.getRequestURI();
		uri = uri.substring(request.getContextPath().length());

		logger.debug("URI>>" + uri + ">>isAjax>>" + GenericMethod.isAjaxRequest(request));
		
		logger.debug("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
		Enumeration<?> names = request.getParameterNames();
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			logger.debug(name + " - " + request.getParameter(name));
		}
		logger.debug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

		if (uri.startsWith("/WEB-INF/page") || uri.startsWith("/resources")) {
			// logger.debug("--------------------------------------ignored resource.");
			return true;
		}

		if (ignoreUri.contains(uri)) {
			// logger.debug("--------------------------------------ignored uri.");
			return true;
		} else {
			if (securityService.hasLogin()) {
				// logger.debug("--------------------------------------loged on.");
				return true;
			} else {
				// logger.debug("--------------------------------------not loged on.");
				if (securityService.isDirty(request.getSession().getId())){
					throw new DirtySessionException();
				}else{
					throw new SessionTimeoutException();
				}
			}
		}
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

	}

	public List<String> getIgnoreUri() {
		return ignoreUri;
	}

	public void setIgnoreUri(List<String> ignoreUri) {
		this.ignoreUri = ignoreUri;
	}

	public String getDefaultPage() {
		return defaultPage;
	}

	public void setDefaultPage(String defaultPage) {
		this.defaultPage = defaultPage;
	}

}
