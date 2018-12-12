package cn.mlight.dao;

import java.util.List;

import cn.mlight.base.dao.BaseDao;
import cn.mlight.domain.Tzgg;

public interface TzggDao extends BaseDao<Tzgg> {

	public Integer getCount(Tzgg ns);

	public List<Tzgg> getAll(Tzgg ns, Integer pageNum, Integer pageCount);

	@Override
	public List<Tzgg> findAll();

	public List<Tzgg> findObjects();

	public int findCount();

	public List<Tzgg> findByPage(int begin, int pageSize);

}
