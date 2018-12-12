package com.triman.tchat.biz.exception;

/**
 * Created by li wei on 2017/3/5.
 */
public class DataIncompleteException extends Exception {
    public DataIncompleteException() {
        this("数据不完整错误！");
    }

    public DataIncompleteException(String message) {
        super(message);
    }
}
