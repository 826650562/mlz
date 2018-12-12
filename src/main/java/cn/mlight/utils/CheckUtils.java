package cn.mlight.utils;

import java.util.List;

/**
 * 验证包
 * @author 李伟
 *
 */
public class CheckUtils {
	
	/**
	 * 验证是否为空
	 * @param obj 常用数据类型[String,Object[],List，更多的话支持自定义扩展]
	 * @return
	 */
	public static boolean isEmpty(Object obj) {
		if (obj instanceof String) {
			return obj == null || ((String) obj).length() == 0;
		} else if (obj instanceof Object[]) {
			Object[] temp = (Object[]) obj;
			for (int i = 0; i < temp.length; i++) {
				if (!isEmpty(temp[i])) {
					return false;
				}
			}
			return true;
		} else if (obj instanceof List) {
			return obj == null || ((List) obj).isEmpty();
		}
		return obj == null;
	}
}
