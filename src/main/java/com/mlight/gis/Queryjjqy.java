package com.mlight.gis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jms.core.JmsTemplate;

import com.google.gson.JsonArray;
import com.mlight.jms.TextMessageCreator;
/*import com.mlight.jni.LogClient;*/
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

import cn.mlight.service.MapService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Queryjjqy {
	@Resource
	private MapService mapService;
	@Resource
	private JmsTemplate jjqyJmsSendTempl;
	private HashMap wlArray;// 查询到的所有的 信息
	private List pointArray;// 查询到的所有的 信息
	private GIScompare gisCompare = new GIScompare();
	final String yjType_in = "核心警戒区";
	final String yjType_out = "外围警戒区";
/*	private static final LogClient logClient = LogClient.getInstance();*/
	static double x_pi = 3.14159265358979324 * 3000.0 / 180.0; 
	
	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	public void queryjjqy() {
		/*logClient.validate();*/
		this.getLinesDateOfjjqy();
		this.queryYjInfo();
	}

	@SuppressWarnings("unchecked")
	public void getLinesDateOfjjqy() {
		// 获取所有的在此时间范围内的预警信息
		String Sql = " SELECT  *  from t_jjqy t   WHERE  unix_timestamp(t.beginDate)<= unix_timestamp(now()) and  unix_timestamp(now()) <= unix_timestamp(t.end_date) and t.del_flag=0 order by id desc ";
		ArrayList<?> res = (ArrayList<?>) this.mapService.getListBySql(Sql);
		ArrayList<HashMap> jjqyMap = new ArrayList<HashMap>();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			List jjqyList = new ArrayList();
			HashMap NameMap = new HashMap();
			jjqyList.add(m.get("id"));
			jjqyList.add(m.get("beginDate"));
			String date = m.get("end_date").toString();
			jjqyList.add(date);
			jjqyList.add(m.get("inLength"));
			jjqyList.add(m.get("outLength"));
			jjqyList.add(m.get("jjqyName"));
			jjqyList.add(m.get("jjqy_otherText"));
			jjqyList.add(m.get("type"));
			jjqyList.add(m.get("bufferIn"));
			jjqyList.add(m.get("bufferOrigin"));
			jjqyList.add(m.get("bufferOut"));
			jjqyList.add(m.get("del_flag"));
			NameMap.put("jjqylist", jjqyList);
			jjqyMap.add(NameMap);
		}
		HashMap fenceMap = new HashMap();
		fenceMap.put("jjqyMap", jjqyMap);
		this.wlArray = fenceMap;
		this.getPointDataOfjjqy();
	}

	public void getPointDataOfjjqy() {
		// 获取当前的所有位置点信息
		String sql = "SELECT  * FROM   t_location a   where a.id in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.standard_time))< 600 GROUP BY v.`user_name`) ";
		this.pointArray = mapService.getListBySql(sql);
		this.compareLinesAndPoints();
	}

	public void setjjqyYjInfo(String wz_seq_no, String jjqy_id, int is_read, String _date, String user_name,
			String geopath, String type) {
		String Sql2 = "select addjjqyinfo('" + wz_seq_no + "'," + jjqy_id + ",'" + user_name + "'," + _date
				+ ",\"" + geopath + "\",'" + type + "') from dual";
		try {
			this.mapService.execute(Sql2);
		} catch (Exception e) {
			System.out.println(Sql2 + "插入预警数据执行失败");
			// TODO: handle exception
		}
	}

	public void queryYjInfo() {
		// 获取当前的所有位置点信息
		String Sql = "  SELECT t.id, t2.jjqyName ,t2.beginDate,t2.end_date,t2.inLength,t2.outLength,"
				+ "t2.type,t2.id as jjqyid ,t2.del_flag,t3.bdlat,t3.bdlon,t3.`name` as yonghu,t3.user_name,"
				+ "t.timestemp as yjsj ,t.jjqy_type  from "
				+ "(SELECT * FROM  t_jjqy_yj_info s  where is_read=0  ORDER BY s.id desc   LIMIT 0,50) t "
				+ "join t_jjqy t2  on t.jjqy_id=t2.id join t_location t3 on t.wz_seq_no=t3.seq_no  ORDER BY t.id ";
		try {
			List res = mapService.getListBySql(Sql);
			JSONArray resJson = JSONArray.fromObject(res);
			if (resJson.size() > 0) {
				this.jjqyJmsSendTempl.send(new TextMessageCreator(resJson.toString()));
			} else {
				this.jjqyJmsSendTempl.send(new TextMessageCreator(new JsonArray().toString()));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	public void compareLinesAndPoints() {
		if (!this.wlArray.isEmpty() && this.pointArray.size() > 0) {
			List fences = (List) wlArray.get("jjqyMap");
			for (int i = 0; i < fences.size(); i++) {
				for (int j = 0; j < pointArray.size(); j++) {
					Map pointGeo = (Map) pointArray.get(j);
					double x = (double) pointGeo.get("bdlon");
					double y = (double) pointGeo.get("bdlat");
					double[] xy=bd_decrypt(x,y);
					
					Point point = gisCompare.getPoint(xy[0], xy[1]);
					Map mymap = (Map) fences.get(i);
					List myfence = (List) mymap.get("jjqylist");

					String geobufferIn = (String) myfence.get(8);// bufferIn
					String geobufferOut = (String) myfence.get(10);// bufferOut

					Boolean isContainsIn = this.compareEveryGeo(geobufferIn, point);
					Boolean isContainsOut = this.compareEveryGeo(geobufferOut, point);

					if (isContainsIn) {
						
						String seq_no = pointGeo.get("seq_no").toString();
						String user_name = pointGeo.get("user_name").toString();
						String id = Integer.toString((int) myfence.get(0));// 获取警戒区记录id
						
						
						long _date = System.currentTimeMillis();
						String date = String.valueOf(_date);// 预警时间
						
						
						this.setjjqyYjInfo(seq_no, id, 0, date, user_name, geobufferIn, this.yjType_in);
					}
					if (isContainsOut) {
						long _date = System.currentTimeMillis();
						String seq_no = pointGeo.get("seq_no").toString();
						String user_name = pointGeo.get("user_name").toString();
						String id = Integer.toString((int) myfence.get(0));// 获取警戒区记录id
						String date = String.valueOf(_date);// 预警时间
						this.setjjqyYjInfo(seq_no, id, 0, date, user_name, geobufferOut, this.yjType_out);
					}
				}
			}
		}
	}
	
	/**
	 * 
	 * BD-09 坐标转换成GCJ-02 坐标
	 * 
	 * @param bd_lon
	 *            经度
	 * 
	 * @param bd_lat
	 *            纬度
	 * 
	 * @return
	 * 
	 */

	public static double[] bd_decrypt(double bd_lon, double bd_lat) {
		double[] d = new double[2];
		double x = bd_lon - 0.0065, y = bd_lat - 0.006;
		double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
		double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
		double gg_lon = z * Math.cos(theta);
		double gg_lat = z * Math.sin(theta);
		d[0] = gg_lon;
		d[1] = gg_lat;
		return d;
	}

	public Boolean compareEveryGeo(String geostring, Point point) {

		JSONObject jasonObject_geobufferIn = JSONObject.fromObject(geostring.replaceAll("'", "\""));

		Map Map_geobufferIn = (Map) jasonObject_geobufferIn;

		Polygon plyIn = gisCompare.createPolygonByWKT(this.getPointString(Map_geobufferIn));// 将geo
		// 转换为可以被识别的line字符串
		Boolean isContains = gisCompare.compare(plyIn, point);

		return isContains;
	};

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
	public static void main(String[] args) {
		long _date = System.currentTimeMillis();
	//	System.out.println(_date);
	}
}
