package cn.mlight.dao.impl;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.TaskDao;
import cn.mlight.domain.Task;
import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.SimpleExpression;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by mlight on 2016/6/15.
 */
public class TaskDaoImpl extends BaseDaoImpl<Task> implements TaskDao {
	private DetachedCriteria toCriteria(Task task) {
		DetachedCriteria criteria = DetachedCriteria.forClass(Task.class);
		// 任务名称
		String taskName = task.getTaskName();
		if (StringUtils.isNotEmpty(taskName)) {
			criteria.add(Restrictions.like("taskName", "%".concat(taskName).concat("%")));
		}

		// 开始时间，结束时间
		Timestamp startTime = task.getStartTime(), endTime = task.getEndTime();

		SimpleExpression startTimeExper = null, endTimeExper = null;
		if (startTime != null) {
			startTimeExper = Restrictions.ge("startTime", startTime);
		}

		if (endTime != null) {
			endTimeExper = Restrictions.le("endTime", endTime);
		}

		if (startTimeExper != null && endTimeExper != null) {
			criteria.add(Restrictions.or(Restrictions.between("startTime", startTime, endTime),
					Restrictions.between("endTime", startTime, endTime)));
		} else {
			SimpleExpression[] expressions = new SimpleExpression[] { startTimeExper, endTimeExper };
			for (int i = 0; i < expressions.length; i++) {
				if (expressions[i] != null) {
					criteria.add(expressions[i]);
				}
			}
		}

		// 任务状态
		String state = task.getState();
		if (StringUtils.isNotEmpty(state)) {
			criteria.add(Restrictions.eq("state", state));
		}
		return criteria;
	}

	@Override
	public List<Task> listPager(Task task, int first, int size) {
		List<Task> result = new ArrayList<>();

		if (task != null) {
			DetachedCriteria detachedCriteria = toCriteria(task);
			Criteria criteria = detachedCriteria.getExecutableCriteria(this.getSession());
			criteria.setFirstResult(first);
			criteria.setMaxResults(size);
			result = criteria.list();
		}

		return result;
	}

	@Override
	public long getCount(Task task) {
		long count = 0;
		if (task != null) {
			DetachedCriteria detachedCriteria = toCriteria(task);
			detachedCriteria.setProjection(Projections.rowCount());
			Criteria criteria = detachedCriteria.getExecutableCriteria(this.getSession());
			List<Long> list = criteria.list();
			count = list.get(0).longValue();
		}

		return count;
	}
}
