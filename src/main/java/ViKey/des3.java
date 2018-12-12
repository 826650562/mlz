package ViKey;

import ViKey.ViKeyJavaObj;

class des3 {
	public static void ViKeySample() {
		ViKeyJavaObj ViKeyObj = new ViKeyJavaObj();

		short Index = 0;
		short len = 8;
		long retval;
		int[] dwCount = new int[1];
		int[] HID = new int[1];
		short Addr;
		short Length;
		byte[] buffer = new byte[1024];
		byte[] UserPassWord = new byte[10];
		byte[] AdminPassWord = new byte[10];
		byte[] SoftIDString = new byte[16];
		byte[] pResult = new byte[8];
		byte[] Type = new byte[10];

		// 查找加密狗
		retval = ViKeyObj.Find(dwCount);
		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			System.out.println("系统中找到ViKey加密狗数量:" + dwCount[0]);
		} else {
			System.out.println("系统中没有找到ViKey加密狗");
			return;
		}

		Index = 0;

		// 获取加密狗硬件ID
		// retval = ViKeyObj.ViKeyGetHID(Index, HID);
		retval = ViKeyObj.GetHID(Index, HID);
		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			System.out.println("获取加密狗的硬件ID:" + HID[0]);
		} else {
			System.out.println("获取加密狗类型错误");
			return;
		}

		// 获取加密狗硬件ID
		// retval = ViKeyObj.ViKeyGetType(Index, Type);
		retval = ViKeyObj.GetType(Index, Type);

		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			System.out.println("TYPE:" + Type[0]);
		} else {
			System.out.println("获取加密狗类型错误");
			return;
		}

		/*
		 * AdminPassWord[0] = 0x30; AdminPassWord[1] = 0x30; AdminPassWord[2] =
		 * 0x30; AdminPassWord[3] = 0x30; AdminPassWord[4] = 0x30;
		 * AdminPassWord[5] = 0x30; AdminPassWord[6] = 0x30; AdminPassWord[7] =
		 * 0x30; AdminPassWord[8] = 0x00;
		 * 
		 * retval = ViKeyObj.ViKeyAdminLogin(Index, AdminPassWord); if (retval
		 * == ViKeyObj.VIKEY_SUCCESS) { System.out.println("管理员登录加密狗成功!"); }
		 * else { System.out.println("管理员登录加密狗失败!"); return; }
		 */

		// 3des
		/*
		 * 秘钥：1234567890ABCDEF 输入：12345678 输出：B73B0B849BB6BCB7 或者小写
		 */
		SoftIDString[0] = '1';
		SoftIDString[1] = '2';
		SoftIDString[2] = '3';
		SoftIDString[3] = '4';
		SoftIDString[4] = '5';
		SoftIDString[5] = '6';
		SoftIDString[6] = '7';
		SoftIDString[7] = '8';
		/*
		 * SoftIDString[8] = '8'; SoftIDString[9] = '7'; SoftIDString[10] = '6';
		 * SoftIDString[11] = '5'; SoftIDString[12] = '4'; SoftIDString[13] =
		 * '3'; SoftIDString[14] = '2'; SoftIDString[15] = '1';
		 */

		retval = ViKeyObj.Vikey3DesEncrypt(Index, len, SoftIDString, pResult);
		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			/*
			 * System.out.println("mima:"); for (int i = 0; i < pResult.length;
			 * i++) { System.out.print( pResult[i]); }
			 */
			System.out.print("out:" + (bytesToHexString(pResult)).toUpperCase());
		} else {
			System.out.println("加密狗失败!");
			return;
		}

		// 解密
	}

	public static void main(String[] args) {
		ViKeySample();
	}

	public static String bytesToHexString(byte[] src) {
		StringBuilder stringBuilder = new StringBuilder("");
		if (src == null || src.length <= 0) {
			return null;
		}
		for (int i = 0; i < src.length; i++) {
			int v = src[i] & 0xFF;
			String hv = Integer.toHexString(v);
			if (hv.length() < 2) {
				stringBuilder.append(0);
			}
			stringBuilder.append(hv);
		}
		return stringBuilder.toString();
	}

	/**
	 * Convert char to byte
	 * 
	 * @param c
	 *            char
	 * @return byte
	 */
	private static byte charToByte(char c) {
		return (byte) "0123456789ABCDEF".indexOf(c);
	}

	/**
	 * Convert hex string to byte[]
	 * 
	 * @param hexString
	 *            the hex string
	 * @return byte[]
	 */
	public static byte[] hexStringToBytes(String hexString) {
		if (hexString == null || hexString.equals("")) {
			return null;
		}
		hexString = hexString.toUpperCase();
		int length = hexString.length() / 2;
		char[] hexChars = hexString.toCharArray();
		byte[] d = new byte[length];
		for (int i = 0; i < length; i++) {
			int pos = i * 2;
			d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
		}
		return d;
	}
}
