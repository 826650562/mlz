package com.triman.tchat.biz.exception;

/**
 * Description: NoPermissionException
 * Author: chenzhi
 * Update: chenzhi(2015-10-05 16:53)
 */
public class NoPermissionException extends Exception {

    public NoPermissionException() {
        this("无权限！");
    }

    public NoPermissionException(String message) {
        super(message);
    }

}
