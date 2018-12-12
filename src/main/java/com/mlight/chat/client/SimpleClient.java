package com.mlight.chat.client;

import com.mlight.chat.client.exception.NotConnectedException;
import com.mlight.chat.message.Request;
import com.mlight.chat.message.Response;
import com.mlight.chat.service.net.exceptions.NetException;

public class SimpleClient {

	private TChatConnection connection;

	public SimpleClient(TChatConnection connection) {
		this.connection = connection;
	}

	public Response execute(Request request) throws NetException {
		Response response;
		MessageCollector collector;
		// 2.
		try {
			long time = System.currentTimeMillis();
			collector = connection.createMessageCollectorAndSend(request);
			System.out.println(request.getId() + " 创建收集器耗时: " + (System.currentTimeMillis() - time));
			time = System.currentTimeMillis();
			response = (Response) collector.nextResult(connection.getConfig().getDefaultTimeout());
			System.out.println(request.getId() + "等待响应耗时: " + (System.currentTimeMillis() - time));
			// 3
			collector.cancel();
			if (response == null) {
				throw new NetException("无响应");
			}
			System.out.println("返回消息成功");
			return response;

			// if (response.getStatusCode() == 200) {
			// return response;
			// } else {
			// throw new NetException(response.getStatusMessage());
			// }
		} catch (NotConnectedException | InterruptedException e) {
			throw new NetException(e.getMessage());
		}
	}
}
