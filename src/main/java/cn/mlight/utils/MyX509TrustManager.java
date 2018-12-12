package cn.mlight.utils;

import com.mlight.chat.webclient.ProxyClientListener;
import org.apache.struts2.ServletActionContext;

import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpServletRequest;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

/**
 * Created by lzr on 2017/1/11.
 */
public class MyX509TrustManager implements X509TrustManager {
	/*
	 * The default X509TrustManager returned by SunX509. We'll delegate
	 * decisions to it, and fall back to the logic in this class if the default
	 * X509TrustManager doesn't trust it.
	 */
	X509TrustManager sunJSSEX509TrustManager;

	public MyX509TrustManager() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		// String realPath =
		// request.getSession().getServletContext().getRealPath("/");
		// create a "default" JSSE X509TrustManager.
		KeyStore ks = KeyStore.getInstance("JKS");
		// "passphrase".toCharArray());
		ks.load(new FileInputStream(ProxyClientListener.JKS_PATH), ProxyClientListener.JKS_PSWD.toCharArray());
		TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509", "SunJSSE");
		tmf.init(ks);
		TrustManager tms[] = tmf.getTrustManagers();
		for (int i = 0; i < tms.length; i++) {
			if (tms[i] instanceof X509TrustManager) {
				sunJSSEX509TrustManager = (X509TrustManager) tms[i];
				return;
			}
		}
		/*
		 * Find some other way to initialize, or else we have to fail the
		 * constructor.
		 */
		throw new Exception("Couldn't initialize");
	}

	/*
	 * Delegate to the default trust manager.
	 */
	@Override
	public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
		try {
			sunJSSEX509TrustManager.checkClientTrusted(chain, authType);
		} catch (CertificateException excep) {
			// do any special handling here, or rethrow exception.
		}
	}

	/*
	 * Delegate to the default trust manager.
	 */
	@Override
	public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
		try {
			sunJSSEX509TrustManager.checkServerTrusted(chain, authType);
		} catch (CertificateException excep) {
			/*
			 * Possibly pop up a dialog box asking whether to trust the cert
			 * chain.
			 */
		}
	}

	/*
	 * Merely pass this through.
	 */
	@Override
	public X509Certificate[] getAcceptedIssuers() {
		return sunJSSEX509TrustManager.getAcceptedIssuers();
	}
}
