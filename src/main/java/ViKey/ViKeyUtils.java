package ViKey;

/**
 * Created by root on 2/15/17.
 */
public class ViKeyUtils {
	public static int getViKeyCount() {
		ViKeyJavaObj ViKeyObj = new ViKeyJavaObj();
		short Index = 0;
		long retval;
		int viKeyCount = 0;
		int[] dwCount = new int[1];
		int[] HID = new int[1];

		// short Addr;
		// short Length;
		// byte[] buffer=new byte[1024];
		// byte[] UserPassWord =new byte[10];
		// byte[] AdminPassWord =new byte[10];
		// byte[] SoftIDString =new byte[16];
		// byte[] pResult =new byte[8];
		//

		// 查找加密狗
		retval = ViKeyObj.Find(dwCount);
		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			viKeyCount = dwCount[0];
		}
		ViKeyObj.Logoff(Index);
		return viKeyCount;
	}

	/**
	 * 验证对应的数字证书key
	 * 
	 * @return
	 */
	public static boolean checkViKey() {
		// 3des
		/*
		 * 秘钥：1234567890ABCDEF 输入：12345678 输出：B73B0B849BB6BCB7 或者小写
		 */
		byte[] SoftIDString = new byte[16];
		short len = 8;
		boolean isTrue = false;
		SoftIDString[0] = '1';
		SoftIDString[1] = '2';
		SoftIDString[2] = '3';
		SoftIDString[3] = '4';
		SoftIDString[4] = '5';
		SoftIDString[5] = '6';
		SoftIDString[6] = '7';
		SoftIDString[7] = '8';
		String answer = "";
		ViKeyJavaObj ViKeyObj = new ViKeyJavaObj();
		short Index = 0;
		long retval;
		byte[] Type = new byte[10];

		retval = ViKeyObj.GetType(Index, Type);
		byte[] pResult = new byte[8];

		retval = ViKeyObj.Vikey3DesEncrypt(Index, len, SoftIDString, pResult);
		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			answer = (bytesToHexString(pResult)).toUpperCase();
			if (answer != null && "B73B0B849BB6BCB7".equals(answer)) {
				isTrue = true;
			}
		}
		ViKeyObj.Logoff(Index);
		return isTrue;
	}

	/**
	 * 获取加密狗硬件ID
	 * 
	 * @return
	 */
	public static int getViKeyID() {
		ViKeyJavaObj ViKeyObj = new ViKeyJavaObj();
		short Index = 0;
		int viKeyId = 0;
		long retval;
		int[] HID = new int[1];
		retval = ViKeyObj.GetHID(Index, HID);
		if (retval == ViKeyObj.VIKEY_SUCCESS) {
			System.out.println("获取加密狗的硬件ID:" + HID[0]);
			viKeyId = HID[0];
		} else {
			System.out.println("获取加密狗类型错误");
		}
		ViKeyObj.Logoff(Index);
		return viKeyId;
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

	public static void main(String args[]) {
		int vikeyCount = ViKeyUtils.getViKeyCount();
		System.out.println("系统中找到ViKey加密狗数量:" + vikeyCount);
		boolean check = ViKeyUtils.checkViKey();
		System.out.println(check);
		System.out.println(ViKeyUtils.getViKeyID());
	}
}
