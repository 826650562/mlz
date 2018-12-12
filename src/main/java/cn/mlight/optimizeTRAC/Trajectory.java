package cn.mlight.optimizeTRAC;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;

public class Trajectory implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1688415786483142528L;
	public int id;
	public DateTime first;
	public DateTime last;
	public double avgv;
	public double maxv;
	public double minv;
	public int span;
	public double len;
	public int maxspan;
	public int minspan;
	public double maxdist;
	public double mindist;
	public String name;
	public List<TrajPoint> TempNoiseList;
	public List<TrajPoint> TrajPoints;

	public Trajectory() {
		this.TempNoiseList = new ArrayList<TrajPoint>();
		this.TrajPoints = new ArrayList<TrajPoint>();
	}

	public Trajectory(String name) {
		this.TempNoiseList = new ArrayList<TrajPoint>();
		this.TrajPoints = new ArrayList<TrajPoint>();
		this.name = name;
	}

	public String DumpDetail() {
		return String.format(
				"开始时间:%s\n结束时间:%s\n平均速度:%s\n最大速度:%s\n最小速度:%s\n时间跨度:%s\n"
						+ "总长度:%s\n最大跨度:%s\n最小跨度:%s\n最大间距:%s\n最小间距:%s\n",
				first.toString("yyyy-MM-dd HH:mm:ss"),
				last.toString("yyyy-MM-dd HH:mm:ss"), Double.toString(avgv),
				Double.toString(maxv), Double.toString(minv),
				Integer.toString(span), Double.toString(len),
				Integer.toString(maxspan), Integer.toString(minspan),
				Double.toString(maxdist), Double.toString(mindist));
	}

	public String getAbstract() {
		// 用于说明字段含义
		String[] keys = new String[] { "taxiId", "开始时间", "结束时间", "平均速度",
				"最大速度", "最小速度", "时间跨度", "总长度", "最大跨度", "最小跨度", "最大间距", "最小间距" };
		return String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s", this.name,
				first.toString("yyyy-MM-dd HH:mm:ss"),
				last.toString("yyyy-MM-dd HH:mm:ss"), Double.toString(avgv),
				Double.toString(maxv), Double.toString(minv),
				Integer.toString(span), Double.toString(len),
				Integer.toString(maxspan), Integer.toString(minspan),
				Double.toString(maxdist), Double.toString(mindist));
	}

	public static void main(String[] args) throws IOException {
		FileOutputStream fstream = new FileOutputStream(new File("tmp.obj"));
		ObjectOutputStream oStream = new ObjectOutputStream(fstream);
		Trajectory traj = new Trajectory();
		traj.TrajPoints = new ArrayList<TrajPoint>(1);
		TrajPoint point = new TrajPoint();
		traj.TrajPoints.add(point);
		oStream.writeObject(traj);
		oStream.flush();
		oStream.close();
	}
}
