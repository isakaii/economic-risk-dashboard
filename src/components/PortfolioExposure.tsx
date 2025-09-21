'use client'

import { useState } from 'react'
import {
  PORTFOLIO_SEGMENTS,
  PORTFOLIO_SUMMARY,
  CURRENT_ECONOMIC_STATE,
  calculateEconomicRiskImpact,
  type PortfolioSegment
} from '@/lib/portfolio'

export default function PortfolioExposure() {
  const [selectedSegment, setSelectedSegment] = useState<PortfolioSegment | null>(null)

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`
    }
    return `$${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getRiskScoreColor = (score: number): string => {
    if (score >= 3.5) return 'text-red-600 bg-red-100'
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getRiskScoreIcon = (score: number): string => {
    if (score >= 3.5) return '🔴'
    if (score >= 2.5) return '🟡'
    return '🟢'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Risk Exposure</h1>
              <p className="text-gray-600 mt-1">
                Analyze lending portfolio exposure to economic risk factors
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Risk Analysis Dashboard</div>
              <div className="text-sm font-medium text-gray-700">FinTechCo</div>
            </div>
          </div>
          {/* Navigation */}
          <div className="mt-4 border-t pt-4">
            <nav className="flex space-x-8">
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 pb-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-300"
              >
                Economic Indicators
              </a>
              <a
                href="/portfolio"
                className="text-blue-600 border-b-2 border-blue-600 pb-2 text-sm font-medium"
              >
                Portfolio Exposure
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Portfolio Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Portfolio Value</h3>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(PORTFOLIO_SUMMARY.totalPortfolioValue)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Loans</h3>
              <div className="text-3xl font-bold text-gray-900">
                {PORTFOLIO_SUMMARY.totalLoanCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Average Risk Score</h3>
              <div className={`text-3xl font-bold p-2 rounded-lg ${getRiskScoreColor(PORTFOLIO_SUMMARY.avgRiskScore)}`}>
                {PORTFOLIO_SUMMARY.avgRiskScore.toFixed(1)} {getRiskScoreIcon(PORTFOLIO_SUMMARY.avgRiskScore)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Potential Loss (Critical)</h3>
              <div className="text-3xl font-bold text-red-600">
                {formatCurrency(PORTFOLIO_SUMMARY.totalPotentialLoss.critical)}
              </div>
            </div>
          </div>
        </section>

        {/* Risk Distribution */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Risk Distribution</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(PORTFOLIO_SUMMARY.riskDistribution.normal)}
                </div>
                <div className="text-sm text-gray-500">🟢 Normal Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {formatPercentage(PORTFOLIO_SUMMARY.riskDistribution.warning)}
                </div>
                <div className="text-sm text-gray-500">🟡 Warning Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatPercentage(PORTFOLIO_SUMMARY.riskDistribution.critical)}
                </div>
                <div className="text-sm text-gray-500">🔴 Critical Risk</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="h-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
            </div>
          </div>
        </section>

        {/* Portfolio Segments */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Segments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PORTFOLIO_SEGMENTS.map((segment) => {
              const riskImpact = calculateEconomicRiskImpact(segment, CURRENT_ECONOMIC_STATE)

              return (
                <div
                  key={segment.id}
                  className="bg-white rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSegment(segment)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                      <p className="text-sm text-gray-600">{segment.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskScoreColor(segment.currentRiskScore)}`}>
                      {segment.currentRiskScore.toFixed(1)} {getRiskScoreIcon(segment.currentRiskScore)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Portfolio Value</div>
                      <div className="font-semibold">{formatCurrency(segment.totalValue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Number of Loans</div>
                      <div className="font-semibold">{segment.loanCount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Potential Loss at Critical Risk</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(segment.potentialLoss.critical)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ({formatPercentage(segment.potentialLoss.critical / segment.totalValue)} of segment)
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Major Risk Factors</div>
                    <div className="flex flex-wrap gap-2">
                      {riskImpact.majorRiskFactors.map((factor) => (
                        <span key={factor} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Sector: {segment.sector}</span>
                      <span>Geography: {segment.geography}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Detailed Modal */}
        {selectedSegment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedSegment.name}</h3>
                  <button
                    onClick={() => setSelectedSegment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Portfolio Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Value:</span>
                        <span className="font-medium">{formatCurrency(selectedSegment.totalValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Loan Count:</span>
                        <span className="font-medium">{selectedSegment.loanCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Loan Size:</span>
                        <span className="font-medium">{formatCurrency(selectedSegment.avgLoanSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Risk Score:</span>
                        <span className={`font-medium px-2 py-1 rounded ${getRiskScoreColor(selectedSegment.currentRiskScore)}`}>
                          {selectedSegment.currentRiskScore.toFixed(1)} {getRiskScoreIcon(selectedSegment.currentRiskScore)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Risk Sensitivity Weights</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedSegment.riskWeights).map(([key, weight]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-gray-600">{key}:</span>
                          <span className="font-medium">{(weight * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Potential Loss Scenarios</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Warning Level</div>
                      <div className="font-bold text-yellow-700">
                        {formatCurrency(selectedSegment.potentialLoss.warning)}
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Critical Level</div>
                      <div className="font-bold text-red-700">
                        {formatCurrency(selectedSegment.potentialLoss.critical)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Segment Details</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedSegment.description}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sector: {selectedSegment.sector}</span>
                    <span>Geography: {selectedSegment.geography}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Economic State Reference */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Economic Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(CURRENT_ECONOMIC_STATE).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-sm text-gray-500 mb-1">{key}</div>
                <div className="font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                  {['UNRATE', 'CPIAUCSL', 'GDP', 'DFF'].includes(key) ? '%' : ''}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Risk calculations are based on these current economic indicator values and individual portfolio segment sensitivities.
          </p>
        </section>
      </main>
    </div>
  )
}