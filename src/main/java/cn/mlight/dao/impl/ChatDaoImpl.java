package cn.mlight.dao.impl;

import java.math.BigInteger;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.jdbc.core.JdbcTemplate;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.ChatDao;
import cn.mlight.domain.Group;
import cn.mlight.domain.Message;
import cn.mlight.domain.User;

public class ChatDaoImpl extends BaseDaoImpl<Group> implements ChatDao {
	

	/**
	 * JdbcTemplate对象，通过Spring注入
	 */
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Override
	public List<Message> findBySender(String admin, int queryCount) {
		String sql = "select * FROM v_message_all WHERE sender=? OR receiver=?  GROUP BY getHB(sender,receiver,group_id) ORDER BY create_time LIMIT ?";
		SQLQuery query = getSession().createSQLQuery(sql).addEntity(Message.class);
		query.setParameter(0, admin);
		query.setParameter(1, admin);
		query.setParameter(2, queryCount);
		return query.list();
	}

	@Override
	public List<User> findByUser() {
		String hql = "from User";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public List findByUser(int group_id) {
		String sql = "select a.id,a.group_id,a.username,b.name from t_group_member a left join t_user b on a.username=b.username where group_id=?";
		SQLQuery query = this.getSession().createSQLQuery(sql).addScalar("id", StandardBasicTypes.INTEGER)
				.addScalar("group_id", StandardBasicTypes.INTEGER).addScalar("username", StandardBasicTypes.STRING)
				.addScalar("name", StandardBasicTypes.STRING);
		query.setParameter(0, group_id);
		return query.list();
	}

	@Override
	public List<Message> getNearestNMessage() {

		return null;
	}

	@Override
	public List<Message> getNearestNMessage(String username, String username2, int top) {
		String sql = "select * from v_message_all where sender in(?,?) and receiver in(?,?) and group_id='-1' order by create_time limit ?";
		SQLQuery query = this.getSession().createSQLQuery(sql);
		query.setParameter(0, username);
		query.setParameter(1, username2);
		query.setParameter(2, username);
		query.setParameter(3, username2);
		query.setParameter(4, top);

		List<Object[]> tmp = query.list();
		List<Message> result = new LinkedList<>();
		for (Object[] i : tmp) {
			Message msg = new Message();
			msg.setType(((Byte) i[2]).intValue());
			msg.setContent((String) i[3]);
			if (i[4] != null) {
				msg.setAttachment((String) i[4]);
			}
			msg.setCreate_time((Date) i[5]);
			msg.setSender((String) i[9]);
			msg.setReceiver((String) i[10]);
			msg.setSendername((String) i[12]);
			msg.setReceivername((String) i[13]);
			msg.setId(((BigInteger) i[0]).longValue());
			result.add(msg);
		}
		return result;
	}

	@Override
	public List<Message> getNearestNMessage1(int groupId, int top) {
		String sql = "select * from v_message_all where group_id=? group by create_time order by create_time limit ?";
		SQLQuery query = this.getSession().createSQLQuery(sql);
		query.setParameter(0, groupId);
		query.setParameter(1, top);

		List<Object[]> tmp = query.list();
		List<Message> result = new LinkedList<>();
		for (Object[] i : tmp) {
			Message msg = new Message();
			msg.setType(((Byte) i[2]).intValue());
			msg.setContent((String) i[3]);
			if (i[4] != null) {
				msg.setAttachment((String) i[4]);
			}
			msg.setCreate_time((Date) i[5]);
			msg.setSender((String) i[9]);
			msg.setReceiver((String) i[10]);
			msg.setSendername((String) i[12]);
			msg.setReceivername((String) i[13]);
			msg.setId(((BigInteger) i[0]).longValue());
			result.add(msg);
		}
		return result;
	}

	@Override
	public List<Group> findAll(String username) {
		String sql = "SELECT * FROM t_group WHERE id IN(SELECT DISTINCT group_id  FROM t_group_member WHERE  username= ?)";
		SQLQuery query = this.getSession().createSQLQuery(sql).addEntity(Group.class);
		query.setParameter(0, username);
		return query.list();
	}

	@Override
	public List getNearestNSession(String username, int n) {
		String sql = "select c.chatType chatType,cast(c.user_id as char(100)) user_id from(\n"
				+ "(select 1 chatType, group_id user_id, max(create_time) t  from t_message a where  (sender = :user or receiver = :user) and (group_id <> -1 and group_id is not null) group by forSearch ) \n"
				+ "union \n"
				+ "(select 0 chatType,getTargetUser(sender,receiver,:user) user_id, max(create_time) t from t_message b where (sender = :user or receiver = :user) and group_id = -1 and getTargetUser(sender,receiver,:user) <> '' group by forSearch) \n"
				+ ") c  where (c.user_id <> '' and c.user_id is not null) order by c.t desc  limit :num";
		SQLQuery query = this.getSession().createSQLQuery(sql);
		query.setParameter("user", username);
		query.setParameter("num", n);
		return query.list();
	}

	public List getListBySql(String sqlStr){
		return this.getJdbcTemplate().queryForList(sqlStr);
	}
}
