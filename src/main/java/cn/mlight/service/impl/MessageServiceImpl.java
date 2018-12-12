package cn.mlight.service.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Properties;

import javax.annotation.Resource;
import javax.imageio.ImageIO;

import cn.mlight.utils.EncryptUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;

import org.hibernate.Query;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Service;

import cn.mlight.dao.MapDao;
import cn.mlight.dao.MessageDao;
import cn.mlight.domain.HistoryMsgPo;
import cn.mlight.domain.Message;
import cn.mlight.domain.MessageModel;
import cn.mlight.domain.HistoryMsgPo;
import cn.mlight.service.MessageService;
import cn.mlight.utils.PageBean;
import sun.misc.BASE64Encoder;

@Service("messageService")
public class MessageServiceImpl implements MessageService {
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;
	@Resource
	private MessageDao messageDao;

	@Resource
	private MapDao mapDao;

	@Override
	public Integer getCount(Message ms) {
		return messageDao.getCount(ms);
	}

	@Override
	public List<Message> getAll(Message ms, Integer pageNum, Integer pageCount) {

		return messageDao.getAll(ms, pageNum, pageCount);
	}

	@Override
	public List<Message> findAll() {

		return messageDao.findAll();
	}

	@Override
	public List<Message> findContexts(String sender, String receiver) {

		return messageDao.findContexts(sender, receiver);
	}

	@Override
	public List<Message> findObjects() {

		return messageDao.findObjects();
	}

	/**
	 * zlj - 2016-5-8 查询历史对话信息，
	 * 参数：ls_startTime,ls_endTime,ls_conditions,pageNo,pageSize
	 * 
	 */
	@Override
	public PageBean<HistoryMsgPo> findByMessage(String ls_startTime, String ls_endTime, String ls_conditions,
			Integer pageNo, Integer pageSize) {
		int totalPage = 0;
		// 模糊查询条件
		String sqlQuery = "";
		if (ls_conditions != null && !ls_conditions.equals("")) {
			sqlQuery = " (u.name LIKE '%" + ls_conditions + "%' or p.name LIKE '%" + ls_conditions
					+ "%' OR g.name LIKE '%" + ls_conditions + "%' ) ";
		}
		// 时间条件
		String condition = " where 1=1  ";
		if (ls_startTime != null && !"".equals(ls_startTime)) {
			condition = condition + " and m.create_time >= '" + ls_startTime + "'";
		}
		if (ls_endTime != null && !"".equals(ls_endTime)) {
			condition = condition + " and m.create_time <= '" + ls_endTime + "'";
		}
		if (!"".equals(sqlQuery)) {
			condition = condition + " and " + sqlQuery;
		}
		int totalNo = mapDao.getJdbcTemplate()
				.queryForInt("SELECT count(1) FROM((SELECT * FROM t_message a GROUP BY fenzu) m "
						+ "LEFT JOIN t_user u ON m.sender = u.username LEFT JOIN t_user p ON m.receiver = p.username"
						+ " LEFT JOIN t_group g ON m.group_id = g.id )" + condition + "");
		PageBean<HistoryMsgPo> pb = new PageBean<HistoryMsgPo>();
		pb.setPageNo(pageNo);
		pb.setPageSize(pageSize);
		pb.setTotalNo(totalNo);
		if (totalNo % pageSize == 0) {
			totalPage = totalNo / pageSize;
		} else {
			totalPage = (totalNo / pageSize) + 1;
		}
		pb.setTotalPage(totalPage);
		int begin = (pageNo - 1) * pageSize;
		// List<Message> list1 = messageDao.findByPage(begin,pageSize);
		List<HistoryMsgPo> list = mapDao.getJdbcTemplate()
				.query("SELECT m.sender,u.name AS sendername,u.avatar AS senderlogo,m.receiver,p.name AS receivername,"
						+ "p.avatar AS receiverlogo,m.group_id,g.name AS groupxx,g.logo AS grouplogo FROM "
						+ "(SELECT * FROM t_message a GROUP BY fenzu ) m "
						+ "LEFT JOIN t_user u ON m.sender = u.username LEFT JOIN t_user p ON m.receiver = p.username "
						+ "LEFT JOIN t_group g ON m.group_id = g.id" + condition
						+ " ORDER BY group_id DESC,sender LIMIT " + begin + "," + pageSize + " ",
				new RowMapper<HistoryMsgPo>() {
					@Override
					public HistoryMsgPo mapRow(ResultSet rs, int num) throws SQLException {
						HistoryMsgPo po = new HistoryMsgPo();
						po.setSender(rs.getString("sender"));
						po.setSendername(rs.getString("sendername"));
						po.setReceiver(rs.getString("receiver"));
						po.setReceivername(rs.getString("receivername"));
						po.setGroup_id(rs.getString("group_id"));
						po.setGroupxx(rs.getString("groupxx"));
						po.setReceiverlogo(rs.getString("receiverlogo"));
						po.setSenderlogo(rs.getString("senderlogo"));
						po.setGrouplogo(rs.getString("grouplogo"));
						return po;
					}
				});
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		String realpath = "";
		String yhxx = "";
		String pdxx = "";
		for (int i = 0; i < list.size(); i++) {
			String Senderlogo = list.get(i).getSenderlogo();
			if (Senderlogo != null && !"".equals(Senderlogo)) {
				String format = Senderlogo.split("\\.")[1];
				String spath = Senderlogo.replace("M00", fdfsUrl);
				File file = new File(spath);
				String dataUrl = null;
				if (file.exists()) {
					BufferedImage bi;
					try {
						bi = ImageIO.read(file);
						ByteArrayOutputStream baos = new ByteArrayOutputStream();
						ImageIO.write(bi, format, baos);
						byte[] bytes = baos.toByteArray();
						dataUrl = encoder.encodeBuffer(bytes).trim();
					} catch (Exception e) {
						e.printStackTrace();
					}
					// file.delete();
				}
				if (dataUrl != null) {
					dataUrl = "data:image/" + format + ";base64," + dataUrl;
					list.get(i).setSenderlogo(dataUrl);
				}
			}
			String Receiverlogo = list.get(i).getReceiverlogo();
			if (Receiverlogo != null && !"".equals(Receiverlogo)) {
				String format = Receiverlogo.split("\\.")[1];
				String rpath = Receiverlogo.replace("M00", fdfsUrl);
				File file = new File(rpath);
				String dataUrl = null;
				if (file.exists()) {
					BufferedImage bi;
					try {
						bi = ImageIO.read(file);
						ByteArrayOutputStream baos = new ByteArrayOutputStream();
						ImageIO.write(bi, format, baos);
						byte[] bytes = baos.toByteArray();
						dataUrl = encoder.encodeBuffer(bytes).trim();
					} catch (Exception e) {
						e.printStackTrace();
					}
					// file.delete();
				}
				if (dataUrl != null) {
					dataUrl = "data:image/" + format + ";base64," + dataUrl;
					list.get(i).setReceiverlogo(dataUrl);
				}
			}
		}
		pb.setBeanList(list);
		return pb;
	}

