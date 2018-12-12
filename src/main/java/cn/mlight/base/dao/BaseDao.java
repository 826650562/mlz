package cn.mlight.base.dao;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

public interface BaseDao<T> {

	/**
	 * ���
	 * 
	 * @param entity
	 */
	public void save(T entity);

	/**
	 * �޸�
	 * 
	 * @param entity
	 */
	public void update(T entity);

	/**
	 * ɾ��
	 * 
	 * @param id
	 */
	public void delete(Long id);

	/**
	 * ��id��ѯ
	 * 
	 * @param id
	 * @return
	 */
	public T getById(Long id);

	/**
	 * ��id�����ѯ
	 * 
	 * @param ids
	 * @return
	 */
	public List<T> getByIds(Long[] ids);

	/**
	 * ��ѯ����
	 * 
	 * @return
	 */
	public List<T> findAll();

	/**
	 * 获取JdbcTemplate对象，用于复杂查询时直接使用SQL语句
	 * 
	 *
	 * @return JdbcTemplate
	 */
	public JdbcTemplate getJdbcTemplate();
}
