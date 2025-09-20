'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MOCK_PORTFOLIO_LOANS,
  RISK_SCENARIOS,
  calculatePortfolioMetrics,
  applyStressScenario,
  getPortfolioByRegion,
  getPortfolioByIndustry,
  type RiskScenario,
  type PortfolioMetrics
} from '@/lib/portfolio'

export default function PortfolioRiskDashboard() {
  const [selectedScenario, setSelectedScenario] = useState<RiskScenario>(RISK_SCENARIOS[0])
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>()
  const [regionData, setRegionData] = useState<Record<string, any>>({})
  const [industryData, setIndustryData] = useState<Record<string, any>>({})

  useEffect(() => {
    // Apply selected scenario to portfolio
    const stressedLoans = applyStressScenario(MOCK_PORTFOLIO_LOANS, selectedScenario)

    // Calculate metrics
    const metrics = calculatePortfolioMetrics(stressedLoans)
    setPortfolioMetrics(metrics)

    // Calculate regional and industry breakdowns
    const regions = getPortfolioByRegion(stressedLoans)
    const industries = getPortfolioByIndustry(stressedLoans)

    setRegionData(regions)
    setIndustryData(industries)
  }, [selectedScenario])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const getRiskColor = (pd: number) => {
    if (pd > 0.1) return 'text-red-600 bg-red-50 border-red-200'
    if (pd > 0.05) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Risk Exposure</h1>
              <p className="text-gray-600 mt-1">
                Analyze how your lending portfolio is exposed to economic risk factors
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">FinTechCo Risk Management</div>
              <div className="text-sm font-medium text-gray-700">Portfolio Analytics</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scenario Selection */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Economic Scenario Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {RISK_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedScenario.id === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{scenario.name}</div>
                  <div className="text-sm text-gray-600">{scenario.description}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Impact: {(scenario.impactMultiplier * 100).toFixed(0)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Overview */}
        {portfolioMetrics && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Outstanding</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolioMetrics.totalOutstanding)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {portfolioMetrics.totalLoans} loans
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border">
                <div className="text-sm font-medium text-gray-500 mb-1">Average Interest Rate</div>
                <div className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics.averageInterestRate.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Weighted average
                </div>
              </div>

              <div className={`rounded-lg shadow-md p-6 border-2 ${getRiskColor(portfolioMetrics.portfolioPD)}`}>
                <div className="text-sm font-medium mb-1">Portfolio Default Rate</div>
                <div className="text-2xl font-bold">
                  {formatPercentage(portfolioMetrics.portfolioPD)}
                </div>
                <div className="text-sm mt-1">
                  Under {selectedScenario.name}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border">
                <div className="text-sm font-medium text-gray-500 mb-1">Expected Loss</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(portfolioMetrics.expectedLoss)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatPercentage(portfolioMetrics.expectedLoss / portfolioMetrics.totalOutstanding)} of portfolio
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Economic Factors Impact */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Economic Factors Impact</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">Unemployment Change</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedScenario.economicFactors.unemploymentChange > 0 ? '+' : ''}
                  {selectedScenario.economicFactors.unemploymentChange.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">Inflation Change</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedScenario.economicFactors.inflationChange > 0 ? '+' : ''}
                  {selectedScenario.economicFactors.inflationChange.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">GDP Growth Change</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedScenario.economicFactors.gdpGrowthChange > 0 ? '+' : ''}
                  {selectedScenario.economicFactors.gdpGrowthChange.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">Interest Rate Change</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedScenario.economicFactors.interestRateChange > 0 ? '+' : ''}
                  {selectedScenario.economicFactors.interestRateChange.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Exposure */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Risk Exposure</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(regionData).map(([region, data]) => (
                <div key={region} className={`p-4 rounded-lg border-2 ${getRiskColor(data.avgPD)}`}>
                  <div className="font-medium text-gray-900 mb-2">{region}</div>
                  <div className="space-y-1 text-sm">
                    <div>Outstanding: {formatCurrency(data.totalAmount)}</div>
                    <div>Loans: {data.loanCount}</div>
                    <div>Avg PD: {formatPercentage(data.avgPD)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Exposure */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry Risk Exposure</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(industryData).map(([industry, data]) => (
                <div key={industry} className={`p-4 rounded-lg border-2 ${getRiskColor(data.avgPD)}`}>
                  <div className="font-medium text-gray-900 mb-2">{industry}</div>
                  <div className="space-y-1 text-sm">
                    <div>Outstanding: {formatCurrency(data.totalAmount)}</div>
                    <div>Loans: {data.loanCount}</div>
                    <div>Avg PD: {formatPercentage(data.avgPD)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Management Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Management Recommendations</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="space-y-4">
              {selectedScenario.id === 'BASE' ? (
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <div>
                    <div className="font-medium text-gray-900">Portfolio Health: Good</div>
                    <div className="text-gray-600">Continue current lending practices with regular monitoring.</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                    <div>
                      <div className="font-medium text-gray-900">Increase Loan Loss Provisions</div>
                      <div className="text-gray-600">Consider increasing reserves to cover potential losses under stress scenario.</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                    <div>
                      <div className="font-medium text-gray-900">Tighten Credit Standards</div>
                      <div className="text-gray-600">Implement stricter lending criteria for new originations.</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                    <div>
                      <div className="font-medium text-gray-900">Diversification Review</div>
                      <div className="text-gray-600">Consider reducing concentration in high-risk regions and industries.</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Portfolio Details Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Details</h2>
          <div className="bg-white rounded-lg shadow-md border overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base PD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stressed PD
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_PORTFOLIO_LOANS.map((loan) => {
                  const stressedPD = Math.min(loan.probabilityOfDefault * selectedScenario.impactMultiplier, 1.0)
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {loan.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.region.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.industry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.creditScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(loan.probabilityOfDefault)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        stressedPD > 0.1 ? 'text-red-600' : stressedPD > 0.05 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {formatPercentage(stressedPD)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              Portfolio Risk Dashboard • FinTechCo Risk Management Platform
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Stress testing powered by economic scenario analysis
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}