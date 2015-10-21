package org.mel.framework.exception;

public class DBAccessException extends GenericException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DBAccessException() {
		super("访问数据错误！");
	}

	public DBAccessException(String message, Throwable cause) {
		super(message, cause);
	}

	public DBAccessException(String message) {
		super(message);
	}

	public DBAccessException(Throwable cause) {
		super(cause);
	}

	@Override
	public int getCode() {
		return GenericException.ERROR_CODE_DB_ACCESS_ERROR;
	}

}
