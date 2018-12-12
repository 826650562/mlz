package cn.mlight.optimizeTRAC;

import java.util.List;

/// <summary>
/// 输入轨迹对象，构造函数中计算轨迹对象的各参数
/// </summary>
public class CalculateTrajPoint
{
    public CalculateTrajPoint(Trajectory traj)
    {
        List<TrajPoint> points = (List<TrajPoint>) traj.TrajPoints;
        double maxVelocity = 0;
        double minVelocity = Double.MAX_VALUE;
        double totalDistance = 0;
        int totalSpan = 0;
        double maxDist = 0; //两点之间最大的距离
        double minDist = Double.MAX_VALUE;
        int maxSpan = 0; //两点之间最大的时间间隔
        int minSpan = 3600;
        if (points.size() > 1)
        {
            TrajPoint pre = points.get(0);
            for (TrajPoint p : points)
            {
                //p.v = DistanceUtility.GetSpeed(pre, p);   //即时速度
                p.span = (int)((p.t.toInstant().getMillis() - pre.t.toInstant().getMillis()) / 1000);    //时间间隔
                p.dist = DistanceUtility.GetSpatialDistance(pre, p);
                pre = p;

                if (p.v > maxVelocity)
                {
                    maxVelocity = p.v;
                }
                if (p.v < minVelocity)
                {
                    minVelocity = p.v;
                }

                totalDistance += p.dist;  //总距离是 所有相邻两点之间的距离累加
                if (p.span > maxSpan)
                {
                    maxSpan = p.span;
                }
                if (p.span < minSpan)
                {
                    minSpan = p.span;
                }
                if (p.dist > maxDist)
                {
                    maxDist = p.dist;
                }
                if (p.dist < minDist)
                {
                    minDist = p.dist;
                }
            }
            totalSpan = (int)((points.get(points.size() - 1).t.toInstant().getMillis() - points.get(0).t.toInstant().getMillis())/1000);
            traj.first = points.get(0).t;
            traj.last = points.get(points.size() - 1).t;
        }
        traj.maxv = maxVelocity;
        traj.minv = minVelocity;
        traj.avgv = totalSpan == 0 ? 0 : totalDistance / totalSpan;
        traj.len = totalDistance;
        traj.span = totalSpan;
        traj.maxdist = maxDist;
        traj.mindist = minDist;
        traj.minspan = minSpan;
        traj.maxspan = maxSpan;
    }

    
}
