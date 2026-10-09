import { RawTask, BountyOpportunity } from './types.js';
import { evaluatePolicyGates, computeSha256 } from '../policy/gates.js';

export const VERIFIED_FIXTURE_TASKS: RawTask[] = [
  {
    id: "launch-python-ops",
    title: "Build Python automation for USDC task operations",
    category: "Data",
    description: "Create a Python workflow that validates task CSV imports, normalizes client records, and prepares admin review queues for a USDC-paid work marketplace.",
    budgetUsdc: 1200,
    chain: "Base",
    token: "USDC",
    paymentMode: "escrow_contract",
    escrowContractAddress: "0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071",
    status: "awaiting_escrow",
    clientName: "WorkUSDC Launch Client"
  },
  {
    id: "launch-python-wallet-alerts",
    title: "Create a Python wallet alert bot for Base USDC payments",
    category: "Protocol",
    description: "Build a monitored Python service that watches escrow contract events, sends Slack alerts, and exports settlement summaries for client review.",
    budgetUsdc: 2150,
    chain: "Base",
    token: "USDC",
    paymentMode: "escrow_contract",
    escrowContractAddress: "0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071",
    status: "awaiting_escrow",
    clientName: "WorkUSDC Launch Client"
  },
  {
    id: "launch-wallet-copy-review",
    title: "Audit wallet transaction simulation copy",
    category: "Security",
    description: "Review wallet transaction simulation copy, risky approval warnings, and phishing-resistant user prompts. Deliver a findings table and revised copy.",
    budgetUsdc: 1800,
    chain: "Base",
    token: "USDC",
    paymentMode: "escrow_contract",
    escrowContractAddress: "0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071",
    status: "awaiting_escrow",
    clientName: "WorkUSDC Launch Client"
  },
  {
    id: "launch-escrow-indexer",
    title: "Build an escrow event indexer for Base USDC milestones",
    category: "Protocol",
    description: "Implement an indexer for funded, assigned, released, and refunded escrow events. Provide a small dashboard export and reconciliation notes.",
    budgetUsdc: 3200,
    chain: "Base",
    token: "USDC",
    paymentMode: "escrow_contract",
    escrowContractAddress: "0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071",
    status: "awaiting_escrow",
    clientName: "WorkUSDC Launch Client"
  },
  {
    id: "launch-ai-prompt-defense",
    title: "Review AI agent prompt-injection defenses",
    category: "AI",
    description: "Assess an authorized AI agent workflow for prompt-injection resilience, unsafe tool-use handling, and clear user confirmation boundaries.",
    budgetUsdc: 2700,
    chain: "Base",
    token: "USDC",
    paymentMode: "escrow_contract",
    escrowContractAddress: "0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071",
    status: "awaiting_escrow",
    clientName: "WorkUSDC Launch Client"
  }
];

export async function fetchWorkUsdcOpportunities(mode: 'LIVE' | 'FIXTURE' = 'LIVE'): Promise<{
  opportunities: BountyOpportunity[];
  modeUsed: 'LIVE' | 'FIXTURE';
  latencyMs: number;
}> {
  const start = Date.now();
  let rawTasks: RawTask[] = [];
  let modeUsed: 'LIVE' | 'FIXTURE' = mode;

  if (mode === 'LIVE') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://workusdc.com/api/tasks', {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json() as { tasks?: RawTask[] };
        if (Array.isArray(data.tasks) && data.tasks.length > 0) {
          rawTasks = data.tasks;
        } else {
          rawTasks = VERIFIED_FIXTURE_TASKS;
          modeUsed = 'FIXTURE';
        }
      } else {
        rawTasks = VERIFIED_FIXTURE_TASKS;
        modeUsed = 'FIXTURE';
      }
    } catch {
      rawTasks = VERIFIED_FIXTURE_TASKS;
      modeUsed = 'FIXTURE';
    }
  } else {
    rawTasks = VERIFIED_FIXTURE_TASKS;
  }

  const now = new Date().toISOString();
  const opportunities: BountyOpportunity[] = rawTasks.map((t, idx) => {
    const rawHash = computeSha256(JSON.stringify(t));
    const evaluation = evaluatePolicyGates(t);
    return {
      id: `bp-${t.id || idx}`,
      sourceId: 'workusdc',
      externalId: t.id || `unknown-${idx}`,
      title: t.title || 'Untitled Opportunity',
      category: t.category || 'General',
      description: t.description || '',
      budgetUsdc: Number(t.budgetUsdc || 0),
      payoutAsset: evaluation.payoutAsset,
      payoutNetwork: evaluation.payoutNetwork,
      escrowContractAddress: t.escrowContractAddress || '0x0000000000000000000000000000000000000000',
      status: t.status || 'open',
      clientName: t.clientName || 'Anonymous Client',
      rawContentHash: rawHash,
      commercialEligibility: evaluation.eligibility,
      policyGatesPassed: evaluation.gatesPassed,
      rejectionReasons: evaluation.rejectionReasons,
      discoveredAt: now
    };
  });

  return {
    opportunities,
    modeUsed,
    latencyMs: Date.now() - start
  };
}
