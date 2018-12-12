package cn.mlight.action;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.mlight.chat.util.DateUtils;
/*import com.mlight.jni.LogClient;*/

import cn.mlight.service.MapService;

public class JmstjfxAction {
	@Resource
	private MapService mapService;
	/*private static final LogClient logClient = LogClient.getInstance();*/
	// 新增
	//private List hxList = new ArrayList();
	//private GIScompare gisCompare = new GIScompare();

	public MapService getMapService() {
		return mapService;
	}

	public void setMapService(MapService mapService) {
		this.mapService = mapService;
	}

	public void insertmsg() {
	/*	logClient.validate();*/
		// 查询北戴河区域
		//this.getLinesDateOfjjqy();

		String date = DateUtils.getDispNow("yyyy-MM-dd HH:00:00");
		String pre_time = getTimeByMinute(-1);
		String suf_time = getTimeByMinute(1);
		List allmb_list = mapService.getListBySql(
				"select count(0) allmb_count from t_target t where t.rwid in(select rwid from t_task t where t.state = '1' )");
		Map allmb_map = (Map) allmb_list.get(0);
		String allmb_count = allmb_map.get("allmb_count").toString();
		//List zzid_list = mapService.getListBySql("select zz_id from t_sub_task where state = '1'");
		int hx_count = 0;
		/*for (int j = 0; j < zzid_list.size(); j++) {
			Map zzid_map = (Map) zzid_list.get(j);
			String zzid_str = zzid_map.get("zz_id").toString();
			List loc_list = mapService
					.getListBySql("select MAX(id) id ,t.lat,t.lon from t_location t where user_id = '" + zzid_str
							+ "' and t.standard_time >='" + pre_time + "' and t.standard_time <='" + suf_time + "' ");
			Map loc_map = (Map) loc_list.get(0);
			if (loc_map.get("id") != null && !"".equals(loc_map.get("id"))) {
				String lat = loc_map.get("lat").toString();
				String lon = loc_map.get("lon").toString();

				boolean xx = getArea(lon, lat);
				if (xx) {
					hx_count++;
				}
			}
		}*/
		mapService.execute("insert into t_statistics_targets(t_time,all_count,hxq_mbcount) values ('" + date + "','"
				+ allmb_count + "','" + hx_count + "')");// biedon 这个是核心区的
	}

	/*
	 * public static boolean getArea(String lat, String lon) {
	 * 
	 * return true; }
	 */

	/*
	 * 对比代码
	 */

	/*public boolean getArea(String lon, String lat) {
		double x = Double.valueOf(lon);
		double y = Double.valueOf(lat);
		Point point = this.gisCompare.getPoint(x, y);
		Boolean isContainsIn =false;
		if(hxList.size()>=2){
			isContainsIn = this.compareEveryGeo(hxList.get(2).toString(), point);
		    return isContainsIn;
		}
		return isContainsIn;
	}*/

	/*public Boolean compareEveryGeo(String geostring, Point point) {

		JSONObject jasonObject_geobufferIn = JSONObject.fromObject(geostring.replaceAll("'", "\""));

		Map Map_geobufferIn = (Map) jasonObject_geobufferIn;

		Polygon plyIn = gisCompare.createPolygonByWKT(this.getPointString(Map_geobufferIn));// 将geo
		// 转换为可以被识别的line字符串
		Boolean isContains = gisCompare.compare(plyIn, point);

		return isContains;
	};*/

	/*public StringBuffer getPointString(Map object) {
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
	}*/

	/*@SuppressWarnings("unchecked")
	public void getLinesDateOfjjqy() {
		// 获取所有的在此时间范围内的预警信息
		String Sql = " SELECT  *  from t_bdharea t ";
		ArrayList<?> res = (ArrayList<?>) this.mapService.getListBySql(Sql);
		if (res.size() > 0) {
			HashMap m = (HashMap) res.get(0);
			hxList.add(m.get("id"));
			hxList.add(m.get("name"));
			hxList.add(m.get("area"));
		}
	}
*/
	// 获取当前时间XX分钟前的时间 格式yyyy-MM-dd HH:mm:ss
	public static String getTimeByMinute(int minute) {

		Calendar calendar = Calendar.getInstance();

		calendar.add(Calendar.MINUTE, minute);

		return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(calendar.getTime());

	}

	public static void main(String[] args) {
		System.out.println(DateUtils.getDispNow("yyyy-MM"));
		String xx = new java.text.DecimalFormat("#.00").format(3.1415926);
		System.out.println(xx);
		System.out.println(getTimeByMinute(1));

	}
}
