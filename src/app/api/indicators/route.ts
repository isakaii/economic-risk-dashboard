import { NextResponse } from 'next/server'
import { fredClient, ECONOMIC_INDICATORS, calculateRiskLevel, type IndicatorKey } from '@/lib/fred'

export async function GET() {
  try {
    const indicators = Object.keys(ECONOMIC_INDICATORS) as IndicatorKey[]

    const results = await Promise.all(
      indicators.map(async (key) => {
        try {
          const result = await fredClient.getLatestValue(key)
          return {
            indicator: key,
            name: ECONOMIC_INDICATORS[key].name,
            value: result.value,
            date: result.date,
            riskLevel: calculateRiskLevel(key, result.value),
            unit: ECONOMIC_INDICATORS[key].unit,
            impact: ECONOMIC_INDICATORS[key].impact
          }
        } catch (error) {
          console.error(`Error fetching ${key}:`, error)
          return {
            indicator: key,
            name: ECONOMIC_INDICATORS[key].name,
            value: null,
            date: '',
            riskLevel: 'normal' as const,
            unit: ECONOMIC_INDICATORS[key].unit,
            impact: ECONOMIC_INDICATORS[key].impact,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}