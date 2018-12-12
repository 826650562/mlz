package com.mlight.gis;

import java.util.ArrayList;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class GIScompare {
	public GeometryFactory myGF = new GeometryFactory();
	public ArrayList<Polygon> Polygons;// 数据库中的围栏
	public ArrayList<Point> Point; // 当前所有的位置信息

	public Point getPoint(double x, double y) {
		// 根据json数据参数产生一个Point对象
		return this.getMyGF().createPoint(this.getPointObj(x, y)); // 创建一个点对象
	}

	public Coordinate getPointObj(double x, double y) {
		// 生成一个类point对象
		return new Coordinate(x, y);
	}

	public Polygon createPolygonByWKT(StringBuffer sb) {
		// 生成一个类多边形对象
		WKTReader reader = new WKTReader(new GeometryFactory());
		Polygon polygon = null;
		String geostr = sb.substring(0, sb.length() - 1);
		try {
			polygon = (Polygon) reader.read("POLYGON((" + geostr.toString() + "))");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return polygon;
	}

	// 拿到一个点 和所有的 在使用中的围栏相互比较， 返回预警的点 及相关信息
	public boolean compare(Geometry g1, Geometry g2/*, String type*/) {
		boolean isYj=false;
		/*if (type.equals("禁出")) {
			if(g1.contains(g2)){
				isYj=false;
			}else{
				isYj=true;
			}
				
		} else if (type.equals("禁入")) {
			isYj=  g1.contains(g2);
		}*/
		isYj=  g1.contains(g2);
		return isYj;
	}

	public GeometryFactory getMyGF() {
		return myGF;
	}

	public void setMyGF(GeometryFactory myGF) {
		this.myGF = myGF;
	}

}
