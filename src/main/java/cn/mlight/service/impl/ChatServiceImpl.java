package cn.mlight.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.mlight.dao.ChatDao;
import cn.mlight.domain.Group;
import cn.mlight.domain.Message;
import cn.mlight.domain.User;
import cn.mlight.service.ChatService;

@Service("chatService")
public class ChatServiceImpl implements ChatService {
	@Autowired
	private ChatDao chatDao;

	@Override
	public List<Group> findAll() {
		return chatDao.findAll();
	}

	@Override
	public List<Message> findBySender(String admin, int queryCount) {

		return chatDao.findBySender(admin, queryCount);
	}

	@Override
	public List<User> findByUser() {

		return chatDao.findByUser();
	}

	@Override
	public List findByUser(int group_id) {
		return chatDao.findByUser(group_id);
	}

	@Override
	public List<Message> getNearestNMessage() {
		return chatDao.getNearestNMessage();
	}

	/**
	 * 查询人与人的对话信息
	 */
	@Override
	public List<Message> getNearestNMessage(String username, String username2, int top) {

		return chatDao.getNearestNMessage(username, username2, top);
	}

	/**
	 * 查询组中对话的信息
	 */
	@Override
	public List<Message> getNearestNMessage1(int groupId, int top) {

		return chatDao.getNearestNMessage1(groupId, top);
	}

	@Override
	public List<Group> findAll(String username) {

		return chatDao.findAll(username);
	}

	@Override
	public List getNearestNSession(String username, int n) {
		return chatDao.getNearestNSession(username, n);
	}
	
	/**
	 * 查询SQL语句，结果直接返回 jdbctemplate
	 */
	public List<?> getListBySql(String sql) {
		return chatDao.getListBySql(sql);
	}

}
