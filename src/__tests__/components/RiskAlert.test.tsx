import { render, screen, waitFor } from '@testing-library/react'
import RiskAlert from '@/components/RiskAlert'

// Mock the fetch function
global.fetch = jest.fn()

const mockNormalRiskData = {
  success: true,
  data: [
    {
      indicator: 'UNRATE' as const,
      name: 'Unemployment Rate',
      value: 3.8,
      riskLevel: 'normal' as const,
      date: '2024-01-15'
    }
  ]
}

const mockWarningRiskData = {
  success: true,
  data: [
    {
      indicator: 'UNRATE' as const,
      name: 'Unemployment Rate',
      value: 6.5,
      riskLevel: 'warning' as const,
      date: '2024-01-15'
    }
  ]
}

describe('RiskAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<RiskAlert />)

    // Check for loading animation elements
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays normal risk status when all indicators are normal', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockNormalRiskData
    })

    render(<RiskAlert />)

    await waitFor(() => {
      expect(screen.getByText('✅ Normal Risk Level')).toBeInTheDocument()
    })

    expect(screen.getByText('All economic indicators are within normal ranges. Current lending criteria appear appropriate.')).toBeInTheDocument()
  })

  it('displays warning risk status when some indicators are at warning level', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockWarningRiskData
    })

    render(<RiskAlert />)

    await waitFor(() => {
      expect(screen.getByText('⚠️ Warning Alert')).toBeInTheDocument()
    })

    expect(screen.getByText('1 indicator(s) showing elevated risk. Monitor closely and prepare for potential policy adjustments.')).toBeInTheDocument()
  })

  it('makes API call to correct endpoint', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockNormalRiskData
    })

    render(<RiskAlert />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/indicators')
    })
  })

  it('displays last update timestamp', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockNormalRiskData
    })

    render(<RiskAlert />)

    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
    })
  })

  it('shows recommended actions', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockNormalRiskData
    })

    render(<RiskAlert />)

    await waitFor(() => {
      expect(screen.getByText('Recommended Actions')).toBeInTheDocument()
      expect(screen.getByText('Continue current lending practices')).toBeInTheDocument()
    })
  })
})