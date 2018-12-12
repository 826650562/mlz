package com.mlight.chat.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Hashtable;
import java.util.Map;

import cn.mlight.utils.CheckUtils;

public class DateUtils {

	private static Map dateFormats = new Hashtable();

	private static DateFormat getDateFormat(String pattern) {
		if (!dateFormats.containsKey(pattern)) {
			DateFormat df = new SimpleDateFormat(pattern);
			dateFormats.put(pattern, df);
		}
		return (DateFormat) dateFormats.get(pattern);
	}

	public static String getDispDate(String strDate, String srcPattern, String dstPattern) {
		DateFormat srcDf = getDateFormat(srcPattern);
		DateFormat dstDf = getDateFormat(dstPattern);
		try {
			return dstDf.format(srcDf.parse(strDate));
		} catch (ParseException e) {
		}
		return "";
	}

	public static long getMilliseconds(String date, String pattern) {
		DateFormat df = getDateFormat(pattern);
		try {
			return df.parse(date).getTime();
		} catch (ParseException e) {
		}
		return 0L;
	}

	public static String getDispDate(Date date, String pattern) {
		DateFormat df = getDateFormat(pattern);
		return df.format(date);
	}

	public static String getDispNow(String pattern) {
		return getDispDate(Calendar.getInstance().getTime(), pattern);
	}

	public static String getSysDate() {
		return getDispNow("yyyyMMddHHmmss");
	}

