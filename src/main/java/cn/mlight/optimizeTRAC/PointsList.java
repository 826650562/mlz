package cn.mlight.optimizeTRAC;

import org.joda.time.DateTime;
import java.util.List;
import java.util.ArrayList;
public class PointsList
{
    private final int FIRST_INDEX = 0;

List<SMPoint> points;

public PointsList() {
    points = new ArrayList<SMPoint>();
}

// 获取集合中点的时间差，以毫秒为单位
public long duration() {
	int size = 0;
	if (points != null && (size = points.size()) > 0) {
		DateTime firstTime = points.get(FIRST_INDEX).t();
        DateTime lastTime = points.get(size - 1).t();
        return (long)(lastTime.getMillis() - firstTime.getMillis()); // 
	}
	else {
		return 0;
	}
}

public void addToBegin(SMPoint point) {
    points.add(FIRST_INDEX, point);
}

public void addToEnd(SMPoint point) {
    points.add(point);
}

public int getFirstPointTimeIndex() {
    return points.get(FIRST_INDEX).getTimeIndex();
}

public int getLastPointTimeIndex() {
    return points.get(points.size()-1).getTimeIndex();
}

public double meanSpeed() {
    int i = 1;
    DateTime timeFirst = points.get(0).t();
    double distance = 0.0;
	while (i < points.size()) {
		SMPoint lastPoint = points.get(i-1);
		SMPoint currentPoint = points.get(i);
        distance = distance + DistanceUtility.GetSpatialDistance(lastPoint.x(), lastPoint.y(), currentPoint.x(), currentPoint.y());
        i++;
	}

    long time = (long)(points.get(points.size() - 1).t().getMillis() - timeFirst.getMillis());

    return (distance / ((double) time/1000));
}

// 设置点集合中所有点的类簇ID
public void setClusterId(int clusterId) {
    for (SMPoint p : points) {
        p.setClusterId(clusterId);
    }
}
}
