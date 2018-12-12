package cn.mlight.service;

import java.util.List;
import cn.mlight.domain.Group;
import cn.mlight.domain.Message;
import cn.mlight.domain.User;

public interface ChatService {

	public List<Group> findAll();

	public List<Message> findBySender(String admin, int queryCount);

	public List<User> findByUser();

	public List findByUser(int group_id);

	public List<Message> getNearestNMessage();

	public List<Message> getNearestNMessage(String username, String username2, int top);

	public List<Message> getNearestNMessage1(int groupId, int top);

	public List<Group> findAll(String username);

	public List getNearestNSession(String username, int n);
	
	public List<?> getListBySql(String sql) ;

}
