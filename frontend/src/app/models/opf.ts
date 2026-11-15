export type OpfId = 'npd' | 'ip' | 'ooo' | 'ao' | 'coop';

export interface OpfInfo {
  id: OpfId;
  name: string;
  fullName: string;
  description: string;
  advantages: string[];
  limitations: string[];
  tax: string;
  liability: string;
  founders: string;
  suitedFor: string;
}

export type FoundersCount = 'one' | 'couple' | 'group' | 'many';

export type RevenueLevel = 'micro' | 'small' | 'large';

export type Priority = 'simplicity' | 'scaling';

export interface RecommendationInput {
  founders: FoundersCount;
  revenue: RevenueLevel;
  employees: boolean;
  investors: boolean;
  limitedLiability: boolean;
  priority: Priority;
}

export interface RecommendationResult {
  opf: OpfInfo;
  reasons: string[];
  alternatives: OpfInfo[];
}
