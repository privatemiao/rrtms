package com.purui.rrtms.system.domain;

import java.util.ArrayList;
import java.util.List;

public class PositionArea {
	private List<Position> positions = new ArrayList<>();

	public PositionArea() {
	}

	public List<Position> getPositions() {
		return positions;
	}

	public void setPositions(List<Position> positions) {
		this.positions = positions;
	}

}
