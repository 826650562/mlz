package com.triman.tchat.biz.exception;

/**
 * Description: UserNotExistsException
 * Author: chenzhi
 * Update: chenzhi(2015-10-05 10:23)
 */
public class UserNotExistsException extends Exception {

    public UserNotExistsException() {
        this("用户不存在！");
    }

    public UserNotExistsException(String message) {
        super(message);
    }

}
