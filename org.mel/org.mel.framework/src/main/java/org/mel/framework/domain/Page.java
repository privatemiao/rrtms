package org.mel.framework.domain;

public class Page {
	private String orderBy;
	private String sortBy;
	private int count = 10;
	private int skip = 0;
	
	public Page() {
	}

	public Page(String orderBy, String sortBy, int count, int skip) {
		this.orderBy = orderBy;
		this.sortBy = sortBy;
		this.count = count;
		this.skip = skip;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public int getSkip() {
		return skip;
	}

	public void setSkip(int skip) {
		this.skip = skip;
	}

	@Override
	public String toString() {
		return "Page [orderBy=" + orderBy + ", sortBy=" + sortBy + ", count=" + count + ", skip=" + skip + "]";
	}

}
