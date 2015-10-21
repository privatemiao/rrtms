package org.mel.security.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.exception.LoginException;
import org.mel.security.domain.IUser;
import org.mel.security.domain.Menu;
import org.mel.security.entity.SecurityRight;
import org.mel.security.entity.SecurityRole;
import org.mel.security.entity.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;

@Service
public class SecurityService {
	@Resource
	private RightService rightService;
	@Resource
	private MenuService menuService;
	@Resource
	private RoleService roleService;

	private Map<String, IUser> indexedBySessionId = new ConcurrentHashMap<>();
	private Map<Long, String> indexedById = new ConcurrentHashMap<>();
	private Map<String, Long> dirtySession = new ConcurrentHashMap<>();

	public void saveRights(List<SecurityRight> rights) {
		rightService.save(rights);
	}

	public Menu getAllMenu() {
		return menuService.getAllMenu();
	}

	public Menu getPersonalMenu() {
		return menuService.getPersonalMenu();
	}

	public List<SecurityRole> getAllRoles() {
		return roleService.findAllRoles();
	}

	public void removeRole(Long... ids) {
		if (ids == null) {
			return;
		}
		roleService.remove(ids);
	}

	public void saveRole(SecurityRole role) {
		if (role.getRights().size() > 0) {
			for (SecurityRight right : role.getRights()) {
				if (right.getId() == null
						&& !StringUtils.isBlank(right.getAid())) {
					right.setId(rightService.load(right.getAid()).getId());
				}
			}
		}

		for (SecurityRight right : role.getRights()) {
			System.out.println(right);
		}

		roleService.save(role);
	}

	public boolean hasLogin() {
		return this.indexedBySessionId.get(getSessionId()) != null;
	}

	public String getSessionId() {
		return RequestContextHolder.currentRequestAttributes().getSessionId();
	}

	public boolean isAdmin() {
		String sessionId = getSessionId();
		SecurityUser securityUser = indexedBySessionId.get(sessionId)
				.getSecurityUser();
		return "admin".equals(securityUser.getLoginId());
	}

	public void cacheSession(IUser user) throws LoginException {
		Long id = user.getSecurityUser().getId();
		String sessionId = getSessionId();
		System.out.println("before cache");
		printIndex();

		removeBySessionId(sessionId);
		removeBySecurityUserId(id);

		indexedBySessionId.put(sessionId, user);
		indexedById.put(id, sessionId);

		System.out.println("after cache");
		printIndex();
	}

	private void removeBySessionId(String sessionId) {
		IUser user = indexedBySessionId.get(sessionId);
		if (user != null) {
			indexedById.remove(user.getSecurityUser().getId());
		}
		indexedBySessionId.remove(sessionId);
	}

	private void removeBySecurityUserId(Long id) {
		String sessionId = indexedById.get(id);
		if (!StringUtils.isBlank(sessionId)) {
			indexedBySessionId.remove(sessionId);
			dirtySession.put(sessionId, System.currentTimeMillis());
		}
		indexedById.remove(id);

	}

	public void removeCurrentUser() {
		System.out.println("before remove");
		printIndex();
		String sessionId = getSessionId();
		IUser user = indexedBySessionId.get(sessionId);
		if (user != null) {
			indexedById.remove(user.getSecurityUser().getId());
		}
		indexedBySessionId.remove(sessionId);

		System.out.println("after remove");
		printIndex();
	}

	public void logout(String sessionId) {
		System.out.println("before logout");
		printIndex();
		System.out.println("sessionId - " + sessionId);
		IUser user = this.indexedBySessionId.remove(sessionId);
		if (user != null) {
			indexedById.remove(user.getSecurityUser().getId());
		}
		if (dirtySession.containsKey(sessionId)){
			dirtySession.remove(sessionId);
		}
		printIndex();
		System.out.println("after logout");
	}

	public IUser getCurrentUser() {
		return indexedBySessionId.get(getSessionId());
	}

	// public String info(){
	// StringBuffer buffer = new StringBuffer();
	// Set<String> keys = indexedBySessionId.keySet();
	// buffer.append("SIZE>>" + keys.size()).append("\r\n");
	// for (String key : keys){
	// buffer.append(key).append(">>").append(indexedBySessionId.get(key).getName()).append("\r\n");
	// }
	// return null;
	// }
	public Map<String, IUser> getCachedUser() {
		printIndex();
		return indexedBySessionId;
	}

	public boolean isDirty(String sessionId){
		boolean flag = dirtySession.containsKey(sessionId);
		if (flag){
			dirtySession.remove(sessionId);
		}
		return flag;
	}
	
	protected void printIndex() {
		System.out.println();
		System.out.println();
		System.out.println();
		System.out.println();
		System.out
				.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		Set<String> keys = indexedBySessionId.keySet();
		for (String key : keys) {
			IUser user = indexedBySessionId.get(key);
			System.out.println(key + ">>" + user.getSecurityUser().getId());
		}
		System.out
				.println("----------------------------------------------------------------------");

		Set<Long> keySets = indexedById.keySet();
		for (Long keySet : keySets) {
			System.out.println(keySet + ">>" + indexedById.get(keySet));
		}
		System.out
				.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		Set<String> keySetss = dirtySession.keySet();
		for (String ks : keySetss) {
			System.out.println(ks + ">>DIRTY>>" + dirtySession.get(ks));
		}
		System.out
				.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		System.out.println();
		System.out.println();
		System.out.println();
		System.out.println();
	}
}
