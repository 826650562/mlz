package com.mlight.chat.service.net;

import com.mlight.chat.service.models.notice.Notice;
import com.mlight.chat.service.net.exceptions.NetException;

import java.util.List;

public interface NetNoticeManager {

	/**
	 * 从服务器获取通知列表信息
	 *
	 * @param pageNo
	 *            第几页
	 * @param pageSize
	 *            每页大小
	 * @return
	 */
	List<Notice> fetchNoticeList(int pageNo, int pageSize) throws NetException;

	/**
	 * 从服务器端获取通知详情
	 *
	 * @param id
	 *            通知id
	 * @return 通知详情
	 */
	Notice getNoticeInfoById(long id) throws NetException;
}
