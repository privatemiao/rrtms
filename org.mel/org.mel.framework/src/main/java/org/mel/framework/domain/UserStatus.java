package org.mel.framework.domain;

/**
 * AUDIT - 审核; NORMAL - 正常; FORBID - 禁用; DEPARTURE - 离职; PURGED - 已删除
 * 
 * @author Mel
 * 
 */
public enum UserStatus {
	AUDIT, NORMAL, FORBID, DEPARTURE, PURGED;

	public String getdesc() {
		String str = "";
		switch (this) {
		case AUDIT:
			str = "审核";
			break;
		case NORMAL:
			str = "正常";
			break;
		case FORBID:
			str = "禁用";
			break;
		case DEPARTURE:
			str = "离职";
			break;
		case PURGED:
			str = "已删除";
			break;

		default:
			break;
		}

		return str;
	}
}