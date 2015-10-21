package org.mel.security.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.mel.framework.util.GenericMethod;
import org.mel.security.domain.CachedUser;
import org.mel.security.domain.Menu;
import org.mel.security.domain.Node;
import org.mel.security.domain.NodeCompator;
import org.mel.security.domain.NodeType;
import org.mel.security.entity.SecurityRight;
import org.mel.security.entity.SecurityRole;
import org.springframework.stereotype.Service;

@Service
public class MenuService {
	private static Menu menu;
	private Map<String, Node> indexedMenu = new HashMap<>();
	private Map<String, Node> exceptMenu = new HashMap<>();

	@Resource
	private SecurityService securityService;

	@PostConstruct
	protected void init() {
		JAXBContext ctx = null;
		try {
			ctx = JAXBContext.newInstance(Menu.class);
			Unmarshaller unmarshaller = ctx.createUnmarshaller();
			menu = (Menu) unmarshaller.unmarshal(this.getClass().getClassLoader().getResourceAsStream("menu.xml"));
			indexMenu(menu.getNodes(), null);
			printMenu(menu);
			syncMenu2DB();
		} catch (JAXBException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}

	private void indexMenu(List<Node> nodes, String parentId) {
		int count = 1;
		for (Node node : nodes) {
			node.setSequence(count++);
			if (parentId == null) {
				node.setParentId(node.getId());
			} else {
				node.setParentId(parentId);
			}
			if (node.isExcept()) {
				exceptMenu.put(node.getId(), node);
			} else {
				indexedMenu.put(node.getId(), node);
			}
			if (node.getNodes().size() > 0) {
				indexMenu(node.getNodes(), node.getId());
			}
		}
	}

	private void syncMenu2DB() {
		Set<String> keySet = indexedMenu.keySet();
		List<SecurityRight> rights = new ArrayList<>();

		for (String key : keySet) {
			Node node = indexedMenu.get(key);
			if (node.getType().equals(NodeType.OPERATE) || node.getType().equals(NodeType.TOOLBAR) || node.getType().equals(NodeType.MENU)) {
				rights.add(new SecurityRight(node.getId(), node.getText(), node.getDesc()));
			}
		}
		System.out.println("NODE-SIZE>>" + rights.size());
		securityService.saveRights(rights);

	}

	public Menu getAllMenu() {
		return (Menu) GenericMethod.depthClone(menu);
	}

	public Menu getPersonalMenu() {
		Map<String, Node> allMenus = getFlatMenuCopy();
		Map<String, Node> checkedNodes = new HashMap<>();

		CachedUser user = (CachedUser) securityService.getCurrentUser();
		if (user.getSecurityUser().getLoginId().equals("admin")) {
			return getAllMenu();
		}
		
		if (user.getMenu() != null){
			return user.getMenu();
		}

		List<Node> userNodes = new ArrayList<>();
		for (SecurityRole role : user.getSecurityUser().getRoles()) {
			for (SecurityRight right : role.getRights()) {
				if (!userNodes.contains(right)) {
					userNodes.add(allMenus.get(right.getAid()));
				}
			}
		}

		// add except
		Set<String> keys = exceptMenu.keySet();
		for (String key : keys) {
			Node node = exceptMenu.get(key);
			if (!userNodes.contains(node)) {
				userNodes.add(node);
			}
		}

		Menu menu = new Menu();

		for (Node node : userNodes) {
			Node top = generateNodeLine(node, checkedNodes, allMenus);
			if (top != null && !menu.getNodes().contains(top)) {
				menu.getNodes().add(top);
			}
		}

		NodeCompator c = new NodeCompator();
		sortNodes(menu.getNodes(), c);

		user.setMenu(menu);
		user.setRightIndex(checkedNodes);
//		printMenu(menu);
		return menu;
	}

	private void sortNodes(List<Node> nodes, NodeCompator c) {
		Collections.sort(nodes, c);
		for (Node node : nodes) {
			sortNodes(node.getNodes(), c);
		}
	}

	private Node generateNodeLine(Node node, Map<String, Node> checkedNodes, Map<String, Node> allMenus) {
		if (checkedNodes.containsKey(node.getId())) {
			return null;
		}
		checkedNodes.put(node.getId(), node);
		if (node.getId().equals(node.getParentId())) {
			return node;
		}
		Node parent = allMenus.get(node.getParentId());
		parent.getNodes().add(node);

		return generateNodeLine(parent, checkedNodes, allMenus);
	}

	// 返回一份 indexedMenu 的复制，并且扁平化
	@SuppressWarnings("unchecked")
	private Map<String, Node> getFlatMenuCopy() {
		Map<String, Node> nodes = (Map<String, Node>) GenericMethod.depthClone(indexedMenu);
		Set<String> keys = nodes.keySet();
		for (String key : keys) {
			Node node = nodes.get(key);
			node.getNodes().clear();
		}
		return nodes;
	}

	protected void printMenu(Menu menu) {
		JAXBContext ctx = null;
		try {
			ctx = JAXBContext.newInstance(Menu.class);
			Marshaller marshaller = ctx.createMarshaller();
			marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			marshaller.marshal(menu, System.out);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
