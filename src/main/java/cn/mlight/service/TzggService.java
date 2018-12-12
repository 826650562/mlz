package cn.mlight.service;

import java.util.List;

import cn.mlight.domain.Message;
import cn.mlight.domain.Tzgg;
import cn.mlight.domain.HistoryMsgPo;
import cn.mlight.utils.PageBean;

public interface TzggService {

	public Integer getCount(Tzgg ns);

	public List<Tzgg> getAll(Tzgg ns, Integer pageNum, Integer pageCount);

	public List<Tzgg> findAll();

	public PageBean<Tzgg> findAllTzgg(Integer pageNo,Integer pageSize);

}
