package cn.mlight.service.impl;

import cn.mlight.dao.TaskDao;
import cn.mlight.domain.Task;
import cn.mlight.service.TaskService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by mlight on 2016/6/15.
 */
@Service("taskService")
public class TaskServiceImpl implements TaskService {
	@Autowired
	private TaskDao taskDao;

	@Override
	public void save(Task task) {
		String state = task.getState();
		if (StringUtils.isEmpty(state)) {
			task.setState("在侦");
		}
		taskDao.save(task);
	}

	@Override
	public List<Task> listPager(Task task, int first, int size) {
		return taskDao.listPager(task, first, size);
	}

	@Override
	public long getCount(Task task) {
		return taskDao.getCount(task);
	}

	public void setTaskDao(TaskDao taskDao) {
		this.taskDao = taskDao;
	}

	public TaskDao getTaskDao() {
		return taskDao;
	}
}
