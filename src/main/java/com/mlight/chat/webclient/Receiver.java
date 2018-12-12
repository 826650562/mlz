package com.mlight.chat.webclient;

import cn.mlight.listener.SessionUtil;
import com.google.gson.Gson;
import com.mlight.chat.service.dao.message.Message;
import net.sf.json.JSONObject;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * 消息接收者
 * 
 * @description
 * @author Danglei
 * 
 * @date 2016-5-4下午10:45:15
 * @version 1.0
 */
public class Receiver extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 5733448381844757031L;

	/**
	 * Constructor of the object.
	 */
	public Receiver() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	@Override
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * The doPost method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to
	 * post.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ServletContext sc = getServletContext();
		String path = sc.getRealPath("/WEB-INF/classes/settings.properties");
		Properties props = new Properties();// 读取文件类型创建对象。
		props.load(new FileInputStream(path));
		String fdfsUrl = props.getProperty("fdfsUrl");
		// System.out.println(value);//结果：a2
		String callback = request.getParameter("callback");
		String result = "login";
		ProxyClient client = SessionUtil.getClient(request.getSession());
		Map<String, Object> map = new HashMap<>();
		if (client == null) {
			// 跳转到登录页面
			map.put("net", -1);
			map.put("msg", result);
		} else {
			List<Message> list = client.receiveMessage();
			BASE64Encoder encoder = new sun.misc.BASE64Encoder();
			for (int i = 0; i < list.size(); i++) {
				String attachment = list.get(i).getAttachment();
				if (!"".equals(attachment) && attachment != null) {
					JSONObject jsonObject = JSONObject.fromObject(attachment);
					if (jsonObject.containsKey("thumbnail")) {
						String thumbnail = jsonObject.get("thumbnail").toString();
						String format = thumbnail.split("\\.")[1];
						String tppath = thumbnail.replace("M00", fdfsUrl);
						File file = new File(tppath);
						String dataUrl = null;
						if (file.exists()) {
							BufferedImage bi;
							try {
								bi = ImageIO.read(file);
								ByteArrayOutputStream baos = new ByteArrayOutputStream();
								ImageIO.write(bi, format, baos);
								byte[] bytes = baos.toByteArray();
								dataUrl = encoder.encodeBuffer(bytes).trim();
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
						if (dataUrl != null) {
							dataUrl = "data:image/" + format + ";base64," + dataUrl;
							jsonObject.put("thumbnail", dataUrl);
						}
					}
					list.get(i).setAttachment(jsonObject.toString());
				}
			}
			map.put("net", client.getSynced()); // 网络状态声明
			map.put("msg", list); // 消息内容
			Gson json = new Gson();
			result = json.toJson(map);
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			if (callback != null && callback.length() > 0) {
				// 以jsonp方式处理
				response.setHeader("Content-type", "application/x-javascript;charset=utf-8");
				out.print(callback + "(" + result + ");");
			} else {
				// 直接返回json
				response.setContentType("text/json;charset=UTF-8");
				out.print(result);
			}
			out.flush();
			out.close();
		}
	}

	/**
	 * Initialization of the servlet. <br>
	 * 
	 * @throws ServletException
	 *             if an error occurs
	 */
	@Override
	public void init() throws ServletException {
		// Put your code here
	}

}
