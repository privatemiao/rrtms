package com.purui.rrtms.system.domain;

public class TotalEnergy {
	private int count = 0;
	private double totalValue;

	public TotalEnergy() {
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public double getTotalValue() {
		return totalValue;
	}

	public void setTotalValue(double totalValue) {
		this.totalValue = totalValue;
	}

	@Override
	public String toString() {
		return "TotalEnergy [count=" + count + ", totalValue=" + totalValue
				+ "]";
	}

}
