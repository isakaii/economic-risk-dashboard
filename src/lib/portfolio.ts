import { type IndicatorKey } from './fred'

export interface PortfolioSegment {
  id: string
  name: string
  description: string
  totalValue: number
  loanCount: number
  avgLoanSize: number
  riskWeights: {
    [key in IndicatorKey]: number
  }
  currentRiskScore: number
  potentialLoss: {
    warning: number
    critical: number
  }
  sector: string
  geography: string
}

export interface PortfolioSummary {
  totalPortfolioValue: number
  totalLoanCount: number
  avgRiskScore: number
  riskDistribution: {
    normal: number
    warning: number
    critical: number
  }
  totalPotentialLoss: {
    warning: number
    critical: number
  }
}

// Mock portfolio data
export const PORTFOLIO_SEGMENTS: PortfolioSegment[] = [
  {
    id: 'commercial-real-estate',
    name: 'Commercial Real Estate',
    description: 'Office buildings, retail centers, and industrial properties',
    totalValue: 2500000000, // $2.5B
    loanCount: 850,
    avgLoanSize: 2941176,
    riskWeights: {
      UNRATE: 0.3,    // High sensitivity to unemployment
      CPIAUCSL: 0.15, // Moderate inflation sensitivity
      GDP: 0.25,      // High sensitivity to GDP
      DFF: 0.25,      // High sensitivity to interest rates
      UMCSENT: 0.05   // Low sentiment sensitivity
    },
    currentRiskScore: 3.2,
    potentialLoss: {
      warning: 125000000,  // $125M at warning levels
      critical: 375000000  // $375M at critical levels
    },
    sector: 'Real Estate',
    geography: 'National'
  },
  {
    id: 'small-business',
    name: 'Small Business Loans',
    description: 'Working capital and equipment financing for SMBs',
    totalValue: 1800000000, // $1.8B
    loanCount: 3600,
    avgLoanSize: 500000,
    riskWeights: {
      UNRATE: 0.35,   // Very high sensitivity to unemployment
      CPIAUCSL: 0.2,  // High inflation sensitivity
      GDP: 0.3,       // Very high sensitivity to GDP
      DFF: 0.1,       // Lower interest rate sensitivity
      UMCSENT: 0.05   // Low sentiment sensitivity
    },
    currentRiskScore: 2.8,
    potentialLoss: {
      warning: 108000000,  // $108M
      critical: 270000000  // $270M
    },
    sector: 'Small Business',
    geography: 'Regional'
  },
  {
    id: 'consumer-mortgage',
    name: 'Consumer Mortgages',
    description: 'Residential mortgage lending portfolio',
    totalValue: 4200000000, // $4.2B
    loanCount: 12000,
    avgLoanSize: 350000,
    riskWeights: {
      UNRATE: 0.4,    // Very high sensitivity to unemployment
      CPIAUCSL: 0.15, // Moderate inflation sensitivity
      GDP: 0.2,       // High sensitivity to GDP
      DFF: 0.2,       // High sensitivity to interest rates
      UMCSENT: 0.05   // Low sentiment sensitivity
    },
    currentRiskScore: 2.1,
    potentialLoss: {
      warning: 168000000,  // $168M
      critical: 420000000  // $420M
    },
    sector: 'Consumer',
    geography: 'National'
  },
  {
    id: 'auto-loans',
    name: 'Auto Loans',
    description: 'New and used vehicle financing',
    totalValue: 1200000000, // $1.2B
    loanCount: 4800,
    avgLoanSize: 250000,
    riskWeights: {
      UNRATE: 0.45,   // Highest sensitivity to unemployment
      CPIAUCSL: 0.25, // High inflation sensitivity
      GDP: 0.15,      // Moderate GDP sensitivity
      DFF: 0.1,       // Lower interest rate sensitivity
      UMCSENT: 0.05   // Low sentiment sensitivity
    },
    currentRiskScore: 2.6,
    potentialLoss: {
      warning: 72000000,   // $72M
      critical: 180000000  // $180M
    },
    sector: 'Consumer',
    geography: 'Regional'
  },
  {
    id: 'credit-cards',
    name: 'Credit Cards',
    description: 'Revolving credit and personal lending',
    totalValue: 800000000, // $800M
    loanCount: 25000,
    avgLoanSize: 32000,
    riskWeights: {
      UNRATE: 0.5,    // Highest sensitivity to unemployment
      CPIAUCSL: 0.3,  // Very high inflation sensitivity
      GDP: 0.1,       // Lower GDP sensitivity
      DFF: 0.05,      // Very low interest rate sensitivity
      UMCSENT: 0.05   // Low sentiment sensitivity
    },
    currentRiskScore: 3.8,
    potentialLoss: {
      warning: 64000000,   // $64M
      critical: 160000000  // $160M
    },
    sector: 'Consumer',
    geography: 'National'
  },
  {
    id: 'corporate-lending',
    name: 'Corporate Lending',
    description: 'Large corporate loans and credit facilities',
    totalValue: 3500000000, // $3.5B
    loanCount: 450,
    avgLoanSize: 7777778,
    riskWeights: {
      UNRATE: 0.2,    // Lower sensitivity to unemployment
      CPIAUCSL: 0.1,  // Lower inflation sensitivity
      GDP: 0.4,       // Very high sensitivity to GDP
      DFF: 0.25,      // High sensitivity to interest rates
      UMCSENT: 0.05   // Low sentiment sensitivity
    },
    currentRiskScore: 2.4,
    potentialLoss: {
      warning: 140000000,  // $140M
      critical: 350000000  // $350M
    },
    sector: 'Corporate',
    geography: 'National'
  }
]

