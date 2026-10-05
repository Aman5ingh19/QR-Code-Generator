package com.qrcode.generator.controller;

import com.qrcode.generator.model.QrCodeHistoryItem;
import com.qrcode.generator.model.QrCodeRequest;
import com.qrcode.generator.model.QrCodeResponse;
import com.qrcode.generator.service.QrCodeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller providing endpoints to generate, retrieve history, and download QR codes.
 */
@RestController
@RequestMapping("/api/qrcode")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"})
public class QrCodeController {

    private final QrCodeService qrCodeService;

    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    /**
     * POST /api/qrcode/generate
     * Accepts text/URL and optional size, returns QR code Base64 string and metadata,
     * and records the generation in the temporary in-memory history ArrayList.
     */
    @PostMapping("/generate")
    public ResponseEntity<QrCodeResponse> generateQrCode(@Valid @RequestBody QrCodeRequest request) {
        QrCodeResponse response = qrCodeService.generateQrCode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/qrcode/history
     * Returns the list of recently generated QR codes stored in the in-memory ArrayList.
     */
    @GetMapping("/history")
    public ResponseEntity<List<QrCodeHistoryItem>> getHistory() {
        List<QrCodeHistoryItem> history = qrCodeService.getHistory();
        return ResponseEntity.ok(history);
    }

    /**
     * DELETE /api/qrcode/history
     * Clears all items in the in-memory history ArrayList.
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, String>> clearHistory() {
        qrCodeService.clearHistory();
        return ResponseEntity.ok(Map.of("message", "History cleared successfully"));
    }

    /**
     * GET /api/qrcode/download/{id}
     * Downloads a previously generated QR code by its ID as a PNG file.
     */
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadQrCode(@PathVariable String id) {
        Optional<QrCodeHistoryItem> itemOpt = qrCodeService.getHistoryItemById(id);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        QrCodeHistoryItem item = itemOpt.get();
        // Extract raw bytes from base64
        String base64Data = item.getQrImageBase64();
        if (base64Data.contains(",")) {
            base64Data = base64Data.split(",")[1];
        }
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("attachment", "qrcode-" + id.substring(0, 8) + ".png");
        headers.setContentLength(imageBytes.length);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    /**
     * GET /api/qrcode/raw?text=...&size=...
     * Direct endpoint to get a QR code directly as a PNG stream (useful for direct embedding/linking).
     */
    @GetMapping("/raw")
    public ResponseEntity<byte[]> getRawQrCode(
            @RequestParam String text,
            @RequestParam(defaultValue = "300") int size) {
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (size < 100 || size > 1000) {
            size = 300;
        }

        byte[] imageBytes = qrCodeService.generateQrCodeImageBytes(text.trim(), size);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(imageBytes.length);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }
}
