package org.mel.framework.domain;

public enum UserType {
	GOVERNMENT, ENTERPRISE, INTERNAL, POWER, PROVIDER;
	public String getDesc() {
		String desc = "";
		switch (this) {
		case GOVERNMENT:
			desc = "政府用户";
			break;
		case ENTERPRISE:
			desc = "企业用户";
			break;
		case INTERNAL:
			desc = "内部用户";
			break;
		case POWER:
			desc = "供电公司";
			break;
		case PROVIDER:
			desc = "服务商";
			break;
		default:
			desc = "未指定";
			break;
		}
		return desc;
	}

	public static void main(String[] args) {
		System.out.println(UserType.ENTERPRISE.getDesc());
		System.out.println(UserType.GOVERNMENT.getDesc());
		System.out.println(UserType.INTERNAL.getDesc());
		System.out.println(UserType.valueOf("ENTERPRISE").getDesc());
	}
}
