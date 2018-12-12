package com.mlight.bridge;

import java.io.File;
import java.io.IOException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;

/**
 * 与文件上传相关的桥<br/>
 * 支持HTTP和HTTPS<br/>
 * by dl
 */
public class UploadBridge {
	/**
	 * 加密
	 */
	public static String ENCRYPTED = "1";

	/**
	 * 没加密
	 */
	public static String UNENCRYPTED = "0";

	/**
	 * 加密密钥
	 */
	private String encryptKey;

	/**
	 * vikey密钥
	 */
	private String viKey;

	private String protocol;
	private String host;
	private int port;
	private String uri;

	/**
	 * 是否加密的
	 */
	private String isEncrypt = ENCRYPTED;

	public String getIsEncrypt() {
		return isEncrypt;
	}

	public void setIsEncrypt(String isEncrypt) {
		this.isEncrypt = isEncrypt;
	}

	/**
	 * 上传文件并获得响应<br/>
	 */
	public String uploadUnencryptVoice(File f) {
		String result = "";
		HttpClient client = new HttpClient();
		client.getHostConfiguration().setHost(host, port, protocol);
		PostMethod filePost = new PostMethod(uri);
		try {
			Part[] parts = { new StringPart("isEncrypt", this.isEncrypt), new StringPart("type", "voice"),
					new FilePart("file", f) };
			MultipartRequestEntity reqEntity = new MultipartRequestEntity(parts, filePost.getParams());
			filePost.setRequestEntity(reqEntity);
			int status = client.executeMethod(filePost);
			if (status == HttpStatus.SC_OK) {
				result = filePost.getResponseBodyAsString();
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			filePost.releaseConnection();
		}
		return result;
	}

	public String getEncryptKey() {
		return encryptKey;
	}

	public void setEncryptKey(String encryptKey) {
		this.encryptKey = encryptKey;
	}

	public String getViKey() {
		return viKey;
	}

	public void setViKey(String viKey) {
		this.viKey = viKey;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}
}