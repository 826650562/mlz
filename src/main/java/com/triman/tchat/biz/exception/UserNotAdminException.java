package com.triman.tchat.biz.exception;

/**
 * Description: UserNotAdminException
 * Author: chenzhi
 * Update: chenzhi(2015-10-05 10:24)
 */
public class UserNotAdminException extends Exception {

    public UserNotAdminException() {
        this("该用户不是管理员！");
    }

    public UserNotAdminException(String message) {
        super(message);
    }

}
