package cn.mlight.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.mlight.dao.LoginDao;
import cn.mlight.domain.User;
import cn.mlight.service.LoginService;
import cn.mlight.utils.MD5;

@Service("loginService")
public class LoginServiceImpl implements LoginService {

	@Autowired
	private LoginDao loginDao;

	@Override
	public User queryUsernameAndPassword(String username, String password) {
		password = MD5.GetMD5Code(password);
		return loginDao.queryUsernameAndPassword(username, password);
	}

}
