import { BountyOpportunity, ProofPacket } from '../discovery/types.js';
import { AUTHORIZED_PAYOUT_WALLET, computeSha256 } from '../policy/gates.js';
import { randomUUID } from 'crypto';

export function generateProofPacket(opportunity: BountyOpportunity): ProofPacket {
  const generatedAt = new Date().toISOString();
  const proofId = `pow-${randomUUID().slice(0, 8)}`;

  const canonicalPayload = {
    proofId,
    opportunityId: opportunity.id,
    externalId: opportunity.externalId,
    title: opportunity.title,
    budgetUsdc: opportunity.budgetUsdc,
    settlementRail: {
      asset: 'USDC' as const,
      network: 'BASE' as const,
      destinationWallet: AUTHORIZED_PAYOUT_WALLET,
      verifiedContract: opportunity.escrowContractAddress
    },
    policyVerification: {
      totalGates: 6,
      passedGates: opportunity.policyGatesPassed.length,
      complianceStatus: opportunity.commercialEligibility === 'ELIGIBLE' 
        ? ('VERIFIED_COMPLIANT' as const) 
        : ('NON_COMPLIANT' as const),
      evaluatedGates: opportunity.policyGatesPassed
    },
    timestamp: generatedAt
  };

  const proofSha256 = computeSha256(JSON.stringify(canonicalPayload));

  return {
    ...canonicalPayload,
    cryptographicAttestation: {
      rawPayloadSha256: opportunity.rawContentHash,
      proofSha256,
      generatedAt,
      algorithm: 'SHA-256'
    }
  };
}
