package cn.mlight.optimizeTRAC;

import org.joda.time.DateTime;

import java.io.Serializable;
import java.util.List;
import java.util.ArrayList;
public class ClusterPoints implements Serializable
{
    public List<SMPoint> points = new ArrayList<SMPoint>();
    public int clusterId;
    private int minPoints = 2;

    public ClusterPoints()
    {
    }

    public boolean check(long minTimeMili)
    {
        if (points.size() > minPoints)
        {//respecting the minimum cluster points	    	
            if (getDuration() >= minTimeMili)
            {
                return true;
            }
            else
                return false;
        }
        else return false;
    }

    public long getDuration()
    {
        return (long)((points.get(points.size() - 1).t().getMillis() - points.get(0).t().getMillis()) / 1000);
    }

    public DateTime getBeginTime()
    {
        return points.get(0).t();
    }

    public DateTime getEndTime()
    {
        return points.get(points.size() - 1).t();
    }

    //停留区的平均速度 m/s
    public double getAverageSpeed()
    {
        int n = points.size();
        if (n > 0)
        {
            double totoal = 0;
            for (SMPoint p : points)
            {
                totoal += p.speed();
            }
            return totoal / n;
        }
        
        return 0;
    }

    //平方米：停留区的覆盖面积，以最小外接圆为准
    public double getCoveredArea()
    {
        return 0;
    }

  //从大到小排序
    public static int compareCluster(ClusterPoints cp1, ClusterPoints cp2)
    {
        if (cp1.getDuration() > cp2.getDuration())
        {
            return -1;
        }
        else if (cp1.getDuration() < cp2.getDuration())
        {
            return 1;
        }
        else return 0;
    }
    
    //返回类簇中轨迹点在原始轨迹序列中的下标，开始下标和结束下标
    public int[] getStartAndEndPointIndex()
    {
    	int iSize = this.points.size(); 
    	if (iSize > 1) {
    		int start = this.points.get(0).getTimeIndex();
    		int end = this.points.get(iSize - 1).getTimeIndex();
    		int [] ret = new int []{
    			start, end
    		};
    		return ret; 
    	}
    	else {
    		return null;
    	}
    }
    
}