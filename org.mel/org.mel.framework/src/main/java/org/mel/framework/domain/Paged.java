package org.mel.framework.domain;

import java.util.Collections;
import java.util.List;

public abstract class Paged<T> {
	private List<T> data = Collections.emptyList();
	private int maxCount = 0;

	public abstract Class<T> getClazz();

	public String getSql() {
		return null;
	}

	public abstract int getCount();

	public String getOrderBy() {
		return null;
	};

	public String getSortBy() {
		return null;
	};

	public String[] getColumns() {
		return null;
	}

	public Object[] getVals() {
		return null;
	}

	/**
	 * 开始记录行数
	 * 
	 * @return
	 */
	public abstract int getStartPosition();

	public List<T> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}

	public int getMaxCount() {
		return maxCount;
	}

	public void setMaxCount(int maxCount) {
		this.maxCount = maxCount;
	}

}
