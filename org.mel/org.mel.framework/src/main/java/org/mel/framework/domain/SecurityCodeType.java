package org.mel.framework.domain;

public enum SecurityCodeType {
	SWITCH;

	public String getDesc() {
		switch (this) {
		case SWITCH:
			return "开关";
		default:
			return "为止类型";
		}
	}
	
	public static void main(String[] args) {
		System.out.println(SWITCH.toString());
	}
}
