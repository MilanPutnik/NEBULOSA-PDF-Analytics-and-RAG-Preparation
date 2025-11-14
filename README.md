# NEBULOSA-PDF-Analytics-and-RAG-Preparation
Ultimate application for PDF analysis and RAG preparation in the history of the whole Universe.
Verzija 2.0
Napredna aplikacija za dubinsku analizu i ekstrakciju podataka iz PDF dokumenata, optimizovana za RAG (Retrieval-Augmented Generation) i AGI (Artificial General Intelligence) sisteme, pokretana snagom Google Gemini 2.5 Pro modela.
(Preporuka: Zameniti link iznad sa pravim screenshot-om aplikacije)
🚀 Ključne Funkcionalnosti
Inteligentna Analiza Dokumenata: Koristi napredne mogućnosti Gemini 2.5 Pro modela za razumevanje i strukturiranje sadržaja iz pravnih i tehničkih PDF dokumenata.
Automatska Ekstrakcija Podataka: Generiše detaljan schema.json fajl sa ekstrahovanim entitetima (osobe, organizacije, lokacije), relacijama, metapodacima i strukturom dokumenta.
Generisanje Markdown Izveštaja: Kreira pregledan data.md izveštaj, formatiran za lako čitanje i dalju obradu, na osnovu ekstrahovanih podataka.
Interaktivno Ispitivanje (RAG): Omogućava postavljanje pitanja u vezi sa sadržajem dokumenta, pružajući odgovore zasnovane isključivo na priloženom fajlu.
Praćenje u Realnom Vremenu: Klijent dobija ažuriranja o statusu obrade uživo putem Server-Sent Events (SSE).
Robusna Arhitektura: Monorepo struktura sa odvojenim React (Vite) klijentom i Node.js (Express) serverom za skalabilnost i lako održavanje.
Bezbednost i Integritet: Generiše SHA-256 hash za svaki obrađeni dokument radi verifikacije integriteta.
🛠️ Tehnologije
Komponenta	Tehnologija
AI Model	Google Gemini 2.5 Pro (sa Function Calling & File Search)
Frontend	React, TypeScript, Vite, Tailwind CSS
Backend	Node.js, Express, TypeScript, tsx za hot-reloading
Komunikacija	REST API, Server-Sent Events (SSE)
Obrada Fajlova	multer za upload na serveru
🏗️ Arhitektura
Projekat je organizovan kao monorepo koristeći npm workspaces, što omogućava centralizovano upravljanje zavisnostima i skriptama za klijentski i serverski deo aplikacije.
client/: Sadrži React aplikaciju kreiranu uz pomoć Vite. Odgovorna za korisnički interfejs, upload fajlova i prikaz rezultata.
server/: Sadrži Node.js/Express API koji upravlja logikom obrade, komunikacijom sa Gemini API-jem i slanjem SSE događaja.
⚙️ Pokretanje Projekta
Preduslovi
Node.js (verzija 20.x ili novija)
npm (verzija 9.x ili novija)
Google Gemini API ključ
Instalacija i Konfiguracija
Kloniranje Repozitorijuma:
code
Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Instalacija Zavisnosti:
Iz korena projekta, pokrenite sledeću komandu koja će instalirati zavisnosti za oba workspace-a (client i server):
code
Bash
npm install
Podešavanje Environment Varijabli:
U server/ direktorijumu, kreirajte fajl pod nazivom .env i dodajte svoj Gemini API ključ:
code
Code
# server/.env
GEMINI_API_KEY="VAŠ_GEMINI_API_KLJUČ"
Pokretanje
Da biste pokrenuli i klijenta i server istovremeno u development modu sa hot-reloadingom, koristite sledeću komandu iz korena projekta:
code
Bash
npm run dev
Ova komanda će:
Pokrenuti Vite dev server za klijenta (obično na http://localhost:5173)
Pokrenuti Node.js server (na http://localhost:5001)
Otvorite http://localhost:5173 u vašem pretraživaču da biste koristili aplikaciju.
💡 Kako Funkcioniše?
Upload: Korisnik bira i upload-uje PDF fajl preko interfejsa.
Slanje na Server: Klijent šalje fajl na /api/process endpoint na serveru.
SSE Konekcija: Klijent odmah uspostavlja SSE konekciju sa /api/stream endpointom kako bi primao statusne poruke.
Obrada na Serveru:
a. Server prima fajl i upload-uje ga na Gemini File API.
b. Server čeka da fajl postane ACTIVE (indeksiran i spreman za analizu).
c. Prvi poziv Gemini API-ju se vrši sa File Search i Function Calling alatima kako bi se ekstrahovali podaci i dobio strukturiran JSON.
d. Drugi poziv Gemini API-ju se koristi za generisanje Markdown izveštaja na osnovu dobijenog JSON-a i originalnog dokumenta.
Prikaz Rezultata: Server šalje finalni JSON, Markdown i metapodatke klijentu kroz SSE. Klijent parsira i prikazuje rezultate, omogućavajući preuzimanje fajlova i interaktivno ispitivanje dokumenta.
📄 Licenca
Ovaj projekat je pod MIT licencom.
Razvijeno od strane Milana Putnika, uz svesrdnu pomoć Sudo AI asistenta.
