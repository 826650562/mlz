package cn.mlight.service;

import cn.mlight.domain.Task;

import java.util.List;

/**
 * Created by mlight on 2016/6/15.
 */
public interface TaskService {
	public void save(Task task);

	public List<Task> listPager(Task task, int first, int size);

	public long getCount(Task task);
}
