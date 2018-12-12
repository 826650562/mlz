package com.mlight.chat.service.net;

import com.mlight.chat.service.models.news.News;
import com.mlight.chat.service.net.exceptions.NetException;

import java.util.List;

public interface NetNewsManager {

	/**
	 * 从服务器获取新闻列表信息
	 *
	 * @param pageNo
	 *            第几页
	 * @param pageSize
	 *            每页大小
	 * @return
	 */
	List<News> fetchNewsList(int pageNo, int pageSize) throws NetException;

	/**
	 * 从服务器端获取动态详情
	 *
	 * @param id
	 *            动态id
	 * @return
	 */
	News getNewsInfoById(long id) throws NetException;

}
