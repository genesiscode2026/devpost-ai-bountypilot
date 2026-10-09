import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateProofPacket } from '../src/engine/proofGenerator.js';
import { BountyOpportunity } from '../src/discovery/types.js';
import { AUTHORIZED_PAYOUT_WALLET } from '../src/policy/gates.js';

describe('BountyPilot AI — Cryptographic Proof Generator', () => {
  it('should generate an immutable SHA-256 Proof-of-Work attestation bound to Base USDC payout rail', () => {
    const opp: BountyOpportunity = {
      id: 'bp-launch-python-ops',
      sourceId: 'workusdc',
      externalId: 'launch-python-ops',
      title: 'Build Python automation for USDC task operations',
      category: 'Data',
      description: 'Create a Python workflow that validates task CSV imports.',
      budgetUsdc: 1200,
      payoutAsset: 'USDC',
      payoutNetwork: 'BASE',
      escrowContractAddress: '0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071',
      status: 'awaiting_escrow',
      clientName: 'WorkUSDC Launch Client',
      rawContentHash: 'd8df1c0e4fa4957d2904aa336681be22adc745d557bce11513b8474ffa5f7f4b',
      commercialEligibility: 'ELIGIBLE',
      policyGatesPassed: [
        'PC0_PLATFORM_IDENTITY',
        'PC1_VERIFIED_BUDGET',
        'PC2_SETTLEMENT_RAIL_COMPLIANT',
        'PC3_ESCROW_CONTRACT_ATTACHED',
        'PC4_ACCEPTANCE_CRITERIA_DEFINED',
        'PC5_DILIGENCE_ATTESTED'
      ],
      rejectionReasons: [],
      discoveredAt: new Date().toISOString()
    };

    const proof = generateProofPacket(opp);

    assert.ok(proof.proofId.startsWith('pow-'), 'Proof ID must start with pow-');
    assert.strictEqual(proof.settlementRail.destinationWallet, AUTHORIZED_PAYOUT_WALLET);
    assert.strictEqual(proof.settlementRail.asset, 'USDC');
    assert.strictEqual(proof.settlementRail.network, 'BASE');
    assert.strictEqual(proof.policyVerification.complianceStatus, 'VERIFIED_COMPLIANT');
    assert.strictEqual(proof.cryptographicAttestation.rawPayloadSha256, opp.rawContentHash);
    assert.strictEqual(proof.cryptographicAttestation.proofSha256.length, 64);
    assert.strictEqual(proof.cryptographicAttestation.algorithm, 'SHA-256');
  });
});
