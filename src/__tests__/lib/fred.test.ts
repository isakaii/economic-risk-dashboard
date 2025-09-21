import { calculateRiskLevel, ECONOMIC_INDICATORS } from '@/lib/fred'

describe('calculateRiskLevel', () => {
  it('returns normal for null values', () => {
    expect(calculateRiskLevel('UNRATE', null)).toBe('normal')
    expect(calculateRiskLevel('GDP', null)).toBe('normal')
    expect(calculateRiskLevel('UMCSENT', null)).toBe('normal')
  })

  describe('Higher-is-worse indicators (UNRATE, CPIAUCSL, DFF)', () => {
    it('calculates unemployment rate risk levels correctly', () => {
      // Normal range (< 4.5%)
      expect(calculateRiskLevel('UNRATE', 3.5)).toBe('normal')
      expect(calculateRiskLevel('UNRATE', 4.4)).toBe('normal')

      // Warning range (4.5% - 5.9%)
      expect(calculateRiskLevel('UNRATE', 4.5)).toBe('warning')
      expect(calculateRiskLevel('UNRATE', 5.9)).toBe('warning')

      // Critical range (>= 6.0%)
      expect(calculateRiskLevel('UNRATE', 6.0)).toBe('critical')
      expect(calculateRiskLevel('UNRATE', 8.2)).toBe('critical')
    })

    it('calculates inflation rate risk levels correctly', () => {
      // Normal range (< 3.0%)
      expect(calculateRiskLevel('CPIAUCSL', 2.1)).toBe('normal')
      expect(calculateRiskLevel('CPIAUCSL', 2.9)).toBe('normal')

      // Warning range (3.0% - 4.9%)
      expect(calculateRiskLevel('CPIAUCSL', 3.0)).toBe('warning')
      expect(calculateRiskLevel('CPIAUCSL', 4.9)).toBe('warning')

      // Critical range (>= 5.0%)
      expect(calculateRiskLevel('CPIAUCSL', 5.0)).toBe('critical')
      expect(calculateRiskLevel('CPIAUCSL', 7.5)).toBe('critical')
    })

    it('calculates federal funds rate risk levels correctly', () => {
      // Normal range (< 5.0%)
      expect(calculateRiskLevel('DFF', 2.5)).toBe('normal')
      expect(calculateRiskLevel('DFF', 4.9)).toBe('normal')

      // Warning range (5.0% - 6.9%)
      expect(calculateRiskLevel('DFF', 5.0)).toBe('warning')
      expect(calculateRiskLevel('DFF', 6.9)).toBe('warning')

      // Critical range (>= 7.0%)
      expect(calculateRiskLevel('DFF', 7.0)).toBe('critical')
      expect(calculateRiskLevel('DFF', 8.5)).toBe('critical')
    })
  })

  describe('Lower-is-worse indicators (GDP, UMCSENT)', () => {
    it('calculates GDP growth risk levels correctly', () => {
      // Normal range (> 1.5%)
      expect(calculateRiskLevel('GDP', 2.5)).toBe('normal')
      expect(calculateRiskLevel('GDP', 3.0)).toBe('normal')

      // Warning range (0.1% - 1.5%)
      expect(calculateRiskLevel('GDP', 1.5)).toBe('warning')
      expect(calculateRiskLevel('GDP', 0.5)).toBe('warning')

      // Critical range (<= 0%)
      expect(calculateRiskLevel('GDP', 0)).toBe('critical')
      expect(calculateRiskLevel('GDP', -1.5)).toBe('critical')
    })

    it('calculates consumer sentiment risk levels correctly', () => {
      // Normal range (> 80)
      expect(calculateRiskLevel('UMCSENT', 85)).toBe('normal')
      expect(calculateRiskLevel('UMCSENT', 95)).toBe('normal')

      // Warning range (70.1 - 80)
      expect(calculateRiskLevel('UMCSENT', 80)).toBe('warning')
      expect(calculateRiskLevel('UMCSENT', 75)).toBe('warning')

      // Critical range (<= 70)
      expect(calculateRiskLevel('UMCSENT', 70)).toBe('critical')
      expect(calculateRiskLevel('UMCSENT', 65)).toBe('critical')
    })
  })
})

describe('ECONOMIC_INDICATORS', () => {
  it('contains all expected indicators with correct structure', () => {
    const expectedIndicators = ['UNRATE', 'CPIAUCSL', 'GDP', 'DFF', 'UMCSENT']

    expectedIndicators.forEach(key => {
      expect(ECONOMIC_INDICATORS).toHaveProperty(key)

      const indicator = ECONOMIC_INDICATORS[key as keyof typeof ECONOMIC_INDICATORS]
      expect(indicator).toHaveProperty('id')
      expect(indicator).toHaveProperty('name')
      expect(indicator).toHaveProperty('description')
      expect(indicator).toHaveProperty('unit')
      expect(indicator).toHaveProperty('warningLevel')
      expect(indicator).toHaveProperty('criticalLevel')
      expect(indicator).toHaveProperty('impact')
    })
  })

  it('has correct configuration for unemployment rate', () => {
    const unrate = ECONOMIC_INDICATORS.UNRATE
    expect(unrate.id).toBe('UNRATE')
    expect(unrate.name).toBe('Unemployment Rate')
    expect(unrate.unit).toBe('%')
    expect(unrate.warningLevel).toBe(4.5)
    expect(unrate.criticalLevel).toBe(6.0)
    expect(unrate.impact).toContain('unemployment')
  })

  it('has correct configuration for consumer sentiment', () => {
    const sentiment = ECONOMIC_INDICATORS.UMCSENT
    expect(sentiment.id).toBe('UMCSENT')
    expect(sentiment.name).toBe('Consumer Sentiment')
    expect(sentiment.unit).toBe('Index')
    expect(sentiment.warningLevel).toBe(80)
    expect(sentiment.criticalLevel).toBe(70)
    expect(sentiment.impact).toContain('confidence')
  })
})