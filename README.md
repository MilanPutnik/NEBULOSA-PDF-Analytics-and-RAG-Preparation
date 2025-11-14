# NEBULOSA — PDF Analytics & RAG Preparation

Ultimate application for PDF analysis and RAG (Retrieval-Augmented Generation) preparation. Version 2.0 — an advanced application for deep analysis and data extraction from PDF documents, optimized for RAG and AGI systems.

> Note: It is recommended to replace the link/screenshot above with a real screenshot of the application.

## 🚀 Key Features
- Intelligent Document Analysis using Google Gemini 2.5 Pro (with Function Calling & File Search).
- Automatic Data Extraction into a structured schema.json — entities (people, organizations, locations), relations, metadata and document structure.
- Markdown Report Generation (data.md) for easy reading and further processing.
- Interactive Querying (RAG) — ask questions about the document content; answers are based solely on the provided file.
- Real-time Progress Updates via Server-Sent Events (SSE) — the client receives live status updates during processing.
- Robust Monorepo Architecture (client/server) for scalability and maintainability.
- File integrity verification using SHA-256 hash.

## 🛠️ Technologies
| Component | Technology |
|---|---|
| AI Model | Google Gemini 2.5 Pro (Function Calling & File Search) |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript (tsx for hot-reloading) |
| Communication | REST API, Server-Sent Events (SSE) |
| File handling | multer (for uploads) |

## 🏗️ Architecture
The project is organized as a monorepo using npm workspaces, enabling centralized dependency and script management for both client and server.

- client/: React application (Vite) — UI, file upload, result display.
- server/: Node.js/Express API — processing logic, communication with Gemini API, SSE event streaming.

## ⚙️ Running the Project

### Prerequisites
- Node.js v20.x or newer
- npm v9.x or newer
- Google Gemini API key

### Installation & Configuration
1. Clone the repository:

```bash
git clone https://github.com/MilanPutnik/NEBULOSA-PDF-Analytics-and-RAG-Preparation.git
cd NEBULOSA-PDF-Analytics-and-RAG-Preparation
```

2. Install dependencies (from the repository root — npm workspaces):

```bash
npm install
```

3. Create a .env file inside the server/ directory with your Gemini API key:

