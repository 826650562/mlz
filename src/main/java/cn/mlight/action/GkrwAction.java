package cn.mlight.action;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

import cn.mlight.domain.Gkrw;
import cn.mlight.domain.Subtask;
import cn.mlight.service.GkrwService;
import cn.mlight.service.MapService;
import cn.mlight.utils.CheckUtils;
import cn.mlight.utils.PageBean;
import net.sf.json.JSONArray;

public class GkrwAction extends ActionSupport {

	@Resource
	private MapService mapService;
	@Resource
	private GkrwService gkrwService;
	private PageBean<Gkrw> gkrw;

	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	public GkrwService getGkrwService() {
		return gkrwService;
	}

	public void setGkrwService(GkrwService gkrwService) {
		this.gkrwService = gkrwService;
	}

	public PageBean<Gkrw> getGkrw() {
		return gkrw;
	}

	public void setGkrw(PageBean<Gkrw> gkrw) {
		this.gkrw = gkrw;
	}

	// 查询用户
	public void queryuser() {
		HttpServletResponse response = ServletActionContext.getResponse();
		List usermsg = null;
		try {
			usermsg = mapService.getListBySql("SELECT task.userid id, USER.NAME name FROM t_task_user task, t_user USER WHERE task.userid = USER .id");
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray json1 = JSONArray.fromObject(usermsg);
	/*	List userlist = new ArrayList();
		for (int i = 0; i < usermsg.size(); i++) {
			Map m = (Map) usermsg.get(i);
			if (!m.isEmpty()) {
				Map NameMap = new HashMap();
				NameMap.put("id", m.get("id"));
				NameMap.put("name", m.get("name"));
				userlist.add(NameMap);
			}
		}
		JSONArray json1 = JSONArray.fromObject(userlist);
*/
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void queryGkrw() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		String start_time = request.getParameter("start_time");
		String end_time = request.getParameter("end_time");
		String state = request.getParameter("state");
		String level = request.getParameter("level");
		String content = request.getParameter("content");
		String pagesize = request.getParameter("pagesize");
		String pages = request.getParameter("pages");
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
		try {
			gkrw = gkrwService.findAllGkrw(start_time, end_time, state, level, content, page, size);
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray json1 = JSONArray.fromObject(gkrw);

		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void queryZrw() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		String rwid = request.getParameter("rwid");
		List<Subtask> list = (List<Subtask>) mapService
				.getListBySql("select * from t_sub_task where rwid = '" + rwid + "'");
		JSONArray json1 = JSONArray.fromObject(list);

		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public void queryLsgj() {
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		String zz_id = request.getParameter("zz_id");
		String start_time = request.getParameter("start_time");
		String end_time = request.getParameter("end_time");
		String condition = " 1 = 1 ";
		if (start_time != null && !"".equals(start_time)) {
			condition = condition + " and t.standard_time >= '" + start_time + "'";
		}
		if (end_time != null && !"".equals(end_time)) {
			condition = condition + " and t.standard_time <= '" + end_time + "'";
		}
		List list = mapService.getListBySql(
				"select t.id ,t.user_id,t.lat,t.lon,t.name,t.standard_time from t_location t where t.user_id ='" + zz_id
						+ "' and " + condition + " ORDER BY t.id ASC");
		// List<Subtask> list = (List<Subtask>) mapService.getListBySql("select
		// * from t_sub_task where rwid = '"+rwid+"'");
		JSONArray json1 = JSONArray.fromObject(list);
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
