package com.triman.tchat.model;

import java.util.Date;

/**
 * Created by Zhongye on 2015/11/5.
 */
public class GroupMemberInfo {
    //用户id
    private Long id;

    private String username;

    private String trueName;

    private Date enterTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTrueName() {
        return trueName;
    }

    public void setTrueName(String trueName) {
        this.trueName = trueName;
    }

    public Date getEnterTime() {
        return enterTime;
    }

    public void setEnterTime(Date enterTime) {
        this.enterTime = enterTime;
    }
}
