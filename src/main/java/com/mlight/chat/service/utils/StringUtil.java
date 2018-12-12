package com.mlight.chat.service.utils;

/**
 * String 工具类
 */
public class StringUtil {
	/**
	 * 请选择
	 */
	final static String PLEASE_SELECT = "请选择...";

	public static boolean empty(Object o) {
		return o == null || "".equals(o.toString().trim()) || "null".equalsIgnoreCase(o.toString().trim())
				|| "undefined".equalsIgnoreCase(o.toString().trim()) || PLEASE_SELECT.equals(o.toString().trim());
	}

	/**
	 * 给JID返回用户名
	 */
	public static String getUserNameByJid(String Jid) {
		if (empty(Jid)) {
			return null;
		}
		if (!Jid.contains("@")) {
			return Jid;
		}
		return Jid.split("@")[0];
	}

	/**
	 * 字符串转布尔值
	 *
	 * @param b
	 * @return 转换异常返回 false
	 */
	public static boolean toBoolean(String b) {
		try {
			return Boolean.parseBoolean(b);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public static String MD5(String s) {
		// MD5FileNameGenerator md5FileNameGenerator = new
		// MD5FileNameGenerator();
		// String string = md5FileNameGenerator.generate(s);
		// return string;
		return s;
	}
}
