package com.qrcode.generator;

import com.qrcode.generator.model.QrCodeHistoryItem;
import com.qrcode.generator.model.QrCodeRequest;
import com.qrcode.generator.model.QrCodeResponse;
import com.qrcode.generator.service.QrCodeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QrCodeGeneratorApplicationTests {

    @Autowired
    private QrCodeService qrCodeService;

    @BeforeEach
    void setUp() {
        qrCodeService.clearHistory();
    }

    @Test
    void contextLoads() {
        assertNotNull(qrCodeService);
    }

    @Test
    void testGenerateQrCode() {
        QrCodeRequest request = new QrCodeRequest("https://google.com", 250);
        QrCodeResponse response = qrCodeService.generateQrCode(request);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("https://google.com", response.getText());
        assertEquals(250, response.getSize());
        assertTrue(response.getQrImageBase64().startsWith("data:image/png;base64,"));

        List<QrCodeHistoryItem> history = qrCodeService.getHistory();
        assertEquals(1, history.size());
        assertEquals("https://google.com", history.get(0).getText());
    }

    @Test
    void testClearHistory() {
        qrCodeService.generateQrCode(new QrCodeRequest("test-item", 200));
        assertFalse(qrCodeService.getHistory().isEmpty());

        qrCodeService.clearHistory();
        assertTrue(qrCodeService.getHistory().isEmpty());
    }
}