	@Override
	public PageBean<Message> findContexts(String sender, String receiver, Integer pageNo) {
		int pageSize = 10;
		int totalPage = 0;
		PageBean<Message> pb = new PageBean<Message>();
		pb.setPageSize(pageSize);
		pb.setPageNo(pageNo);
		int totalNo = mapDao.getJdbcTemplate()
				.queryForInt("SELECT COUNT(1) FROM (SELECT * FROM t_message WHERE sender IN('" + sender + "','"
						+ receiver + "') AND receiver IN('" + sender + "','" + receiver + "')) a");
		pb.setTotalNo(totalNo);
		if (totalNo % pageSize == 0) {
			totalPage = totalNo / pageSize;
		} else {
			totalPage = (totalNo / pageSize) + 1;
		}
		pb.setTotalPage(totalPage);
		int begin = (pageNo - 1) * pageSize;
		List<Message> list = messageDao.findByPage(sender, receiver, begin, pageSize);
		pb.setBeanList(list);
		return pb;
	}

	/*
	 * 查询某对用户的聊天信息
	 */
	@Override
	public PageBean<Message> findContexts(String sender, String receiver, String ls_startTime, String ls_endTime,
			Integer pageNo) {
		String condition = " group_id = -1 ";
		if (ls_startTime != null && !"".equals(ls_startTime)) {
			condition = condition + " and create_time >= '" + ls_startTime + "'";
		}
		if (ls_endTime != null && !"".equals(ls_endTime)) {
			condition = condition + " and create_time <= '" + ls_endTime + "'";
		}
		int pageSize = 10;
		int totalPage = 0;
		PageBean<Message> pb = new PageBean<Message>();
		pb.setPageSize(pageSize);
		pb.setPageNo(pageNo);
		int totalNo = mapDao.getJdbcTemplate()
				.queryForInt("SELECT COUNT(1) FROM (SELECT * FROM t_message WHERE  " + condition + " and sender IN('"
						+ sender + "','" + receiver + "') AND receiver IN('" + sender + "','" + receiver + "')) a");
		pb.setTotalNo(totalNo);
		if (totalNo % pageSize == 0) {
			totalPage = totalNo / pageSize;
		} else {
			totalPage = (totalNo / pageSize) + 1;
		}
		pb.setTotalPage(totalPage);
		int begin = (pageNo - 1) * pageSize;
		List<Message> list = messageDao.findByPage(sender, receiver, condition, begin, pageSize);
		pb.setBeanList(list);
		return pb;
	}

	/*
	 * 查询某个群组的聊天信息
	 */
	@Override
	public PageBean<Message> findQzContexts(String groupid, String startTime, String endTime, Integer pageNo) {
		String condition = " 1 = 1 ";
		if (startTime != null && !"".equals(startTime)) {
			condition = condition + " and create_time >= '" + startTime + "'";
		}
		if (endTime != null && !"".equals(endTime)) {
			condition = condition + " and create_time <= '" + endTime + "'";
		}
		int pageSize = 10;
		int totalPage = 0;
		PageBean<Message> pb = new PageBean<Message>();
		pb.setPageSize(pageSize);
		pb.setPageNo(pageNo);
		int totalNo = mapDao.getJdbcTemplate().queryForInt("SELECT COUNT(*) FROM (SELECT * FROM t_message WHERE  "
				+ condition + " and  group_id = '" + groupid + "' GROUP BY create_time) a");
		pb.setTotalNo(totalNo);
		if (totalNo % pageSize == 0) {
			totalPage = totalNo / pageSize;
		} else {
			totalPage = (totalNo / pageSize) + 1;
		}
		pb.setTotalPage(totalPage);
		int begin = (pageNo - 1) * pageSize;
		List<Message> list = messageDao.findByGroupid(groupid, condition, begin, pageSize);
		pb.setBeanList(list);
		return pb;
	}

}
