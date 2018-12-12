package com.triman.tchat.biz.exception;

/**
 * Description: UserNotExistsOrPasswordWrongException
 * Author: chenzhi
 * Update: chenzhi(2015-10-05 10:16)
 */
public class UsernameOrPasswordWrongException extends Exception{

    public UsernameOrPasswordWrongException() {
        this("用户名或密码错误！");
    }

    public UsernameOrPasswordWrongException(String message) {
        super(message);
    }

}
