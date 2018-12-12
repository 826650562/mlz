package cn.mlight.optimizeTRAC;
import java.io.Serializable;

import org.joda.time.DateTime;

/**
 * 
 * 
 * @author louispc
 * 
 */
public class TrajPoint implements Serializable {

	public int id;
	public double x;
	public double y;
	public double z;
	public DateTime t;
	public double v;
	public double dist=0;
	public int span=0;
	public double theta=0;
	public String empty; // 载客状�??
	public PointExtAttributes ext;

	public TrajPoint Clone() {
		TrajPoint c = new TrajPoint();
		{
			c.id = this.id;
			c.x = this.x;
			c.y = this.y;
			c.z = this.z;
			c.t = this.t;
			c.v = this.v;
			c.dist = this.dist;
			c.span = this.span;
			c.theta = this.theta;
			c.empty = this.empty;
			if (this.ext != null) {
				c.ext = new PointExtAttributes();
				c.ext.clusterId = this.ext.clusterId;
				c.ext.timeIndex = this.ext.timeIndex;
			}

		}
		return c;
	}

	TrajPoint() {
	}

	TrajPoint(double x, double y, Long sjc, double v) {
		this.x = x;
		this.y = y;
		this.v = v;
		DateTime dt=new DateTime(sjc);
		this.t = dt;
		if (this.ext != null) {
			this.ext = new PointExtAttributes();
			this.ext.clusterId = this.ext.clusterId;
			this.ext.timeIndex = this.ext.timeIndex;
		}
	}

	// 1 空车 0重车
	public static boolean isEmpty(String empty) {
		return "1".equals(empty);
	}
}
