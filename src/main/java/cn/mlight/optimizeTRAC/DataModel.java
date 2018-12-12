package cn.mlight.optimizeTRAC;


import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import org.joda.time.DateTime;

/*
 * 一个移动对象对应的数据模型
 * */
public class DataModel {

	private String _movobjid;
	private int _nextPointId;
	private DaySample _daySample;
	private Trajectory _trajectory;
	private LinearDensityCluster cluster;

	public DataModel(String movingObjectId) {
		this._movobjid = movingObjectId;
		_nextPointId = 0;
		_daySample = null;
	}

	public String getMovObjId() {
		return _movobjid;
	}

	public DaySample getDaySample() {
		return _daySample;
	}

	public Trajectory getTrajectory() {
		return _trajectory;
	}

	// 将原始采样记录构造DaySample和SamplePoint对象
	public int ImportRawPoints(Iterable<SampleRecord> records) {
		// return 1;
		int countOfPoint = 0; // 已导入点数
		DateTime begin = DateTime.now(), end = DateTime.now(); // 一个轨迹文件内的轨迹点的开始时间和结束时间
		try {
			_daySample = null;

			boolean first = true;
			SampleRecord last = null;
			for (SampleRecord rec : records) {
				last = rec;
				if (first) {
					begin = rec.MeaTime;
					first = false;
				}
				++_nextPointId;
				++countOfPoint;
				SamplePoint newPoint = new SamplePoint();
				{
					newPoint.id = _nextPointId;
					newPoint.x = rec.Lon;
					newPoint.y = rec.Lat;
					newPoint.z = 0;
					newPoint.v = rec.Velocity;
					newPoint.t = rec.MeaTime;
					newPoint.empty = rec.Empty;
				}
				;
				if (_daySample == null) {
					_daySample = new DaySample();
					{
						_daySample.day = new DateTime(newPoint.t.getYear(),
								newPoint.t.getMonthOfYear(),
								newPoint.t.getDayOfMonth(), 0, 0);
						_daySample.firsttime = begin;
						_daySample.lasttime = end;
						_daySample.count = countOfPoint;
						// newDaySample.ownerMO = newMovingObject;
					}
					;
				} else {
					_daySample.lasttime = end;
					_daySample.count = countOfPoint;
				}
				_daySample.SamplePoints.add(newPoint);
			}

			end = last.MeaTime;
			return countOfPoint;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return countOfPoint;
	}

	// 不经过任何计算，直接将原始采样记录按照轨迹对象格式生成轨迹对象和轨迹点对象
	public void CreateWholeTrajectory() {
		_trajectory = null;
		if (_daySample != null && _daySample.SamplePoints.size() > 1) {
			Trajectory traj = new Trajectory();
			for (SamplePoint sp : _daySample.SamplePoints) {
				TrajPoint trajPoint = new TrajPoint();
				trajPoint.x = sp.x;
				trajPoint.y = sp.y;
				trajPoint.z = sp.z;
				trajPoint.t = sp.t;
				trajPoint.v = sp.v;
				trajPoint.empty = sp.empty;
				traj.TrajPoints.add(trajPoint);
			}
			_trajectory = traj;
		}
	}

	// 打印轨迹的基本概要信息
	public void PrintTrajectoryDetail(PrintWriter p) {
		if (_trajectory != null) {/*
			Trajectory t = _trajectory;
			System.out.println(String.format("first:%s://开始时间",
					t.first.toString("yyyy-MM-dd HH:mm:ss")));
			System.out.println(String.format("last:%s://结束时间",
					t.last.toString("yyyy-MM-dd HH:mm:ss")));
			System.out.println(String.format("avgv:%s://平均速度", Double.toString(t.avgv)));
			System.out.println(String.format("maxv:%s://最大速度", Double.toString(t.maxv)));
			System.out.println(String.format("minv:%s://最小速度", Double.toString(t.minv)));
			System.out.println(String.format("span:%s://时间跨度", Integer.toString(t.span)));
			System.out.println(String.format("len:%s://总长度", Double.toString(t.len)));
			System.out.println(String.format("maxspan:%s://最大跨度",
					Integer.toString(t.maxspan)));
			System.out.println(String.format("minspan:%s://最小跨度",
					Integer.toString(t.minspan)));
			System.out.println(String.format("maxdist:%s://最大间距",
					Double.toString(t.maxdist)));
			System.out.println(String.format("mindist:%s://最小间距",
					Double.toString(t.mindist)));
		*/}
	}

	// 轨迹概要
	public String PrintTrajectoryDetailLine() {
		StringBuffer buffer = new StringBuffer("");
		if (_trajectory != null) {
			Trajectory t = _trajectory;
			buffer.append(this._movobjid);

			buffer.append(",");
			buffer.append(t.first.toString("yyyy-MM-dd HH:mm:ss"));

			buffer.append(",");
			buffer.append(t.last.toString("yyyy-MM-dd HH:mm:ss"));

			buffer.append(",");
			buffer.append(Double.toString(t.avgv));

			buffer.append(",");
			buffer.append(Double.toString(t.maxv));

			buffer.append(",");
			buffer.append(Double.toString(t.minv));

			buffer.append(",");
			buffer.append(Double.toString(t.span));

			buffer.append(",");
			buffer.append(Double.toString(t.len));

			buffer.append(",");
			buffer.append(Integer.toString(t.maxspan));

			buffer.append(",");
			buffer.append(Integer.toString(t.minspan));

			buffer.append(",");
			buffer.append(Double.toString(t.maxdist));

			buffer.append(",");
			buffer.append(Double.toString(t.mindist));
		}

		return buffer.toString();
	}

	// 聚类结果
	// taxiid,stoptime,stopbegin,stopend,stopspeed
	public List<String> PrintClusterDetailLine() {
		String param = this.PrintClusterParamLine();

		List<String> result = new ArrayList<String>();
		if (this.cluster != null) {
			int i = 0;

			if (cluster.ResultClusters().size() > 0) {
				for (ClusterPoints c : cluster.ResultClusters()) {
					StringBuffer buffer = new StringBuffer();
					buffer.append(this._movobjid + "-" + (i++));

					buffer.append(",");
					buffer.append(this._movobjid);

					buffer.append(",");
					buffer.append(Long.toString(c.getDuration()));

					buffer.append(",");
					buffer.append(c.getBeginTime().toString(
							"yyyy-MM-dd HH:mm:ss"));

					buffer.append(",");
					buffer.append(c.getEndTime()
							.toString("yyyy-MM-dd HH:mm:ss"));

					buffer.append(",");
					buffer.append(Double.toString(c.getAverageSpeed()));

					buffer.append(",");
					buffer.append(param);

					// 聚类参数
					result.add(buffer.toString());
				}
			}
		}
		return result;
	}

	// 聚类参数
	// mMaxAvgSpeed,mMaxSpeed,mMinTime
	public String PrintClusterParamLine() {
		StringBuffer paramBuf = new StringBuffer();
		if (this.cluster != null) {
			paramBuf.append(Double.toString(cluster.mMaxAvgSpeed));

			paramBuf.append(",");
			paramBuf.append(Double.toString(cluster.mMaxSpeed));

			paramBuf.append(",");
			paramBuf.append(Integer.toString(cluster.mMinTime / 1000));
		}
		return paramBuf.toString();
	}

	public void PrintClusterDetail(PrintWriter p, LinearDensityCluster cluster) {
		if (cluster != null) {
			System.out.println(String.format("AvgVFactor:%s://平均速度因子（0-1）",
					Double.toString(cluster.mMaxAvgSpeed)));
			System.out.println(String.format("MaxVFactor:%s://最大即时速度因子（>1）",
					Double.toString(cluster.mMaxSpeed)));
			System.out.println(String.format("MinTime:%s://最小时间跨度（秒）",
					Integer.toString(cluster.mMinTime / 1000)));
			System.out.println(String.format("count:%s://类簇个数",
					Integer.toString(cluster.ResultClusters().size())));
			for (ClusterPoints c : cluster.ResultClusters()) {
				System.out.println(String.format("stoptime:%s://停留时间（秒）",
						Long.toString(c.getDuration())));
				System.out.println(String.format("stopbegin:%s://开始时刻", c.getBeginTime()
						.toString("yyyy-MM-dd HH:mm:ss")));
				System.out.println(String.format("stopend:%s://结束时刻", c.getEndTime()
						.toString("yyyy-MM-dd HH:mm:ss")));
				System.out.println(String.format("stopspeed:%s://停留平均速度（米/秒）",
						Double.toString(c.getAverageSpeed())));
			}
		}
	}

	public LinearDensityCluster getCluster() {
		return cluster;
	}

	public void setCluster(LinearDensityCluster cluster) {
		this.cluster = cluster;
	}

}
