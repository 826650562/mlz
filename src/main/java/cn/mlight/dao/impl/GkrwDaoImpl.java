package cn.mlight.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.GkrwDao;
import cn.mlight.domain.Message;
import cn.mlight.domain.Gkrw;

@SuppressWarnings("unchecked")
public class GkrwDaoImpl extends BaseDaoImpl<Gkrw> implements GkrwDao {

	@Override
	public Integer getCount(Gkrw ns) {
		DetachedCriteria dc = DetachedCriteria.forClass(Gkrw.class);
		dc.setProjection(Projections.rowCount());
		List<Long> count = dc.getExecutableCriteria(getSession()).list();
		return count.get(0).intValue();
	}

	@Override
	public List<Gkrw> getAll(Gkrw ns, Integer pageNum, Integer pageCount) {
		DetachedCriteria dc = DetachedCriteria.forClass(Gkrw.class);
		Criteria criteria = dc.getExecutableCriteria(getSession());
		criteria.setFirstResult((pageNum - 1) * pageCount);
		criteria.setMaxResults(pageCount);
		return criteria.list();
	}

	@Override
	public List<Gkrw> findAll() {
		String hql = "from t_Gkrw group by id";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public List<Gkrw> findObjects() {
		String hql = "from t_Gkrw group by id";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public int findCount() {
		String hql = "SELECT COUNT(*) FROM (SELECT * FROM Gkrw where deleted = '0' GROUP BY id ) a";
		Query query = getSession().createQuery(hql);
		List<Long> temp = query.list();
		//System.out.println(temp);
		/* SQLQuery query = this.getSession().createSQLQuery(sql); */

		return temp.get(0).intValue();
	}

	@Override
	public List<Gkrw> findByPage(int begin, int pageSize, String condition, String state, String level,
			List rwidstr) {
		String hql ="";
		if(rwidstr.size() > 0){
		 hql = "from Gkrw where "+condition+" and state = "+state+" and level ="+level+" and rwid in (:ElementUUid) order by start_time desc";
		}else{
			 hql = "from Gkrw where "+condition+" and state = "+state+" and level ="+level+" and rwid is null order by start_time desc";
		}
		Query query = getSession().createQuery(hql);
		if(rwidstr.size() > 0){
		query.setParameterList("ElementUUid", rwidstr);
		}
		query.setFirstResult(begin);
		query.setMaxResults(pageSize);
		
		List<Gkrw> list = query.list();
		return list.size() > 0 ? list : null;
	}

}
