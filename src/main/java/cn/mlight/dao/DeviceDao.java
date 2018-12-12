package cn.mlight.dao;

import cn.mlight.base.dao.BaseDao;
import cn.mlight.domain.Device;

/**
 * Created by mlight on 2016/6/15.
 */
public interface DeviceDao extends BaseDao<Device> {
	public void saveDevice(Device device);
}