package com.mlight.jms;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.LinkedBlockingQueue;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;

/**
 * 接收APP端发送的消息
 */
public class AppJmsMessageListener extends HttpServlet implements MessageListener {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final LinkedBlockingQueue<String> QUEUE = new LinkedBlockingQueue<String>();
	boolean flag = true;

	@Override
	public void onMessage(Message message) {
		TextMessage textMsg = (TextMessage) message;
		String content = null;
		try {
			content = textMsg.getText();
			QUEUE.add(content);
		} catch (JMSException e) {
			e.printStackTrace();
		}
	}

	public void service(ServletRequest req, ServletResponse response) throws ServletException, IOException {
		response.setContentType("text/event-stream");
		response.setCharacterEncoding("UTF-8");
		PrintWriter writer = response.getWriter();
		while (flag) {
			String element;
			try {
				element = QUEUE.take();
				writer.write("event:xxsb\n");
				writer.write("data: " + element + "\n\n");
				writer.flush();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		writer.close();
	}
}
