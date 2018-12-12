package cn.mlight.action;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.mlight.chat.util.DateUtils;
import com.opensymphony.xwork2.ActionSupport;

import cn.mlight.service.MapService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class TjfxAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Resource
	private MapService mapService;

	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	// 在侦数据
	public void queryCount() {
		HttpServletResponse response = ServletActionContext.getResponse();
		List list = mapService.getListBySql(
				"select count(0) task_count,(select count(0) from t_target t where t.rwid in(select rwid from t_task t where t.state = '1' ) ) target_count,(select count(0) from t_sub_task t where t.state in('0','1')) zzxz_count,(select count(0)from t_group_member t where t.group_id in (select t.xz_id from t_sub_task t where t.state in('0','1'))) zzjy_count from t_task t where t.state = '1'");
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

	// 已结数据
	public void queryEndCount() {
		HttpServletResponse response = ServletActionContext.getResponse();
		List list = mapService.getListBySql(
				"select count(0) yj_count,(select count(0) from t_target t where t.rwid in(select c.rwid from t_task c where c.state ='2')) yjmb_count from t_task t  where t.state ='2'");
		List sjlist = mapService
				.getListBySql("select end_time,start_time from t_task where state = '2'  GROUP BY rwid");
		int gk_count = mapService.countAll("select count(0) from t_task where state = '2'");
		int min = 0;
		for (int i = 0; i < sjlist.size(); i++) {
			Map sjmap = (Map) sjlist.get(i);
			String end_time = sjmap.get("end_time").toString();
			String start_time = sjmap.get("start_time").toString();
			List sjc = mapService
					.getListBySql("SELECT TIMESTAMPDIFF(MINUTE,'" + start_time + "','" + end_time + "') t");
			Map xx = (Map) sjc.get(0);
			int sj = Integer.valueOf(xx.get("t").toString());
			min = min + sj;

		}
		String hour = new java.text.DecimalFormat("#.00").format(min / 60.0);
		JSONObject json1 = JSONObject.fromObject(list.get(0));
		json1.put("sj_count", hour);
		json1.put("gk_count", gk_count);
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	// 当日跟控数量统计
	public void queryToday() {
		HttpServletResponse response = ServletActionContext.getResponse();
		String date = DateUtils.getDispNow("yyyy-MM-dd");
		List today_list = mapService
				.getListBySql("select t_time,hxq_mbcount,all_count from t_statistics_targets t where t_time like '"
						+ date + "%'ORDER BY id asc");
		JSONArray json1 = JSONArray.fromObject(today_list);
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	// 三类人员

	public void queryType() {
		HttpServletResponse response = ServletActionContext.getResponse();
		List p_type = mapService
				.getListBySql("select count(0) t_count,t.personnel_type  from t_monitor t GROUP BY t.personnel_type");
		JSONArray json1 = JSONArray.fromObject(p_type);
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void queryHxqy() {
		// 核心区目标统计
		HttpServletResponse response = ServletActionContext.getResponse();
		List h_count = mapService.getListBySql(
				"select SUM(t.person_number) p_num ,t.police_addr from t_monitor t GROUP BY t.police_addr");
		JSONArray json1 = JSONArray.fromObject(h_count);
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json1));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// 跟控任务月度统计
	public void queryMouth() {
		HttpServletResponse response = ServletActionContext.getResponse();
		String date = DateUtils.getDispNow("yyyyMM");
		List m_count = mapService
				.getListBySql("select * from t_statistics_taskts t where t.times like '" + date + "%' order by id asc");
		for (int i = 0; i < m_count.size(); i++) {
			Map xx = (Map) m_count.get(i);
			String str_times = xx.get("times").toString();
			String ts = DateUtils.getDispDate(str_times, "yyyyMMdd", "yyyy-MM-dd");
			xx.put("times", ts);
			m_count.set(i, xx);
		}
		JSONArray json1 = JSONArray.fromObject(m_count);
		//System.out.println(json1);
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
