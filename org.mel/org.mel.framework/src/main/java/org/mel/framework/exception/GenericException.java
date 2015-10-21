package org.mel.framework.exception;

public abstract class GenericException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public GenericException() {
		super("未知错误！");
	}

	public GenericException(String message) {
		super(message);
	}

	public GenericException(String message, Throwable cause) {
		super(message, cause);
	}

	public GenericException(Throwable cause) {
		super(cause);
	}

	public abstract int getCode();
	
	public static final int ERROR_CODE_DB_ACCESS_ERROR = -1;
	public static final int ERROR_CODE_SESSION_TIME_OUT_ERROR = -2;
	public static final int ERROR_CODE_NO_PERMISSION_ERROR = -3;
	public static final int ERROR_CODE_LOGINID_PASSWORD_ERROR = -4;
	public static final int ERROR_CODE_DIRTY_SESSION = -5;
}
