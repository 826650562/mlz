package com.triman.tchat.model;

import java.io.Serializable;

public class MessageWithBLOBs extends Message implements Serializable {
    private String content;

    private String attachment;

    private static final long serialVersionUID = 1L;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
    }

    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment == null ? null : attachment.trim();
    }
}