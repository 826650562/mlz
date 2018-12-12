package com.mlight.jms;

import javax.annotation.Resource;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.servlet.http.HttpServlet;
import cn.mlight.service.MapService;
import net.sf.json.JSONObject;

public class AddMeetingJms extends HttpServlet implements MessageListener {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Resource
	private MapService mapService;

	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	@Override
	public void onMessage(Message message) {
		TextMessage textMsg = (TextMessage) message;
		String content = null;
		try {
			content = textMsg.getText();
			JSONObject jsonObject = JSONObject.fromObject(content);
			int type = jsonObject.getInt("type");
			if (type == 1) {
				// 创建会议
				if (createmeeting(jsonObject)) {
					System.out.println("创建会议保存成功");
				}
			} else if (type == 2) {
				// 加入会议
				if (addmeeting(jsonObject)) {
					System.out.println("加入会议保存成功");
				}
				;
			} else if (type == 3) {
				// 退出会议
				if (outmeeting(jsonObject)) {
					System.out.println("退出会议保存成功");
				}
				;
			} else if (type == 4) {
				// 结束会议
				if (stopmeeting(jsonObject)) {
					System.out.println("结束会议保存成功");
				}
				;
			} else if (type == 5) {
				// 获得麦克
				if (getmk(jsonObject)) {
					System.out.println("获得麦克保存成功");
				}
				;
			} else if (type == 6) {
				// 释放麦克
				if (dropmk(jsonObject)) {
					System.out.println("释放麦克保存成功");
				}
				;
			} else if (type == 7) {
				// 新建文件
				if (createfile(jsonObject)) {
					System.out.println("新建文件保存成功");
				}
				;
			}
		} catch (JMSException e) {
			e.printStackTrace();
		}
	}

	public Boolean createmeeting(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		String conferencename = jsonObject.getString("conferenceName");
		String creator = jsonObject.getString("creator");
		String creatorname = jsonObject.getString("creatorName");
		Long starttime = jsonObject.getLong("starttime");
		Long endtime = jsonObject.getLong("endtime");
		int meetingtype = jsonObject.getInt("conferenceType");
		String sql = "";
		sql = "INSERT into t_conference (conference_id,conferencename,creator,creatorname,starttime,endtime,meetingtype) VALUES"
				+ "('" + conference_id + "','" + conferencename + "','" + creator + "','" + creatorname + "','"
				+ starttime + "','" + endtime + "','" + meetingtype + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}

	public Boolean addmeeting(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		String username = jsonObject.getString("nickname");
		int userid = jsonObject.getInt("userid");
		String meeting_roles = jsonObject.getString("conferenceRole");
		int inviterid = jsonObject.getInt("inviterId");
		Long entry_time = jsonObject.getLong("enterTime");
		String inviter = jsonObject.getString("inviterNickName");
		String sql = "";
		sql = "INSERT into t_conference_members (conference_id,username,userid,meeting_roles,inviterid,entry_time,inviter) VALUES"
				+ "('" + conference_id + "','" + username + "','" + userid + "','" + meeting_roles + "','" + inviterid
				+ "','" + entry_time + "','" + inviter + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}

	public Boolean outmeeting(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		String username = jsonObject.getString("nickname");
		int userid = jsonObject.getInt("userid");
		Long leave_time = jsonObject.getLong("outtime");
		String sql = "";
		sql = "INSERT into t_conference_members (conference_id,username,userid,leave_time) VALUES" + "('"
				+ conference_id + "','" + username + "','" + userid + "','" + leave_time + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}

	public Boolean stopmeeting(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		int endtype = jsonObject.getInt("endtype");
		int enduserid = jsonObject.getInt("endUserId");
		String endusername = jsonObject.getString("endUserName");
		String sql = "";
		sql = "INSERT into t_conference (conference_id,endtype,enduserid,endusername) VALUES" + "('" + conference_id
				+ "','" + endtype + "','" + enduserid + "','" + endusername + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}

	public Boolean getmk(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		int userid = jsonObject.getInt("userId");
		String username = jsonObject.getString("userName");
		Long mak_starttime = jsonObject.getLong("starttime");
		String sql = "";
		sql = "INSERT into t_getmkphone_log (conference_id,userid,username,mak_starttime) VALUES" + "('" + conference_id
				+ "','" + userid + "','" + username + "','" + mak_starttime + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}

	public Boolean dropmk(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		int userid = jsonObject.getInt("userId");
		String username = jsonObject.getString("userName");
		Long mak_outtime = jsonObject.getLong("endtime");
		String sql = "";
		sql = "INSERT into t_getmkphone_log (conference_id,userid,username,mak_outtime) VALUES" + "('" + conference_id
				+ "','" + userid + "','" + username + "','" + mak_outtime + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}

	public Boolean createfile(JSONObject jsonObject) {
		Boolean flag = true;
		String conference_id = jsonObject.getString("conferenceId");
		Long starttime = jsonObject.getLong("starttime");
		Long endtime = jsonObject.getLong("endtime");
		String file_path = jsonObject.getString("path");
		String sql = "";
		sql = "INSERT into t_conference_video (conference_id,starttime,endtime,file_path) VALUES" + "('" + conference_id
				+ "','" + starttime + "','" + endtime + "','" + file_path + "')";
		try {
			this.mapService.execute(sql);
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}
}
