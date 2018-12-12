package cn.mlight.optimizeTRAC;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Zrender {
	public List<TPoint> stopAndmoves;
	public final static double eps = 35;
	public final static int minPts = 2;
	public static ResOfTras resOfTras;
	public final static int minPoints = 15;

	public static ResOfTras begin(List<List<String>> listOfpoint, ResOfTras resObj)  {
		List<TPoint> doublist = new ArrayList<TPoint>();
		List<TPoint> tempList = new ArrayList<TPoint>();
		resOfTras = resObj;
		try {
			for (List<String> st : listOfpoint) {
				double x = Double.parseDouble(st.get(0));
				double y = Double.parseDouble(st.get(1));
				Long time = Long.valueOf(st.get(2));
				double v = Double.parseDouble(st.get(3));
				TPoint p = new TPoint(x, y, time, v);
				if (!isinpoints(tempList, p)) {
					tempList.add(p);
				}
				doublist.add(p);
			}
		} catch (Exception e) {
		}
		Subtracs stac = new Subtracs(tempList);
		List<List<TPoint>> SubDoublist = stac.subTrajects();
		for (int i = 0; i < SubDoublist.size(); i++) {
			List<TPoint> tpList = SubDoublist.get(i);
			//每一条轨迹里面有多条子轨迹，每个子轨迹里面有多个停留点集合 和一条正常轨迹
			if (tpList.size() >= minPoints) {
				MyTrac tac = new MyTrac();
				tac.setSeq(i);
				try {
					Long beginSjc = tpList.get(0).sjc;
					Long endSjc = tpList.get(tpList.size() - 1).sjc;
					if (beginSjc != 0 && endSjc != 0) {
						tac.setStartTime(beginSjc);
						tac.setEndTime(endSjc);
					}
					// 分析停留点
					stopAndmove snd = new stopAndmove(tpList);
					//获得几个停留点
					List<List<TPoint>> stopss=snd.analyzeStayPoint();
					tac.setStopPt(stopss);
				} catch (Exception e) {
					// TODO: handle exception
				}
				//降噪和平滑
				DbscanCluster db = new DbscanCluster(eps, minPts);
				tac.setShowPt(db.cluster(tpList, tpList)); 
				resOfTras.ListMyTrac.add(tac);
			}
		}
		return resOfTras;
	}

	public static boolean isinpoints(List<TPoint> ls, TPoint point) {

		boolean isin = false;
		for (int i = 0; i < ls.size(); i++) {
			double longth = SpatilUtils.GetSpatialDistance(ls.get(i).x, ls.get(i).y, point.x, point.y);
			if (longth <= 1) {
				isin = true;
			}
		}
		return isin;
	}

}
