import { describe, it } from 'node:test';
import assert from 'node:assert';
import { evaluatePolicyGates, AUTHORIZED_PAYOUT_WALLET } from '../src/policy/gates.js';
import { RawTask } from '../src/discovery/types.js';

describe('BountyPilot AI — Policy Gates Compliance Engine', () => {
  it('should accept valid Base USDC tasks with verified budgets as ELIGIBLE', () => {
    const validTask: RawTask = {
      id: 'task-test-01',
      title: 'Implement Python indexing service',
      description: 'Comprehensive deliverable description exceeding the twenty character minimum length requirement.',
      budgetUsdc: 1500,
      chain: 'Base',
      token: 'USDC',
      escrowContractAddress: '0x3E6fE77D1bCFF4d2029E73D0e9E51B65cB51d071',
      status: 'awaiting_escrow'
    };

    const res = evaluatePolicyGates(validTask);
    assert.strictEqual(res.eligibility, 'ELIGIBLE');
    assert.ok(res.gatesPassed.includes('PC0_PLATFORM_IDENTITY'));
    assert.ok(res.gatesPassed.includes('PC1_VERIFIED_BUDGET'));
    assert.ok(res.gatesPassed.includes('PC2_SETTLEMENT_RAIL_COMPLIANT'));
    assert.ok(res.gatesPassed.includes('PC3_ESCROW_CONTRACT_ATTACHED'));
    assert.ok(res.gatesPassed.includes('PC5_DILIGENCE_ATTESTED'));
    assert.strictEqual(res.payoutAsset, 'USDC');
    assert.strictEqual(res.payoutNetwork, 'BASE');
  });

  it('should reject tasks with non-USDC speculative tokens or unsupported networks', () => {
    const invalidTask: RawTask = {
      id: 'task-test-02',
      title: 'Meme token shill task',
      description: 'Long description for a task that pays in an unverified speculative asset.',
      budgetUsdc: 500,
      chain: 'Solana',
      token: 'BONK',
      escrowContractAddress: '0x00'
    };

    const res = evaluatePolicyGates(invalidTask);
    assert.strictEqual(res.eligibility, 'EXCLUDED');
    assert.ok(res.rejectionReasons.some(r => r.includes('PC2_FAILED')));
  });

  it('should confirm the authorized settlement payout wallet invariant', () => {
    assert.strictEqual(AUTHORIZED_PAYOUT_WALLET, '0xC6F86e170411182114FcCdb28793dC76B5e8D144');
  });
});
