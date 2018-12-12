package com.triman.tchat.model;

import java.util.List;

/**
 * Description: PagingResult
 * Author: chenzhi
 * Update: chenzhi(2015-09-24 10:24)
 */
public class PagingResult<T> {

    private int page;
    private int pageSize;
    private int total;

    private List<T> data;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
}
