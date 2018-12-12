package cn.mlight.optimizeTRAC;

import java.util.ArrayList;
import java.util.List;

public class ResOfTras {
	public String name;// 用户名
	public String startTime;// 开始时间
	public String endTime;// 结束时间
	public int rawPt;// 原始轨迹点数量
	public int showPt;// 可显示轨迹点数量
	public String[] ptProperty = { "id", "lat", "lon", "ts", "speed" }; // 点属性

	public List<MyTrac> ListMyTrac=new ArrayList<MyTrac>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String[] getPtProperty() {
		return ptProperty;
	}

	public void setPtProperty(String[] ptProperty) {
		this.ptProperty = ptProperty;
	}

	public List<MyTrac> getListMyTrac() {
		return ListMyTrac;
	}

	public void setListMyTrac(List<MyTrac> listMyTrac) {
		ListMyTrac = listMyTrac;
	}

	public int getRawPt() {
		return rawPt;
	}

	public void setRawPt(int rawPt) {
		this.rawPt = rawPt;
	}

	public int getShowPt() {
		return showPt;
	}

	public void setShowPt(int showPt) {
		this.showPt = showPt;
	}

}
