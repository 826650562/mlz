package cn.mlight.dao;

import java.util.List;

import cn.mlight.base.dao.BaseDao;
import cn.mlight.domain.Gkrw;

public interface GkrwDao extends BaseDao<Gkrw> {

	public Integer getCount(Gkrw ns);

	public List<Gkrw> getAll(Gkrw ns, Integer pageNum, Integer pageCount);

	@Override
	public List<Gkrw> findAll();

	public List<Gkrw> findObjects();

	public int findCount();

	public List<Gkrw> findByPage(int begin, int pageSize,String condition,String state,String level, List rwidstr);

}
