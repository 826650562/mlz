package com.mlight.chat.service.utils;

public class SharedSetUtil {

	// //当前登录者的用户名
	// public static void saveLoginer(Context context,String s){
	// SharedPreferences.Editor edit = context.getSharedPreferences("loginer",
	// Context.MODE_PRIVATE).edit();
	// edit.putString("loginer_id",s).commit();
	// }
	// public static String getLoginer(Context context){
	// return Constants.CURRENT_USERNAME;
	// }
	//
	// //新消息提醒是否显示内容
	// public static boolean getShowContent(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_SHOW_NEW_MESSAGE_CONTENT,
	// 0);
	// return
	// preferences.getBoolean(PreferenceConstants.PRE_BOOLEAN_SHOW_NEW_MESSAGE_CONTENT,
	// true);
	// }
	//
	// public static void saveShowContent(Boolean isOn, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_SHOW_NEW_MESSAGE_CONTENT,
	// 0).edit();
	// editor.putBoolean(PreferenceConstants.PRE_BOOLEAN_SHOW_NEW_MESSAGE_CONTENT,
	// isOn);
	// editor.commit();
	// }
	//
	// public static boolean getUploadLocation(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences("upload_location", 0);
	// return preferences.getBoolean("upload_location", false);
	// }
	//
	// public static void saveUploadLocation(Boolean isOn, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences("upload_location", 0).edit();
	// editor.putBoolean("upload_location", isOn);
	// editor.commit();
	// }
	//
	// //新消息提醒是否有声音
	// public static boolean getReceiveMessageSound(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_SOUND,
	// 0);
	// return
	// preferences.getBoolean(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_SOUND,
	// true);
	// }
	//
	// public static void saveReceiveMessageSound(Boolean isOn, Context context)
	// {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_SOUND,
	// 0).edit();
	// editor.putBoolean(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_SOUND,
	// isOn);
	// editor.commit();
	// }
	//
	// //新消息提醒是否震动
	// public static boolean getReceiveMessageVibrate(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_VIBRATE,
	// 0);
	// return
	// preferences.getBoolean(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_VIBRATE,
	// true);
	// }
	//
	// public static void saveReceiveMessageVibrate(Boolean isOn, Context
	// context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_VIBRATE,
	// 0).edit();
	// editor.putBoolean(PreferenceConstants.PRE_BOOLEAN_RECEIVE_MESSAGE_VIBRATE,
	// isOn);
	// editor.commit();
	// }
	//
	// //聊天页面字体大小
	// public static String getTextSize(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.PRE_STR_TEXT_SIZE, 0);
	// return preferences.getString(PreferenceConstants.PRE_STR_TEXT_SIZE, "1");
	// }
	//
	// public static void saveTextSize(String textSize, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.PRE_STR_TEXT_SIZE,
	// 0).edit();
	// editor.putString(PreferenceConstants.PRE_STR_TEXT_SIZE, textSize);
	// editor.commit();
	// }
	//
	// //视频质量
	// public static String getVideoType(Context context){
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.VIDEO_TYPE, 0);
	// return preferences.getString(PreferenceConstants.VIDEO_TYPE, "0");
	// }
	//
	// public static void saveVideoType(String videoType,Context context){
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.VIDEO_TYPE, 0).edit();
	// editor.putString(PreferenceConstants.VIDEO_TYPE, videoType);
	// editor.commit();
	// }
	//
	// //实时视频 real_time_video
	// public static String getRealTimeVideo(Context context){
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.REAL_TIME_VIDEO, 0);
	// return preferences.getString(PreferenceConstants.REAL_TIME_VIDEO, "0");
	// }
	//
	// public static void saveRealTimeVideo(String realTimeVideo,Context
	// context){
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.REAL_TIME_VIDEO,
	// 0).edit();
	// editor.putString(PreferenceConstants.REAL_TIME_VIDEO, realTimeVideo);
	// editor.commit();
	// }
	//
	//
	//
	// //是否听筒模式
	// public static boolean getEarphoneMode(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_IS_EARPHONE_MODE,
	// 0);
	// return
	// preferences.getBoolean(PreferenceConstants.PRE_BOOLEAN_IS_EARPHONE_MODE,
	// false);
	// }
	//
	// public static void saveEarphoneMode(Boolean isOn, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_IS_EARPHONE_MODE,
	// 0).edit();
	// editor.putBoolean(PreferenceConstants.PRE_BOOLEAN_IS_EARPHONE_MODE,
	// isOn);
	// editor.commit();
	// }
	//
	// //是自动播放语音
	// public static boolean getAutoPlayAudio(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_IS_AUTO_PLAY_AUDIO,
	// 0);
	// return
	// preferences.getBoolean(PreferenceConstants.PRE_BOOLEAN_IS_AUTO_PLAY_AUDIO,
	// false);
	// }
	//
	// public static void saveAutoPlayAudio(Boolean isOn, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.PRE_BOOLEAN_IS_AUTO_PLAY_AUDIO,
	// 0).edit();
	// editor.putBoolean(PreferenceConstants.PRE_BOOLEAN_IS_AUTO_PLAY_AUDIO,
	// isOn);
	// editor.commit();
	// }
	//
	// //当前点对点聊天人的username
	// public static String getChatUserName(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.CHAT_USERNAME, 0);
	// return preferences.getString(PreferenceConstants.CHAT_USERNAME, "");
	// }
	//
	// public static void saveChatUserName(String textSize, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.CHAT_USERNAME,
	// 0).edit();
	// editor.putString(PreferenceConstants.CHAT_USERNAME, textSize);
	// editor.commit();
	// }
	//
	// //当前群聊的GroupId
	// public static String getChatGroupId(Context context) {
	// SharedPreferences preferences =
	// context.getSharedPreferences(PreferenceConstants.CHAT_GROUPID, 0);
	// return preferences.getString(PreferenceConstants.CHAT_GROUPID, "");
	// }
	//
	// public static void saveChatGroupId(String textSize, Context context) {
	// SharedPreferences.Editor editor =
	// context.getSharedPreferences(PreferenceConstants.CHAT_GROUPID, 0).edit();
	// editor.putString(PreferenceConstants.CHAT_GROUPID, textSize);
	// editor.commit();
	// }
	//
	// // 未提交或提交失败时，保存意见反扣你内容
	// public static String getFeedbackContent(Context context, String username)
	// {
	// SharedPreferences preferences = context.getSharedPreferences(username +
	// "feedback", Activity.MODE_PRIVATE);
	// return preferences.getString(PreferenceConstants.PRE_FEEDBACK_CONTENT,
	// "");
	// }
	//
	// public static void setFeedbackContent(Context context, String username,
	// String content) {
	// SharedPreferences.Editor editor = context.getSharedPreferences(username +
	// "feedback", Activity.MODE_PRIVATE).edit();
	// editor.putString(PreferenceConstants.PRE_FEEDBACK_CONTENT, content);
	// editor.commit();
	// }
}
