package cn.mlight.listener;

import cn.mlight.domain.User;
import com.mlight.chat.webclient.ProxyClient;
import org.apache.struts2.ServletActionContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by mlight on 2016/6/16.
 */
public class SessionUtil {
	private static final String KEY_USER = "sessionUser";
	private static final String KEY_CONNECTION = "connection";

	public static void putSession(HttpSession session, User user) {
		session.setAttribute(KEY_USER, user);
	}

	public static void setSessionUserToken(String token) {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute(KEY_USER);
		if (null != user) {
			user.setToken(token);
		}
		session.setAttribute(KEY_USER, user);
	}

	public static String getSessionUserToken() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute(KEY_USER);
		if (null != user) {
			return user.getToken();
		}
		return "";
	}

	public static void putSession(HttpSession session, ProxyClient client) {
		session.setAttribute(KEY_CONNECTION, client);
	}

	public static User getUser(HttpSession session) {
		Object user = session.getAttribute(KEY_USER);
		User result = null;
		if (user != null) {
			result = (User) user;
		}
		return result;
	}

	public static ProxyClient getClient(HttpSession session) {
		Object obj = session.getAttribute(KEY_CONNECTION);
		ProxyClient client = null;
		if (obj != null) {
			client = (ProxyClient) obj;
		}
		return client;
	}

	public static void destorySession(HttpSession session) {
		session.removeAttribute(KEY_USER);
		ProxyClient client = getClient(session);
		if (client != null) {
			//client.onStop();
		}
		session.invalidate();
	}

	public static void refreshSession(HttpSession session) {
		ProxyClient client = getClient(session);
		if (client != null) {
			client.refresh(System.currentTimeMillis()); // 更新请求时间
		}
	}
}