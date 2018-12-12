package cn.mlight.dao;

import java.util.List;

import cn.mlight.base.dao.BaseDao;
import cn.mlight.domain.Message;

public interface MessageDao extends BaseDao<Message> {

	public Integer getCount(Message ms);

	public List<Message> getAll(Message ms, Integer pageNum, Integer pageCount);

	@Override
	public List<Message> findAll();

	public List<Message> findContexts(String sender, String receiver);

	public List<Message> findObjects();

	public int findCount();

	public List<Message> findByPage(int begin, int pageSize);

	public List<Message> findByPage(String sender, String receiver, int begin, int pageSize);

	public List<Message> findByPage(String sender, String receiver, String condition, int begin, int pageSize);

	public List<Message> findByGroupid(String groupid, String condition, int begin, int pageSize);
}
