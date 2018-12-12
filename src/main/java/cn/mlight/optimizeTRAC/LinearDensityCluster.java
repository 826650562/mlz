package cn.mlight.optimizeTRAC;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;

public class LinearDensityCluster {
	private Trajectory mTrajectory = null;
	double mMaxAvgSpeed = 0.6; //
	int mMinTime = 180 * 1000;
	double mMaxSpeed = 1.5;
	private List<ClusterPoints> mClusters = null;

	// 返回聚类类簇的集合（一个类簇是连续点集合）。类簇：ClusterPoints
	public List<ClusterPoints> ResultClusters() {
		return this.mClusters;
	}

	public LinearDensityCluster(Trajectory traj) {
		if (traj != null && traj.TrajPoints.size() > 0) {
			if (traj.span == 0) {
				CalculateTrajPoint calc = new CalculateTrajPoint(traj);
			}
		}
		mTrajectory = traj;
	}

	public void SetParameters(LinearDensityClusterPara para) {
		this.mMaxAvgSpeed = para.AverageFactor;
		this.mMaxSpeed = para.LimitedFactor;
		this.mMinTime = para.MinTime * 1000;
	}

	public void Run() {
		mClusters = speedClustering(this.mTrajectory, mMaxAvgSpeed, mMinTime,
				mMaxSpeed);
	}

	public void SortResultClusters() {
		if (mClusters != null) {
			Collections.sort(mClusters, new Comparator<ClusterPoints>() {
				public int compare(ClusterPoints c1, ClusterPoints c2) {
					return ClusterPoints.compareCluster(c1, c2);
				}
			});
		}
		//System.out.println(mClusters);
	}

	public static List<ClusterPoints> speedClustering(Trajectory t,
			double avgFactor, long minTimeMilli, double speedLimitFactor) {
		Logger logger = Logger.getLogger("LinearDenstiyCluster");
		List<SMPoint> points = new ArrayList<SMPoint>();
		int timeIndex = 0;

		logger.info("t:" + t);
		logger.info("t.TrajPoints:" + t.TrajPoints);

		for (TrajPoint tp : t.TrajPoints) {
			points.add(new SMPoint(tp, timeIndex++));
		}

		double avgSpeedOfTrajectory = t.avgv;
		double avgSpeedLimit = avgSpeedOfTrajectory * avgFactor;
		double instantSpeedLimit = avgSpeedOfTrajectory * speedLimitFactor; // 即时速度的最大阈值

		int clusterId = 1;
		// 对轨迹点的‘即时速度’从小到大进行排序
		List<SMPoint> pointsSorted = getPointsSortedBySpeed(points);
		// 从速度最小的轨迹点开始，作为种子停留进行左右扩展，因为速度最小的轨迹点更容易满足条件要求。
		for (SMPoint point : pointsSorted) {

			// 如果当前轨迹点没有被划分到某类簇，则进行划分。
			// 此处不一定按照循环的顺序逐个执行，可能是跳跃执行的，因为执行某个轨迹点，可能会扩展影响其邻居的类簇划分。
			if (point.getClusterId() == SMPoint.NULL_CLUSTER_ID) { // point is
																	// unprocessed
				if (limitedNeighborhood(points, point, clusterId,
						avgSpeedLimit, minTimeMilli, instantSpeedLimit)) {
					clusterId++;
				}
			}
		}
		// 合并相邻的类簇
		unifyAdjacentClusters(points);
		return createClusters(points);
	}

	// 按照顺序进行排序，速度从小--到大排序
	private static List<SMPoint> getPointsSortedBySpeed(List<SMPoint> points) {
		List<SMPoint> pointsCopy = new ArrayList<SMPoint>();
		for (SMPoint p : points) {
			pointsCopy.add(p);
		}

		// pointsCopy.Sort(compare);
		Collections.sort(pointsCopy, new Comparator<SMPoint>() {
			public int compare(SMPoint p1, SMPoint p2) {
				double s1 = p1.speed();
				double s2 = p2.speed();
				return s1 < s2 ? -1 : (s1 > s2 ? +1 : 0);
			}
		});
		return pointsCopy;
	}

