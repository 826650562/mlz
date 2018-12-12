package cn.mlight.dao;

import cn.mlight.base.dao.BaseDao;
import cn.mlight.domain.User;

public interface LoginDao extends BaseDao<User> {

	public User queryUsernameAndPassword(String username, String password);

}
