package com.mlight.gis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimerTask;

import javax.annotation.Resource;

import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

import cn.mlight.service.MapService;
import net.sf.json.JSONObject;

public class GISlocationTask extends TimerTask {
	@Resource
	private MapService mapService;
	private HashMap wlArray;// 查询到的所有的围栏信息
	private List pointArray;// 查询到的所有的围栏信息
	private GIScompare gisCompare = new GIScompare();

	@Override
	public void run() {
		this.getLinesDateOfdzwl();
	}

	public GISlocationTask(MapService mapService) {
		this.mapService = mapService;
	}

	@SuppressWarnings("unchecked")
	public void getLinesDateOfdzwl() {
		// 获取所有的电子围栏
		String Sql = " SELECT * from t_fence where del_flag = 0 and isRead = 0 order by id desc ";
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

	public void compareLinesAndPoints() {
		ArrayList<Map> res=new ArrayList<Map>();
		ArrayList<ArrayList> resMap=new ArrayList<ArrayList>();
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
					//Boolean isContains = gisCompare.compare(ply, point);
					/*if(isContains){
						res.add(pointGeo);res.add(mymap);
						resMap.add(res);
					}*/
				}
			}
		}
		//System.out.println(resMap);
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

}
