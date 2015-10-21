package org.mel.framework.exception;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mel.framework.domain.JsonResponse;
import org.mel.framework.util.GenericMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

@ControllerAdvice
public class ExceptionCtroller {
	final static Logger logger = LoggerFactory.getLogger(ExceptionCtroller.class);

	@ExceptionHandler
	public void handlerException(GenericException ex, HttpServletRequest request, HttpServletResponse response) {
		logger.debug(GenericMethod.generateGirl("GenericException Handler"));
		logger.error(ex.getMessage(), ex);

		response.setCharacterEncoding("UTF-8");

		if (GenericMethod.isAjaxRequest(request)) {
			ajaxError(response, ex);
		} else {
			if (ex.getCode() == GenericException.ERROR_CODE_SESSION_TIME_OUT_ERROR) {
				goToLoginPage(request, response);
			}else{
				pageError(request, response, ex);
			}
		}

	}

	@ExceptionHandler
	public void handler(Exception ex, HttpServletRequest request, HttpServletResponse response) {
		logger.debug(GenericMethod.generateGirl("Exception Handler"));
		logger.error(ex.getMessage(), ex);

		response.setCharacterEncoding("UTF-8");

		if (GenericMethod.isAjaxRequest(request)) {
			ajaxError(response, ex);
		} else {
			pageError(request, response, ex);
		}
	}

	private void pageError(HttpServletRequest request, HttpServletResponse response, Exception ex) {
		PrintWriter writer = null;
		try {
			String messageUTF = new String(ex.getMessage().getBytes(), "UTF-8");
			response.setContentType("text/html");
			writer = response.getWriter();
			writer.print(messageUTF);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			GenericMethod.close(writer);
		}
	}

	public void goToLoginPage(HttpServletRequest request, HttpServletResponse response) {
		try {
			response.sendRedirect(request.getContextPath() + "/loginpage");
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	private void ajaxError(HttpServletResponse response, Exception ex) {
		response.setContentType("Content-Type: application/json");
		response.setCharacterEncoding("UTF-8");
		OutputStream os = null;
		try {
			os = response.getOutputStream();
			JsonResponse resp = new JsonResponse(ex.getMessage(), JsonResponse.STATUS.ERROR);
			new ObjectMapper().writeValue(os, resp);
			os.flush();
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} finally {
			GenericMethod.close(os);
		}
	}
}
