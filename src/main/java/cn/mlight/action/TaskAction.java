package cn.mlight.action;

import cn.mlight.domain.Task;
import cn.mlight.domain.User;
import cn.mlight.listener.SessionUtil;
import cn.mlight.service.TaskService;
import cn.mlight.utils.PageBean;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mlight.chat.service.dao.message.Message;
import com.mlight.chat.webclient.ProxyClient;
import com.mlight.chat.webclient.ProxyClientListener;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mlight on 2016/6/15.
 */
public class TaskAction extends ActionSupport {
	private static final Logger logger = LoggerFactory.getLogger(TaskAction.class);
	@Autowired
	private TaskService service;

	private Task task;
	private PageBean<Task> page;
	private String msg = "";
	private int code = 1;

	/**
	 * 生成任务序列号 使用同步保证串行调用
	 */
	public static String getTaskId() {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		return format.format(new Date(System.currentTimeMillis()));
	}

	/**
	 * 创建新任务<br/>
	 * 1. 向T_task表中插入1条数据<br/>
	 * 2. 发一条消息给默认任务接受人
	 */
	public String save() {
		try {
			task.setTaskId(getTaskId());
			task.setStartTime(new Timestamp(System.currentTimeMillis()));
			service.save(task); // 完成任务保存

			HttpServletRequest request = ServletActionContext.getRequest();
			ProxyClient client = SessionUtil.getClient(request.getSession());
			// ProxyClient.getDefaultInstance(); // 发送消息
			HttpSession session = ServletActionContext.getRequest().getSession();
			Message msg = toMsg(task, SessionUtil.getUser(session));
			client.sendFreshMessage(msg);
			msg.setContent(String.format("编号#%s", task.getTaskId()));
			client.sendFreshMessage(msg);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e.getCause());
			code = 0;
			msg = "发送失败";
		}

		Map<String, Object> map = new HashMap<>();
		map.put("code", code);
		map.put("msg", msg);
		response(toJson(map));
		return null;
	}

	// 任务对应的消息内容模板
	private static final String TASK_TEMPLATE = "任务名称: %s\r\n" + "目标姓名: %s\r\n\r\n" + "任务内容: \r\n%s\r\n\r\n"
			+ "备注: \r\n%s\r\n#%s";

	private static Message toMsg(Task task, User user) {
		Message msg = new Message();
		msg.setChatType(Message.CHAT_TYPE_CHAT); // 点对点
		msg.setType(Message.MSG_TYPE_TEXT); // 文本
		String content = String.format(TASK_TEMPLATE, task.getTaskName(), task.getTargetName(),
				task.getTaskContent() == null ? "无" : task.getTaskContent(), task.getBz() == null ? "无" : task.getBz(),
				task.getTaskId());
		msg.setContent(content);
		msg.setSender(user.getUsername());
		msg.setTime(System.currentTimeMillis()); // 时间
		msg.setReceiver(ProxyClientListener.VAL_DEFAULT_RECEIVER);
		return msg;
	}

	/**
	 * 根据Task中的任务状态字段检索任务 开始时间，结束时间，任务名称，任务状态检索任务 支持有分页信息的检索和无分页信息的检索
	 */
	public String listPager() {
		if (page == null) {
			page = new PageBean<>();
			page.setPageSize(5);
		}

		int size = page.getPageSize();
		if (size <= 0) {
			size = Short.MAX_VALUE;
		} else if (size > Short.MAX_VALUE) {
			size = Short.MAX_VALUE;
		}

		int first = (page.getPageNo() - 1) * page.getPageSize();
		if (first < 0) {
			first = 0;
		} else if (first > Short.MAX_VALUE) {
			first = Short.MAX_VALUE;
		}

		if (task == null) {
			task = new Task();
		}

		try {
			List<Task> data = service.listPager(task, first, size);
			page.setBeanList(data);
			page.setTotalNo((int) (service.getCount(task)));
		} catch (Exception e) {
			code = 0;
			msg = "服务器端异常,请重试";
		}

		Map<String, Object> map = new HashMap<>();
		map.put("code", code);
		map.put("msg", msg);
		map.put("page", page);
		response(toJson(map));
		return null;
	}

	public static void response(String data) {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			PrintWriter writer = response.getWriter();
			writer.write(data);
		} catch (IOException e) {
			logger.error(e.getLocalizedMessage(), e.getCause());
		}
	}

	public static String toJson(Object target) {
		GsonBuilder builder = new GsonBuilder();
		builder.setDateFormat("yyyy-MM-dd HH:mm:ss");
		Gson gson = builder.create();
		return gson.toJson(target);
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public Task getTask() {
		return task;
	}

	public void setPage(PageBean<Task> page) {
		this.page = page;
	}

	public PageBean<Task> getPage() {
		return page;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getMsg() {
		return msg;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public int getCode() {
		return code;
	}
}