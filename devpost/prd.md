---
doc: prd
status: approved
---

# BountyPilot AI — Product Requirements Document

One line: Autonomous Web3 bounty discovery, policy-gate diligence, and cryptographic proof-of-work generator for builders.
Source: `scope.md > BountyPilot AI`.

## The Core Journey
1. **Launch:** The builder starts BountyPilot with `npm start` and opens `http://127.0.0.1:4040`.
2. **Telemetry Dashboard:** The user views system status, target payout rail (`Base USDC`), and registered discovery connectors.
3. **Live Discovery:** The user clicks "Run Live Discovery". The agent queries the live WorkUSDC API (`https://workusdc.com/api/tasks`) and parses returned tasks.
4. **Policy Triage:** The agent executes Policy Gates PC0 through PC5:
   - Validates asset type (USDC) and network (Base / Ethereum escrow).
   - Validates authenticity score and non-speculative payout status.
   - Computes raw advertised value vs. commercially eligible value.
5. **Opportunity Selection:** The user reviews the prioritized list of tasks (e.g., "Build Python automation for USDC task operations - $1,200 USDC").
6. **Execution Simulation & PoW Generation:** The user clicks "Generate Proof Packet" on an eligible task. The engine runs milestone verification checks and outputs a canonical cryptographic proof file with SHA-256 evidence hashes.
7. **Export:** The user downloads the generated `bountypilot-proof-packet.json` ready for submission to clients or hackathon judges.

## Screens and Layout
- **Single-page Responsive Dashboard (`index.html`):**
  - **Header:** Brand emblem, live status indicator, and target settlement rail badge (`BASE // USDC: 0xC6F8...D144`).
  - **Metric Bar:** 4 live metric tiles:
    1. Total Discovered Value ($ USD).
    2. Commercially Eligible Value ($ USD).
    3. Active Connectors (Live / Fixture status).
    4. Cryptographic Proofs Generated.
  - **Control Bar:** Action buttons: `[Scan Live Marketplaces]`, `[Run Deterministic Fixtures]`, `[Export Evidence Ledger]`.
  - **Main Split View:**
    - *Left Pane (Opportunities Feed):* Card list of discovered bounties with tags (`ELIGIBLE`, `AWAITING_ESCROW`, `BASE_USDC`), budget, and client details.
    - *Right Pane (Audit & Proof Inspector):* Deep inspection view showing raw payload SHA-256, policy gate breakdown, and generated Proof-of-Work attestation.

## Look and Feel
- **Color Palette:** Deep obsidian background (`#0B0F17`), Slate borders (`#1E293B`), Emerald verification accents (`#10B981`), Base Blue highlights (`#0052FF`), and Pure White typography (`#F8FAFC`).
- **Typography:** Modern monospace (`JetBrains Mono`, `Fira Code`) for hashes and metrics; Inter / System UI for descriptive copy.
- **Tone:** Technical, robust, security-first, and institutional.

## Features and Behavior

### 1. Multi-Venue Discovery Engine
- Connects to WorkUSDC live tasks endpoint with timeout and error fallback.
- Falls back gracefully to deterministic certified fixtures if the network is unavailable.
- Deduplicates incoming tasks based on canonical URLs and content fingerprints.

### 2. Policy Compliance Engine (PC0 - PC5)
- **Gate PC0 (Platform Presence):** Verifies task exists on canonical platform URL.
- **Gate PC1 (Financial Advertising):** Extracts nominal advertised budget without fabricating missing amounts.
- **Gate PC2 (Escrow & Settlement):** Enforces Base / Ethereum USDC settlement rail. Rejects speculative tokens.
- **Gate PC3 (Client Authenticity):** Filters out unverified or high-risk postings.
- **Gate PC4 (Milestone Execution):** Validates acceptance criteria clarity.
- **Gate PC5 (Final Attestation):** Requires builder consent before submitting completed work.

### 3. Cryptographic Proof Generator
- Computes SHA-256 hash over raw task payload.
- Injects canonical timestamp, policy evaluation results, and executor fingerprint.
- Exports structured, immutable JSON attestation.

## States and Boundaries
- **Empty State:** Shows zero discovered tasks with prompt to click "Scan Live Marketplaces".
- **Loading State:** Displays scanning pulse animations across active connectors.
- **Active State:** Populated card list sorted by commercial eligibility and payout value.
- **Error State:** Network failures are caught and displayed gracefully in telemetry console without crashing the app.
- **Security Boundary:** Strictly read-only; no private keys, no automated wallet spending, fail-closed on unknown contracts.

## Product Decisions
- **Stand-alone Express/TypeScript Server:** Chosen over heavy frameworks so it starts instantly on any machine with `npm start` and zero external database dependencies.
- **Deterministic Offline Mode:** Included alongside live API so reviewers can verify all functionality without active internet connectivity.
- **Strict Base USDC Filter:** Avoids all multi-token volatility and adheres to institutional payment standards.

## What We're Building
A self-contained, fully working Node.js/TypeScript application with web dashboard, REST endpoints (`/api/discover`, `/api/proof`, `/api/health`), and complete test suite.

## Deferred From the POC
- Direct on-chain transaction execution via web3 provider.
- Automated code solution generation via LLM API calls.
- Multi-user authentication.

## Non-Goals
- NOT an automated spam bidding bot.
- NOT a custody wallet or fund manager.
- NOT an AI auto-coder that pushes unreviewed code to clients.

## Open Questions
- None blocking POC completion. The WorkUSDC live endpoint is verified accessible and returns 9 real tasks.
