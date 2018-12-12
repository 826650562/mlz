package com.triman.tchat.biz.exception;

/**
 * Description: UserExistsException
 * Author: chenzhi
 * Update: chenzhi(2015-10-04 20:26)
 */
public class UserExistsException extends Exception {

    public UserExistsException() {
        this("该用户名已存在！");
    }

    public UserExistsException(String message) {
        super(message);
    }

}
