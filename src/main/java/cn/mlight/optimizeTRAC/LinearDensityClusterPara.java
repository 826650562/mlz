package cn.mlight.optimizeTRAC;
public class LinearDensityClusterPara {

	public double AverageFactor;  //平均速度因子
    public double LimitedFactor; //最大即时速度因子
    public int MinTime; //最小时间跨度


    public LinearDensityClusterPara()
    {
        this.AverageFactor = 0.5;
        this.LimitedFactor = 20;//20
        this.MinTime = 60;
    }
}
