package com.mlight.bridge;

import java.io.File;

import org.junit.Test;

public class UploadBridgeTest {

	@Test
	public void upload() {
		UploadBridge bridge = new UploadBridge();
		bridge.setHost("192.168.2.193");
		bridge.setPort(18080);
		bridge.setProtocol("http");
		bridge.setUri("/upload/app/upload");
		String path = "G:\\MIXUN\\eclipse_workspace\\xxcj_zhd_mlight_1\\src\\test\\java\\com\\mlight\\bridge\\test.amr";
		String result = bridge.uploadUnencryptVoice(new File(path));
		System.out.println(result);
	}
}
