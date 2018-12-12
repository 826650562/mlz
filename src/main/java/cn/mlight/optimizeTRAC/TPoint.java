package cn.mlight.optimizeTRAC;

 
public   class TPoint {

	public double x;  
	public double y;  
	public Long sjc; 
	public double v;  

	public boolean coincideDedup;  

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public Long getSjc() {
		return sjc;
	}

	public void setSjc(Long sjc) {
		this.sjc = sjc;
	}

	public double getV() {
		return v;
	}

	public void setV(double v) {
		this.v = v;
	}

	public TPoint() {
		this.coincideDedup = false;
	}

	public TPoint(double x, double y, Long sjc, double v) {
		this.x = x;
		this.y = y;
		this.v = v;
		this.sjc = sjc;
//		this.coincideDedup = false;

	}

	public TPoint(String x, String y) {
		this.x = Double.parseDouble(x);
		this.y = Double.parseDouble(y);
		this.coincideDedup = false;
	}

	public TPoint(double x, double y, boolean distinct) {
		this.x = x;
		this.y = y;
		this.coincideDedup = distinct;
	}

	public double distanceTo(TPoint b) {
		return Math.sqrt((this.x - b.x) * (this.x - b.x) + (this.y - b.y) * (this.y - b.y));
	}

	public double sphericalDistaceTo(TPoint p, double r) {
		double rx = this.x * Constant.toRadius;
		double ry = this.y * Constant.toRadius;
		double prx = p.x * Constant.toRadius;
		double pry = p.y * Constant.toRadius;
		double a = Math.sin(ry) * Math.sin(pry) + Math.cos(rx - prx) * Math.cos(ry) * Math.cos(pry);
		double s = Math.acos(a);
		s = s * r;
		return s;
	}

	public double absDistanceTo(TPoint p) {
		return Math.abs(x - p.x) + Math.abs(y - p.y);
	}

	public boolean isCoincide(TPoint p) {
		if (x == p.x && y == p.y)
			return true;
		double d = distanceTo(p);
		return d < Constant.e;
	}

	@Override
	public String toString() {
		return "(" + String.format("%f", x) + "," + String.format("%f", y) + ")";
	}

	@Override
	public boolean equals(Object obj) {
		if (this.coincideDedup) {
			return isCoincide((TPoint) obj);
		} else {
			return super.equals(obj);
		}
	}

	@Override
	public int hashCode() {
		return (int) (x * 100000 + y * 100000);
	}
}
