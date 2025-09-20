import { NextResponse } from 'next/server'
import { fredClient, ECONOMIC_INDICATORS, calculateRiskLevel, type IndicatorKey } from '@/lib/fred'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const indicatorId = params.id.toUpperCase() as IndicatorKey

    if (!ECONOMIC_INDICATORS[indicatorId]) {
      return NextResponse.json(
        { success: false, error: 'Invalid indicator ID' },
        { status: 400 }
      )
    }

    const result = await fredClient.getLatestValue(indicatorId)
    const indicator = ECONOMIC_INDICATORS[indicatorId]

    return NextResponse.json({
      success: true,
      data: {
        indicator: indicatorId,
        name: indicator.name,
        value: result.value,
        date: result.date,
        riskLevel: calculateRiskLevel(indicatorId, result.value),
        unit: indicator.unit,
        impact: indicator.impact,
        warningLevel: indicator.warningLevel,
        criticalLevel: indicator.criticalLevel
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error(`API Error for ${params.id}:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}