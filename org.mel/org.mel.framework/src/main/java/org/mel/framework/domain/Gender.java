package org.mel.framework.domain;

public enum Gender {
	MALE, FEMALE;
	
	public String getDesc(){
		if (this == FEMALE){
			return "女";
		}else{
			return "男";
		}
	}
	
}
