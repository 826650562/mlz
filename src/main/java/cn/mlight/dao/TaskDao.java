package cn.mlight.dao;

import cn.mlight.base.dao.BaseDao;
import cn.mlight.domain.Task;

import java.util.List;

/**
 * Created by mlight on 2016/6/15.
 */
public interface TaskDao extends BaseDao<Task> {
	// 基于任务的开始时间，结束时间，任务状态,任务名称检索任务;其中的任何一个条件都是非必填的
	public List<Task> listPager(Task task, int first, int size);

	public long getCount(Task task);
}