package cn.mlight.utils;

import javax.crypto.*;
import javax.crypto.spec.DESKeySpec;
import java.io.*;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;

/**
 * Created by lym on 2017/1/5.
 */
public class EncryptUtils {
	private static final String ALGORITHM = "DES"; // 加密算法名
	private static final SecureRandom sr = new SecureRandom(); // 强加密随机数生成器

	// 根据密码的消息摘要和DESKeySpec生成密钥。
	private static SecretKey generateSecretKey(String key) {
		SecretKey secretKey = null;
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] bytes = key.getBytes();
			md.update(bytes, 3, bytes.length - 3);
			byte[] mdBytes = md.digest(); // Generate 16 bytes
			byte[] truncatedBytes = Arrays.copyOf(mdBytes, 8); // Fetch 8 bytes
																// for
																// DESKeySpec
			DESKeySpec keySpec = new DESKeySpec(truncatedBytes);
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(ALGORITHM);
			secretKey = keyFactory.generateSecret(keySpec);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return secretKey;
	}

	/**
	 * 根据密码加密文件。
	 * 
	 * @param file_path
	 *            需要加密的文件路径
	 * @param newFile_path
	 *            加密后的文件路径
	 * @param key
	 *            加密关键字
	 */
	public static void encryptFile(String file_path, String newFile_path, String key) {
		SecretKey secretKey = generateSecretKey(key);
		encryptFile(file_path, newFile_path, secretKey);
	}

	private static void encryptFile(String file, String newFile, SecretKey secretKey) {
		InputStream in = null;
		CipherInputStream cin = null;
		OutputStream out = null;
		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, secretKey, sr);
			in = new FileInputStream(file);
			cin = new CipherInputStream(in, cipher);
			out = new FileOutputStream(newFile);
			byte[] buffer = new byte[1024];
			int count = 0;
			while ((count = cin.read(buffer)) > 0) {
				out.write(buffer, 0, count);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				cin.close();
				in.close();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	// 根据密码解密文件。

	/**
	 * 文件解密
	 * 
	 * @param file
	 *            已经加密的文件
	 * @param newFile
	 *            要新生成的解密文件
	 * @param key
	 *            加密秘钥字符串
	 */
	public static void decryptFile(String file, String newFile, String key) {
		SecretKey secretKey = generateSecretKey(key);
		decryptFile(file, newFile, secretKey);
	}

	// 直接输入文件流解密文件
	public static void decryptFile(FileInputStream in, String newFile, String key) {
		SecretKey secretKey = generateSecretKey(key);
		decryptFile(in, newFile, secretKey);
	}

	private static void decryptFile(FileInputStream in, String newFile, SecretKey secretKey) {
		// InputStream in = null;
		CipherOutputStream cout = null;
		OutputStream out = null;
		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, secretKey, sr);
			// in = new FileInputStream(file);
			out = new FileOutputStream(newFile);
			cout = new CipherOutputStream(out, cipher);
			byte[] buffer = new byte[1024];
			int count = 0;
			while ((count = in.read(buffer)) > 0) {
				cout.write(buffer, 0, count);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				cout.close();
				out.close();
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private static void decryptFile(String file, String newFile, SecretKey secretKey) {
		InputStream in = null;
		CipherOutputStream cout = null;
		OutputStream out = null;
		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, secretKey, sr);
			in = new FileInputStream(file);
			out = new FileOutputStream(newFile);
			cout = new CipherOutputStream(out, cipher);
			byte[] buffer = new byte[1024];
			int count = 0;
			while ((count = in.read(buffer)) > 0) {
				cout.write(buffer, 0, count);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				cout.close();
				out.close();
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	// 根据密码加密字符串。
	public static byte[] encryptStr(String str, String key) {
		byte[] bytes = str.getBytes();
		SecretKey secretKey = generateSecretKey(key);
		return encrypt(bytes, secretKey);
	}

	// 根据密码加密字节数组。
	public static byte[] encrypt(byte[] bytes, String key) {
		SecretKey secretKey = generateSecretKey(key);
		return encrypt(bytes, secretKey);
	}

	private static byte[] encrypt(byte[] bytes, SecretKey secretKey) {
		byte[] encryptedObj = null;

		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM); // Get the cipher
			cipher.init(Cipher.ENCRYPT_MODE, secretKey);
			encryptedObj = cipher.doFinal(bytes);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return encryptedObj;
	}

	// 根据密码解密字符串。
	public static byte[] decryptStr(String str, String key) {
		byte[] bytes = str.getBytes();
		SecretKey secretKey = generateSecretKey(key);
		return decrypt(bytes, secretKey);
	}

	// 根据密码解密字节数组。
	public static byte[] decrypt(byte[] bytes, String key) {
		SecretKey secretKey = generateSecretKey(key);
		return decrypt(bytes, secretKey);
	}

	private static byte[] decrypt(byte[] bytes, SecretKey secretKey) {
		byte[] decryptedObj = null;

		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM); // Get the cipher
			cipher.init(Cipher.DECRYPT_MODE, secretKey);
			decryptedObj = cipher.doFinal(bytes);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return decryptedObj;
	}
}
