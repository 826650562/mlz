package com.triman.tchat.biz.exception;

/**
 * Description: OrganizationExistsException
 * Author: chenzhi
 * Update: chenzhi(2015-10-05 09:57)
 */
public class OrganizationExistsException extends Exception {

    public OrganizationExistsException() {
        this("该组织已存在！");
    }

    public OrganizationExistsException(String message) {
        super(message);
    }

}
