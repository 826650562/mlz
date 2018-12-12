package cn.mlight.dao.impl;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.springframework.jdbc.core.JdbcTemplate;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.MapDao;
import cn.mlight.domain.MyMap;

@SuppressWarnings("unchecked")
public class MapDaoImpl extends BaseDaoImpl<MyMap> implements MapDao {

	@Override
	public List<MyMap> findObjects() {
		return getSession().createQuery("from MyMap").list();
	}

	// SELECT * FROM t_trajcollection WHERE id IN (SELECT MAX(id) FROM
	// t_trajcollection GROUP BY username)
	@Override
	public List<MyMap> findByIdAndUsername() {
		String hql = "FROM MyMap WHERE id IN (SELECT MAX(id) FROM MyMap WHERE UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(sent_time)<900 GROUP BY user_name)";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public List<MyMap> findByUsername() {
		String hql = "from MyMap group by username";
		Query query = this.getSession().createQuery(hql);
		return query.list();

	}

	@Override
	public List<Object> findGroup() {
		// String sql = "select a.id grp_id , a.name grp_name , b.username
		// userid,c.name cn_name from t_group a JOIN t_group_member b on a.id =
		// b.group_id JOIN t_user c on c.username = b.username ORDER BY
		// a.`name`";
		String sql = " select a.id grp_id , a.name grp_name ,b.id MemberId, b.username userid,c.name cn_name ,c.username cn_username from t_group a JOIN t_group_member b on a.id = b.group_id JOIN sys_user c on c.username = b.username  where b.username in (select ff.user_name from t_last_location ff )ORDER BY a.`name`";
		List list = this.jdbcTemplate.queryForList(sql);
		return list;
	}
	
			
	public HashMap findGroupAndMember() {
		String sql = "SELECT  *  FROM   sys_office  t  where t.del_flag =0 and id!=10 ORDER BY sort ";
		List list = this.jdbcTemplate.queryForList(sql);
		HashMap members=new HashMap();
		for(int i =list.size()-1;i>=0;i--){
			Map group=(Map) list.get(i);
			String id=group.get("id").toString();
			String sort=group.get("sort").toString();
			String parent_ids=group.get("parent_ids").toString();
			String name=group.get("name").toString();
			String sql2 = "SELECT * from sys_user t where t.office_id='"+id+"' and t.del_flag =0 ";
			List memberlist = this.jdbcTemplate.queryForList(sql2);
			members.put(name+";"+id+';'+parent_ids+";"+sort, memberlist);
		}
		return members;
	}

	/**
	 * JdbcTemplate对象，通过Spring注入
	 */
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

}
