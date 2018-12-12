package cn.mlight.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.TzggDao;
import cn.mlight.domain.Message;
import cn.mlight.domain.Tzgg;

@SuppressWarnings("unchecked")
public class TzggDaoImpl extends BaseDaoImpl<Tzgg> implements TzggDao {

	@Override
	public Integer getCount(Tzgg ns) {
		DetachedCriteria dc = DetachedCriteria.forClass(Tzgg.class);
		dc.setProjection(Projections.rowCount());
		List<Long> count = dc.getExecutableCriteria(getSession()).list();
		return count.get(0).intValue();
	}

	@Override
	public List<Tzgg> getAll(Tzgg ns, Integer pageNum, Integer pageCount) {
		DetachedCriteria dc = DetachedCriteria.forClass(Tzgg.class);
		Criteria criteria = dc.getExecutableCriteria(getSession());
		criteria.setFirstResult((pageNum - 1) * pageCount);
		criteria.setMaxResults(pageCount);
		return criteria.list();
	}
	@Override
	public List<Tzgg> findAll() {
		String hql = "from t_tzgg group by id";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public List<Tzgg> findObjects() {
		String hql = "from t_tzgg group by id";
		Query query = this.getSession().createQuery(hql);
		return query.list();
	}

	@Override
	public int findCount() {
		String hql = "SELECT COUNT(*) FROM (SELECT * FROM Tzgg where deleted = '0' GROUP BY id ) a";
		Query query = getSession().createQuery(hql);
		List<Long> temp = query.list();
		System.out.println(temp);
		/* SQLQuery query = this.getSession().createSQLQuery(sql); */

		return temp.get(0).intValue();
	}

	@Override
	public List<Tzgg> findByPage(int begin, int pageSize) {
		String hql = "from Tzgg where deleted = '0' order by create_time desc";
		Query query = getSession().createQuery(hql);
		query.setFirstResult(begin);
		query.setMaxResults(pageSize);
		List<Tzgg> list = query.list();
		//System.out.println(list);
		return list.size() > 0 ? list : null;
	}



}
