package cn.mlight.service;

import java.util.HashMap;
import java.util.List;
import cn.mlight.domain.MyMap;

public interface MapService {

	public List<MyMap> findObjects();

	public List<MyMap> findByIdAndUsername();

	public List<MyMap> findByUsername();

	public List<Object> findGroup();

	public HashMap findGroupAndMember();
	/**
	 * 查询SQL语句，结果直接返回 jdbctemplate
	 */
	public List<?> getListBySql(String sql);
	public void execute(String sql); 

	public int countAll(String sql);

}
