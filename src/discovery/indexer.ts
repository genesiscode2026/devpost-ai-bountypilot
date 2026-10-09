import { BountyOpportunity, DiscoveryResult } from './types.js';
import { fetchWorkUsdcOpportunities } from './workusdcConnector.js';

export async function runDiscovery(mode: 'LIVE' | 'FIXTURE' = 'LIVE'): Promise<DiscoveryResult> {
  const { opportunities, modeUsed, latencyMs } = await fetchWorkUsdcOpportunities(mode);

  // Sort: Eligible first, then descending by budgetUsdc
  opportunities.sort((a, b) => {
    if (a.commercialEligibility === 'ELIGIBLE' && b.commercialEligibility !== 'ELIGIBLE') return -1;
    if (b.commercialEligibility === 'ELIGIBLE' && a.commercialEligibility !== 'ELIGIBLE') return 1;
    return b.budgetUsdc - a.budgetUsdc;
  });

  const eligible = opportunities.filter(o => o.commercialEligibility === 'ELIGIBLE');
  const totalEligibleUsdc = eligible.reduce((acc, cur) => acc + cur.budgetUsdc, 0);

  return {
    sourceId: 'workusdc',
    mode: modeUsed,
    totalRaw: opportunities.length,
    eligibleCount: eligible.length,
    totalEligibleUsdc,
    opportunities,
    latencyMs,
    timestamp: new Date().toISOString()
  };
}
