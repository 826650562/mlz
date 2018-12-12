package cn.mlight.optimizeTRAC;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;

public class stopAndmove {

	private List<TPoint> listPoints;

	stopAndmove(List<TPoint> tps) {
		this.setListPoints(tps);
	}

	public List<List<TPoint>> analyzeStayPoint() throws FileNotFoundException {
		if (this.listPoints.size() > 0) {
			Trajectory trajectory = new Trajectory();
			DataModel dataModel = new DataModel("Poi");
			List<List<TPoint>> res = new ArrayList<List<TPoint>>();
			for (TPoint p : listPoints) {
				// listTrajPoints.add();
				trajectory.TrajPoints.add(new TrajPoint(p.x, p.y, p.sjc, p.v));
			}

			if (trajectory != null) {
				// 4. 计算轨迹基本属性
				CalculateTrajPoint calculator = new CalculateTrajPoint(trajectory);

				// 5. 线性密度聚类
				LinearDensityClusterPara para = new LinearDensityClusterPara();
				LinearDensityCluster cluster = new LinearDensityCluster(trajectory);
				cluster.SetParameters(para);
				cluster.Run();
				cluster.SortResultClusters();

				if (cluster.ResultClusters().size() > 0) {
					List<ClusterPoints> ClusterPs = cluster.ResultClusters();

					for (ClusterPoints ps : ClusterPs) {
						List<TPoint> lst = new ArrayList<TPoint>();
						List<SMPoint> points = ps.points;
						for (SMPoint smp : points) {
							// double x, double y, Long sjc, double v
							DateTime dt = smp.t();
							long millis = dt.getMillis();
							lst.add(new TPoint(smp.x(), smp.y(), millis, smp.speed()));
						}
						res.add(lst);
					}
				}
			}
			return	res;

		}

		return null;
	}

	private void centerOfstop() {

	}

	public List<TPoint> getListPoints() {
		return listPoints;
	}

	public void setListPoints(List<TPoint> listPoints) {
		this.listPoints = listPoints;
	}
}
