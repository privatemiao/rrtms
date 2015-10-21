package org.mel.framework.exception;

public class SessionTimeoutException extends GenericException{

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public SessionTimeoutException() {
		super("没有登录或者超时！");
	}

	public SessionTimeoutException(String message, Throwable cause) {
		super(message, cause);
	}

	public SessionTimeoutException(String message) {
		super(message);
	}

	public SessionTimeoutException(Throwable cause) {
		super(cause);
	}

	@Override
	public int getCode() {
		return GenericException.ERROR_CODE_SESSION_TIME_OUT_ERROR;
	}

}
