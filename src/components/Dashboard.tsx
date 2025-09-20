'use client'

import Link from 'next/link'
import IndicatorCard from './IndicatorCard'
import RiskAlert from './RiskAlert'
import { ECONOMIC_INDICATORS, type IndicatorKey } from '@/lib/fred'

export default function Dashboard() {
  const indicators = Object.keys(ECONOMIC_INDICATORS) as IndicatorKey[]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FinTechCo Economic Risk Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Monitor key economic indicators to assess credit risk and inform lending decisions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/portfolio"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Portfolio Risk Analysis
              </Link>
              <div className="text-right">
                <div className="text-sm text-gray-500">Built with Federal Reserve Economic Data</div>
                <div className="text-sm font-medium text-gray-700">FinTechCo</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Alert Section */}
        <section className="mb-8">
          <RiskAlert />
        </section>

        {/* Indicators Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Economic Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((key) => (
              <IndicatorCard key={key} indicatorKey={key} />
            ))}
          </div>
        </section>

        {/* Information Section */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Dashboard</h2>
          <div className="prose text-gray-600">
            <p className="mb-4">
              This dashboard monitors key economic indicators from the Federal Reserve Economic Data (FRED)
              to help banking teams assess credit risk and make informed lending decisions.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2">How Risk Levels Work:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>🟢 Normal:</strong> Indicators are within acceptable ranges for standard lending practices</li>
              <li><strong>🟡 Warning:</strong> Elevated risk levels suggest caution and increased monitoring</li>
              <li><strong>🔴 Critical:</strong> High risk conditions recommend immediate policy adjustments</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Key Indicators:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Unemployment Rate:</strong> Higher unemployment typically correlates with increased loan defaults</li>
              <li><strong>Inflation Rate:</strong> High inflation can strain borrowers' ability to repay existing debts</li>
              <li><strong>GDP Growth:</strong> Economic contraction often leads to higher credit risk</li>
              <li><strong>Federal Funds Rate:</strong> Interest rate changes affect borrowing costs and refinancing risk</li>
              <li><strong>Consumer Sentiment:</strong> Consumer confidence impacts spending and payment behavior</li>
            </ul>

            <p className="mt-4 text-sm text-gray-500">
              Data is automatically updated from FRED API. Thresholds are based on historical correlations
              with loan performance and industry best practices.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              Economic Risk Dashboard • Powered by{' '}
              <a
                href="https://fred.stlouisfed.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                FRED API
              </a>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Federal Reserve Bank of St. Louis • Economic Research Division
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}