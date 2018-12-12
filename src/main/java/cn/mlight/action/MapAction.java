package cn.mlight.action;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import sun.misc.BASE64Encoder;

import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Value;

import cn.mlight.domain.MyMap;
import cn.mlight.service.MapService;
import cn.mlight.utils.PageBean;
import cn.mlight.domain.Trajection;
import cn.mlight.optimizeTRAC.ResOfTras;
import cn.mlight.optimizeTRAC.Zrender;

import com.opensymphony.xwork2.ActionSupport;
import com.sun.org.apache.xml.internal.security.Init;

import cn.mlight.utils.SpatilUtils;
import cn.mlight.utils.TimeUtils;
import java.text.*;

public class MapAction extends ActionSupport {
	@Value("#{settingProperties['fdfsUrl']}")
	private String fdfsUrl;
	@Resource
	private MapService mapService;
	private List<MyMap> mapList;
	public MyMap myMap = new MyMap();
	private List<MyMap> mpList;
	public SpatilUtils utils;//引入SpatilUtils类
	
	public String mainUI() {
		return "mainUI";
	}

	private String lsgj_startTime;
	private String lsgj_endTime;
	private String lsgj_condition;
	private PageBean<Trajection> mpb;
	public Integer pageNo;
	public String taskId;
	
	public String quyu;

	public String getQuyu() {
		return quyu;
	}

