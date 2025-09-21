import { render, screen, waitFor } from '@testing-library/react'
import IndicatorCard from '@/components/IndicatorCard'

// Mock the fetch function
global.fetch = jest.fn()

const mockIndicatorData = {
  success: true,
  data: {
    value: 3.8,
    date: '2024-01-15',
    riskLevel: 'normal' as const
  }
}

const mockErrorData = {
  success: false,
  error: 'API Error: Unable to fetch data'
}

describe('IndicatorCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<IndicatorCard indicatorKey="UNRATE" />)

    // Check for loading animation elements
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders unemployment rate data correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockIndicatorData
    })

    render(<IndicatorCard indicatorKey="UNRATE" />)

    await waitFor(() => {
      expect(screen.getByText('Unemployment Rate')).toBeInTheDocument()
    })

    expect(screen.getByText('3.80%')).toBeInTheDocument()
    expect(screen.getByText('🟢')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockErrorData
    })

    render(<IndicatorCard indicatorKey="UNRATE" />)

    await waitFor(() => {
      expect(screen.getByText('Unemployment Rate')).toBeInTheDocument()
    })

    expect(screen.getByText('Error: API Error: Unable to fetch data')).toBeInTheDocument()
  })

  it('makes API call to correct endpoint', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockIndicatorData
    })

    render(<IndicatorCard indicatorKey="UNRATE" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/indicators/unrate')
    })
  })

  it('displays risk level information', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockIndicatorData
    })

    render(<IndicatorCard indicatorKey="UNRATE" />)

    await waitFor(() => {
      expect(screen.getByText('Risk Levels:')).toBeInTheDocument()
    })
  })

  it('displays impact information', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockIndicatorData
    })

    render(<IndicatorCard indicatorKey="UNRATE" />)

    await waitFor(() => {
      expect(screen.getByText('Impact:')).toBeInTheDocument()
    })

    expect(screen.getByText(/Higher unemployment correlates with increased default risk/)).toBeInTheDocument()
  })
})