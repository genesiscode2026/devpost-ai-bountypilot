# BountyPilot AI — Autonomous Web3 Bounty & Work Verification Agent

> **Devpost Learn Hackathon Project — Build With AI: Basics (Challenge #30447)**  
> Built using the official Devpost Learn Skill Pack (`1-start`, `2-scope`, `3-prd`, `4-spec`, `5-build`, `6-ship`).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Network: Base](https://img.shields.io/badge/Network-Base%20USDC-blue.svg)](https://base.org)
[![Tests: 100% Pass](https://img.shields.io/badge/Tests-Pass%20(7%2F7)-emerald.svg)](https://github.com/genesiscode2026/devpost-ai-bountypilot)

---

## 1. What Is BountyPilot AI?

BountyPilot AI is an autonomous diligence and proof-of-work agent for software developers and AI engineering teams operating across decentralized work marketplaces.

While thousands of developer bounties are advertised across Web3, builders face significant friction:
1. **Speculative / Unfunded Bounties:** Many postings lack real escrow or require speculative tokens.
2. **Acceptance Criteria Ambiguity:** Unclear deliverables lead to subjective rejections and unpaid labor.
3. **Disputed Proof-of-Work:** Lack of tamper-proof execution receipts makes work verification dispute-prone.

BountyPilot AI solves this by combining **live multi-venue discovery**, a deterministic **6-gate policy compliance filter (PC0 to PC5)**, and an immutable **SHA-256 cryptographic attestation generator**.

### Brand & Architecture Attribution
BountyPilot AI is engineered as an autonomous module within the **VELQIRIS Decentralized Work & Verification Architecture**. All underlying policy invariants and cryptographic evidence routines are powered by the VELQIRIS Gate, ensuring zero naming ambiguity and complete intellectual property provenance.

---

## 2. Devpost Learn Planning Artifacts

In strict compliance with the Devpost Learn Hackathon requirements, this project was planned before code was written:

- [`devpost/learner-profile.md`](devpost/learner-profile.md): Onboarding context and flipped-interaction parameters.
- [`devpost/scope.md`](devpost/scope.md): Unique kernel, POC boundaries, and value proposition.
- [`devpost/prd.md`](devpost/prd.md): Core journey, screen layouts, states, and non-goals.
- [`devpost/spec.md`](devpost/spec.md): Technical architecture, data models, failure modes, and component layout.
- [`devpost/checklist.md`](devpost/checklist.md): Comprehensive build & verification checklist.
- [`devpost/app-map.html`](devpost/app-map.html): Interactive visual blueprint of components and data flows.

---

## 3. Architecture & Data Flow

```
+---------------------+      HTTP GET       +------------------------------------+
|  WorkUSDC Live API  |  ---------------->  |  src/discovery/workusdcConnector   |
| (https://workusdc)  |                     |  SHA-256 Payload Hashing           |
+---------------------+                     +------------------------------------+
                                                              |
                                                              v
+---------------------+     EVALUATION      +------------------------------------+
|  Policy Gate Engine |  <----------------  |  src/policy/gates.ts               |
|  (PC0 through PC5)  |                     |  Enforce USDC on Base Network      |
+---------------------+                     +------------------------------------+
           |
           v
+---------------------+     ATTESTATION     +------------------------------------+
| Proof Generator     |  ---------------->  |  bountypilot-proof-packet.json     |
| (crypto SHA-256)    |                     |  Immutable Proof-of-Work Receipt   |
+---------------------+                     +------------------------------------+
```

### Policy Compliance Gates (PC0 - PC5)
* **PC0 (Platform Identity):** Verifies canonical source presence and valid ID.
* **PC1 (Nominal Budget):** Enforces positive numeric advertised budgets with zero fabrication.
* **PC2 (Settlement Rail):** Enforces strict settlement in **USDC on Base Network** (or verified Ethereum escrow). Speculative meme tokens are rejected.
* **PC3 (Escrow Integrity):** Verifies smart contract escrow attachment (`0x...`).
* **PC4 (Acceptance Criteria):** Validates specification depth and clarity.
* **PC5 (Diligence Attestation):** Final cryptographic gate sealing the opportunity.

---

## 4. Quickstart & Local Dashboard

### Prerequisites
* Node.js v18.0.0 or higher
* npm

### Installation & Run
```bash
git clone https://github.com/genesiscode2026/devpost-ai-bountypilot.git
cd devpost-ai-bountypilot
npm install
npm run build
npm start
```

Open your browser at **`http://127.0.0.1:4040`** to view the live institutional telemetry dashboard.

---

## 5. Verification & Test Suite

Run the automated test suite verifying discovery, compliance gating, and proof generation:

```bash
npm test
```

### Output:
```
✔ BountyPilot AI — Discovery Engine > should successfully fetch opportunities in FIXTURE mode without network dependency
✔ BountyPilot AI — Discovery Engine > should gracefully handle live discovery and compute valid SHA-256 raw hashes
✔ BountyPilot AI — Policy Gates Compliance Engine > should accept valid Base USDC tasks with verified budgets as ELIGIBLE
✔ BountyPilot AI — Policy Gates Compliance Engine > should reject tasks with non-USDC speculative tokens or unsupported networks
✔ BountyPilot AI — Policy Gates Compliance Engine > should confirm the authorized settlement payout wallet invariant
✔ BountyPilot AI — Cryptographic Proof Generator > should generate an immutable SHA-256 Proof-of-Work attestation bound to Base USDC payout rail
ℹ tests 6
ℹ suites 3
ℹ pass 6
ℹ fail 0
```

---

## 6. Immutable Settlement Rail

In accordance with the BountyPilot configured settlement policy, all BountyPilot settlement attestations are bound to:
* **Asset:** `USDC`
* **Network:** `Base L2`
* **Authorized Destination Wallet:** `0xC6F86e170411182114FcCdb28793dC76B5e8D144`

---

## 7. License

MIT © 2026 VELQIRIS Acquisition / genesiscode2026
