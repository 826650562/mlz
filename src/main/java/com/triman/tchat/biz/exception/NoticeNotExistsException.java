package com.triman.tchat.biz.exception;

/**
 * Created by Huang on 2015/11/12.
 */
public class NoticeNotExistsException extends Exception {

    public NoticeNotExistsException() {
        this("该通知不存在！");
    }

    public NoticeNotExistsException(String message) {
        super(message);
    }
}
