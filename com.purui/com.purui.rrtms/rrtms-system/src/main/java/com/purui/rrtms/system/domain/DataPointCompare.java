package com.purui.rrtms.system.domain;

import java.util.Comparator;

import com.purui.rrtms.system.entity.DataPoint;

public class DataPointCompare implements Comparator<DataPoint> {

	@Override
	public int compare(DataPoint o1, DataPoint o2) {
		if (new Integer(o1.getSubTagType().getCode()).intValue() >= new Integer(o2.getSubTagType().getCode()).intValue()) {
			return 1;
		} else {
			return -1;
		}
	}

}