	private static int compare(SMPoint p1, SMPoint p2) {
		double s1 = p1.speed();
		double s2 = p2.speed();
		return s1 < s2 ? -1 : (s1 > s2 ? +1 : 0);
	}

	private static boolean limitedNeighborhood(List<SMPoint> points,
			SMPoint point, int clusterId, double avgSpeedLimit,
			long minTimeMilliseconds, double instantSpeedLimit) {
		if (point.speed() > instantSpeedLimit) {
			return false;
		}
		PointsList seeds = new PointsList();
		seeds.addToEnd(point);

		// 向‘种子停留窗口’的左右邻居扩展，直到条件不满足
		slowestNeighborhood(points, seeds, instantSpeedLimit,
				minTimeMilliseconds);
		double meanSpeed = seeds.meanSpeed();
		if (meanSpeed > avgSpeedLimit || seeds.duration() < minTimeMilliseconds) {
			// ‘种子停留窗口’的平均速度超过阈值或者持续时间不够最小阈值，则说明：本次以‘point作为起点’没有找到满足条件的停留。
			// 这个查找过程并没有修改任何点的类簇标识符clusterId
			return false;
		} else {
			seeds.setClusterId(clusterId);// 设置‘种子停留窗口’中所有的类簇标签为一个统一的编号值。
			while (true) {// 一直不停地扩展‘种子停留窗口’左邻居或者右邻居（如果有的话）

				// 将即时速度较小的左邻居或者右邻居添加到‘种子停留窗口’中，然后再判断整个窗口是否满足速度要求，时间要求已经满足了。
				// 虽然已经将左邻居或者右邻居添加到了窗口中，但是 没有对clusterId编号，并不影响最终类簇结果。
				SMPoint addedPoint = addSlowerNeighborToSeeds(points, seeds);
				if (addedPoint != null) {
					double newMeanSpeed = seeds.meanSpeed();
					if (newMeanSpeed <= avgSpeedLimit
							&& addedPoint.speed() <= instantSpeedLimit) {
						if (addedPoint.getClusterId() == SMPoint.NULL_CLUSTER_ID) {
							// 如果左右邻居还没有编号，则对新添加的左右邻居进行编号；
							addedPoint.setClusterId(clusterId);
						} else {
							// 如果左右邻居已经有了编号，就不再对其编号了，而是放弃，如果再进行编号，相当于破坏了
							// 左右邻居所在的原有类簇。
							break;
						}
					} else {
						break;
					}
				} else {
					break;
				}
			}
		}
		return true;
	}

	// 根据初始的种子停留窗口，试探性查找窗口的左右邻居，将满足速度阈值要求的最慢左邻居或者右邻居加入到窗口。
	private static void slowestNeighborhood(List<SMPoint> points,
			PointsList seeds, double instantSpeedLimit, long minTimeMilliseconds) {
		SMPoint leftPoint;
		SMPoint rightPoint;
		do {
			try {
				leftPoint = points.get((seeds.getFirstPointTimeIndex() - 1));
			} catch (IndexOutOfBoundsException eLeft) {
				try {
					rightPoint = points.get(seeds.getLastPointTimeIndex() + 1);
				} catch (IndexOutOfBoundsException eRight) {
					break;// 如果种子停留窗口既没有左邻居，又没有右邻居，则循环结束。
				}
				if (rightPoint.getClusterId() == SMPoint.NULL_CLUSTER_ID
						&& rightPoint.speed() <= instantSpeedLimit) {
					seeds.addToEnd(rightPoint); // 在没有左邻居的情况下，有又邻居，且右邻居速度没有超过即时阈值，加入到种子停留窗口。
					continue;// 跳过后续
				} else {
					break;// 如果右邻居已被化成类簇，或者超过阈值则退出循环。
				}
			}
			try {
				// 程序走到这里表示：有左邻居。
				rightPoint = points.get(seeds.getLastPointTimeIndex() + 1);
			} catch (IndexOutOfBoundsException eRight) {
				if (leftPoint.getClusterId() == SMPoint.NULL_CLUSTER_ID
						&& leftPoint.speed() <= instantSpeedLimit) {
					seeds.addToBegin(leftPoint);
					continue;
				} else {
					break;
				}
			}
			// 对比左右邻居的大小，选择其中一个速度小的，加入到种子停留窗口中。
			if ((leftPoint.speed() <= rightPoint.speed())
					&& leftPoint.getClusterId() == SMPoint.NULL_CLUSTER_ID
					&& leftPoint.speed() <= instantSpeedLimit) {
				seeds.addToBegin(leftPoint);
			} else if (rightPoint.getClusterId() == SMPoint.NULL_CLUSTER_ID
					&& rightPoint.speed() <= instantSpeedLimit) {
				seeds.addToEnd(rightPoint);
			} else {
				break;// 要么是不满足阈值要求，要么是邻居已经有了类簇标签。
			}
		} while (seeds.duration() < minTimeMilliseconds);
	}

