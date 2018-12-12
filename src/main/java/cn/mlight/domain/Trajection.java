package cn.mlight.domain;

public class Trajection {
	private String user_name;
	private String name;
	private String start_time;
	private String end_time;
	private String trj_num;
	private String averge_speed;
	private String take_times;
	private String length;
	private String square;
	
	private String Ssdw; //所属单位

	public String getSsdw() {
		return Ssdw;
	}

	public void setSsdw(String ssdw) {
		Ssdw = ssdw;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStart_time() {
		return start_time;
	}

	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}

	public String getEnd_time() {
		return end_time;
	}

	public void setEnd_time(String end_time) {
		this.end_time = end_time;
	}

	public String getTrj_num() {
		return trj_num;
	}

	public void setTrj_num(String trj_num) {
		this.trj_num = trj_num;
	}

	public String getAverge_speed() {
		return averge_speed;
	}

	public void setAverge_speed(String averge_speed) {
		this.averge_speed = averge_speed;
	}

	public String getTake_times() {
		return take_times;
	}

	public void setTake_times(String take_times) {
		this.take_times = take_times;
	}

	public String getLength() {
		return length;
	}

	public void setLength(String length) {
		this.length = length;
	}

	public String getSquare() {
		return square;
	}

	public void setSquare(String square) {
		this.square = square;
	}

}
