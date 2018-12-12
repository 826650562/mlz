package com.triman.tchat.biz.exception;

/**
 * Created by Huang on 2015/11/12.
 */
public class NewsNotExistsException extends Exception {

    public NewsNotExistsException() {
        this("该新闻不存在！");
    }

    public NewsNotExistsException(String message) {
        super(message);
    }
}
