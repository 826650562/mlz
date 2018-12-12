package cn.mlight.optimizeTRAC;

import java.io.Serializable;
import java.util.List;
import java.util.ArrayList;

import org.joda.time.DateTime;

/*
 * 移动对象一日的采样记录
 * */
public class DaySample implements Serializable{

    public int id;
    public DateTime day;
    public DateTime firsttime;
    public DateTime lasttime;
    public int count;
    public double avgv;
    public double maxv;
    public double minv;
    public int span;
    public double len;
    public int maxspan;
    public int minspan;
    public double maxdist;
    public double mindist;
    public List<SamplePoint> SamplePoints;
    public DaySample()
    {
    	SamplePoints = new ArrayList<SamplePoint>();
    }
}
