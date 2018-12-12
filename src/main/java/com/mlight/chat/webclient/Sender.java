package com.mlight.chat.webclient;

import cn.mlight.listener.SessionUtil;
import com.mlight.chat.service.dao.message.Message;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 消息发送者
 */
public class Sender extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8906144993023894669L;

	/**
	 * Constructor of the object.
	 */
	public Sender() {
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
		String callback = request.getParameter("callback");

		// 测试内容
		Message message = new Message();
		message.setSender(request.getParameter("sender"));
		message.setReceiver(request.getParameter("receiver")); // 优先级在groupId之下
		message.setType(Integer.parseInt(request.getParameter("type")));
		message.setContent(request.getParameter("content"));

		String attachment = request.getParameter("attachment");
		if (attachment == null || "".equals(attachment)) {

		} else {
			message.setAttachment(attachment); // 复杂消息
		}

		String groupId = request.getParameter("groupId");
		if (groupId == null || "".equals(groupId)) {

		} else {
			message.setGroupId(groupId); // 一旦设置则自动设置为群聊信息
		}

		String chatTypeStr = request.getParameter("chatType");
		int chatType = 0;
		try {
			chatType = Integer.parseInt(chatTypeStr);
		} catch (Exception e) {
			chatType = 0;
		}
		message.setChatType(chatType);

		String time = request.getParameter("time");
		try {
			message.setTime(Long.parseLong(time));
		} catch (Exception e) {
			message.setTime(System.currentTimeMillis());
		}

		String result = "{'status':0}";

		ProxyClient client = SessionUtil.getClient(request.getSession());
		boolean flag = client.sendFreshMessage(message);
		if (!flag) {
			result = "{'status':1}";
		}
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		if (callback != null && callback.length() > 0) {
			out.println(callback + "(" + result + ")");
		} else {
			out.println(result);
		}
		out.flush();
		out.close();
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
		this.doGet(request, response);
	}

	/**
	 * Initialization of the servlet. <br>
	 * 
	 * @throws ServletException
	 *             if an error occurs
	 */
	@Override
	public void init() throws ServletException {

	}
}
