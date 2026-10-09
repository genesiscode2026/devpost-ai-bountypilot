import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDiscovery } from '../discovery/indexer.js';
import { generateProofPacket } from '../engine/proofGenerator.js';
import { BountyOpportunity } from '../discovery/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4040;
let cachedOpportunities: Map<string, BountyOpportunity> = new Map();

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health endpoint
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', uptime: process.uptime(), service: 'BountyPilot AI' }));
    return;
  }

  // Discovery endpoint
  if (pathname === '/api/discover' && req.method === 'GET') {
    try {
      const modeParam = urlObj.searchParams.get('mode') || 'LIVE';
      const mode = modeParam.toUpperCase() === 'FIXTURE' ? 'FIXTURE' : 'LIVE';
      const result = await runDiscovery(mode);
      
      // Update cache
      cachedOpportunities.clear();
      for (const opp of result.opportunities) {
        cachedOpportunities.set(opp.id, opp);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Discovery failure' }));
    }
    return;
  }

  // Proof generation endpoint
  if (pathname === '/api/proof' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}') as { opportunityId?: string };
        const opp = cachedOpportunities.get(payload.opportunityId || '');
        if (!opp) {
          // If not in cache, run a quick discovery to find it
          const fresh = await runDiscovery('LIVE');
          for (const o of fresh.opportunities) cachedOpportunities.set(o.id, o);
        }

        const target = cachedOpportunities.get(payload.opportunityId || '');
        if (!target) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Opportunity not found' }));
          return;
        }

        const proof = generateProofPacket(target);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(proof));
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err?.message || 'Invalid proof request' }));
      }
    });
    return;
  }

  // Frontend dashboard
  if (pathname === '/' || pathname === '/index.html') {
    const candidatePaths = [
      path.resolve(__dirname, '../../../src/web/index.html'),
      path.resolve(__dirname, '../../src/web/index.html'),
      path.resolve(__dirname, '../web/index.html'),
      path.resolve(process.cwd(), 'src/web/index.html')
    ];
    for (const cp of candidatePaths) {
      if (fs.existsSync(cp)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(cp));
        return;
      }
    }
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

export function startServer(port = PORT) {
  return new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`[BountyPilot AI] Telemetry dashboard running at http://127.0.0.1:${port}`);
      resolve();
    });
  });
}

// Auto-start if executed directly
if (process.argv[1] && process.argv[1].endsWith('app.js')) {
  startServer();
}

export { server };
