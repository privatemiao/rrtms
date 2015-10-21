package org.mel.framework.exception;

public class DirtySessionException extends GenericException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public int getCode() {
		return ERROR_CODE_DIRTY_SESSION;
	}

	public DirtySessionException() {
		super("您已在其它地方登录！");
	}

	public DirtySessionException(String message, Throwable cause) {
		super(message, cause);
	}

	public DirtySessionException(String message) {
		super(message);
	}

	public DirtySessionException(Throwable cause) {
		super(cause);
	}
	
	

}
