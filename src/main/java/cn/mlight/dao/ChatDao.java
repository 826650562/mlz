package cn.mlight.dao;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

import cn.mlight.domain.Group;
import cn.mlight.domain.Message;
import cn.mlight.domain.User;

public interface ChatDao {
	/**
	 * 获取JdbcTemplate对象，用于复杂查询时直接使用SQL语句
	 * 
	 *
	 * @return JdbcTemplate
	 */
	public JdbcTemplate getJdbcTemplate();


	public List<Group> findAll();

	public List<Message> findBySender(String admin, int queryCount);

	public List<User> findByUser();

	public List findByUser(int group_id);

	public List<Message> getNearestNMessage();

	public List<Message> getNearestNMessage(String username, String username2, int top);

	public List<Message> getNearestNMessage1(int groupId, int top);

	public List<Group> findAll(String username);

	/**
	 * 获得某个用户最近的N次会,并按时间倒序排列<br/>
	 * List中等内容为[chatType userId];chatType: 0 表示个人；1表示群组；
	 * userId，username；或者groupId
	 */
	public List getNearestNSession(String username, int n);
	
	public List getListBySql(String sqlStr);
}
