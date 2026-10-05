package com.qrcode.generator.model;

import java.time.LocalDateTime;

/**
 * Response payload returned to React upon QR code generation.
 */
public class QrCodeResponse {

    private String id;
    private String text;
    private String qrImageBase64;
    private int size;
    private LocalDateTime createdAt;
    private String downloadUrl;

    public QrCodeResponse() {
    }

    public QrCodeResponse(String id, String text, String qrImageBase64, int size, LocalDateTime createdAt, String downloadUrl) {
        this.id = id;
        this.text = text;
        this.qrImageBase64 = qrImageBase64;
        this.size = size;
        this.createdAt = createdAt;
        this.downloadUrl = downloadUrl;
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

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }
}
