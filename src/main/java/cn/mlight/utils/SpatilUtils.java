package cn.mlight.utils;

public class SpatilUtils {

	/*
	 * public static double GetSpatialDistance(TrajPoint Point1, TrajPoint
	 * Point2) { return dist_m(Point1.y, Point1.x, Point2.y, Point2.x); }
	 * 
	 * public static double GetSpatialDistance(SamplePoint Point1, SamplePoint
	 * Point2) { return dist_m(Point1.y, Point1.x, Point2.y, Point2.x); }
	 * 
	 * public static double GetSpatialDistance(TrajPoint Point1, SamplePoint
	 * Point2) { return dist_m(Point1.y, Point1.x, Point2.y, Point2.x); }
	 */

	// 计算过两点间距离，米
	public static double GetSpatialDistance(double x1, double y1, double x2, double y2) {
		return dist_m(y1, x1, y2, x2);
	}

	public static double GetSpatialDistance(double[] a, double[] b) {
		return dist_m(a[1], a[0], b[1], b[0]);
	}

	/*
	 * public static double GetSpeed(TrajPoint Point1, TrajPoint Point2) {
	 * double d = dist_m(Point1.y, Point1.x, Point2.y, Point2.x); // long t =
	 * Point1.t.numSecondsFrom(Point2.t);
	 * 
	 * long ts = Point1.t.toInstant().getMillis() -
	 * Point2.t.toInstant().getMillis(); double t = ts / 1000.0; if (t < 0) t =
	 * -t; if (t < 0.000001 || d < 0.000001) return 0.0; else return d / t; }
	 */

	public static double GetSpeed(double d, double t) {
		if (t < 0.000001 || d < 0.000001)
			return 0.0;
		else
			return d / t;
	}

	// 求范围
	public static double GetSquare(double min_x, double min_y, double max_x, double max_y) {
		return (max_x - min_x) * (max_y - min_y);
	}

	/*
	 * public static double GetSpeed(SamplePoint Point1, SamplePoint Point2) {
	 * double d = dist_m(Point1.y, Point1.x, Point2.y, Point2.x); // long t =
	 * Point1.t.numSecondsFrom(Point2.t); long ts =
	 * Point1.t.toInstant().getMillis() - Point2.t.toInstant().getMillis();
	 * double t = ts / 1000.0; if (t < 0) t = -t; if (t < 0.000001 || d <
	 * 0.000001) return 0.0; else return d / t; }
	 */

	/*
	 * public static double GetSpeed(TrajPoint Point1, SamplePoint Point2) {
	 * double d = dist_m(Point1.y, Point1.x, Point2.y, Point2.x); // long t =
	 * Point1.t.numSecondsFrom(Point2.t); long ts =
	 * Point1.t.toInstant().getMillis() - Point2.t.toInstant().getMillis();
	 * double t = ts / 1000.0; if (t < 0) t = -t; if (t < 0.000001 || d <
	 * 0.000001) return 0.0; else return d / t; }
	 */

	/*
	 * public static double GetSpatialDistance(List<TrajPoint> PointList1,
	 * List<TrajPoint> PointList2) { return 0; }
	 */

	// const double d2r = (M_PI / 180.0);
	static final double d2r = (Math.PI / 180.0);

	// calculate haversine distance for linear distance, return meter
	static double dist_m(double lat1, double long1, double lat2, double long2) {
		double dlong = (long2 - long1) * d2r;
		double dlat = (lat2 - lat1) * d2r;
		double a = Math.pow(Math.sin(dlat / 2.0), 2)
				+ Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.pow(Math.sin(dlong / 2.0), 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		double d = 6367000 * c;

		return d;
	}

	public static void main(String[] args) {
		double[] a = new double[] { 121.345373, 31.306466 }, b = new double[] { 121.3114, 31.272142 };
		double len = 5001.9501;
		double result = len / Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
		System.out.println(result);
	}
}