	public void setQuyu(String quyu) {
		this.quyu = quyu;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public Integer getPageNo() {
		return pageNo;
	}

	public void setPageNo(Integer pageNo) {
		this.pageNo = pageNo;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	private Integer pageSize;

	public String getLsgj_startTime() {
		return lsgj_startTime;
	}

	public void setLsgj_startTime(String lsgj_startTime) {
		this.lsgj_startTime = lsgj_startTime;
	}

	public String getLsgj_endTime() {
		return lsgj_endTime;
	}

	public void setLsgj_endTime(String lsgj_endTime) {
		this.lsgj_endTime = lsgj_endTime;
	}

	public String getLsgj_condition() {
		return lsgj_condition;
	}

	public void setLsgj_condition(String lsgj_condition) {
		this.lsgj_condition = lsgj_condition;
	}

	// 当前位置
	public String dqwz() {
		return "dqwz";
	}

	// 历史轨迹
	public String lsgj() {
		return "lsgj";
	}

	public void CurrectPlace() {
		mapList = mapService.findByIdAndUsername();
		String dqwz_sql = "select a.task_id , a.target_name ,b.user_name ,b.lat ,b.lon  from t_task a join t_location b on a.relate_actor = b.user_name  and a.state = '在侦' and ((a.istg='0' and   b.id = (select max(id ) from t_location c where UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(c.sent_time)<600  and c.user_name = a.relate_actor))"
				+ " or  (a.istg='1' and   b.id = (select max(id ) from t_location c where c.sent_time < a.tg_time and c.user_name = a.relate_actor)))";
		List traList = mapService.getListBySql(dqwz_sql);
		JSONArray json = JSONArray.fromObject(traList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// System.out.println(String.valueOf(json));
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unused")
	public void NowPlace() {
		// mapList = mapService.findByIdAndUsername();
		HttpServletRequest request = ServletActionContext.getRequest();
		Long sjc = Long.parseLong(request.getParameter("sjc"));
		Long sjc2 = Long.parseLong(request.getParameter("sjc2"));
		//查询t_location距离当前时间最近的一条数据
		/*String dqwz_sql = "SELECT  * FROM   t_location a   where a.id in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< "
				+ sjc + "  GROUP BY v.`user_name`) ";*/
		
		//先获取t_location中的最新一条数据
	/*	String dqwz_sql = "SELECT  * FROM   t_location a  join (select   sys_user.login_name AS login_name,sys_user.name as sys_user, sys_role.name as roleName,sys_office.name as officeName  from sys_user,sys_user_role,sys_role,sys_office where sys_user_role.role_id=sys_role.id AND sys_user.office_id=sys_office.id  AND  sys_user.id=sys_user_role.user_id" + 
        ") w on a.`user_name`= w.login_name where a.id in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< "+ sjc2 + "  GROUP BY v.`user_name`) ";
		*/
		
		String dqwz_sql="SELECT MAX(v.id),v.sent_time, v.user_name , v.lat, v.lon ,v.speed ,u.`name`  ,f.`name` office_name  FROM  t_location v JOIN sys_user u on v.user_name = u.login_name JOIN sys_office f on u.office_id = f.id	WHERE v.user_name is not  null  and ( 	UNIX_TIMESTAMP(NOW())- UNIX_TIMESTAMP(v.sent_time) )< "+sjc2+"  GROUP BY v.`user_name` ";
		
		
		
		//System.out.println(dqwz_sql);
		//获取当前点击人员当天上传所有坐标
		String schedule = "SELECT id,lat,lon,sent_time FROM t_location WHERE (user_name in ("
		+"SELECT user_name FROM t_location WHERE id IN(SELECT MAX(v.id) FROM t_location v "
				+"where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< 900000 GROUP BY v.`user_name`))) "
		+"AND sent_time>=date(now()) and sent_time<DATE_ADD(date(now()),INTERVAL 1 DAY)";
		
		//System.out.println(schedule);
		
		//List sched = mapService.getListBySql(schedule);
		double schedAll = 0.0;
		int len =0; //sched.size();
		//计算总路程
		/*for(int i=0;i<len-1;i++){						
			Map map = (Map) sched.get(i);
			Map map2 = (Map) sched.get(i+1);				
			double lat1 = Double.parseDouble(String.valueOf(map.get("lat")));
			double lon1 = Double.parseDouble(String.valueOf(map.get("lon")));
			double lat2 = Double.parseDouble(String.valueOf(map2.get("lat")));
			double lon2 = Double.parseDouble(String.valueOf(map2.get("lon")));
			double schedAdd = SpatilUtils.GetSpatialDistance(lat1, lon1, lat2, lon2);			
			schedAll+=schedAdd;
			//System.out.println(schedAll);			
		}	*/
		
		//检查企业数
		String qyNumString = "SELECT * FROM t_ydjd_xcjx WHERE create_by in (SELECT user_name FROM t_location "
		+" WHERE id in (SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< " + sjc +" GROUP BY v.`user_name`)) GROUP BY bjxqy";
		//List qyNumList = mapService.getListBySql(qyNumString);
		int qyNum = 0;//qyNumList.size();
		
		//发现隐患数
	/*	String yxNumString = "SELECT * FROM t_ydjd_xcjx WHERE create_by in (SELECT user_name FROM t_location "
				+" WHERE id IN (SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< " + sjc +" GROUP BY v.`user_name`))";
		List yxNumList = mapService.getListBySql(yxNumString);*/
		int fxNum =0; //yxNumList.size();
		
		//隐患复查数
		String fcNumString = "SELECT * FROM t_ydjd_xcfx WHERE update_by in (SELECT user_name FROM t_location "
		+"WHERE id IN (SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< " +   sjc+ " GROUP BY v.`user_name`))";
		//List fcNumList = mapService.getListBySql(fcNumString);
		int fcNum = 0;//fcNumList.size();
		
		//查询现场检查（xcjx）和现场复查（xcfx）是否存在当前点击人员检查企业信息数据
		String date_sql1 = "SELECT  create_date FROM   t_ydjd_xcjx  where  (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(t_ydjd_xcjx.create_date))<" + sjc2+ " GROUP BY create_by";
		String date_sql2 = "SELECT  update_date FROM   t_ydjd_xcfx  where  (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(t_ydjd_xcfx.update_date))<" + sjc2+ " GROUP BY update_by";
		//List date_sql3 = mapService.getListBySql(date_sql1);//数据库查询xcjx
		//List date_sql4 = mapService.getListBySql(date_sql2);//数据库查询xcfx
		/*if(date_sql3.size() !=0){
			dqwz_sql = "SELECT  * FROM   t_location a JOIN (SELECT  bjxqy as qy,create_date,create_by FROM   t_ydjd_xcjx "
		+"  where  (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(t_ydjd_xcjx.create_date))<"
		+ sjc2+ " GROUP BY create_by) n on a.`user_name`=n.create_by  "
					+"join (select  sys_user.name as sys_user, sys_role.name as roleName,sys_office.name as officeName "
		+" from sys_user,sys_user_role,sys_role,sys_office where sys_user_role.role_id=sys_role.id " 
					+" AND sys_user.office_id=sys_office.id  AND  sys_user.id=sys_user_role.user_id" 
					+ ") w on a.`user_name`=w.sys_user where a.id in( SELECT MAX(v.id) FROM t_location v " 
					+" where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< "+ sjc + " GROUP BY v.`user_name`)";
		}else if(date_sql4.size() !=0){
			dqwz_sql = "SELECT  * FROM   t_location a "
		+"JOIN (SELECT  bjxqy as qy,update_date,update_by FROM   t_ydjd_xcfx"
					+" where  (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(t_ydjd_xcfx.update_date))<"+
		sjc2+ " GROUP BY update_by) n on a.`user_name`=n.update_by "
					+" join (select  sys_user.name as sys_user, sys_role.name as roleName,sys_office.name as officeName "
		+"  from sys_user,sys_user_role,sys_role,sys_office "
					+" where sys_user_role.role_id=sys_role.id AND sys_user.office_id=sys_office.id "
		+"  AND  sys_user.id=sys_user_role.user_id) w on a.`user_name`=w.sys_user  where a.id "
					+" in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< "+ 
		sjc + " GROUP BY v.`user_name`)";
		}else{
			dqwz_sql = "SELECT  * FROM   t_location a JOIN (SELECT  bjxqy as qy,create_date,create_by FROM   t_ydjd_xcjx  where  (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(t_ydjd_xcjx.create_date))<"
					+ sjc2+ " GROUP BY create_by) n on a.`user_name`=n.create_by  "
								+"join (select  sys_user.name as sys_user, sys_role.name as roleName,sys_office.name as officeName  from sys_user,sys_user_role,sys_role,sys_office where sys_user_role.role_id=sys_role.id AND sys_user.office_id=sys_office.id  AND  sys_user.id=sys_user_role.user_id" 
								+ ") w on a.`user_name`=w.sys_user where a.id in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.sent_time))< "+ sjc + " GROUP BY v.`user_name`)";
		}*/
		List traList = mapService.getListBySql(dqwz_sql);
		//traList.put("qyNum", qyNum);
		List resList = new ArrayList();
		resList.add(traList);
		
		//保留小数5位
		schedAll = schedAll/1000;
		//DecimalFormat df=new DecimalFormat(".#####");
		double schedAfter=(double) Math.round(schedAll * 100000) / 100000;;
		
		//向resList添加数据
		Map<String, Object> schedAllResultMap = new HashMap<String, Object>();
		schedAllResultMap.put("schedAll", schedAfter);
		schedAllResultMap.put("qyNum", qyNum);
		schedAllResultMap.put("fxNum", fxNum);
		schedAllResultMap.put("fcNum", fcNum);
		resList.add(schedAllResultMap);
		
		
		JSONArray json = JSONArray.fromObject(resList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}


	public void Group() {
		// mapList = mapService.findByIdAndUsername();
		@SuppressWarnings("unused")
		HttpServletRequest request = ServletActionContext.getRequest();

		HashMap traList = mapService.findGroupAndMember();
		JSONArray json = JSONArray.fromObject(traList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// System.out.println(String.valueOf(json));
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// 查询所有任务信息
	// 2016-06-16 zlj
	public void GetTasks() {
		// List groupList = mapService.findGroup();
		List taskList = mapService.getListBySql(" select task_id ,task_name ,state from t_task ORDER BY state ");
		JSONArray json = JSONArray.fromObject(taskList);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		// System.out.println(String.valueOf(json));
		// 输出信息
		try {
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 根据任务编号，查询该任务的轨迹 2016-06-16 zlj
	 */
	public void GetTrajByTaskid() {
		// List groupList = mapService.findGroup();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String task_id = this.getTaskId();
		if (task_id != null && !task_id.equals("")) {
			String conds = " where  1!=1 ";
			String msgSql = " select b.sender, b.create_time, SUBSTR(b.content,18,2) stage   from t_message b where b.type = 0 and b.content like CONCAT('#','"
					+ task_id + "','%') and SUBSTR(b.content,18,2) in( '收到','托管','结束') ORDER BY b.create_time  ";
			List stateList = mapService.getListBySql(msgSql);
			if (stateList.size() != 0) {
				for (int i = 0; i < stateList.size(); i++) {
					String sender = ((Map) stateList.get(i)).get("SENDER").toString();
					String stage = ((Map) stateList.get(i)).get("STAGE").toString();
					Date start_time = (Date) ((Map) stateList.get(i)).get("CREATE_TIME");
					String beginT = TimeUtils.getStrByTime(start_time, "yyyy-MM-dd HH:mm:ss");
					if ("收到".equals(stage)) {
						// conds = conds + " and ( ) ";
						conds = conds + "  or ( user_name = '" + sender + "' and  sent_time > '" + beginT + "'";
						if (i < (stateList.size() - 1)) {
							Date start_time2 = (Date) ((Map) stateList.get(i + 1)).get("CREATE_TIME");
							String endT = TimeUtils.getStrByTime(start_time2, "yyyy-MM-dd HH:mm:ss");
							conds = conds + " and  sent_time <= '" + endT + "' )";
						} else {
							conds = conds + " ) ";
						}
					}
				}
			}
			List trajList = mapService.getListBySql(" select * from t_location " + conds + " order by  sent_time");
			if (trajList.size() != 0) {
				JSONArray json = JSONArray.fromObject(trajList);
				// System.out.println(String.valueOf(json));
				// 输出信息
				try {
					response.getWriter().write(String.valueOf(json));
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} else {
				try {
					response.getWriter().write("nodata");
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}

	public String history() {
		mapList = mapService.findByUsername();
		return "history";
	}

	// ---------------------------------
	public List<MyMap> getMapList() {
		return mapList;
	}

	public void setMapList(List<MyMap> mapList) {
		this.mapList = mapList;
	}

	public MyMap getMyMap() {
		return myMap;
	}

	public void setMyMap(MyMap myMap) {
		this.myMap = myMap;
	}

	public List<MyMap> getMpList() {
		return mpList;
	}

	public void setMpList(List<MyMap> mpList) {
		this.mpList = mpList;
	}

	/**
	 * 获取历史轨迹的用户名单 zlj
	 */
	public void GetTrajUsers() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		try {
			int begin = (pageNo - 1) * pageSize;
			String query_condition = " where a.lat > 0 ";
			String time_condition = " where a.lat > 0 ";
			if (lsgj_startTime != null && !"".equals(lsgj_startTime)) {
				query_condition = query_condition + " and a.sent_time >= '" + lsgj_startTime + "'";
				time_condition = time_condition + " and a.sent_time >= '" + lsgj_startTime + "'";
			}
			if (lsgj_endTime != null && !"".equals(lsgj_endTime)) {
				query_condition = query_condition + " and a.sent_time <= '" + lsgj_endTime + "'";
				time_condition = time_condition + " and a.sent_time <= '" + lsgj_endTime + "'";
			}
			if (lsgj_condition != null && !"".equals(lsgj_condition)) {
				query_condition = query_condition + " and a.name like '%" + lsgj_condition + "%' ";
			}
			
			if (quyu != null && !"".equals(quyu)) {
				query_condition = query_condition + " and a.quyu like '%" + quyu + "%' ";
			}
			
			int totalNo = mapService.countAll("SELECT count(1) from (select * from  t_location a " + query_condition
					+ " group by user_name ) b ");
			String conds = getTrajCondtion(begin, pageSize, query_condition);

			List<Trajection> trajList = new ArrayList<Trajection>();
			if (totalNo != 0 && !"".equals(conds)) { // 如果没有数据则不往下执行
				trajList = getTrajList(time_condition, conds);
			}

			int totalPage = 0;
			PageBean<Trajection> pb = new PageBean<Trajection>();
			pb.setPageSize(pageSize);
			pb.setPageNo(pageNo);
			pb.setTotalNo(totalNo);
			if (totalNo % pageSize == 0) {
				totalPage = totalNo / pageSize;
			} else {
				totalPage = (totalNo / pageSize) + 1;
			}
			pb.setTotalPage(totalPage);
			pb.setBeanList(trajList);
			JSONArray json = JSONArray.fromObject(pb);
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("出错了,GetTrajUsers");
			e.printStackTrace();
			System.out.print(e.getMessage());
		}
	}

	/**
	 * 获取指定的用户名单条件， zlj
	 */
	public String getTrajCondtion(int beginpages, int pgSize, String query_condition) {
		List<?> usernameList = mapService
				.getListBySql(" select * from (SELECT user_name from t_location a " + query_condition
						+ " group by user_name ) m ORDER BY m.user_name LIMIT " + beginpages + "," + pgSize + " ");
		String conds = "";
		if (usernameList.size() != 0) {
			for (int i = 0; i < usernameList.size(); i++) {
				String usernames = ((Map) usernameList.get(i)).get("USER_NAME") != null
						? ((Map) usernameList.get(i)).get("USER_NAME").toString() : "";
				if (usernames != null && !usernames.equals("")) {
					conds = conds + "'" + usernames + "',";
				}
			}
		}
		int conds_length = conds.length();
		if (conds_length > 1) {
			conds = conds.substring(0, conds_length - 1);
			conds = " (" + conds + ") ";
		}
		// System.out.println(" 历史轨迹查询条件 -username————" + conds);
		return conds;
	}

	/**
	 *
	 *
	 * */
	public List<Trajection> getTrajList(String time_cond, String username_cond) {
		DecimalFormat df = new DecimalFormat("######0.00");
		String user_name = "";
		String name="";
		String officename="";
		
		Date start_time;
		Date end_time;
		String trj_num;
		String averge_speed;
		String take_times;
		String length;
		String square;
		List<Trajection> trajList = new ArrayList<Trajection>();
		List<?> locationList = mapService.getListBySql("  select * from (SELECT a.*,u.`name` as _name,u.officename  from t_location a  JOIN (SELECT u.login_name,u.`name`,o.`name` as officename from sys_user u join sys_office o on u.office_id=o.id) u on a.user_name=u.login_name   " + time_cond
				+ " and a.user_name in " + username_cond + " ) m ORDER BY m.user_name,m.sent_time ");
		// 遍历组合
		if (locationList.size() != 0) {
			String cur_name = "";
			String next_name = "";
			double a_x;
			double a_y;
			double b_x;
			double b_y;
			double min_x = (Double) ((Map) locationList.get(0)).get("LON"); // 后动范围
			double min_y = (Double) ((Map) locationList.get(0)).get("LAT");
			double max_x = (Double) ((Map) locationList.get(0)).get("LON");
			double max_y = (Double) ((Map) locationList.get(0)).get("LAT");

			int samples = 0;
			double longs = 0;
			start_time = (Date) ((Map) locationList.get(0)).get("SENT_TIME");

			for (int i = 0; i < locationList.size(); i++) {
				// 初始化
				cur_name = ((Map) locationList.get(i)).get("USER_NAME").toString();
				if (i < (locationList.size() - 1)) {
					next_name = ((Map) locationList.get(i + 1)).get("USER_NAME").toString();
				} else {
					next_name = "last one";
				}
				samples++;
				if (i > 0) {
					// 计算距离
					a_x = (Double) ((Map) locationList.get(i - 1)).get("LON");
					a_y = (Double) ((Map) locationList.get(i - 1)).get("LAT");
					b_x = (Double) ((Map) locationList.get(i)).get("LON");
					b_y = (Double) ((Map) locationList.get(i)).get("LAT");
					longs = longs + SpatilUtils.GetSpatialDistance(b_y, b_x, a_y, a_x);
					// 求最大值和最小值
					if (b_x < min_x) {
						min_x = b_x;
					}
					if (b_y < min_y) {
						min_y = b_y;
					}
					if (b_x > max_x) {
						max_x = b_x;
					}
					if (b_y > max_y) {
						max_y = b_y;
					}
				}
				// 关键断点
				if (!cur_name.equals(next_name)) {// 判断下一个用是否为同一个用户 阶段结束
					user_name = cur_name;
					
					try{
						name = String.valueOf(((Map) locationList.get(i)).get("_NAME"));
						officename = String.valueOf(((Map) locationList.get(i)).get("OFFICENAME"));
					}catch(Exception e){
						
					}
				
					trj_num = Integer.toString(samples);
					end_time = (Date) ((Map<?, ?>) locationList.get(i)).get("SENT_TIME");
					long ms = end_time.getTime() - start_time.getTime();
					long day = ms / (24 * 60 * 60 * 1000);
					long hour = (ms / (60 * 60 * 1000) - day * 24);
					long min = ((ms / (60 * 1000)) - day * 24 * 60 - hour * 60);
					long s = (ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);
					// take_times = "" + day + "天" + hour + "小时" + min + "分" + s
					// + "秒";
					take_times = "" + hour + "小时" + min + "分" + s + "秒";
					length = df.format(longs / 1000);
					double ts = ((double) ms) / (60 * 60 * 1000); // h
					double ds = longs / 1000; // km
					if (ms > 0) {
						averge_speed = df.format(SpatilUtils.GetSpeed(ds, ts));
					} else {
						averge_speed = "0";
					}
					// 求square
					double sq = SpatilUtils.GetSquare(min_x, min_y, max_x, max_y) / (1000 * 1000); // 平方公里
					square = df.format(sq);
					// 插入 轨迹中
					Trajection traj = new Trajection();
					traj.setUser_name(user_name);
					traj.setName(name);
					traj.setTrj_num(trj_num);
					traj.setTake_times(take_times);
					traj.setLength(length);
					traj.setStart_time(TimeUtils.getStrByTime(start_time, "yyyy-MM-dd HH:mm:ss"));
					traj.setEnd_time(TimeUtils.getStrByTime(end_time, "yyyy-MM-dd HH:mm:ss"));
					traj.setAverge_speed(averge_speed);
					traj.setSquare(square);
					traj.setSsdw(officename);
					trajList.add(traj);

					// 保存后数据，重新初始化参数
					samples = 0;
					if (i < (locationList.size() - 1)) {
						start_time = (Date) ((Map) locationList.get(i + 1)).get("SENT_TIME"); // 时间重置
						min_x = (Double) ((Map) locationList.get(i + 1)).get("LON"); // 后动范围
						min_y = (Double) ((Map) locationList.get(i + 1)).get("LAT");
						max_x = (Double) ((Map) locationList.get(i + 1)).get("LON");
						max_y = (Double) ((Map) locationList.get(i + 1)).get("LAT");
					}
					longs = 0;
				}

			}
		}
		return trajList;
	}

	/**
	 * 获取单个用户历史轨迹 map_old
	 */
	public void GetLsgjByUserid() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String query_condition = " where a.lat > 0  ";
		if (lsgj_startTime != null && !"".equals(lsgj_startTime)) {
			query_condition = query_condition + " and a.sent_time >= '" + lsgj_startTime + "'";
		}
		if (lsgj_endTime != null && !"".equals(lsgj_endTime)) {
			query_condition = query_condition + " and a.sent_time <= '" + lsgj_endTime + "'";
		}
		if (lsgj_condition != null && !"".equals(lsgj_condition)) {
			query_condition = query_condition + " and a.user_name ='" + lsgj_condition + "' ";
		}
		List<?> gj_List = mapService.getListBySql(" SELECT *  from t_location a " + query_condition
				+ " ORDER BY sent_time asc");
		if (gj_List.size() != 0) {
			try {
				JSONArray json = JSONArray.fromObject(gj_List);
				JSONArray calculateRes = JSONArray.fromObject(this.saveDatasTofile(json));
				List allRes = new ArrayList();
				allRes.add(json);
				allRes.add(calculateRes);
				response.getWriter().write(String.valueOf(allRes));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	};

	@SuppressWarnings("static-access")
	public ResOfTras saveDatasTofile(JSONArray json) {
		List<List<String>> listOfpoint = new ArrayList<List<String>>();
		ResOfTras resOfTras = new ResOfTras();
		try {
			Zrender zr = new Zrender();
			String name = "";
			String beginDate;
			String endDate;
			int rawPt = json.size();
			for (int i = 0; i < rawPt; i++) {
				List<String> st = new ArrayList<String>();
				Map resm = json.getJSONObject(i);
				Map sent_time = (Map) resm.get("sent_time"); 
				if (name.isEmpty()) {
					// name = (String) resm.get("name"); zlj-20180425
					name = (String) resm.get("user_name");
					resOfTras.setName(name);
				}
				if (i == 0) {
					beginDate = String.valueOf(sent_time.get("time"));
					resOfTras.setStartTime(beginDate);
				} else if (i == rawPt - 1) {
					endDate = String.valueOf(sent_time.get("time"));
					resOfTras.setEndTime(endDate);
				}
				//st.add(String.valueOf(resm.get("bdlon")));   zlj-20180425
				//st.add(String.valueOf(resm.get("bdlat")));  zlj-20180425
				st.add(String.valueOf(resm.get("lon")));
				st.add(String.valueOf(resm.get("lat")));
				st.add(String.valueOf(sent_time.get("time")));
				st.add(String.valueOf(resm.get("speed")));
				listOfpoint.add(st);
			}
			resOfTras.setRawPt(rawPt);
			return zr.begin(listOfpoint, resOfTras);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/*
	 * 获取用户在该时间段内所有的图片 王新亮
	 */
	public void GetpicsByUserid() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8");
		String query_condition = " where  deleted=0 and a.type=1  ";
		if (lsgj_startTime != null && !"".equals(lsgj_startTime)) {
			query_condition = query_condition + " and a.create_time >= '" + lsgj_startTime + "'";
			// query_condition = query_condition + " and a.create_time >=
			// '2017-03-24 08:13:03'";
		}
		if (lsgj_endTime != null && !"".equals(lsgj_endTime)) {
			query_condition = query_condition + " and a.create_time <= '" + lsgj_endTime + "'";
			// query_condition = query_condition + " and a.create_time <=
			// '2017-04-26 23:13:03'";
		}
		if (lsgj_condition != null && !"".equals(lsgj_condition)) {
			query_condition = query_condition + " and a.sender in (" + lsgj_condition + ") ";
		}

		List<?> gj_List = mapService.getListBySql(" SELECT *  from t_message a " + query_condition
				+ "  group by create_time ORDER BY sender ,create_time ");
		BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		List res = new ArrayList<>();
		for (int i = 0; i < gj_List.size(); i++) {
			Map gj_map = (Map) gj_List.get(i);
			if (gj_map.get("attachment") != null && !"".equals(gj_map.get("attachment"))) {
				String attachment = gj_map.get("attachment").toString();
				JSONObject jsonobject = JSONObject.fromObject(attachment);
				if (jsonobject.containsKey("thumbnail")) {
					String thumbnil = jsonobject.get("thumbnail").toString();
					String format = thumbnil.split("\\.")[1];
					String tppath = thumbnil.replace("M00", fdfsUrl);
					File file = new File(tppath);
					String dataUrl = null;
					if (file.exists()) {
						BufferedImage bi;
						try {
							bi = ImageIO.read(file);
							ByteArrayOutputStream baos = new ByteArrayOutputStream();
							ImageIO.write(bi, format, baos);
							byte[] bytes = baos.toByteArray();
							dataUrl = encoder.encodeBuffer(bytes).trim();
						} catch (Exception e) {
							e.printStackTrace();
						}
						// file.delete();
					}
					if (dataUrl != null) {
						dataUrl = "data:image/" + format + ";base64," + dataUrl;
						jsonobject.put("thumbnail", dataUrl);
					}
				}
				gj_map.put("attachment", jsonobject.toString());
			}
			res.add(gj_map);
		}
		try {
			JSONArray json = JSONArray.fromObject(res);
			response.getWriter().write(String.valueOf(json));
		} catch (IOException e) {
			e.printStackTrace();
		}
	};

}
