package org.mel.framework.domain;

public class JsonResponse {
	public enum STATUS {
		SUCCESS, FAILURE, ERROR
	}

	public static final String MESSAGE_SAVE_SUCCESS = "保存成功！";
	public static final String MESSAGE_SAVE_FAILURE = "保存失败！";

	public static final String MESSAGE_REMOVE_SUCCESS = "删除成功！";
	public static final String MESSAGE_REMOVE_FAILURE = "删除失败！";
	
	public static final String MESSAGE_EXECUTE_SUCCESS = "执行成功！";
	public static final String MESSAGE_EXECUTE_FAILURE = "执行失败！";

	private String message;

	private Object result;

	private STATUS status;

	public JsonResponse() {
	}

	public JsonResponse(String message, Object result, STATUS status) {
		this.message = message;
		this.result = result;
		this.status = status;
	}

	public JsonResponse(String message, STATUS status) {
		this.message = message;
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	public STATUS getStatus() {
		return status;
	}

	public void setStatus(STATUS status) {
		this.status = status;
	}

}
