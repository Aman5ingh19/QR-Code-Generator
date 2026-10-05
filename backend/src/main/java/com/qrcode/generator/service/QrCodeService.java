package com.qrcode.generator.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.qrcode.generator.model.QrCodeHistoryItem;
import com.qrcode.generator.model.QrCodeRequest;
import com.qrcode.generator.model.QrCodeResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for generating QR codes with ZXing and managing in-memory history using a Java ArrayList.
 */
@Service
public class QrCodeService {

    private static final Logger logger = LoggerFactory.getLogger(QrCodeService.class);
    private static final int MAX_HISTORY_LIMIT = 50;

    /**
     * In-memory storage for recently generated QR codes, using a Java ArrayList.
     * Wrapped with Collections.synchronizedList to guarantee thread-safe operations in a web environment.
     */
    private final List<QrCodeHistoryItem> qrCodeHistory = Collections.synchronizedList(new ArrayList<>());

    /**
     * Generates a QR code from the given request and saves it into the history ArrayList.
     */
    public QrCodeResponse generateQrCode(QrCodeRequest request) {
        int size = request.getSize() != null ? request.getSize() : 300;
        String text = request.getText().trim();

        byte[] imageBytes = generateQrCodeImageBytes(text, size);
        String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        // Save to temporary Java ArrayList history (synchronized)
        QrCodeHistoryItem historyItem = new QrCodeHistoryItem(id, text, base64Image, size, now);
        synchronized (qrCodeHistory) {
            // Add most recent to beginning
            qrCodeHistory.add(0, historyItem);
            // Cap history to prevent memory leak
            if (qrCodeHistory.size() > MAX_HISTORY_LIMIT) {
                qrCodeHistory.remove(qrCodeHistory.size() - 1);
            }
        }

        logger.info("Generated QR code for text='{}', size={}px, id={}", text, size, id);

        String downloadUrl = "/api/qrcode/download/" + id;
        return new QrCodeResponse(id, text, base64Image, size, now, downloadUrl);
    }

    /**
     * Generates raw PNG bytes for a QR code using ZXing QRCodeWriter.
     */
    public byte[] generateQrCodeImageBytes(String text, int size) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, size, size, hints);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            return pngOutputStream.toByteArray();
        } catch (WriterException | IOException e) {
            logger.error("Failed to generate QR code image: {}", e.getMessage(), e);
            throw new RuntimeException("Could not generate QR code: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieves all items from the temporary in-memory ArrayList history.
     */
    public List<QrCodeHistoryItem> getHistory() {
        synchronized (qrCodeHistory) {
            return new ArrayList<>(qrCodeHistory);
        }
    }

    /**
     * Finds a history item by ID.
     */
    public Optional<QrCodeHistoryItem> getHistoryItemById(String id) {
        synchronized (qrCodeHistory) {
            return qrCodeHistory.stream()
                    .filter(item -> item.getId().equals(id))
                    .findFirst();
        }
    }

    /**
     * Clears all items in the in-memory ArrayList history.
     */
    public void clearHistory() {
        synchronized (qrCodeHistory) {
            qrCodeHistory.clear();
        }
        logger.info("Cleared QR code history ArrayList");
    }
}
