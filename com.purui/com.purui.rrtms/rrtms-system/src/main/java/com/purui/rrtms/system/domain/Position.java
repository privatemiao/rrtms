package com.purui.rrtms.system.domain;

public class Position {
	private double lng;
	private double lat;

	public Position() {
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	@Override
	public String toString() {
		return "Position [lng=" + lng + ", lat=" + lat + "]";
	}

}
