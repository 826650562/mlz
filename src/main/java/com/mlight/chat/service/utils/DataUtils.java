package com.mlight.chat.service.utils;

import com.mlight.chat.service.models.schedule.DateInfo;

import java.util.List;

public class DataUtils {
	public static void checkLastSeven(List<DateInfo> list) {
		if (list.size() < 42)
			return;
		for (int i = 35; i < list.size(); i++) {
			if (list.get(i).getDate() != -1)
				return;
		}
		int j = 41;
		while (j >= 35) {
			list.remove(list.size() - 1);
			j--;
		}
	}

	public static int getFirstIndexOf(List<DateInfo> list) {
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i).getDate() != -1)
				return i;
		}
		return -1;
	}

	public static int getLastIndexOf(List<DateInfo> list) {
		for (int i = list.size() - 1; i >= 0; i--) {
			if (list.get(i).getDate() != -2)
				return i;
		}
		return -1;
	}

	public static int getDayFlag(List<DateInfo> list, int day) {
		int i;
		for (i = 0; i < list.size(); i++) {
			if (list.get(i).getDate() == day && list.get(i).isThisMonth() == 1) {

				return i;
			}
		}
		for (i = list.size() - 1; i >= 0; i--) {
			if (list.get(i).isThisMonth() == 1) {
				break;
			}
		}
		return i;
	}
}
