package com.triman.tchat.biz.exception;

/**
 * Description: OrganizationNotExistsException
 * Author: chenzhi
 * Update: chenzhi(2015-10-07 15:34)
 */
public class OrganizationNotExistsException extends Exception {

    public OrganizationNotExistsException() {
        this("该组织不存在！");
    }

    public OrganizationNotExistsException(String message) {
        super(message);
    }

}
