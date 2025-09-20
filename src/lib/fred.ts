export interface FredObservation {
  date: string
  value: string
  realtime_start: string
  realtime_end: string
}

export interface FredSeries {
  id: string
  realtime_start: string
  realtime_end: string
  title: string
  observation_start: string
  observation_end: string
  frequency: string
  frequency_short: string
  units: string
  units_short: string
  seasonal_adjustment: string
  seasonal_adjustment_short: string
  last_updated: string
  popularity: number
  notes: string
}

export interface FredApiResponse {
  realtime_start: string
  realtime_end: string
  observation_start: string
  observation_end: string
  units: string
  output_type: number
  file_type: string
  order_by: string
  sort_order: string
  count: number
  offset: number
  limit: number
  observations: FredObservation[]
}

export interface FredSeriesResponse {
  realtime_start: string
  realtime_end: string
  seriess: FredSeries[]
}

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'

// Server-side API key (not exposed to client)
const getApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    // Client-side: API calls should go through our Next.js API routes
    return null
  }
  // Server-side: use environment variable
  return process.env.NEXT_PUBLIC_FRED_API_KEY || null
}

export class FredClient {
  private baseUrl: string
  private apiKey: string | null

  constructor() {
    this.baseUrl = FRED_BASE_URL
    this.apiKey = getApiKey()
  }

  async getSeriesObservations(
    seriesId: string,
    options: {
      observationStart?: string
      observationEnd?: string
      limit?: number
      units?: 'lin' | 'chg' | 'ch1' | 'pch' | 'pc1' | 'pca'
    } = {}
  ): Promise<FredObservation[]> {
    if (!this.apiKey) {
      throw new Error('FRED API key is required. This method should only be called server-side.')
    }

    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: this.apiKey,
      file_type: 'json',
      limit: (options.limit || 100).toString(),
      sort_order: 'desc'
    })

    if (options.observationStart) {
      params.append('observation_start', options.observationStart)
    }
    if (options.observationEnd) {
      params.append('observation_end', options.observationEnd)
    }
    if (options.units) {
      params.append('units', options.units)
    }

    const url = `${this.baseUrl}/series/observations?${params.toString()}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.status} ${response.statusText}`)
      }

      const data: FredApiResponse = await response.json()
      return data.observations
    } catch (error) {
      console.error('Error fetching FRED data:', error)
      throw error
    }
  }

  async getSeriesInfo(seriesId: string): Promise<FredSeries> {
    if (!this.apiKey) {
      throw new Error('FRED API key is required. This method should only be called server-side.')
    }

    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: this.apiKey,
      file_type: 'json'
    })

    const url = `${this.baseUrl}/series?${params.toString()}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.status} ${response.statusText}`)
      }

      const data: FredSeriesResponse = await response.json()
      return data.seriess[0]
    } catch (error) {
      console.error('Error fetching FRED series info:', error)
      throw error
    }
  }

  async getLatestValue(seriesId: string): Promise<{ value: number | null; date: string }> {
    const observations = await this.getSeriesObservations(seriesId, { limit: 1 })

    if (observations.length === 0) {
      return { value: null, date: '' }
    }

    const latest = observations[0]
    const value = latest.value === '.' ? null : parseFloat(latest.value)

    return {
      value,
      date: latest.date
    }
  }
}

// Economic indicators configuration
export const ECONOMIC_INDICATORS = {
  UNRATE: {
    id: 'UNRATE',
    name: 'Unemployment Rate',
    description: 'Civilian Unemployment Rate',
    unit: '%',
    warningLevel: 4.5,
    criticalLevel: 6.0,
    impact: 'Higher unemployment correlates with increased default risk'
  },
  CPIAUCSL: {
    id: 'CPIAUCSL',
    name: 'Inflation Rate',
    description: 'Consumer Price Index for All Urban Consumers',
    unit: '%',
    warningLevel: 3.0,
    criticalLevel: 5.0,
    impact: 'High inflation affects borrowers\' ability to repay loans'
  },
  GDP: {
    id: 'GDP',
    name: 'GDP Growth',
    description: 'Gross Domestic Product',
    unit: '%',
    warningLevel: 1.5,
    criticalLevel: 0,
    impact: 'Economic growth impacts credit demand and risk levels'
  },
  DFF: {
    id: 'DFF',
    name: 'Federal Funds Rate',
    description: 'Federal Funds Effective Rate',
    unit: '%',
    warningLevel: 5.0,
    criticalLevel: 7.0,
    impact: 'Interest rate changes affect refinancing and default risk'
  },
  UMCSENT: {
    id: 'UMCSENT',
    name: 'Consumer Sentiment',
    description: 'University of Michigan Consumer Sentiment',
    unit: 'Index',
    warningLevel: 80,
    criticalLevel: 70,
    impact: 'Consumer confidence impacts payment behavior'
  }
} as const

export type IndicatorKey = keyof typeof ECONOMIC_INDICATORS

// Risk calculation utility
export function calculateRiskLevel(indicatorKey: IndicatorKey, value: number | null): 'normal' | 'warning' | 'critical' {
  if (value === null) return 'normal'

  const indicator = ECONOMIC_INDICATORS[indicatorKey]

  // For indicators where higher values are worse (unemployment, inflation, interest rates)
  if (['UNRATE', 'CPIAUCSL', 'DFF'].includes(indicatorKey)) {
    if (value >= indicator.criticalLevel) return 'critical'
    if (value >= indicator.warningLevel) return 'warning'
    return 'normal'
  }

  // For indicators where lower values are worse (GDP, consumer sentiment)
  if (['GDP', 'UMCSENT'].includes(indicatorKey)) {
    if (value <= indicator.criticalLevel) return 'critical'
    if (value <= indicator.warningLevel) return 'warning'
    return 'normal'
  }

  return 'normal'
}

// Create singleton instance (only for server-side use)
export const fredClient = (() => {
  if (typeof window !== 'undefined') {
    // Client-side: return a dummy client that throws errors
    return {
      getSeriesObservations: () => Promise.reject(new Error('Use API routes from client')),
      getSeriesInfo: () => Promise.reject(new Error('Use API routes from client')),
      getLatestValue: () => Promise.reject(new Error('Use API routes from client'))
    } as unknown as FredClient
  }
  // Server-side: create the real client
  return new FredClient()
})()