```env
# server/.env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### Development Run
To run both client and server with hot-reloading:

```bash
npm run dev
```
- Vite dev server: http://localhost:5173  
- Node.js server: http://localhost:5001

Open http://localhost:5173 in your browser.

## 💡 How It Works
1. Upload: user selects and uploads a PDF via the UI.  
2. Send to Server: the client POSTs the file to /api/process.  
3. SSE: the client opens an SSE connection to /api/stream to receive real-time status messages.  
4. Server Processing:
   a. The server receives the file and uploads it to the Gemini File API.  
   b. The server waits for the file to become ACTIVE (indexed and ready).  
   c. First Gemini API call: File Search + Function Calling to extract data and produce structured JSON.  
   d. Second Gemini API call: generate a Markdown report based on the JSON and the original document.  
5. Result Delivery: the server sends final JSON, Markdown and metadata via SSE; the client parses and displays results, allows file download and interactive querying.

## API (Basic)
- POST /api/process — upload and start processing a PDF
- GET /api/stream — SSE endpoint for status messages and results

(Adjust routes/names to match server/ implementation.)

## 📄 License
This project is licensed under the MIT License.

## Author
Developed by Milan Putnik, with assistance from the Sudo AI assistant.

---

# NEBULOSA — PDF Analitika i Priprema za RAG

Ultimate application za PDF analizu i pripremu za RAG (Retrieval-Augmented Generation). Verzija 2.0 — napredna aplikacija za dubinsku analizu i ekstrakciju podataka iz PDF dokumenata, optimizovana za RAG i AGI sisteme.

> Napomena: Preporučuje se da zamenite link/screenshot iznad pravim prikazom aplikacije.

## 🚀 Ključne funkcionalnosti
- Inteligentna analiza dokumenata koristeći Google Gemini 2.5 Pro (Function Calling & File Search).
- Automatska ekstrakcija podataka u strukturirani schema.json — entiteti (osobe, organizacije, lokacije), relacije, metapodaci i struktura dokumenta.
- Generisanje Markdown izveštaja (data.md) za lako čitanje i dalju obradu.
- Interaktivno ispitivanje (RAG) — postavljanje pitanja o sadržaju dokumenta sa odgovorima zasnovanim isključivo na priloženom fajlu.
- Praćenje u realnom vremenu putem Server-Sent Events (SSE) — klijent dobija statusne update-ove tokom obrade.
- Robusna monorepo arhitektura (client/server) za skalabilnost i održavanje.
- Verifikacija integriteta fajlova pomoću SHA-256 hasha.

## 🛠️ Tehnologije
| Komponenta | Tehnologija |
|---|---|
| AI model | Google Gemini 2.5 Pro (Function Calling & File Search) |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript (tsx za hot-reloading) |
| Komunikacija | REST API, Server-Sent Events (SSE) |
| Upload/obrada fajlova | multer |

## 🏗️ Arhitektura
Projekat je organizovan kao monorepo koristeći npm workspaces, što omogućava centralizovano upravljanje zavisnostima i skriptama za klijenta i server.

- client/: React aplikacija (Vite) — UI, upload fajlova, prikaz rezultata.
- server/: Node.js/Express API — obrada fajlova, komunikacija sa Gemini API-jem, slanje SSE događaja.

## ⚙️ Pokretanje projekta

### Preduslovi
- Node.js v20.x ili noviji
- npm v9.x ili noviji
- Google Gemini API ključ

### Instalacija i konfiguracija
1. Klonirajte repozitorijum:

```bash
git clone https://github.com/MilanPutnik/NEBULOSA-PDF-Analytics-and-RAG-Preparation.git
cd NEBULOSA-PDF-Analytics-and-RAG-Preparation
```

2. Instalirajte zavisnosti (iz korena projekta — npm workspaces):

```bash
npm install
```

3. Kreirajte .env u server/ direktorijumu sa vašim Gemini API ključem:

```env
# server/.env
GEMINI_API_KEY="VAŠ_GEMINI_API_KLJUČ"
```

### Pokretanje u development režimu
Da biste istovremeno pokrenuli klijenta i server sa hot-reloadingom:

```bash
npm run dev
```
- Vite dev server obično: http://localhost:5173  
- Node.js server obično: http://localhost:5001

Otvorite http://localhost:5173 u vašem pregledaču.

## 💡 Kako funkcioniše?
1. Upload: korisnik bira i upload-uje PDF preko UI.  
2. Slanje na server: klijent šalje fajl na endpoint `/api/process`.  
3. SSE: klijent otvara SSE konekciju ka `/api/stream` za primanje statusnih poruka u realnom vremenu.  
4. Obrada na serveru:
   a. Server primi fajl i upload-uje ga na Gemini File API.  
   b. Server čeka da fajl postane ACTIVE (indeksiran i spreman).  
   c. Prvi poziv Gemini API-ju: File Search + Function Calling za ekstrakciju i dobijanje strukturiranog JSON-a.  
   d. Drugi poziv Gemini API-ju: generisanje Markdown izveštaja na osnovu JSON-a i originalnog dokumenta.  
5. Prikaz rezultata: server šalje finalni JSON, Markdown i metapodatke kroz SSE; klijent parsira i prikazuje rezultate, omogućavajući preuzimanje fajlova i interaktivno ispitivanje dokumenta.

## API (osnovno)
- POST /api/process — upload i start obrade PDF-a
- GET /api/stream — SSE endpoint za statusne poruke i rezultate

(Podesite nazive i rute prema implementaciji u server/ direktorijumu.)

## 📄 Licenca
Ovaj projekat je pod MIT licencom.

## Autor
Razvijeno od strane Milana Putnika, uz pomoć Sudo AI asistenta.
