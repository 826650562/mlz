package cn.mlight.service;

import java.util.List;

import cn.mlight.domain.Message;
import cn.mlight.domain.HistoryMsgPo;
import cn.mlight.utils.PageBean;

public interface MessageService {

	public Integer getCount(Message ms);

	public List<Message> getAll(Message ms, Integer pageNum, Integer pageCount);

	public List<Message> findAll();

	public List<Message> findContexts(String sender, String receiver);

	public List<Message> findObjects();

	public PageBean<HistoryMsgPo> findByMessage(String ls_startTime, String ls_endTime, String ls_conditions,
			Integer pageNo, Integer pageSize);

	public PageBean<Message> findContexts(String sender, String receiver, Integer pageNo);

	public PageBean<Message> findContexts(String sender, String receiver, String startTime, String endTime,
			Integer pageNo);

	public PageBean<Message> findQzContexts(String groupid, String startTime, String endTime, Integer pageNo);

}
