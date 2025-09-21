# FinTechCo Economic Risk Dashboard

A Next.js application that monitors economic indicators from FRED API to help banking teams track credit risk.

## Features

- Monitor unemployment, inflation, and GDP growth in real-time
- Alert when economic conditions suggest increased credit risk
- Help adjust lending criteria based on economic data

## Setup

```bash
# Clone the repository
git clone https://github.com/yourorg/economic-risk-dashboard.git
cd economic-risk-dashboard

# Install dependencies
npm install

# Add your FRED API key to .env.local
echo "NEXT_PUBLIC_FRED_API_KEY=your_api_key_here" > .env.local

# Run the development server
npm run dev
```

Get your free FRED API key at: https://fred.stlouisfed.org/docs/api/fred/

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- FRED API

## Project Structure

```
economic-risk-dashboard/
├── app/
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # App layout
│   └── api/
│       └── indicators/    # API routes for FRED data
├── components/
│   ├── Dashboard.tsx      # Dashboard component
│   ├── IndicatorCard.tsx  # Individual indicator display
│   └── RiskAlert.tsx      # Alert component
├── lib/
│   └── fred.ts           # FRED API client
├── public/
├── .env.local.example
├── package.json
└── README.md
```

## Key Indicators

The dashboard tracks these FRED indicators:

- **UNRATE**: Unemployment Rate
- **CPIAUCSL**: Consumer Price Index (Inflation)
- **GDP**: Gross Domestic Product Growth
- **DFF**: Federal Funds Rate
- **UMCSENT**: Consumer Sentiment

## Deployment

Deploy to Vercel (recommended for Next.js):

```bash
npx vercel
```

Or build for production:

```bash
npm run build
npm start
```

## Development

```bash
# Development server
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## License

MIT