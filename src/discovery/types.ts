export interface RawTask {
  id: string;
  title: string;
  category?: string;
  description: string;
  budgetUsdc: number;
  chain?: string;
  token?: string;
  paymentMode?: string;
  walletAddress?: string;
  escrowContractAddress?: string;
  status?: string;
  clientName?: string;
  createdAt?: string;
}

export interface BountyOpportunity {
  id: string;
  sourceId: string;
  externalId: string;
  title: string;
  category: string;
  description: string;
  budgetUsdc: number;
  payoutAsset: 'USDC' | 'OTHER';
  payoutNetwork: 'BASE' | 'ETHEREUM' | 'SOLANA' | 'UNKNOWN';
  escrowContractAddress: string;
  status: string;
  clientName: string;
  rawContentHash: string;
  commercialEligibility: 'ELIGIBLE' | 'REVIEW_REQUIRED' | 'EXCLUDED';
  policyGatesPassed: string[];
  rejectionReasons: string[];
  discoveredAt: string;
}

export interface DiscoveryResult {
  sourceId: string;
  mode: 'LIVE' | 'FIXTURE';
  totalRaw: number;
  eligibleCount: number;
  totalEligibleUsdc: number;
  opportunities: BountyOpportunity[];
  latencyMs: number;
  timestamp: string;
}

export interface ProofPacket {
  proofId: string;
  opportunityId: string;
  externalId: string;
  title: string;
  budgetUsdc: number;
  settlementRail: {
    asset: 'USDC';
    network: 'BASE';
    destinationWallet: string;
    verifiedContract: string;
  };
  policyVerification: {
    totalGates: number;
    passedGates: number;
    complianceStatus: 'VERIFIED_COMPLIANT' | 'NON_COMPLIANT';
    evaluatedGates: string[];
  };
  cryptographicAttestation: {
    rawPayloadSha256: string;
    proofSha256: string;
    generatedAt: string;
    algorithm: 'SHA-256';
  };
}