	/**
	 * 获取系统当前时间
	 *
	 * @return yyyy-MM-dd HH:mm:ss
	 */
	public static String getNowTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowTime = sdf.format(new Date());
		return nowTime;
	}

	/**
	 * 获取系统当前时间
	 *
	 * @return yyyy-MM-dd
	 */
	public static String getSystemTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String sysTime = sdf.format(new Date());
		return sysTime;
	}

	public static String getDisplayDate(String time) {
		return getDisplayDate(time, true);
	}

	public static String getDisplayDate(String time, boolean covertNull) {
		if (CheckUtils.isEmpty(time)) {
			if (covertNull) {
				return "---/--/--";
			}
			return "";
		}
		int length = time.length();
		if (length == 8) {
		}
		if (time.length() == 8) {
			return getDispDate(time, "yyyyMMdd", "yyyy-MM-dd");
		} else if (time.length() == 12) {
			return getDispDate(time, "yyyyMMddHHmm", "yyyy-MM-dd");
		} else if (time.length() == 14) {
			return getDispDate(time, "yyyyMMddHHmmss", "yyyy-MM-dd");
		} else {
			return getDispDate(time, "yyyyMMddHHmmss", "yyyy-MM-dd");
		}

	}

	public static String getDisplayTime(String time) {
		return getDisplayTime(time, true);
	}

	public static String getDisplayTime(String time, boolean covertNull) {
		if (CheckUtils.isEmpty(time)) {
			if (covertNull) {
				return "---/--/--";
			}
			return "";
		}

		return getDispDate(time, "yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
	}

	public static long getTimeStamp(String time) throws Exception {
		return getTimeStamp(time, "yyyyMMddHHmmss");
	}

	public static long getTimeStamp(String time, String pattern) throws Exception {
		DateFormat format = null;
		if (time.length() == pattern.length()) {
			format = getDateFormat(pattern);
		} else if (time.length() == 8) {
			format = getDateFormat("yyyyMMdd");
		} else if (time.length() == 12) {
			format = getDateFormat("yyyyMMddHHmm");
		} else if (time.length() == 14) {
			format = getDateFormat("yyyyMMddHHmmss");
		} else if (time.length() == 16) {
			format = getDateFormat("yyyy-MM-dd HH:mm");
		} else if (time.length() == 19) {
			format = getDateFormat("yyyy-MM-dd HH:mm:ss");
		} else {
			throw new Exception();
		}

		Date date = null;
		try {
			date = format.parse(time);
		} catch (ParseException e) {

		}
		return date.getTime();
	}

	public static String addTime(String time, int field, int amount, String pattern) {
		Calendar cal = Calendar.getInstance();
		DateFormat df = getDateFormat(pattern);
		Date date = null;
		try {
			date = df.parse(time);
		} catch (ParseException e) {

		}
		cal.setTime(date);
		cal.add(field, amount);
		return df.format(cal.getTime());
	}

	public static String addTime(Date time, int field, int amount, String pattern) {
		Calendar cal = Calendar.getInstance();
		DateFormat df = getDateFormat(pattern);
		cal.setTime(time);
		cal.add(field, amount);
		return df.format(cal.getTime());
	}

	/**
	 * 将传入的时间过滤，如果时间为空，则自动返回昨天的时间
	 *
	 * @param initTime
	 *            初始化时间
	 * @return
	 */
	public static String formatTime(String initTime) {
		Date date = new Date();
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		String _time = "";
		_time = f.format(new Date());
		_time = DateUtils.addDay(_time, -1);
		if (!CheckUtils.isEmpty(initTime)) {
			try {
				date = f.parse(initTime);
				_time = f.format(date);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
		return _time;
	}

	/**
	 * 把获取到的时间戳转换为日期类型
	 * 
	 * @param time
	 *            时间戳，long类型
	 * @return java.util.Date
	 */
	public static Date formatTime(long time) {
		Date date = new Date();
		date.setTime(time);
		return date;
	}

	/**
	 * 将时间由字符串类型转换为标准的时间类型
	 *
	 * @param initTime
	 * @param inPattern
	 * @param outPatttern
	 * @return
	 * @author 李伟
	 */
	public static String formatTime(String initTime, String inPattern, String outPatttern) {
		if (CheckUtils.isEmpty(initTime)) {
			return "";
		} else {
			if (initTime.length() == 10) {
				initTime = initTime + " 00:00:00";
			}
		}
		Date date = new Date();
		SimpleDateFormat f = new SimpleDateFormat(inPattern);
		SimpleDateFormat outSdf = new SimpleDateFormat(outPatttern);
		String _time = "";
		_time = f.format(new Date());
		if (!CheckUtils.isEmpty(initTime)) {
			try {
				date = f.parse(initTime);
				_time = outSdf.format(date);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
		return _time;
	}

	public static String AddYear(String initTime, int count) {
		String _time = "";
		if (!CheckUtils.isEmpty(initTime)) {
			try {
				int year = 0, month = 0, day = 0;
				String[] _temp = initTime.split(" ");
				String[] getDate = _temp[0].split("-");
				year = Integer.parseInt(getDate[0]);
				month = Integer.parseInt(getDate[1]);
				day = Integer.parseInt(getDate[2]);

				year = year + count;
				_time = String.valueOf(year) + "-" + String.valueOf(month) + "-" + String.valueOf(day);
				// System.out.println(String.valueOf(year));
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
		}

		return _time;
	}

	public static String formatWeek(String sourcetime) {
		sourcetime = sourcetime.concat(" 00:00:00");
		Date date = new Date();
		SimpleDateFormat f = new SimpleDateFormat("E");
		String _time = "";
		_time = f.format(date);
		// _time = DateUtils.addDay(_time, -1);
		if (!CheckUtils.isEmpty(sourcetime)) {
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				date = sdf.parse(sourcetime);

				_time = f.format(date);
				_time = String.valueOf(date.getDay());
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
		return _time;
	}

	/**
	 * 将日期相加制定的日期
	 *
	 * @param time
	 *            要转换的日期
	 * @param addNum
	 *            要增加的天数
	 * @return 转换好的字符串日期
	 */
	public static String addDay(String time, int addNum) {
		// 把time转换成date,再把date转换成
		String[] input = time.split("-");
		int year = Integer.parseInt(input[0]);
		int month = Integer.parseInt(input[1]) - 1;
		int day = Integer.parseInt(input[2]);
		Calendar c = Calendar.getInstance();
		c.set(year, month, day);
		c.add(Calendar.DATE, addNum);
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		Date date = c.getTime();
		String _time = f.format(date);
		return _time;
	}

	/**
	 * 比较两个日期哪个在前面，哪个在后面
	 *
	 * @param beginTime
	 *            第一个时间
	 * @param endTime
	 *            第二个时间
	 * @return 比较结构
	 */
	public static boolean isAfter(String beginTime, String endTime) {
		Date beginDate = new Date();
		Date endDate = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		try {
			if (!CheckUtils.isEmpty(beginTime) && !CheckUtils.isEmpty(endTime)) {
				beginDate = format.parse(beginTime);
				endDate = format.parse(endTime);
			} else {
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (beginDate.after(endDate)) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 将字符串类型转换成date类型
	 *
	 * @param time
	 * @param pattern
	 * @return
	 */
	public static Date StringToDate(String time, String pattern) {
		Calendar cal = Calendar.getInstance();
		DateFormat df = getDateFormat(pattern);
		Date date = null;
		try {
			date = df.parse(time);
		} catch (ParseException e) {
			System.out.println("转换格式出错。");
			e.printStackTrace();
		}
		return date;
	}

	public static String getFormatTime(long date, String pattern) {
		return getDispDate(new Date(date), pattern);
	}

	public static void main(String[] args) throws Exception {
		// String s = getDispDate(new Date(), "yyyy-MM-dd");
		//
		// System.out.println(s);
		String xx = DateUtils.getDispDate("20170101", "yyyyMMdd", "yyyy-MM-dd");
		long t = getTimeStamp("20170101", "yyyyMMdd");
		System.out.println(xx);
	}

}
