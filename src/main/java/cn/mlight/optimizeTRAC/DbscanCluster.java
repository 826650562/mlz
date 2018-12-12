package cn.mlight.optimizeTRAC;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/*
 * author:ShuChen
 */
public class DbscanCluster {

	private final double eps;
	private final int minPts;

	private enum PointStatus {
		NOISE, PART_OF_CLUSTER
	}

	private List<TPoint> noisePoints = new ArrayList<>();
	private List<TPoint> allPoints = new ArrayList<>();

	public List<TPoint> filter() {
		List<TPoint> resPoints = new ArrayList<>();
		for (int i = 0; i < allPoints.size(); i++) {
			boolean isin = false;
			for (int j = 0; j < noisePoints.size(); j++) {
				double longth = SpatilUtils.GetSpatialDistance(allPoints.get(i).x, allPoints.get(i).y,
						noisePoints.get(j).x, noisePoints.get(j).y);
				if (longth <= 2) {
					isin = true;
					break;
				}
			}
			if (!isin) {
				resPoints.add(allPoints.get(i));
			}
		}

		List<String> gpsDataLines = new ArrayList<String>();
		for (int j = 0; j < resPoints.size(); j++) {
			gpsDataLines.add(resPoints.get(j).v + " " + "2" + " " + resPoints.get(j).x + " " + resPoints.get(j).y + " "
					+ String.valueOf(resPoints.get(j).sjc));
		}

		GPSDataFactory gpsDatasFactory = new GPSDataFactory(gpsDataLines);
		return gpsDatasFactory.startFactory();

	}

	public DbscanCluster(double eps, int minPts) {
		if (eps < 0.0d) {
			throw new IllegalArgumentException("eps is not positive");
		}
		if (minPts < 0) {
			throw new IllegalArgumentException("minPts is not positive");
		}
		this.eps = eps;
		this.minPts = minPts;
	}

	public double getEps() {
		return eps;
	}

	public int getMinPts() {
		return minPts;
	}

	public List<TPoint> cluster(List<TPoint> points, List<TPoint> dbpoints) {
		allPoints = dbpoints;
		List<List<TPoint>> result = new ArrayList<>();
		Map<TPoint, PointStatus> used = new HashMap<>();
		for (TPoint point : points) {
			if (used.get(point) != null)
				continue;
			List<TPoint> neighbors = getNeighbors(point, points);
			if (neighbors.size() >= minPts) {
				List<TPoint> list = new ArrayList<>();
				result.add(expandCluster(list, point, neighbors, points, used));
			} else {
				used.put(point, PointStatus.NOISE);
				noisePoints.add(point);
			}
		}
		return this.filter();

	}

	private List<TPoint> expandCluster(List<TPoint> list, TPoint point, List<TPoint> neighbors, List<TPoint> points,
			Map<TPoint, PointStatus> used) {
		list.add(point);
		used.put(point, PointStatus.PART_OF_CLUSTER);
		List<TPoint> temp = new ArrayList<>(neighbors);
		int count = 0;
		while (count < temp.size()) {
			TPoint current = temp.get(count);
			PointStatus pStatus = used.get(current);
			if (pStatus == null) {
				List<TPoint> currentNeighbors = getNeighbors(current, points);
				if (currentNeighbors.size() >= minPts) {
					temp = merge(temp, currentNeighbors);
				}
			}
			if (pStatus != PointStatus.PART_OF_CLUSTER) {
				used.put(current, PointStatus.PART_OF_CLUSTER);
				list.add(current);
			}
			count++;
		}
		return list;
	}

	private List<TPoint> merge(List<TPoint> temp, List<TPoint> currentNeighbors) {
		Set<TPoint> tempSet = new HashSet<>(temp);
		for (TPoint point : currentNeighbors) {
			if (!tempSet.contains(point)) {
				temp.add(point);
			}
		}
		return temp;
	}

	// �������ڵ�����㣬��KD���Ż������Ӷ��½���logn
	private List<TPoint> getNeighbors(TPoint point, List<TPoint> points) {
		List<TPoint> res = new ArrayList<>();
		for (TPoint t : points) {
			if (t != point && point.sphericalDistaceTo(t, Constant.earthRadius) <= eps) {
				res.add(t);
			}
		}
		return res;
	}

}
