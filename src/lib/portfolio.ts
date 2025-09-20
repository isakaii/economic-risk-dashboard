export interface LoanProduct {
  id: string
  name: string
  description: string
}

export interface GeographicRegion {
  id: string
  name: string
  state: string
}

export interface IndustrySegment {
  id: string
  name: string
  sector: string
}

export interface PortfolioLoan {
  id: string
  amount: number
  interestRate: number
  term: number // months
  originationDate: string
  maturityDate: string
  product: LoanProduct
  region: GeographicRegion
  industry: IndustrySegment
  creditScore: number
  ltv: number // loan-to-value ratio
  currentStatus: 'current' | 'past_due_30' | 'past_due_60' | 'past_due_90' | 'default'
  probabilityOfDefault: number // 0-1
}

export interface RiskScenario {
  id: string
  name: string
  description: string
  economicFactors: {
    unemploymentChange: number // percentage point change
    inflationChange: number // percentage point change
    gdpGrowthChange: number // percentage point change
    interestRateChange: number // percentage point change
  }
  impactMultiplier: number // multiplier applied to PD
}

export interface PortfolioMetrics {
  totalLoans: number
  totalOutstanding: number
  averageInterestRate: number
  averageCreditScore: number
  portfolioPD: number // weighted average probability of default
  expectedLoss: number
}

// Mock portfolio data
export const MOCK_PORTFOLIO_LOANS: PortfolioLoan[] = [
  {
    id: 'LOAN001',
    amount: 250000,
    interestRate: 4.25,
    term: 360,
    originationDate: '2023-03-15',
    maturityDate: '2053-03-15',
    product: { id: 'MORTGAGE', name: 'Residential Mortgage', description: '30-year fixed rate mortgage' },
    region: { id: 'CA_BAY', name: 'San Francisco Bay Area', state: 'CA' },
    industry: { id: 'TECH', name: 'Technology', sector: 'Information Technology' },
    creditScore: 750,
    ltv: 0.8,
    currentStatus: 'current',
    probabilityOfDefault: 0.02
  },
  {
    id: 'LOAN002',
    amount: 500000,
    interestRate: 6.75,
    term: 84,
    originationDate: '2023-06-20',
    maturityDate: '2030-06-20',
    product: { id: 'COMMERCIAL', name: 'Commercial Real Estate', description: 'Commercial property loan' },
    region: { id: 'TX_DALLAS', name: 'Dallas-Fort Worth', state: 'TX' },
    industry: { id: 'RETAIL', name: 'Retail Trade', sector: 'Consumer Discretionary' },
    creditScore: 680,
    ltv: 0.75,
    currentStatus: 'current',
    probabilityOfDefault: 0.045
  },
  {
    id: 'LOAN003',
    amount: 75000,
    interestRate: 5.5,
    term: 60,
    originationDate: '2023-01-10',
    maturityDate: '2028-01-10',
    product: { id: 'AUTO', name: 'Auto Loan', description: 'Vehicle financing' },
    region: { id: 'FL_MIAMI', name: 'Miami-Dade', state: 'FL' },
    industry: { id: 'HEALTHCARE', name: 'Healthcare', sector: 'Healthcare' },
    creditScore: 720,
    ltv: 0.9,
    currentStatus: 'current',
    probabilityOfDefault: 0.03
  },
  {
    id: 'LOAN004',
    amount: 150000,
    interestRate: 8.25,
    term: 36,
    originationDate: '2023-09-05',
    maturityDate: '2026-09-05',
    product: { id: 'SBA', name: 'SBA Business Loan', description: 'Small business administration loan' },
    region: { id: 'NY_NYC', name: 'New York City', state: 'NY' },
    industry: { id: 'HOSPITALITY', name: 'Hospitality', sector: 'Consumer Discretionary' },
    creditScore: 640,
    ltv: 0.7,
    currentStatus: 'past_due_30',
    probabilityOfDefault: 0.12
  },
  {
    id: 'LOAN005',
    amount: 300000,
    interestRate: 4.75,
    term: 300,
    originationDate: '2023-04-18',
    maturityDate: '2048-04-18',
    product: { id: 'MORTGAGE', name: 'Residential Mortgage', description: '25-year fixed rate mortgage' },
    region: { id: 'WA_SEATTLE', name: 'Seattle Metropolitan', state: 'WA' },
    industry: { id: 'FINANCE', name: 'Financial Services', sector: 'Financials' },
    creditScore: 780,
    ltv: 0.75,
    currentStatus: 'current',
    probabilityOfDefault: 0.015
  },
  {
    id: 'LOAN006',
    amount: 450000,
    interestRate: 7.5,
    term: 120,
    originationDate: '2023-08-12',
    maturityDate: '2033-08-12',
    product: { id: 'COMMERCIAL', name: 'Commercial Real Estate', description: 'Office building loan' },
    region: { id: 'IL_CHICAGO', name: 'Chicago Metro', state: 'IL' },
    industry: { id: 'MANUFACTURING', name: 'Manufacturing', sector: 'Industrials' },
    creditScore: 700,
    ltv: 0.8,
    currentStatus: 'current',
    probabilityOfDefault: 0.035
  },
  {
    id: 'LOAN007',
    amount: 85000,
    interestRate: 9.75,
    term: 48,
    originationDate: '2023-07-22',
    maturityDate: '2027-07-22',
    product: { id: 'PERSONAL', name: 'Personal Loan', description: 'Unsecured personal loan' },
    region: { id: 'GA_ATLANTA', name: 'Atlanta Metro', state: 'GA' },
    industry: { id: 'EDUCATION', name: 'Education', sector: 'Consumer Discretionary' },
    creditScore: 650,
    ltv: 0,
    currentStatus: 'past_due_60',
    probabilityOfDefault: 0.18
  },
  {
    id: 'LOAN008',
    amount: 200000,
    interestRate: 5.25,
    term: 240,
    originationDate: '2023-05-30',
    maturityDate: '2043-05-30',
    product: { id: 'MORTGAGE', name: 'Residential Mortgage', description: '20-year fixed rate mortgage' },
    region: { id: 'CO_DENVER', name: 'Denver Metro', state: 'CO' },
    industry: { id: 'ENERGY', name: 'Energy', sector: 'Energy' },
    creditScore: 740,
    ltv: 0.85,
    currentStatus: 'current',
    probabilityOfDefault: 0.025
  }
]

