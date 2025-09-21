# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Economic Risk Dashboard is a Next.js 14 application that monitors economic indicators from FRED API to help banking teams track credit risk. The application fetches real-time economic data and provides risk assessment dashboards for lending decisions.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Core Structure
- **Next.js App Router**: Uses the modern App Router pattern (`src/app/`)
- **API Routes**: Server-side API endpoints for FRED data fetching (`src/app/api/`)
- **Component Architecture**: Reusable React components in `src/components/`
- **FRED Client**: Custom API client for Federal Reserve Economic Data (`src/lib/fred.ts`)

### Key Files
- `src/lib/fred.ts`: FRED API client with TypeScript interfaces, economic indicators configuration, and risk calculation logic
- `src/app/api/indicators/route.ts`: Main API endpoint that fetches all economic indicators
- `src/app/api/indicators/[id]/route.ts`: Individual indicator API endpoint
- `src/components/Dashboard.tsx`: Main dashboard component with indicator grid
- `src/components/IndicatorCard.tsx`: Individual economic indicator display
- `src/components/RiskAlert.tsx`: Risk level alert component

### Data Flow
1. Dashboard components make client-side API calls to Next.js API routes
2. API routes use the FRED client (server-side only) to fetch data from FRED API
3. Risk levels are calculated based on configurable thresholds in `ECONOMIC_INDICATORS`
4. Components display real-time data with color-coded risk indicators

### Economic Indicators
The application tracks five key indicators defined in `ECONOMIC_INDICATORS`:
- **UNRATE**: Unemployment Rate (higher = worse risk)
- **CPIAUCSL**: Consumer Price Index/Inflation (higher = worse risk)
- **GDP**: Gross Domestic Product Growth (lower = worse risk)
- **DFF**: Federal Funds Rate (higher = worse risk)
- **UMCSENT**: Consumer Sentiment (lower = worse risk)

### Risk Calculation
Risk levels are calculated in `calculateRiskLevel()` function with three states:
- **normal**: Green indicator, acceptable risk levels
- **warning**: Yellow indicator, elevated risk requiring caution
- **critical**: Red indicator, high risk requiring policy adjustments

### Environment Setup
Requires `NEXT_PUBLIC_FRED_API_KEY` in `.env.local` for FRED API access. Get a free key at https://fred.stlouisfed.org/docs/api/fred/

### Security Pattern
- FRED API key is only used server-side in API routes
- Client components make requests to internal Next.js API routes
- No direct FRED API calls from the browser