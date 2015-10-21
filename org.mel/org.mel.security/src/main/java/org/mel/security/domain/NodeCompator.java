package org.mel.security.domain;

import java.util.Comparator;

public class NodeCompator implements Comparator<Node> {

	@Override
	public int compare(Node o1, Node o2) {
		if (o1.getSequence() >= o2.getSequence()) {
			return 1;
		} else {
			return -1;
		}
	}

}
