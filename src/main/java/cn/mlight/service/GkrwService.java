package cn.mlight.service;

import java.util.List;

import cn.mlight.domain.Gkrw;
import cn.mlight.utils.PageBean;

public interface GkrwService {

	public Integer getCount(Gkrw ns);

	public List<Gkrw> getAll(Gkrw ns, Integer pageNum, Integer pageCount);

	public List<Gkrw> findAll();
	public PageBean<Gkrw> findAllGkrw(String start_time,String end_time,String state,String level,String content,Integer pageNo,Integer pageSize);

}
