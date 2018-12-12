package com.mlight.gis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jms.core.JmsTemplate;

import com.mlight.jms.TextMessageCreator;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

import cn.mlight.service.MapService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Querydzwl {
	@Resource
	private MapService mapService;
	@Resource
	private JmsTemplate dzwlJmsSendTempl;
	private HashMap wlArray;// 查询到的所有的围栏信息
	private List pointArray;// 查询到的所有的围栏信息
	private GIScompare gisCompare = new GIScompare();

	// private static final LinkedBlockingQueue<String> QUEUE = new
	// LinkedBlockingQueue<String>();
	// boolean flag = true;

	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	public void querydzwl() {

		this.getLinesDateOfdzwl();
		this.queryYjInfo();
	}

	@SuppressWarnings("unchecked")
	public void getLinesDateOfdzwl() {
		// 获取所有的电子围栏
		String Sql = " SELECT * from t_fence where del_flag = 0 and typeid  = 0 order by id desc ";// 既没有被删除也没有被关闭的围栏
																									// 用来对比
		ArrayList<?> res = (ArrayList<?>) this.mapService.getListBySql(Sql);
		ArrayList<HashMap> fencelist = new ArrayList<HashMap>();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			List fence = new ArrayList();
			HashMap NameMap = new HashMap();
			fence.add(m.get("name"));
			fence.add(m.get("type"));
			String date = m.get("create_date").toString();
			fence.add(date);
			fence.add(m.get("creater"));
			fence.add(m.get("path"));
			fence.add(m.get("id"));
			NameMap.put("fence", fence);
			fencelist.add(NameMap);
		}
		HashMap fenceMap = new HashMap();
		fenceMap.put("fencelist", fencelist);
		this.wlArray = fenceMap;
		this.getPointDateOfdzwl();
	}

	public void getPointDateOfdzwl() {
		// 获取当前的所有位置点信息
		String dqwz_sql = "SELECT  * FROM   t_location a   where a.id in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.standard_time))< 600  GROUP BY v.`user_name`) ";
		this.pointArray = mapService.getListBySql(dqwz_sql);
		this.compareLinesAndPoints();
	}

	public void setYjInfo(String wz_seq_no, String fence_id, int is_read, String _date, String user_name) {
		// String Sql = " INSERT into yjres
		// (wz_seq_no,fence_id,is_read,timestemp,user_name) VALUES ('" +
		// wz_seq_no + "'," + fence_id + "," + is_read +","+ _date +
		// ",'"+user_name+"') ";
		String Sql2 = "select addNewAlarm('" + wz_seq_no + "'," + fence_id + ",'" + user_name + "'," + _date
				+ "+900000+1) from dual";

		try {
			this.mapService.execute(Sql2);
		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	/*
	 * public void updateFordzwl() { String Sql =
	 * " UPDATE t_xllx SET del_flag = '1' where id = '" + groupid + "'";
	 * this.mapService.execute(Sql); }
	 */
	public void queryYjInfo() {
		// 获取当前的所有位置点信息
		String Sql = " SELECT t.id, t2.`name` as wlname,t2.path,t2.type,t2.del_flag,t3.lat,t3.lon,t3.`name` as yonghu,t3.user_name,t.timestemp as yjsj,t2.id as fence_id from yjres t join t_fence t2  on t.fence_id=t2.id join t_location t3 on t.wz_seq_no=t3.seq_no  where t.is_read=0 ";
		try {
			List res = mapService.getListBySql(Sql);
			JSONArray resJson = JSONArray.fromObject(res);
			this.dzwlJmsSendTempl.send(new TextMessageCreator(resJson.toString()));
			// QUEUE.add(resJson.toString());
		} catch (Exception e) {
			// TODO: handle exception
		}

	}

	public void compareLinesAndPoints() {
		if (!this.wlArray.isEmpty() && this.pointArray.size() > 0) {
			List fences = (List) wlArray.get("fencelist");
			for (int i = 0; i < fences.size(); i++) {
				for (int j = 0; j < pointArray.size(); j++) {
					Map pointGeo = (Map) pointArray.get(j);
					double x = (double) pointGeo.get("lon");
					double y = (double) pointGeo.get("lat");
					Point point = gisCompare.getPoint(x, y);
					Map mymap = (Map) fences.get(i);
					List myfence = (List) mymap.get("fence");
					String geo = (String) myfence.get(4);

					JSONObject jasonObject = JSONObject.fromObject(geo.replaceAll("'", "\""));
					Map geoMap = (Map) jasonObject;

					Polygon ply = gisCompare.createPolygonByWKT(this.getPointString(geoMap));// 将geo
																								// 转换为可以被识别的line字符串
					Boolean isContains = gisCompare.compare(ply, point /*,myfence.get(1).toString()*/);
					if (isContains) {
						long _date = System.currentTimeMillis();
						String seq_no = pointGeo.get("seq_no").toString();
						String user_name = pointGeo.get("user_name").toString();
						String id = Integer.toString((int) myfence.get(5));
						String date = String.valueOf(_date);
						this.setYjInfo(seq_no, id, 0, date, user_name);
					}
				}
			}
		}

	}

	public StringBuffer getPointString(Map object) {
		Map geo = (Map) object.get("geometry");

		List rings = (List) geo.get("rings");
		List ring = (List) rings.get(0);
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < ring.size(); i++) {
			List r = (List) ring.get(i);
			sb.append(r.get(0));
			sb.append(" ");
			sb.append(r.get(1));
			sb.append(",");
		}
		// System.out.print(sb); //获取到所有的围栏的坐标
		return sb;
	}

	/*
	 * public void service(ServletRequest req, ServletResponse response) throws
	 * ServletException, IOException {
	 * response.setContentType("text/event-stream");
	 * response.setCharacterEncoding("UTF-8"); PrintWriter writer =
	 * response.getWriter(); int x = 0; //while (flag) { String element; try {
	 * element = QUEUE.take(); System.out.println("shuchu" + x++);
	 * writer.write("event:dzwl\n"); writer.write("data: " + element + "\n\n");
	 * writer.flush(); } catch (InterruptedException e) { e.printStackTrace(); }
	 * } writer.close(); }
	 */
}
