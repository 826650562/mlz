package com.triman.tchat.biz.exception;

/**
 * Description: UserAuthorizedFailedException
 * Author: chenzhi
 * Update: chenzhi(2016-03-07 11:52)
 */
public class UserAuthorizedFailedException extends Exception{

    public UserAuthorizedFailedException() {
        super("授权认证失败,请重新登录");
    }

}