// Risk scenarios for stress testing
export const RISK_SCENARIOS: RiskScenario[] = [
  {
    id: 'BASE',
    name: 'Base Case',
    description: 'Current economic conditions continue',
    economicFactors: {
      unemploymentChange: 0,
      inflationChange: 0,
      gdpGrowthChange: 0,
      interestRateChange: 0
    },
    impactMultiplier: 1.0
  },
  {
    id: 'MILD_RECESSION',
    name: 'Mild Recession',
    description: 'Moderate economic downturn with rising unemployment',
    economicFactors: {
      unemploymentChange: 2.0,
      inflationChange: -0.5,
      gdpGrowthChange: -1.5,
      interestRateChange: -1.0
    },
    impactMultiplier: 1.5
  },
  {
    id: 'SEVERE_RECESSION',
    name: 'Severe Recession',
    description: 'Major economic contraction similar to 2008 financial crisis',
    economicFactors: {
      unemploymentChange: 4.5,
      inflationChange: -1.0,
      gdpGrowthChange: -3.0,
      interestRateChange: -2.5
    },
    impactMultiplier: 2.5
  },
  {
    id: 'INFLATION_SPIKE',
    name: 'High Inflation',
    description: 'Persistent high inflation with aggressive rate hikes',
    economicFactors: {
      unemploymentChange: 1.0,
      inflationChange: 3.0,
      gdpGrowthChange: -0.5,
      interestRateChange: 3.0
    },
    impactMultiplier: 1.8
  },
  {
    id: 'STAGFLATION',
    name: 'Stagflation',
    description: 'High inflation combined with economic stagnation',
    economicFactors: {
      unemploymentChange: 3.0,
      inflationChange: 4.0,
      gdpGrowthChange: -2.0,
      interestRateChange: 2.0
    },
    impactMultiplier: 2.2
  }
]

// Portfolio analysis utilities
export function calculatePortfolioMetrics(loans: PortfolioLoan[]): PortfolioMetrics {
  const totalLoans = loans.length
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const averageInterestRate = loans.reduce((sum, loan) => sum + loan.interestRate, 0) / totalLoans
  const averageCreditScore = loans.reduce((sum, loan) => sum + loan.creditScore, 0) / totalLoans

  // Calculate weighted average PD
  const portfolioPD = loans.reduce((sum, loan) => sum + (loan.probabilityOfDefault * loan.amount), 0) / totalOutstanding

  // Calculate expected loss
  const expectedLoss = loans.reduce((sum, loan) => sum + (loan.amount * loan.probabilityOfDefault * 0.6), 0) // Assuming 60% LGD

  return {
    totalLoans,
    totalOutstanding,
    averageInterestRate,
    averageCreditScore,
    portfolioPD,
    expectedLoss
  }
}

export function applyStressScenario(loans: PortfolioLoan[], scenario: RiskScenario): PortfolioLoan[] {
  return loans.map(loan => ({
    ...loan,
    probabilityOfDefault: Math.min(loan.probabilityOfDefault * scenario.impactMultiplier, 1.0)
  }))
}

export function getPortfolioByRegion(loans: PortfolioLoan[]) {
  const regionMap = loans.reduce((acc, loan) => {
    const regionName = loan.region.name
    if (!acc[regionName]) {
      acc[regionName] = {
        totalAmount: 0,
        loanCount: 0,
        avgPD: 0,
        loans: []
      }
    }
    acc[regionName].totalAmount += loan.amount
    acc[regionName].loanCount++
    acc[regionName].loans.push(loan)
    return acc
  }, {} as Record<string, any>)

  // Calculate average PD for each region
  Object.keys(regionMap).forEach(region => {
    const loans = regionMap[region].loans
    regionMap[region].avgPD = loans.reduce((sum: number, loan: PortfolioLoan) =>
      sum + (loan.probabilityOfDefault * loan.amount), 0) / regionMap[region].totalAmount
  })

  return regionMap
}

export function getPortfolioByIndustry(loans: PortfolioLoan[]) {
  const industryMap = loans.reduce((acc, loan) => {
    const industryName = loan.industry.name
    if (!acc[industryName]) {
      acc[industryName] = {
        totalAmount: 0,
        loanCount: 0,
        avgPD: 0,
        loans: []
      }
    }
    acc[industryName].totalAmount += loan.amount
    acc[industryName].loanCount++
    acc[industryName].loans.push(loan)
    return acc
  }, {} as Record<string, any>)

  // Calculate average PD for each industry
  Object.keys(industryMap).forEach(industry => {
    const loans = industryMap[industry].loans
    industryMap[industry].avgPD = loans.reduce((sum: number, loan: PortfolioLoan) =>
      sum + (loan.probabilityOfDefault * loan.amount), 0) / industryMap[industry].totalAmount
  })

  return industryMap
}