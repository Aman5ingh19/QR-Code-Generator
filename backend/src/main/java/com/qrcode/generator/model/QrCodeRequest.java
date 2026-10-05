package com.qrcode.generator.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload for generating a QR code.
 */
public class QrCodeRequest {

    @NotBlank(message = "Text or URL cannot be empty")
    @Size(max = 2000, message = "Text cannot exceed 2000 characters")
    private String text;

    @Min(value = 100, message = "Size must be at least 100 pixels")
    @Max(value = 1000, message = "Size must not exceed 1000 pixels")
    private Integer size = 300;

    public QrCodeRequest() {
    }

    public QrCodeRequest(String text, Integer size) {
        this.text = text;
        if (size != null) {
            this.size = size;
        }
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getSize() {
        return size != null ? size : 300;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
