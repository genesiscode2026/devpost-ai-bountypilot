import { RawTask, BountyOpportunity } from '../discovery/types.js';
import { createHash } from 'crypto';

export const AUTHORIZED_PAYOUT_WALLET = '0xC6F86e170411182114FcCdb28793dC76B5e8D144';

export function computeSha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

export function evaluatePolicyGates(task: RawTask): {
  eligibility: 'ELIGIBLE' | 'REVIEW_REQUIRED' | 'EXCLUDED';
  gatesPassed: string[];
  rejectionReasons: string[];
  payoutAsset: 'USDC' | 'OTHER';
  payoutNetwork: 'BASE' | 'ETHEREUM' | 'SOLANA' | 'UNKNOWN';
} {
  const gatesPassed: string[] = [];
  const rejectionReasons: string[] = [];

  // PC0: Platform Presence & ID
  if (task.id && task.id.length > 0) {
    gatesPassed.push('PC0_PLATFORM_IDENTITY');
  } else {
    rejectionReasons.push('PC0_FAILED: Missing task ID');
  }

  // PC1: Nominal Budget Advertising
  const budget = Number(task.budgetUsdc || 0);
  if (budget > 0 && !isNaN(budget)) {
    gatesPassed.push('PC1_VERIFIED_BUDGET');
  } else {
    rejectionReasons.push('PC1_FAILED: Zero or non-numeric advertised budget');
  }

  // PC2: Currency & Settlement Rail Gate
  const token = (task.token || 'USDC').toUpperCase();
  const rawChain = (task.chain || 'Base').toUpperCase();
  
  let payoutAsset: 'USDC' | 'OTHER' = token === 'USDC' ? 'USDC' : 'OTHER';
  let payoutNetwork: 'BASE' | 'ETHEREUM' | 'SOLANA' | 'UNKNOWN' = 'UNKNOWN';

  if (rawChain.includes('BASE')) {
    payoutNetwork = 'BASE';
  } else if (rawChain.includes('ETH')) {
    payoutNetwork = 'ETHEREUM';
  } else if (rawChain.includes('SOL')) {
    payoutNetwork = 'SOLANA';
  }

  if (payoutAsset === 'USDC' && (payoutNetwork === 'BASE' || payoutNetwork === 'ETHEREUM')) {
    gatesPassed.push('PC2_SETTLEMENT_RAIL_COMPLIANT');
  } else {
    rejectionReasons.push(`PC2_FAILED: Incompatible settlement asset or network (${token} on ${rawChain})`);
  }

  // PC3: Authenticity & Escrow Contract Gate
  if (task.escrowContractAddress && task.escrowContractAddress.startsWith('0x')) {
    gatesPassed.push('PC3_ESCROW_CONTRACT_ATTACHED');
  } else {
    // Non-fatal if awaiting escrow, but flagged
    rejectionReasons.push('PC3_WARNING: Escrow contract awaiting deployment');
  }

  // PC4: Acceptance Criteria & Description Quality
  if (task.description && task.description.length >= 20) {
    gatesPassed.push('PC4_ACCEPTANCE_CRITERIA_DEFINED');
  } else {
    rejectionReasons.push('PC4_FAILED: Inadequate task description length');
  }

  // PC5: Final Diligence Attestation
  const isEligible = gatesPassed.includes('PC0_PLATFORM_IDENTITY') &&
                     gatesPassed.includes('PC1_VERIFIED_BUDGET') &&
                     gatesPassed.includes('PC2_SETTLEMENT_RAIL_COMPLIANT') &&
                     gatesPassed.includes('PC4_ACCEPTANCE_CRITERIA_DEFINED');

  let eligibility: 'ELIGIBLE' | 'REVIEW_REQUIRED' | 'EXCLUDED' = 'EXCLUDED';
  if (isEligible) {
    eligibility = gatesPassed.includes('PC3_ESCROW_CONTRACT_ATTACHED') ? 'ELIGIBLE' : 'REVIEW_REQUIRED';
    gatesPassed.push('PC5_DILIGENCE_ATTESTED');
  }

  return {
    eligibility,
    gatesPassed,
    rejectionReasons,
    payoutAsset,
    payoutNetwork
  };
}
