// HIPNODRECE ujebane v2.0 - Usklađeni Express tipovi sa server.ts da se spreči tihi pad.
// Fix: Import Request and Response from 'express' to ensure correct types.
// FIX: Use a default type import for express to avoid type collisions with global Request/Response.
import type express from 'express';

class SseManager {
    // FIX: Use express.Response for correct typing.
    private clients: Set<express.Response> = new Set();

    // FIX: Use express.Request and express.Response for correct typing.
    public addClient(req: express.Request, res: express.Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        this.clients.add(res);
        console.log(`[SSE] Client connected. Total clients: ${this.clients.size}`);

        req.on('close', () => {
            this.clients.delete(res);
            console.log(`[SSE] Client disconnected. Total clients: ${this.clients.size}`);
            res.end();
        });
    }

    public sendEvent(data: any): void {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        const clientsCopy = new Set(this.clients); 
        for (const client of clientsCopy) {
            client.write(message);
        }
    }
}

export const sseManager = new SseManager();