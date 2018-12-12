package cn.mlight.dao.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import cn.mlight.dao.DeviceDao;
import cn.mlight.domain.Device;
import org.hibernate.Query;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.LoginDao;
import cn.mlight.domain.User;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.Resource;

public class LoginDaoImpl extends BaseDaoImpl<User> implements LoginDao {

	private DeviceDao deviceDao;

	public DeviceDao getDeviceDao() {
		return deviceDao;
	}

	public void setDeviceDao(DeviceDao deviceDao) {
		this.deviceDao = deviceDao;
	}

	/**
	 * JdbcTemplate对象，通过Spring注入
	 */
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	/**
	 * 登录
	 */
	@Override
	public User queryUsernameAndPassword(String username, String password) {
		String hql = "from User where username = ? and password = ? and deleted = ?";
		Query query = getSession().createQuery(hql);
		query.setParameter(0, username);
		query.setParameter(1, password);
		query.setParameter(2, 0);
		List<User> temp = query.list();
		if ((temp != null && temp.size() > 0)) {
			User user = temp.get(0);
			long user_id = user.getId();
			
			String sql = "delete from t_device where user_id = ?";
			this.getJdbcTemplate().update(sql, user_id);
			
			String uid = UUID.randomUUID().toString().replace("-", "");
			String token = UUID.randomUUID().toString().replace("-", "");
			// //插入其中的token信息、last_login_time,update_time
			// //更新自己的token信息，更新数据库的个人用户信息
			Device device = new Device();
			device.setUser_id(user_id);
			device.setUid(uid);
			device.setBrand("");
			device.setModel_number("");
			device.setOs_type("");
			device.setOs_version("");
			device.setOs_sub_type("");
			device.setOs_sub_version("");
			device.setToken(token);
			device.setLast_login_time(new Date());
			device.setCreate_time(new Date());
			device.setUpdate_time(new Date());
			getDeviceDao().saveDevice(device);
			// String devicehql = "from Device where uid = ? and token = ?";
			// Query devicequery = getSession().createQuery(devicehql);
			// devicequery.setParameter(0, uid);
			// devicequery.setParameter(1, token);
			// List<Device> devicetemp = devicequery.list();
			// device = devicetemp.get(0);
			// Long device_id = device.getId();
			// String update_sql = "update t_user set device_id=1,device_uid
			// =1,token=1 where id=1";
			// this.getJdbcTemplate().update(update_sql);
			// this.getJdbcTemplate().update(update_sql,new
			// Object[]{device_id,uid,token,user.getId()});
			// Query updateQuery = getSession().createQuery(update_hql);
			// updateQuery.setParameter(0, device_id);
			// updateQuery.setParameter(1, uid);
			// updateQuery.setParameter(2, token);
			// updateQuery.setParameter(3, user.getId());
			// user.setDevice_id(device_id);
			// user.setDevice_uid(uid);
			// user.setToken(token);
			// update(user);
			return user;
		}

		return null;
	}

}
