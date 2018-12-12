package cn.mlight.dao;

import cn.mlight.domain.Task;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by mlight on 2016/6/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath*:applicationContext.xml" })
public class TaskDaoTest {

	@Autowired
	TaskDao dao;

	@Test
	@Transactional
	public void save() {
		Task task = new Task();
		task.setTaskId("20150202030501");
		task.setTargetName("目标信息");
		task.setTaskName("跟踪目标以熟悉其作息规律");
		task.setTaskContent("任务内容可能相对复杂");
		task.setBz("备注");

		dao.save(task);
	}

	@Test
	@Transactional
	public void listPager() {
		Task stateTask = new Task();
		// 任务状态
		stateTask.setState("已结");
		List<Task> list = dao.listPager(stateTask, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 1);

		stateTask.setState("在侦");
		list = dao.listPager(stateTask, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 2);

		Task startTask = new Task();
		// 开始时间
		startTask.setStartTime(new Timestamp(0));
		list = dao.listPager(startTask, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 2);

		startTask.setStartTime(new Timestamp(System.currentTimeMillis()));
		list = dao.listPager(startTask, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 0);

		// 结束时间
		Task endTask = new Task();
		endTask.setEndTime(new Timestamp(System.currentTimeMillis()));
		list = dao.listPager(endTask, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 2);

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date timestamp = null;
		try {
			timestamp = format.parse("2016-06-03 09:09:10");
		} catch (ParseException e) {
			e.printStackTrace();
		}

		if (timestamp != null) {
			endTask.setEndTime(new Timestamp(timestamp.getTime()));
			list = dao.listPager(endTask, 0, Short.MAX_VALUE);
			Assert.assertTrue(list.size() == 1);
		}

		// 任务名称
		Task nameTask = new Task();
		nameTask.setTaskName("目标");
		list = dao.listPager(nameTask, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 1);

		Task task = new Task();
		task.setState("在侦");
		task.setTaskName("目标");
		list = dao.listPager(task, 0, Short.MAX_VALUE);
		Assert.assertTrue(list.size() == 1);

	}
}
