---
doc: spec
status: approved
---

# BountyPilot AI — Technical Specification

## How This Works, In Plain Language
BountyPilot AI is built as a modular Node.js/TypeScript engine that bridges decentralized work discovery with cryptographic proof generation. 
The system consists of four lightweight layers:
1. **Connectors:** Modules that fetch opportunity records from external endpoints (like WorkUSDC REST API) and normalize them into a uniform schema.
2. **Policy Filter:** A rule engine that runs each opportunity through 6 compliance gates (PC0–PC5) to guarantee payment safety (Base USDC only, no fake tokens, no scams).
3. **Proof Generator:** A cryptographic utility using Node.js `crypto` that computes SHA-256 hashes over raw payloads and builds signed proof-of-work packets.
4. **Web Telemetry UI:** A single-file responsive frontend served by an embedded HTTP server providing live scanning, metrics, and instant JSON downloads.

## The Core Journey Through the System
1. User clicks **"Scan Live Marketplaces"** on `http://127.0.0.1:4040`.
2. Browser issues `GET /api/discover?mode=live`.
3. `server/app.ts` invokes `discovery/indexer.ts` which calls `workusdcConnector.ts`.
4. Connector executes HTTP fetch with an explicit timeout. If reachable, raw JSON tasks are parsed; each raw payload is hashed with SHA-256 (`rawContentHash`).
5. Normalized records are passed to `policy/gates.ts` where PC0–PC5 rules are evaluated.
6. The server returns JSON with opportunities, metrics, and connector health.
7. Frontend renders the live cards with commercial eligibility badges and budget values.
8. User selects a task and clicks **"Generate Proof Packet"**.
9. Frontend issues `POST /api/proof` with the task ID.
10. `engine/proofGenerator.ts` constructs an immutable proof object with timestamp, gate attestation, and SHA-256 signatures, returning `proof-packet.json`.

## Stack
- **Runtime:** Node.js v20+ / TypeScript 5+ (ESM modules).
- **HTTP Server:** Node.js native `http` module or minimal Express (zero heavy dependencies).
- **Cryptography:** Native Node.js `crypto` (SHA-256).
- **Testing:** Vitest or Node.js native test runner (`node --test`).
- **Frontend:** Pure HTML5, Tailwind-compatible CSS styling, and Vanilla JavaScript (zero bundle build step required).

## Where It Runs and How Someone Tries It
- **Local Runtime:** Any machine with Node.js 18+ installed.
- **Start Command:**
  ```bash
  cd devpost_ai_bountypilot
  npm install
  npm start
  ```
- **Access Point:** Open browser at `http://127.0.0.1:4040`.
- **Run Tests:**
  ```bash
  npm test
  ```
- **Public Repository:** `https://github.com/genesiscode2026/devpost-ai-bountypilot`
- **Demo Video:** 1080p MP4 recording demonstrating live discovery and proof generation.

## Look and Feel
- **Theme:** High-assurance cybersecurity telemetry.
- **Colors:** `#0B0F17` (Deep Slate background), `#1E293B` (Borders), `#0052FF` (Base Blue accent), `#10B981` (Emerald verified status), `#EF4444` (Amber/Red rejected status).
- **Typography:** JetBrains Mono for cryptographic identifiers; Inter for UI copy.

## Components

### 1. `src/discovery/workusdcConnector.ts`
Fetches live tasks from `https://workusdc.com/api/tasks`, normalizes payload into standard `BountyOpportunity` shape, and computes `rawContentHash`.
PRD ref: `prd.md > 1. Multi-Venue Discovery Engine`.

### 2. `src/policy/gates.ts`
Evaluates compliance gates:
- PC0: Live URL availability.
- PC1: Verified advertised budget.
- PC2: Base USDC asset validation (`payoutAsset === 'USDC' && payoutNetwork === 'BASE'`).
- PC3: Authenticity & anti-fraud scoring.
- PC4: Clear deliverable requirements.
- PC5: Execution consent gate.
PRD ref: `prd.md > 2. Policy Compliance Engine`.

### 3. `src/engine/proofGenerator.ts`
Produces deterministic SHA-256 proof packets containing:
- Opportunity metadata and raw content hash.
- Policy compliance verification report.
- Settlement destination verification (`0xC6F8...D144`).
- ISO 8601 UTC timestamp and verification signature.
PRD ref: `prd.md > 3. Cryptographic Proof Generator`.

### 4. `src/server/app.ts`
Exposes REST endpoints:
- `GET /health` -> Server status and uptime.
- `GET /api/discover` -> Executes live or fixture discovery.
- `POST /api/proof` -> Generates and exports PoW proof packets.
- `GET /` -> Serves frontend dashboard.

## Data Model

```typescript
export interface BountyOpportunity {
  id: string;
  sourceId: string;
  externalId: string;
  title: string;
  description: string;
  budgetUsdc: number;
  payoutAsset: 'USDC';
  payoutNetwork: 'BASE' | 'ETHEREUM';
  escrowContractAddress: string;
  status: string;
  rawContentHash: string;
  commercialEligibility: 'ELIGIBLE' | 'REVIEW_REQUIRED' | 'EXCLUDED';
  policyGatesPassed: string[];
  discoveredAt: string;
}

export interface ProofPacket {
  proofId: string;
  opportunityId: string;
  title: string;
  budgetUsdc: number;
  settlementRail: {
    asset: 'USDC';
    network: 'BASE';
    destinationWallet: string;
  };
  policyVerification: {
    gatesEvaluated: number;
    gatesPassed: number;
    complianceStatus: 'VERIFIED_COMPLIANT' | 'NON_COMPLIANT';
  };
  cryptographicAttestation: {
    rawPayloadHash: string;
    proofHash: string;
    generatedAt: string;
    algorithm: 'SHA-256';
  };
}
```

## File Structure

```
devpost_ai_bountypilot/
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   ├── checklist.md
│   └── app-map.html
├── src/
│   ├── discovery/
│   │   ├── workusdcConnector.ts
│   │   └── indexer.ts
│   ├── policy/
│   │   ├── gates.ts
│   │   └── sanitizer.ts
│   ├── engine/
│   │   └── proofGenerator.ts
│   ├── server/
│   │   └── app.ts
│   └── web/
│       └── index.html
├── tests/
│   ├── discovery.test.ts
│   ├── policy.test.ts
│   └── proof.test.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## External Services and Dependencies
- **WorkUSDC REST API:** `https://workusdc.com/api/tasks` (Free public endpoint, no authentication required).
- **Base Network RPC:** Read-only event checks (optional public RPC).

## Important Failure Modes
1. **WorkUSDC Network Timeout / Cloudflare Error:** Connector times out after 5000ms and seamlessly serves verified cached fixtures with a `SOURCE_DEGRADED` warning.
2. **Unsupported Payment Asset (e.g. Non-USDC token):** Gate PC2 immediately flags task as `EXCLUDED_UNSUPPORTED_ASSET` with zero financial risk.
3. **Invalid or Corrupt Payload:** JSON parse fails safely, isolating the malformed record while preserving the rest of the discovery batch.

## What Was Simplified and Why
- Native Node.js `http` and `crypto` used instead of heavy blockchain client libraries (ethers/web3.js) to keep installation lightning fast (< 5 seconds) and eliminate dependency vulnerabilities.
- Static single-file HTML/CSS dashboard eliminates React build pipeline, allowing anyone to view the interface instantly.
