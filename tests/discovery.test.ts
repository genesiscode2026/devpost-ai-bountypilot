import { describe, it } from 'node:test';
import assert from 'node:assert';
import { runDiscovery } from '../src/discovery/indexer.js';
import { fetchWorkUsdcOpportunities } from '../src/discovery/workusdcConnector.js';

describe('BountyPilot AI — Discovery Engine', () => {
  it('should successfully fetch opportunities in FIXTURE mode without network dependency', async () => {
    const result = await runDiscovery('FIXTURE');
    assert.strictEqual(result.sourceId, 'workusdc');
    assert.strictEqual(result.mode, 'FIXTURE');
    assert.ok(result.totalRaw > 0, 'Should return fixture opportunities');
    assert.ok(result.eligibleCount > 0, 'Should have commercially eligible bounties');
    assert.ok(result.totalEligibleUsdc > 0, 'Should have positive eligible USDC value');
  });

  it('should gracefully handle live discovery and compute valid SHA-256 raw hashes', async () => {
    const res = await fetchWorkUsdcOpportunities('LIVE');
    assert.ok(res.opportunities.length > 0, 'Should return opportunities in live or fallback mode');
    for (const opp of res.opportunities) {
      assert.strictEqual(opp.rawContentHash.length, 64, 'Raw hash must be a 64-char hex SHA-256');
      assert.ok(opp.title.length > 0, 'Opportunity must have a non-empty title');
    }
  });
});
