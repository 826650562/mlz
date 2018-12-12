package cn.mlight.optimizeTRAC;

import java.util.List;

public class MyTrac {
	public int seq;// 轨迹序列号
	public Long startTime;// 本段轨迹开始时间
	public Long endTime;// 本段轨迹结束时间

	public List<TPoint>  showPt;
	public List<List<TPoint>> stopPt;

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public Long getStartTime() {
		return startTime;
	}

	public void setStartTime(Long startTime) {
		this.startTime = startTime;
	}

	public Long getEndTime() {
		return endTime;
	}

	public void setEndTime(Long endTime) {
		this.endTime = endTime;
	}

	public List<TPoint> getShowPt() {
		return showPt;
	}

	public void setShowPt(List<TPoint> showPt) {
		this.showPt = showPt;
	}

	public List<List<TPoint>> getStopPt() {
		return stopPt;
	}

	public void setStopPt(List<List<TPoint>> stopPt) {
		this.stopPt = stopPt;
	}

}
