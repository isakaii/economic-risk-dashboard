'use client'

import { useState, useEffect } from 'react'
import { ECONOMIC_INDICATORS, type IndicatorKey } from '@/lib/fred'

interface IndicatorCardProps {
  indicatorKey: IndicatorKey
}

export default function IndicatorCard({ indicatorKey }: IndicatorCardProps) {
  const [value, setValue] = useState<number | null>(null)
  const [date, setDate] = useState<string>('')
  const [riskLevel, setRiskLevel] = useState<'normal' | 'warning' | 'critical'>('normal')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const indicator = ECONOMIC_INDICATORS[indicatorKey]

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/indicators/${indicatorKey.toLowerCase()}`)
        const data = await response.json()

        if (data.success) {
          setValue(data.data.value)
          setDate(data.data.date)
          setRiskLevel(data.data.riskLevel)
        } else {
          setError(data.error || 'Failed to fetch data')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [indicatorKey])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'border-red-500 bg-red-50 text-red-900'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-900'
      default:
        return 'border-green-500 bg-green-50 text-green-900'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical':
        return '🔴'
      case 'warning':
        return '🟡'
      default:
        return '🟢'
    }
  }

  const formatValue = (val: number | null) => {
    if (val === null) return 'N/A'

    // Format based on indicator type
    if (indicatorKey === 'UMCSENT') {
      return val.toFixed(1)
    }
    return val.toFixed(2) + indicator.unit
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-red-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{indicator.name}</h3>
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-2 ${getRiskColor(riskLevel)}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{indicator.name}</h3>
        <span className="text-2xl">{getRiskIcon(riskLevel)}</span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold mb-1">
          {formatValue(value)}
        </div>
        <div className="text-sm text-gray-600">
          As of {formatDate(date)}
        </div>
      </div>

      <div className="text-sm mb-4">
        <p className="font-medium text-gray-700 mb-1">Risk Levels:</p>
        <p className="text-gray-600">
          Warning: {indicator.unit === '%' ? indicator.warningLevel + '%' : indicator.warningLevel} |
          Critical: {indicator.unit === '%' ? indicator.criticalLevel + '%' : indicator.criticalLevel}
        </p>
      </div>

      <div className="text-sm text-gray-600">
        <p className="font-medium mb-1">Impact:</p>
        <p>{indicator.impact}</p>
      </div>
    </div>
  )
}