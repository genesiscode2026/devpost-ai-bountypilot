---
doc: scope
status: approved
---

# BountyPilot AI — Autonomous Web3 Bounty & Work Verification Agent

One line: An autonomous agent that discovers live crypto developer bounties, verifies strict payment security invariants, and generates tamper-proof SHA-256 evidence packets to prove proof-of-work.

## The Unique Kernel
The one distinctive thing that makes this not generic: **Zero-trust cryptographic evidence generation for developer bounties.** Instead of merely listing bounties or creating speculative AI code snippets, BountyPilot binds every discovered opportunity to a deterministic 6-gate compliance pipeline (PC0 to PC5) and produces an immutable SHA-256 execution attestation proving that tasks meet verified payout requirements (USDC on Base).

## Who It's For
An independent developer or AI engineering team seeking to discover, triage, and claim verified crypto developer tasks without risking uncompensated work or falling for fraudulent, un-escrowed bounty postings.

## The Core Loop
1. The developer triggers BountyPilot via the interactive dashboard or CLI.
2. The agent executes parallel live discovery across decentralized task registries (WorkUSDC REST API and Superteam Earn).
3. The policy engine evaluates all 6 compliance gates: escrow verification, chain compatibility, non-speculative budgets, and prompt-injection resilience.
4. The user selects an eligible opportunity; BountyPilot plans the solution milestone, runs the verification checks, and generates a cryptographically signed Proof Packet (`proof.json` with SHA-256 content hashes).
5. The developer submits the verifiable proof packet directly to the marketplace client.

## Inspiration & Identity
- **Aesthetic:** Crisp, high-contrast dark mode terminal / telemetry dashboard inspired by Devpost, Base network explorers, and GitHub Actions telemetry.
- **Mood:** Precise, authoritative, security-conscious, and transparent.
- **References:**
  - Base Network: https://base.org
  - WorkUSDC Live Tasks: https://workusdc.com
  - Devpost Learn: https://learn-ai-basics.devpost.com

## Why This Matters to the Learner
Developers spend countless hours building software for hackathons and bounties only to face payment disputes, unclear acceptance criteria, or fake escrow promises. BountyPilot gives builders autonomous diligence and immutable proof-of-work receipts that can never be disputed.

## What "Working" Looks Like
A running local service and web dashboard that connects to live marketplace endpoints, retrieves authentic task records (e.g. WorkUSDC tasks with real budgets), filters out ineligible or unverified bounties, and runs a simulated completion job that produces a downloadable, SHA-256 verified Proof Packet with 100% green unit tests.

## The POC Boundary
- **IN:**
  - Live connector for WorkUSDC tasks endpoint (`https://workusdc.com/api/tasks`).
  - High-fidelity offline test fixtures for deterministic offline evaluation.
  - PC0–PC5 Policy Gate Validator enforcing Base USDC invariant rules.
  - SHA-256 Evidence Packet Generator with canonical JSON hashing.
  - Fast embedded HTTP server serving a modern web UI dashboard.
  - Automated test suite covering discovery, policy gating, and proof generation.
- **LATER:**
  - Multi-agent autonomous code generation for solving bounties end-to-end.
  - On-chain smart contract escrow auto-claiming via private key signing.
  - Telegram / Discord alert bot integration.

## Explicitly Cut
- **Automatic wallet transactions / private key storage:** Cut for absolute security in POC. BountyPilot is strictly read-only and diligence-focused; no funds or keys are exposed.
- **Non-USDC / non-Base payment rails:** Out of scope. Strict focus on Base USDC eliminates exchange-rate volatility and complex cross-chain bridges.
