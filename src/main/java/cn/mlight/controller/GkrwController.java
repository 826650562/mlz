package cn.mlight.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.thrift.TException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.triman.tchat.thrift.client.AdminClient;
import com.triman.tchat.thrift.protocol.Target;
import com.triman.tchat.thrift.protocol.Task;

import cn.mlight.utils.CheckUtils;
import net.sf.json.JSONObject;

/**
 * Created by lzr .
 */
@SuppressWarnings("CallToPrintStackTrace")
@Controller
@RequestMapping("/gkrw")
public class GkrwController {
	@Value("#{settingProperties['encrypt.key']}")
	private String keys;
	@Value("#{settingProperties['uploadUrl']}")
	private String uploadUrl;
	@Autowired
	private AdminClient adminClient;

	@RequestMapping(value = "/addtask", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public void addTask(String rwid, String rwbh, String task_name, String level, String fzr_id, String fzr_name,
			String task_content, String level_name, HttpServletRequest request) {

		Task task = new Task();
		task.setRwid(rwid);
		task.setRwbh(rwbh);
		task.setTask_name(task_name);
		task.setLevel(level);
		task.setLevel_name(level_name);
		task.setFzr_id(fzr_id);
		task.setFzr_name(fzr_name);
		task.setTask_content(task_content);
		try {
			adminClient.saveTaskWithState(task);
		} catch (TException e) {
			e.printStackTrace();
		}
	
	}

	@RequestMapping(value = "/addtarget", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String addTarget(String rwid, String mb_name, String task_content, String mb_image,
			HttpServletRequest request) {
		String success = "";
		String original ="";
		if("mx/gkrw/images/xyr.png".equals(mb_image)){
			mb_image ="";
		}
		if(mb_image !=null && !"".equals(mb_image)){
			original = mb_image.replace("thumb_","");
		}
		JSONObject mb_object = new JSONObject();
		mb_object.put("thumb", mb_image);
		mb_object.put("original", original);
		String xx = mb_object.toString();
		Target target = new Target();
		target.setRwid(rwid);
		target.setMb_name(mb_name);
		target.setTask_content(task_content);
		target.setMb_image(mb_object.toString());
		try {
			adminClient.saveTarget(target);
			success = "true";
		} catch (TException e) {
			e.printStackTrace();
		}
		return success;
	}

	@RequestMapping(value = "/querygkrw", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String queryGkrw(String start_time, String end_time, String state, String level, String content,
			String pagesize, String pages, HttpServletRequest request) {
		int size = 0;
		int page = 0;
		if (!CheckUtils.isEmpty(pages)) {
			try {
				page = Integer.parseInt(pages);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				page = 1;
			}
		}
		if (page == 0) {
			page = 1;
		}

		if (!CheckUtils.isEmpty(pagesize)) {
			try {
				size = Integer.parseInt(pagesize);
			} catch (java.lang.NumberFormatException e) {
				e.printStackTrace();
				size = 20;
			}
		}
		String msg =null;
		try {
			msg = adminClient.queryTask(start_time, end_time, state, level, content, size, page);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return msg;
	}
}
