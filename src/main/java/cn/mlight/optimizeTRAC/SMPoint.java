package cn.mlight.optimizeTRAC;

import java.io.Serializable;

import org.joda.time.DateTime;
/// <summary>
/// Stop-Move Point, a wrapper class for sample point or trajectory point
/// </summary>
public class SMPoint implements Serializable
{
    private TrajPoint mPoint = null;

    public static final int NULL_CLUSTER_ID = -1;

    //所属轨迹对象的ID
    
    
    //public int gid; //ATENTION it is not the gid attribute of the point!! Stores the gid of the rf that intercepts the point
    public ClusterType cluster = ClusterType.NONE;

    public int getClusterId()
    {
        return this.mPoint.ext.clusterId;         
    }
    
    public void setClusterId(int value)
    {
    	this.mPoint.ext.clusterId = value;
    }

    // 该轨迹点在轨迹中的原始下标（时间上的下标）
    public int getTimeIndex()
    {
        return this.mPoint.ext.timeIndex;
    }
    public void setTimeIndex(int value)
    {
        this.mPoint.ext.timeIndex = value;
    }

    public SMPoint(TrajPoint point, int timeindex)
    {
        this.mPoint = point;
        this.mPoint.ext = new PointExtAttributes(); //给轨迹点增加扩展属性
        this.setTimeIndex(timeindex);
        this.setClusterId(NULL_CLUSTER_ID);
    }

    public double x()
    {
        return mPoint.x;
    }

    public double y()
    {
        return mPoint.y; 
    }

    public double z()
    {
        return mPoint.z; 
    }

    public DateTime t()
    {
        return mPoint.t; 
    }

    public double speed()
    {
        return mPoint.v;
    }

    
    public void clearClusterFlag()
    {
        this.cluster = ClusterType.NONE;
        this.setClusterId(NULL_CLUSTER_ID);
    }
}