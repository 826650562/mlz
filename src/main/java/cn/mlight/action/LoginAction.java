package cn.mlight.action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.mlight.chat.webclient.ProxyClientListener;
/*import com.mlight.jni.LogClient;*/
import com.opensymphony.xwork2.ActionSupport;

import cn.mlight.domain.User;
import cn.mlight.listener.SessionUtil;
import cn.mlight.service.LoginService;

public class LoginAction extends ActionSupport {
	/*private static final LogClient logClient = LogClient.getInstance();*/
	private static final Logger logger = LoggerFactory.getLogger(LoginAction.class);

	@Value("#{settingProperties['vikey.id']}")
	private int vikeyid;

	@Resource
	private LoginService loginService;
	private String receiver;
	private String errorMsg;

	public User user = new User();

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	/**
	 * 跳转登录页面
	 * 
	 * @return
	 */
	public String loginUI() {
		return "loginUI";
	}

	/**
	 * 登录
	 * 
	 * @return
	 */
	public String login() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		// if(ViKeyUtils.getViKeyCount() == 0){
		// errorMsg = "未查找到加密狗。";
		// session.setAttribute("errorMsg", errorMsg);
		// return "loginUI";
		// }
		//
		// if(ViKeyUtils.getViKeyID() != vikeyid){
		// errorMsg = "加密狗设备ID错误。";
		// session.setAttribute("errorMsg", errorMsg);
		// return "loginUI";
		// }
		// if(!ViKeyUtils.checkViKey()){
		// errorMsg = "加密狗验证失败。";
		// session.setAttribute("errorMsg", errorMsg);
		// return "loginUI";
		// }
		String username = user.getUsername(), password = user.getPassword(), msg = null;
		if (logger.isDebugEnabled()) {
			logger.debug(String.format("{%s,%s login}", new Object[] { username, password }));
		}
		// System.out.println(System.getProperty("user.dir"));
		if (username != null && !"".equals(username) && password != null && !"".equals(password)) {
			User userLogin = loginService.queryUsernameAndPassword(user.getUsername(), user.getPassword());
			if (userLogin != null) {
				userLogin.setPassword(password);
				SessionUtil.putSession(session, userLogin);
				// 登录消息服务器,如果已经登录过了
				// ProxyClient client = new
				// ProxyClient(ProxyClientListener.connectionConfig, username,
				// password);
				/*
				 * SessionUtil.putSession(session, client); client.onStart();
				 */
				session.removeAttribute("errorMsg");
				return "home";
			} else {
				errorMsg = "用户名密码不匹配！";
				session.setAttribute("errorMsg", errorMsg);
				return "loginUI";
			}
		} else {
			return "loginUI";
		}

	}

	/**
	 * 退出
	 */
	public String logout() {
		HttpSession session = ServletActionContext.getRequest().getSession();
		SessionUtil.destorySession(session);
		return "logout";
	}

	// 默认的任务接受者
	public String getReceiver() {
		return ProxyClientListener.VAL_DEFAULT_RECEIVER;
	}
	/**
	 * 用于获得当前服务器端时间
	 * 
	 * @author DDL007
	 */
	public void now() {
		long time = System.currentTimeMillis();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			PrintWriter writer = response.getWriter();
			writer.write(String.valueOf(time));// 语音路径
			writer.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
