package com.qrcode.generator.model;

import java.time.LocalDateTime;

/**
 * Model representing an item stored in the in-memory history ArrayList.
 */
public class QrCodeHistoryItem {

    private String id;
    private String text;
    private String qrImageBase64;
    private int size;
    private LocalDateTime createdAt;

    public QrCodeHistoryItem() {
    }

    public QrCodeHistoryItem(String id, String text, String qrImageBase64, int size, LocalDateTime createdAt) {
        this.id = id;
        this.text = text;
        this.qrImageBase64 = qrImageBase64;
        this.size = size;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getQrImageBase64() {
        return qrImageBase64;
    }

    public void setQrImageBase64(String qrImageBase64) {
        this.qrImageBase64 = qrImageBase64;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
