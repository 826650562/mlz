package com.mlight.chat.service.models.schedule;

public class DateInfo {

	private int date;
	private int isThisMonth;
	private boolean isWeekend;
	private boolean isHoliday;
	private String NongliDate;

	private String formatDate;

	public int getDate() {
		return date;
	}

	public void setDate(int date) {
		this.date = date;
	}

	public String getNongliDate() {
		return NongliDate;
	}

	public void setNongliDate(String nongliDate) {
		NongliDate = nongliDate;
	}

	public int isThisMonth() {
		return isThisMonth;
	}

	public void setThisMonth(int isThisMonth) {
		this.isThisMonth = isThisMonth;
	}

	public boolean isHoliday() {
		return isHoliday;
	}

	public void setHoliday(boolean isHoliday) {
		this.isHoliday = isHoliday;
	}

	public boolean isWeekend() {
		return isWeekend;
	}

	public void setWeekend(boolean isWeekend) {
		this.isWeekend = isWeekend;
	}

	public String getFormatDate() {
		return formatDate;
	}

	public void setFormatDate(String formatDate) {
		this.formatDate = formatDate;
	}
}