// Calculate portfolio summary from segments
export function calculatePortfolioSummary(segments: PortfolioSegment[]): PortfolioSummary {
  const totalValue = segments.reduce((sum, seg) => sum + seg.totalValue, 0)
  const totalLoans = segments.reduce((sum, seg) => sum + seg.loanCount, 0)
  const avgRiskScore = segments.reduce((sum, seg) => sum + (seg.currentRiskScore * seg.totalValue), 0) / totalValue

  // Calculate risk distribution based on risk scores
  let normal = 0, warning = 0, critical = 0
  segments.forEach(seg => {
    if (seg.currentRiskScore >= 3.5) critical += seg.totalValue
    else if (seg.currentRiskScore >= 2.5) warning += seg.totalValue
    else normal += seg.totalValue
  })

  const totalWarningLoss = segments.reduce((sum, seg) => sum + seg.potentialLoss.warning, 0)
  const totalCriticalLoss = segments.reduce((sum, seg) => sum + seg.potentialLoss.critical, 0)

  return {
    totalPortfolioValue: totalValue,
    totalLoanCount: totalLoans,
    avgRiskScore: avgRiskScore,
    riskDistribution: {
      normal: normal / totalValue,
      warning: warning / totalValue,
      critical: critical / totalValue
    },
    totalPotentialLoss: {
      warning: totalWarningLoss,
      critical: totalCriticalLoss
    }
  }
}

// Mock current economic indicator values for portfolio calculations
export const CURRENT_ECONOMIC_STATE = {
  UNRATE: 3.8,      // Current unemployment rate
  CPIAUCSL: 3.2,    // Current inflation rate
  GDP: 2.1,         // Current GDP growth
  DFF: 5.25,        // Current federal funds rate
  UMCSENT: 78.5     // Current consumer sentiment
}

// Calculate risk impact based on economic indicators
export function calculateEconomicRiskImpact(
  segment: PortfolioSegment,
  economicState: typeof CURRENT_ECONOMIC_STATE
): {
  impactScore: number
  majorRiskFactors: string[]
  projectedLoss: number
} {
  let impactScore = 0
  const majorRiskFactors: string[] = []

  // Calculate weighted impact from each indicator
  Object.entries(economicState).forEach(([key, value]) => {
    const indicatorKey = key as IndicatorKey
    const weight = segment.riskWeights[indicatorKey]

    // Normalize risk contribution (higher values = higher risk for most indicators)
    let riskContribution = 0
    switch (indicatorKey) {
      case 'UNRATE':
        riskContribution = Math.max(0, (value - 3.5) / 2.5) // Risk increases above 3.5%
        break
      case 'CPIAUCSL':
        riskContribution = Math.max(0, (value - 2.0) / 3.0) // Risk increases above 2%
        break
      case 'GDP':
        riskContribution = Math.max(0, (2.5 - value) / 2.5) // Risk increases below 2.5%
        break
      case 'DFF':
        riskContribution = Math.max(0, (value - 4.0) / 3.0) // Risk increases above 4%
        break
      case 'UMCSENT':
        riskContribution = Math.max(0, (85 - value) / 15) // Risk increases below 85
        break
    }

    const weightedImpact = riskContribution * weight
    impactScore += weightedImpact

    // Track major risk factors (contribution > 0.05)
    if (weightedImpact > 0.05) {
      majorRiskFactors.push(key)
    }
  })

  // Calculate projected loss as percentage of portfolio value
  const lossPercentage = Math.min(0.25, impactScore) // Cap at 25% loss
  const projectedLoss = segment.totalValue * lossPercentage

  return {
    impactScore: impactScore,
    majorRiskFactors,
    projectedLoss
  }
}

// Get portfolio summary
export const PORTFOLIO_SUMMARY = calculatePortfolioSummary(PORTFOLIO_SEGMENTS)