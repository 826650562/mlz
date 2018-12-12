package com.triman.tchat.biz.exception;

/**
 * Description: DepartmentNotExistsException
 * Author: chenzhi
 * Update: chenzhi(2015-10-05 17:18)
 */
public class DepartmentNotExistsException extends Exception {

    public DepartmentNotExistsException() {
        this("该部门不存在！");
    }

    public DepartmentNotExistsException(String message) {
        super(message);
    }

}
