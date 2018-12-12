package com.mlight.chat.client;

import org.junit.Test;

/**
 * Created by mlight on 2016/6/13.
 */
public class SimpleClientTest {
	static ConnectionConfig config = new ConnectionConfig();

	static {
		config.setHost("115.231.213.228");
		config.setPort(10094);
		config.setDefaultTimeout(200000);
		config.setPingInternal(10000);
		config.setConnectTimeout(300000);
	}

	@Test
	public void getLastConnection() {
		// TChatConnection connection = new TChatConnection(config);
		// try {
		// connection.connect();
		// // connection.loginInternal("dl","1","");
		//
		// SimpleClient client = new SimpleClient(connection);
		// Request request = new Request();
		// request.setUri("/location/newest");
		// request.setParam("groupId","13");
		// Response response = client.execute(request);
		// System.out.println(response.getBody());
		// connection.disconnect();
		// } catch (NetException e) {
		// e.printStackTrace();
		// } catch (IOException e) {
		// e.printStackTrace();
		// } catch (CertificateException e) {
		// e.printStackTrace();
		// } catch (NoSuchAlgorithmException e) {
		// e.printStackTrace();
		// } catch (UnrecoverableKeyException e) {
		// e.printStackTrace();
		// } catch (AlreadyConnectedException e) {
		// e.printStackTrace();
		// } catch (KeyStoreException e) {
		// e.printStackTrace();
		// } catch (KeyManagementException e) {
		// e.printStackTrace();
		// }
	}
}
