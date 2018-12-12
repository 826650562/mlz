package cn.mlight.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.mlight.dao.MapDao;
import cn.mlight.dao.TzggDao;
import cn.mlight.domain.Message;
import cn.mlight.domain.Tzgg;
import cn.mlight.service.TzggService;
import cn.mlight.utils.PageBean;

@Service("tzggService")
public class TzggServiceImpl implements TzggService {
	@Resource
	private TzggDao tzggDao;

	@Resource
	private MapDao mapDao;

	@Override
	public Integer getCount(Tzgg ns) {
		// TODO Auto-generated method stub
		return tzggDao.getCount(ns);
	}

	@Override
	public List<Tzgg> getAll(Tzgg ns, Integer pageNum, Integer pageCount) {
		// TODO Auto-generated method stub
		return tzggDao.getAll(ns, pageNum, pageCount);
	}

	@Override
	public List<Tzgg> findAll() {
		// TODO Auto-generated method stub
		return tzggDao.findAll();
	}

	@Override
	public PageBean<Tzgg> findAllTzgg(Integer pageNo ,Integer pageSize) {
		int totalPage = 0;
		PageBean<Tzgg> pb = new PageBean<Tzgg>();
		pb.setPageSize(pageSize);
		pb.setPageNo(pageNo);
		int totalNo = mapDao.getJdbcTemplate()
				.queryForInt("SELECT COUNT(*) FROM (SELECT * FROM t_notice WHERE deleted = '0' ) a");
		pb.setTotalNo(totalNo);
		if (totalNo % pageSize == 0) {
			totalPage = totalNo / pageSize;
		} else {
			totalPage = (totalNo / pageSize) + 1;
		}
		pb.setTotalPage(totalPage);
		int begin = (pageNo - 1) * pageSize;
		List<Tzgg> list = tzggDao.findByPage(begin, pageSize);
		pb.setBeanList(list);
		return pb;
	}

	

}
