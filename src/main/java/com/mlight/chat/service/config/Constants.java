package com.mlight.chat.service.config;

/**
 * 常量值.
 */
public class Constants {

	/**
	 * 用户登录成功后，保存该用户的用户名.
	 */
	public static String CURRENT_USERNAME = "";

	public static final String STR_DEFAULT_VALUE = "";

	public static final long LONG_DEFAULT_VALUE = 0;

	public static boolean LOCATION = false;

	// 本地高配阿里云
	// //后台支撑服务IP
	// public static final String HOST_IP = "139.224.33.193";
	// // 音视频服务器IP
	// public static final String VIDEO_IP = "139.224.33.193";
	// // 上传地理位置坐标IP
	// public static final String UPLOADLOCATION_IP = "139.224.33.193";
	// //nginx链接和端口
	// public static final String NGINX_URL = "http://139.224.33.193:8888";
	// //文件服务器链接和端口
	// public static final String FILE_URL =
	// "http://139.224.33.193:8081/upload/app/upload";

	// 宁波服务器
	// 后台支撑服务IP
	public static final String HOST_IP = "139.224.33.193";
	// 宁波服务器，宁波tomcat现在是8080，其他的服务器默认是8081
	// public static final String HOST_IP = "192.168.2.199";
	// public static final String HOST_IP = "115.231.213.228";
	// 音视频服务器IP
	public static final String VIDEO_IP = HOST_IP;
	// 上传地理位置坐标IP
	public static final String UPLOADLOCATION_IP = "139.224.33.193";
	// 上传地理位置坐标端口
	public static final Integer UPLOADLOCATION_PORT = 10094;
	// nginx链接和端口
	public static final String NGINX_URL = "http://" + HOST_IP + ":8888";
	// 文件服务器链接和端口
	public static final String FILE_URL = "http://" + HOST_IP + ":8081/upload/app/upload";
	// 自动更新对应的配置文件
	public static final String UPLOAD_CHECK_XML = "http://" + HOST_IP + ":8081/update/version.xml";

	/**
	 * 物理位置协同情况下，如果没有获取到任何成员的位置，默认返回的经纬度坐标
	 */
	public static final double LAT = 31.23847d;
	public static final double LNG = 121.480394d;
}
