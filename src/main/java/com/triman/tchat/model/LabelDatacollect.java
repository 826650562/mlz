package com.triman.tchat.model;

import java.io.Serializable;

public class LabelDatacollect implements Serializable {
    private Long id;

    private Long dataCollectId;

    private Long labelId;

    private static final long serialVersionUID = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDataCollectId() {
        return dataCollectId;
    }

    public void setDataCollectId(Long dataCollectId) {
        this.dataCollectId = dataCollectId;
    }

    public Long getLabelId() {
        return labelId;
    }

    public void setLabelId(Long labelId) {
        this.labelId = labelId;
    }
}