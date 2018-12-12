package cn.mlight.dao;

import java.util.HashMap;
import java.util.List;
import cn.mlight.domain.*;
import cn.mlight.base.dao.BaseDao;
import org.springframework.jdbc.core.JdbcTemplate;

public interface MapDao extends BaseDao<MyMap> {

	public List<MyMap> findObjects();

	public List<MyMap> findByIdAndUsername();

	public List<MyMap> findByUsername();

	public List<Object> findGroup();
	
	public HashMap findGroupAndMember();

	/**
	 * 获取JdbcTemplate对象，用于复杂查询时直接使用SQL语句
	 * 
	 *
	 * @return JdbcTemplate
	 */
	@Override
	public JdbcTemplate getJdbcTemplate();

}
