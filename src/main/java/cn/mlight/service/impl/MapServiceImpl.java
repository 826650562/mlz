package cn.mlight.service.impl;

import java.util.HashMap;
import java.util.List;
import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.mlight.dao.MapDao;
import cn.mlight.domain.MyMap;
import cn.mlight.service.MapService;

@Service("mapService")
public class MapServiceImpl implements MapService {
	@Resource
	private MapDao mapDao;

	@Override
	public List<MyMap> findObjects() {
		return mapDao.findObjects();
	}

	@Override
	public List<MyMap> findByIdAndUsername() {
		return mapDao.findByIdAndUsername();
	}

	@Override
	public List<MyMap> findByUsername() {
		return mapDao.findByUsername();
	}
	@Override
	public  void execute(String sql) {
	    mapDao.getJdbcTemplate().execute(sql);;
	}

	/**
	 * 查询SQL语句，结果直接返回 jdbctemplate
	 */
	@Override
	public List<?> getListBySql(String sql) {
		return mapDao.getJdbcTemplate().queryForList(sql);
	}

	@Override
	public List<Object> findGroup() {
		return mapDao.findGroup();
	}
	@Override
	public HashMap findGroupAndMember() {
		return mapDao.findGroupAndMember();
	}

	@Override
	public int countAll(String sql) {
		return mapDao.getJdbcTemplate().queryForInt(sql);
	}

}
