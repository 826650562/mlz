package com.mlight.chat.service.net;

import com.mlight.chat.service.net.exceptions.NetException;

public interface NetAccountManager extends BaseNet {

	boolean changePassword(String username, String oldPassword, String newPassword) throws NetException;
}
