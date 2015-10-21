package org.mel.framework.domain;

import java.util.Collections;
import java.util.List;

public class JSonPageWrapper<T> {
	private int count = 10;
	private int curPage = 1;
	private int maxCount = 0;
	private int skip = 0;

	private List<T> data = Collections.emptyList();

	public JSonPageWrapper() {
	}

	public JSonPageWrapper(Paged<T> paged) {
		if (paged != null) {
			this.count = paged.getCount();
			this.maxCount = paged.getMaxCount();
			this.skip = paged.getStartPosition();
			this.data = paged.getData();
		}
	}
	
	public JSonPageWrapper(List<T> list){
		if (list == null){
			return ;
		}
		
		this.count = list.size();
		this.maxCount = list.size();
		this.skip = 0;
		this.data = list;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public int getCurPage() {
		return curPage;
	}

	public void setCurPage(int curPage) {
		this.curPage = curPage;
	}

	public int getMaxCount() {
		return maxCount;
	}

	public void setMaxCount(int maxCount) {
		this.maxCount = maxCount;
	}

	public int getSkip() {
		return skip;
	}

	public void setSkip(int skip) {
		this.skip = skip;
	}

	public List<?> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "JSonPageWrapper [count=" + count + ", curPage=" + curPage + ", maxCount=" + maxCount + ", skip=" + skip + ", data=" + data + "]";
	}

}
