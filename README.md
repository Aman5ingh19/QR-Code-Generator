# QR Craft — QR Code Generator

A lightweight, modern full-stack **QR Code Generator** web application built with **React** (frontend) and **Java Spring Boot** (backend).

Users can generate customized QR codes for any text, URL, Wi-Fi configuration, email, or contact card, preview them in real time, download them as high-resolution PNG images, and review their recent generation history stored in a server-side in-memory `ArrayList`.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [REST API Endpoints](#-rest-api-endpoints)
- [Prerequisites](#-prerequisites)
- [Setup & How to Run](#-setup--how-to-run)
  - [1. Running the Spring Boot Backend](#1-running-the-spring-boot-backend)
  - [2. Running the React Frontend](#2-running-the-react-frontend)
  - [Quick Start via Batch Script (Windows)](#quick-start-via-batch-script-windows)
- [Project Limitations](#-project-limitations)
- [License](#-license)

---

## ✨ Features

- **Instant QR Code Generation**: Enter any URL or text and instantly generate high-quality QR codes via ZXing with high error correction (`Level H`).
- **Customizable Resolution**: Adjustable slider from 150px up to 600px resolution.
- **Convenient Presets**: 1-click presets for Links, Wi-Fi credentials, Email format, vCard contacts, and Plain text.
- **PNG Download**: Download generated QR codes as PNG images directly to your local file system.
- **Copy to Clipboard**: Quick copy of the encoded text or link with visual confirmation.
- **Temporary In-Memory History**: Automatically records recent generations in a thread-safe Java `ArrayList` (`Collections.synchronizedList`).
- **History Inspection & Re-Viewing**: Click any item in the history list to load it into the main preview card or download it.
- **Clear History**: Clear server-side history on demand with a single click.
- **Clean, Responsive UI**: Modern dark glassmorphic design system with smooth micro-animations and status ping indicators.
- **Zero Heavyweight Infrastructure**: No database, no Docker, no external message brokers, no authentication layers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Styling**: Vanilla CSS3 with CSS Custom Properties, modern typography (`Plus Jakarta Sans`), and glassmorphism.
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [Spring Boot 3.3.4](https://spring.io/projects/spring-boot)
- **Language**: Java 21 (LTS)
- **QR Engine**: [Google ZXing (`core` & `javase` 3.5.3)](https://github.com/zxing/zxing)
- **Build Tool**: Apache Maven
- **In-Memory Storage**: Java `ArrayList` wrapped in `Collections.synchronizedList`
- **Validation**: Jakarta Bean Validation (`@NotBlank`, `@Size`, `@Min`, `@Max`)

---

## 🏛️ Architecture

```
+-----------------------------------------------------------------------+
|                           React Frontend                              |
|   (Vite Server @ http://localhost:5173 with API Proxy to 8080)        |
+-----------------------------------------------------------------------+
        |                                                 ^
        | 1. POST /api/qrcode/generate                    | 4. Base64 PNG +
        |    { "text": "...", "size": 300 }               |    Metadata JSON
        |                                                 |
        v                                                 |
+-----------------------------------------------------------------------+
|                       Spring Boot REST API                            |
|                     (Server @ Port 8080)                              |
|                                                                       |
|  [Controller]                                                         |
|    └─ QrCodeController.java (REST Endpoints & Input Validation)       |
|                                                                       |
|  [Service]                                                            |
|    └─ QrCodeService.java                                              |
|         ├─ ZXing QRCodeWriter (generates BitMatrix -> PNG bytes)      |
|         └─ In-Memory Java ArrayList (stores QrCodeHistoryItem objects)|
|                                                                       |
|  [Exception Handler]                                                  |
|    └─ GlobalExceptionHandler.java (Structured JSON error responses)   |
+-----------------------------------------------------------------------+
```

---

## 📂 Project Structure

```
QR Code Generator/
│
├── run-all.bat                     # Windows one-click script to run backend + frontend
├── run-backend.bat                 # Helper script to launch Spring Boot backend
├── run-frontend.bat                # Helper script to launch React frontend
├── README.md                       # Project documentation
│
├── backend/                        # Java Spring Boot Backend Application
│   ├── pom.xml                     # Maven project configuration & dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/qrcode/generator/
│   │   │   │   ├── QrCodeGeneratorApplication.java    # Application entry point
│   │   │   │   ├── config/
│   │   │   │   │   └── CorsConfig.java                # Global CORS configuration
│   │   │   │   ├── controller/
│   │   │   │   │   └── QrCodeController.java          # REST API endpoints
│   │   │   │   ├── exception/
│   │   │   │   │   └── GlobalExceptionHandler.java    # Centralized REST error handler
│   │   │   │   ├── model/
│   │   │   │   │   ├── QrCodeRequest.java             # Request payload DTO
│   │   │   │   │   ├── QrCodeResponse.java            # Generation response DTO
│   │   │   │   │   └── QrCodeHistoryItem.java         # History record model
│   │   │   │   └── service/
│   │   │   │       └── QrCodeService.java             # ZXing generation & ArrayList store
│   │   │   └── resources/
│   │   │       └── application.properties             # App port and logging settings
│   │   └── test/
│   │       └── java/com/qrcode/generator/
│   │           └── QrCodeGeneratorApplicationTests.java # Context & unit tests
│
└── frontend/                       # React Frontend Application
    ├── package.json                # NPM dependencies and scripts
    ├── vite.config.js              # Vite configuration with /api backend proxy
    ├── index.html                  # HTML template with Google fonts
    └── src/
        ├── main.jsx                # React DOM mount
        ├── App.jsx                 # Main stateful application component
        ├── index.css               # Design system, tokens, and responsive layout
        ├── App.css                 # Component-specific styles
        └── components/
            ├── Navbar.jsx          # Header with branding and backend health status
            ├── QrGeneratorForm.jsx # Input form, presets, and resolution slider
            ├── QrDisplay.jsx       # QR preview card and PNG download buttons
            ├── QrHistory.jsx       # Recent generation history grid
            └── Footer.jsx          # Footer with tech stack tags
```

---

## 📡 REST API Endpoints

Base URL: `http://localhost:8080/api/qrcode`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/generate` | Generate a new QR code and add to history | JSON (`text`, optional `size`) | `201 Created` with QR Code JSON |
| `GET` | `/history` | Fetch all recently generated QR codes | *None* | `200 OK` with JSON array of history items |
| `DELETE`| `/history` | Clear all items from in-memory history | *None* | `200 OK` with confirmation message |
| `GET` | `/download/{id}`| Download specific generated QR as PNG file | *None* | `200 OK` with `image/png` attachment |
| `GET` | `/raw?text={text}&size={size}` | Direct stream of raw PNG QR code image | Query Params | `200 OK` with `image/png` binary |

### Sample Request: `POST /api/qrcode/generate`

```json
{
  "text": "https://spring.io",
  "size": 300
}
```

### Sample Response (`201 Created`):

```json
{
  "id": "ba116351-08f3-4ed9-936a-e650129eaf5a",
  "text": "https://spring.io",
  "qrImageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASw...",
  "size": 300,
  "createdAt": "2026-10-05T14:36:24.926",
  "downloadUrl": "/api/qrcode/download/ba116351-08f3-4ed9-936a-e650129eaf5a"
}
```

---

## ⚙️ Prerequisites

1. **Java Development Kit (JDK)**: Java 21 or later installed.
2. **Apache Maven**: Version 3.6 or later.
3. **Node.js**: Version 18.0 or later (includes `npm`).

---

## 🚀 Setup & How to Run

### Quick Start via Batch Script (Windows)
Double-click `run-all.bat` located in the root project folder, or run:
```bat
run-all.bat
```
This automatically boots both the backend server (port `8080`) and the React development server (port `5173`).

---

### 1. Running the Spring Boot Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Compile and run the backend application:
   ```bash
   mvn spring-boot:run
   ```
   *Alternatively, if your environment requires setting JDK paths:*
   ```powershell
   $env:JAVA_HOME = "C:\Users\<username>\.jdks\jdk-21.0.6+7"
   mvn spring-boot:run
   ```

3. The server will start at:
   - **URL**: `http://localhost:8080`
   - **Health / History test**: `http://localhost:8080/api/qrcode/history`

4. To execute the automated backend tests:
   ```bash
   mvn test
   ```

---

### 2. Running the React Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   - **URL**: [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Project Limitations

As specified in the system design requirements:

1. **In-Memory Storage Only**: The history of generated QR codes is stored in a Java `ArrayList` in RAM. Restarting or terminating the Spring Boot server clears all history.
2. **No Persistent Database**: There is deliberately no SQL (PostgreSQL, MySQL, H2) or NoSQL (MongoDB) database configured.
3. **No Authentication or Authorization**: The application is an open internal tool; any user can generate, view, and clear the shared history.
4. **Single-Node In-Memory Cache**: Because state is kept in local memory, clustering across multiple instances without a distributed cache (like Redis) would result in split history views.
5. **Character Limit**: Input strings are constrained to 2000 characters by validation to maintain optimal QR code scan readability and performance.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
