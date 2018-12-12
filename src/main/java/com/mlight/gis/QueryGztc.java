package com.mlight.gis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jms.core.JmsTemplate;

import com.mlight.jms.TextMessageCreator;
/*import com.mlight.jni.LogClient;*/
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

import cn.mlight.service.MapService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class QueryGztc {
	@Resource
	private MapService mapService;
	@Resource
	private JmsTemplate gztcJmsSendTempl;
	private HashMap wlArray;
	private List pointArray;
/*	private static final LogClient logClient = LogClient.getInstance();*/
	private GIScompare gisCompare = new GIScompare();
	static double x_pi = 3.14159265358979324 * 3000.0 / 180.0; 

	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	public void queryGztc() {
		/*logClient.validate();*/
		this.getLinesDateOfdzwl();
		this.queryYjInfo();
	}

	@SuppressWarnings("unchecked")
	public void getLinesDateOfdzwl() {
		String Sql = " SELECT * from t_gztc where del_flag = 0  order by id desc ";
		ArrayList<?> res = (ArrayList<?>) this.mapService.getListBySql(Sql);
		ArrayList<HashMap> fencelist = new ArrayList<HashMap>();
		for (int i = 0; i < res.size(); i++) {
			Map m = (Map) res.get(i);
			List fence = new ArrayList();
			HashMap NameMap = new HashMap();
			fence.add(m.get("name"));
			fence.add(m.get("miaoshu"));
			String date = m.get("create_date").toString();
			fence.add(date);
			fence.add(m.get("creater"));
			fence.add(m.get("point"));
			fence.add(m.get("polygon"));
			fence.add(m.get("id"));
			fence.add(m.get("distance"));
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
		String dqwz_sql = "SELECT  * FROM   t_location a   where a.id in( SELECT MAX(v.id) FROM t_location v where (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(v.standard_time))< 600   GROUP BY v.`user_name`) ";
		this.pointArray = mapService.getListBySql(dqwz_sql);
		this.compareLinesAndPoints();
	}

	public void setYjInfo(String wz_seq_no, String fence_id, int is_read, String _date, String user_name) {

		String Sql2 = "select addNewAlarmGztc('" + wz_seq_no + "'," + fence_id + ",'" + user_name + "'," + _date
				+ "+900000+1) from dual";
		try {
			this.mapService.execute(Sql2);
		} catch (Exception e) {
		}
	}

	public void queryYjInfo() {
		// 获取当前的所有位置点信息
		String Sql = "SELECT t.id, t2.`name` as wlname, t2.del_flag,t3.lat,t3.lon,t3.`name` as yonghu,t3.user_name,t.timestemp as yjsj,t2.id   from t_gztc_yj t join t_gztc t2  on t.gztc_id=t2.id join t_location t3 on t.wz_seq_no=t3.seq_no  where t.is_read=0 and   (UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(t.timestemp))< 6000";
		try {
			List res = mapService.getListBySql(Sql);
			JSONArray resJson = JSONArray.fromObject(res);
			this.gztcJmsSendTempl.send(new TextMessageCreator(resJson.toString()));
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
					double x = (double) pointGeo.get("bdlon");
					double y = (double) pointGeo.get("bdlat");
					double[] xy=bd_decrypt(x,y);
					Point point = gisCompare.getPoint(xy[0], xy[1]);
					Map mymap = (Map) fences.get(i);
					List myfence = (List) mymap.get("fence");
					String geobufferIn = (String) myfence.get(5);// bufferIn
					Boolean isContainsIn = this.compareEveryGeo(geobufferIn, point);
					if (isContainsIn) {
						long _date = System.currentTimeMillis();
						String seq_no = pointGeo.get("seq_no").toString();
						String user_name = pointGeo.get("user_name").toString();
						String id = Integer.toString((int) myfence.get(6));// 获取警戒区记录id
						String date = String.valueOf(_date);// 预警时间
						this.insertInfoTableOfGXTC(seq_no, id, 0, date, user_name);
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

	// 插入一条数据
	public void insertInfoTableOfGXTC(String wz_seq_no, String _id, int is_read, String _date, String user_name) {
		String isInfoSQL = "select * from  t_gztc_yj  t where t.user_name='" + user_name + "' and t.gztc_id='" + _id
				+ "'";
		List resJson = this.execteMysql(isInfoSQL, user_name, _id);
		if (resJson.size() < 1) {
			String sql = " INSERT into t_gztc_yj (wz_seq_no,gztc_id,is_read,timestemp,user_name) VALUES ('" + wz_seq_no
					+ "','" + _id + "','" + 0 + "','" + _date + "','" + user_name + "'" + ") ";
			this.mapService.execute(sql);

			String isInfoSQL2 = "select * from  t_gztc_yj  t where t.user_name='" + user_name + "' and t.gztc_id='"
					+ _id + "'";
			List resJson2 = this.execteMysql(isInfoSQL2, user_name, _id);
			this.gztcJmsSendTempl.send(new TextMessageCreator(resJson2.toString()));
		}
	}

	public List execteMysql(String sql, String user_name, String _id) {
		String isInfoSQL = "select * from  t_gztc_yj  t where t.user_name='" + user_name + "' and t.gztc_id='" + _id
				+ "'";
		List res = mapService.getListBySql(isInfoSQL);
		JSONArray resJson = JSONArray.fromObject(res);
		return resJson;
	};

	public Boolean compareEveryGeo(String geostring, Point point) {
		JSONObject jasonObject_geobufferIn = new JSONObject();
		try {
			jasonObject_geobufferIn = JSONObject.fromObject(geostring.replaceAll("'", "\""));
		} catch (Exception e) {
			System.out.println(geostring.replaceAll("'", "\""));
		}
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

}