	// 给定‘种子停留窗口’seeds，比较其左右邻居的即时速度，将值较小的邻居添加到‘种子停留窗口’
	// 中，并且返回这个较小值的邻居。如果没有左右邻居，则返回空null
	private static SMPoint addSlowerNeighborToSeeds(List<SMPoint> points,
			PointsList seeds) {
		SMPoint leftPoint;
		SMPoint rightPoint;
		try {
			leftPoint = points.get(seeds.getFirstPointTimeIndex() - 1);
		} catch (IndexOutOfBoundsException eLeft) {
			leftPoint = null;
		}
		try {
			rightPoint = points.get(seeds.getLastPointTimeIndex() + 1);
		} catch (IndexOutOfBoundsException eRight) {
			if (leftPoint != null) {
				seeds.addToBegin(leftPoint);
			}
			return leftPoint;
		}
		if ((leftPoint != null) && (leftPoint.speed() <= rightPoint.speed())) {
			seeds.addToBegin(leftPoint);
			return leftPoint;
		} else {
			seeds.addToEnd(rightPoint);
			return rightPoint;
		}
	}

	private static void unifyAdjacentClusters(List<SMPoint> points) {
		if (points.size() < 2) {
			return;
		}

		int i = 1;
		while (i < points.size()) {
			SMPoint p = points.get(i); // gets the second point ordered by time
			int lastClusterId = points.get(p.getTimeIndex() - 1).getClusterId();
			if (p.getClusterId() != SMPoint.NULL_CLUSTER_ID
					&& lastClusterId != SMPoint.NULL_CLUSTER_ID) {
				if (p.getClusterId() != lastClusterId) {
					int newClusterId = Math
							.min(lastClusterId, p.getClusterId());
					p.setClusterId(newClusterId);
				}
			}
			i++;
		}
	}

	private static List<ClusterPoints> createClusters(List<SMPoint> points) {
		List<SMPoint> clusterPoints = new ArrayList<SMPoint>();
		for (SMPoint p : points) {
			if (p.getClusterId() != SMPoint.NULL_CLUSTER_ID) {
				clusterPoints.add(p);
			}
		}

		List<ClusterPoints> clusters = new ArrayList<ClusterPoints>();
		ClusterPoints acluster = new ClusterPoints();

		if (clusterPoints.size() > 0) {
			SMPoint p = clusterPoints.get(0);
			acluster.points.add(p);
			int lastClusterId = p.getClusterId();
			acluster.clusterId = lastClusterId;
			int i = 1;
			while (i < clusterPoints.size()) {
				p = clusterPoints.get(i);
				if (p.getClusterId() != lastClusterId) {
					clusters.add(acluster);
					acluster = new ClusterPoints();
					lastClusterId = p.getClusterId();
					acluster.clusterId = lastClusterId;
				}
				acluster.points.add(p);
				i++;
			}
			clusters.add(acluster);
		}

		return clusters;
	}
}