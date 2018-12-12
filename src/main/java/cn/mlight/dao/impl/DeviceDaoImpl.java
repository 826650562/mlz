package cn.mlight.dao.impl;

import cn.mlight.base.dao.impl.BaseDaoImpl;
import cn.mlight.dao.DeviceDao;
import cn.mlight.domain.Device;
import org.hibernate.Query;

import java.util.List;

/**
 * Created by lzr on 2017/1/12.
 */
public class DeviceDaoImpl extends BaseDaoImpl<Device> implements DeviceDao {

	@Override
	public void saveDevice(Device device) {
		String hql_hql_query_device = "from Device where user_id = ?";
		Query hql_query_device = getSession().createQuery(hql_hql_query_device);
		hql_query_device.setParameter(0, device.getUser_id());

		List<Device> list = hql_query_device.list();

		if (list != null && list.size() > 0) {
			Device update_device = list.get(0);
			update_device.setUser_id(device.getUser_id());
			update_device.setUid(device.getUid());
			update_device.setToken(device.getToken());
			update(update_device);
		} else {
			save(device);
		}

	}
}
