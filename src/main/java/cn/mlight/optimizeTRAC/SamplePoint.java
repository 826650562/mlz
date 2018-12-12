package cn.mlight.optimizeTRAC;

import java.io.Serializable;

import org.joda.time.DateTime;

/*
 * 原始采样记录
 * */
public class SamplePoint implements Serializable{

    public int id;
    public double x;
    public double y;
    public double z;
    public DateTime t;
    public double v;
    public double dist;
    public int span;
    public double theta;
    public String empty; // 载客状态
}
