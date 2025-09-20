'use client'

import { useState, useEffect } from 'react'
import { ECONOMIC_INDICATORS, type IndicatorKey } from '@/lib/fred'

interface RiskData {
  indicator: IndicatorKey
  name: string
  value: number | null
  riskLevel: 'normal' | 'warning' | 'critical'
  date: string
}

export default function RiskAlert() {
  const [riskData, setRiskData] = useState<RiskData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    async function fetchAllIndicators() {
      try {
        setLoading(true)

        const response = await fetch('/api/indicators')
        const result = await response.json()

        if (result.success) {
          setRiskData(result.data)
          setLastUpdate(new Date().toLocaleString())
        } else {
          console.error('Error fetching risk data:', result.error)
        }
      } catch (error) {
        console.error('Error fetching risk data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllIndicators()

    // Refresh data every 30 minutes
    const interval = setInterval(fetchAllIndicators, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const criticalAlerts = riskData.filter(d => d.riskLevel === 'critical')
  const warningAlerts = riskData.filter(d => d.riskLevel === 'warning')

  const getOverallRiskLevel = () => {
    if (criticalAlerts.length > 0) return 'critical'
    if (warningAlerts.length > 0) return 'warning'
    return 'normal'
  }

  const getOverallMessage = () => {
    const overallRisk = getOverallRiskLevel()

    if (overallRisk === 'critical') {
      return {
        title: '🚨 Critical Risk Alert',
        message: `${criticalAlerts.length} indicator(s) at critical levels. Consider tightening lending criteria immediately.`,
        bgColor: 'bg-red-100 border-red-500',
        textColor: 'text-red-800'
      }
    }

    if (overallRisk === 'warning') {
      return {
        title: '⚠️ Warning Alert',
        message: `${warningAlerts.length} indicator(s) showing elevated risk. Monitor closely and prepare for potential policy adjustments.`,
        bgColor: 'bg-yellow-100 border-yellow-500',
        textColor: 'text-yellow-800'
      }
    }

    return {
      title: '✅ Normal Risk Level',
      message: 'All economic indicators are within normal ranges. Current lending criteria appear appropriate.',
      bgColor: 'bg-green-100 border-green-500',
      textColor: 'text-green-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  const alert = getOverallMessage()

  return (
    <div className="space-y-4">
      {/* Overall Risk Status */}
      <div className={`rounded-lg border-2 p-6 ${alert.bgColor} ${alert.textColor}`}>
        <h2 className="text-xl font-bold mb-2">{alert.title}</h2>
        <p className="mb-4">{alert.message}</p>
        <div className="text-sm opacity-75">
          Last updated: {lastUpdate}
        </div>
      </div>

      {/* Detailed Alerts */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-lg font-semibold mb-4">Risk Details</h3>

          {criticalAlerts.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-red-700 mb-2">Critical Risk Indicators:</h4>
              <ul className="space-y-2">
                {criticalAlerts.map((alert) => (
                  <li key={alert.indicator} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{alert.name}</span>
                    <span className="text-red-600">
                      {alert.value !== null ? alert.value.toFixed(2) : 'N/A'}
                      {ECONOMIC_INDICATORS[alert.indicator].unit !== 'Index' ?
                        ECONOMIC_INDICATORS[alert.indicator].unit : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warningAlerts.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">Warning Level Indicators:</h4>
              <ul className="space-y-2">
                {warningAlerts.map((alert) => (
                  <li key={alert.indicator} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{alert.name}</span>
                    <span className="text-yellow-600">
                      {alert.value !== null ? alert.value.toFixed(2) : 'N/A'}
                      {ECONOMIC_INDICATORS[alert.indicator].unit !== 'Index' ?
                        ECONOMIC_INDICATORS[alert.indicator].unit : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommended Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Recommended Actions</h3>
        <div className="text-sm text-blue-800">
          {getOverallRiskLevel() === 'critical' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Immediately review and tighten lending criteria</li>
              <li>Increase credit score requirements for new loans</li>
              <li>Reduce debt-to-income ratio thresholds</li>
              <li>Consider pausing high-risk loan products</li>
            </ul>
          )}

          {getOverallRiskLevel() === 'warning' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Increase monitoring frequency of loan portfolio</li>
              <li>Prepare contingency plans for policy adjustments</li>
              <li>Consider small increases to interest rates</li>
              <li>Review existing loan approval criteria</li>
            </ul>
          )}

          {getOverallRiskLevel() === 'normal' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Continue current lending practices</li>
              <li>Monitor indicators for any changes</li>
              <li>Consider opportunities for growth</li>
              <li>Review and optimize current processes</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}