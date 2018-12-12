package cn.mlight.service;

import cn.mlight.domain.User;

public interface LoginService {

	public User queryUsernameAndPassword(String username, String password);

}
