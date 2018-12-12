package com.triman.tchat.biz.exception;

/**
 * Description: GroupNotExistsException
 * Author: chenzhi
 * Update: chenzhi(2015-10-07 19:42)
 */
public class GroupNotExistsException extends Exception {

    public GroupNotExistsException() {
        this("该群组不存在！");
    }

    public GroupNotExistsException(String message) {
        super(message);
    }

}
