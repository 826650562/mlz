package com.mlight.chat.webclient;

import com.mlight.chat.client.ConnectionConfig;
import com.mlight.chat.service.config.ServiceConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * 伴随Tomcat一起启动，构成消息代理服务器
 * 
 * @version 1.0
 *
 * @version 1.1 将原有的默认用户名密码删除，使得当前客户端支持用户名与密码的登录
 */
public class ProxyClientListener implements ServletContextListener {
	public static String VAL_IM_HOST;
	public static final String KEY_IM_HOST = "imHost";

	public static String VAL_IM_PORT;

	public static String VAL_CONNECT_TIMEOUT;

	public static String VAL_DEFAULT_TIMEOUT;

	public static String VAL_PING_INTERVAL;

	public static String VAL_ACCESS_URL;
	public static String VAL_ARCGIS_URL;
	public static final String KEY_ACCESS_URL = "accessUrl";

	public static String VAL_UPLOAD_URL;
	public static final String KEY_UPLOAD_URL = "uploadUrl";

	public static String VAL_DEFAULT_RECEIVER;

	public static final ServiceConfig serviceConfig = ServiceConfig.getInstance(); // 全局唯一
	public static final ConnectionConfig connectionConfig = ConnectionConfig.getInstance(); // 全局唯一

	public static String REMOTE_HOST, JKS_PATH, JKS_PSWD;

	@Override
	public void contextDestroyed(ServletContextEvent sce) {

	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		ServletContext ctx = sce.getServletContext();
		ProxyClientListener.initServiceConfig();
		ProxyClientListener.initConnectionConfig();

		ctx.setAttribute(KEY_ACCESS_URL, VAL_ACCESS_URL);
		ctx.setAttribute(KEY_UPLOAD_URL, VAL_UPLOAD_URL);
		ctx.setAttribute(KEY_IM_HOST, VAL_IM_HOST);
		ctx.setAttribute("arcgisUrl", VAL_ARCGIS_URL);
	}

	private static void initServiceConfig() {
		serviceConfig.setHost(VAL_IM_HOST);
		serviceConfig.setPort(Integer.parseInt(VAL_IM_PORT));
		serviceConfig.setConnectTimeout(Integer.parseInt(VAL_CONNECT_TIMEOUT));
		serviceConfig.setDefaultTimeout(Integer.parseInt(VAL_DEFAULT_TIMEOUT));
		serviceConfig.setPingInternal(Integer.parseInt(VAL_PING_INTERVAL));
		serviceConfig.setAccessURL(VAL_ACCESS_URL);
		serviceConfig.setArcgisURL(VAL_ARCGIS_URL);
		serviceConfig.setUploadURL(VAL_UPLOAD_URL);
	}

	private static void initConnectionConfig() {
		connectionConfig.setHost(VAL_IM_HOST);
		connectionConfig.setPort(Integer.parseInt(VAL_IM_PORT));
		connectionConfig.setConnectTimeout(Integer.parseInt(VAL_CONNECT_TIMEOUT));
		connectionConfig.setDefaultTimeout(Integer.parseInt(VAL_DEFAULT_TIMEOUT));
		connectionConfig.setPingInternal(Integer.parseInt(VAL_PING_INTERVAL));
	}

	public void setValImHost(String valImHost) {
		VAL_IM_HOST = valImHost;
	}

	public void setValImPort(String valImPort) {
		VAL_IM_PORT = valImPort;
	}

	public void setValPingInterval(String valPingInterval) {
		VAL_PING_INTERVAL = valPingInterval;
	}

	public void setValUploadUrl(String valUploadUrl) {
		VAL_UPLOAD_URL = valUploadUrl;
	}

	public void setValConnectTimeout(String valConnectTimeout) {
		VAL_CONNECT_TIMEOUT = valConnectTimeout;
	}

	public void setValDefaultReceiver(String valDefaultReceiver) {
		VAL_DEFAULT_RECEIVER = valDefaultReceiver;
	}

	public void setValDefaultTimeout(String valDefaultTimeout) {
		VAL_DEFAULT_TIMEOUT = valDefaultTimeout;
	}

	public void setValAccessUrl(String valAccessUrl) {
		VAL_ACCESS_URL = valAccessUrl;
	}

	public static String valArcgisUrl;

	public void setValArcgisUrl(String valArcgisUrl) {
		valArcgisUrl = valArcgisUrl;
	}

	public void setRemoteHost(String host) {
		REMOTE_HOST = host;
	}

	public void setJksPath(String jkspath) {
		JKS_PATH = jkspath;
	}

	public void setJksPswd(String jksPswd) {
		JKS_PSWD = jksPswd;
	}
}
