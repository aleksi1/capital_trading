/* eslint-disable @typescript-eslint/no-use-before-define */
interface TurboWarrantParams {
    underlyingPrice: number;
    strikePrice: number;
    knockOutBarrier: number;
    riskFreeRate: number;
    financingRate: number;
    volatility: number;
    ratio: number;
  }

function calculateUnlimitedTurboCallPrice({
  underlyingPrice,
  strikePrice,
  knockOutBarrier,
  riskFreeRate,
  financingRate,
  volatility,
  ratio,
}: TurboWarrantParams): number {
  // Ensure the warrant is not knocked out
  if (underlyingPrice <= knockOutBarrier) {
    return 0
  }

  // Calculate intrinsic value
  const intrinsicValue: number = Math.max(0, underlyingPrice - strikePrice)

  // Calculate financing costs (assuming continuous compounding)
  const financingCost: number = strikePrice * (Math.exp(financingRate) - 1)

  // Calculate the gap risk premium
  const gapRiskPremium: number = calculateGapRiskPremium({
    underlyingPrice,
    knockOutBarrier,
    riskFreeRate,
    volatility,
  })

  // Calculate the final price
  const turboCallPrice: number = (intrinsicValue - financingCost - gapRiskPremium) / ratio

  return Math.max(0, turboCallPrice)
}

  interface GapRiskParams {
    underlyingPrice: number;
    knockOutBarrier: number;
    riskFreeRate: number;
    volatility: number;
  }

function standardNormalCDF(x: number): number {
  const t: number = 1 / (1 + 0.2316419 * Math.abs(x))
  const d: number = 0.3989423 * Math.exp((-x * x) / 2)
  let prob: number = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  if (x > 0) {
    prob = 1 - prob
  }
  return prob
}

function calculateGapRiskPremium({
  underlyingPrice,
  knockOutBarrier,
  riskFreeRate,
  volatility,
}: GapRiskParams): number {
  const d1: number = (Math.log(underlyingPrice / knockOutBarrier)
        + (riskFreeRate + volatility ** 2 / 2))
      / (volatility * Math.sqrt(1))

  const Nd1: number = standardNormalCDF(d1)

  return knockOutBarrier * (1 - Nd1)
}

// Example usage
const price: number = calculateUnlimitedTurboCallPrice({
  underlyingPrice: 100, // underlying price
  strikePrice: 90, // strike price
  knockOutBarrier: 85, // knock-out barrier
  riskFreeRate: 0.02, // risk-free rate (2%)
  financingRate: 0.03, // financing rate (3%)
  volatility: 0.2, // volatility (20%)
  ratio: 1, // ratio
})

console.log('Unlimited Turbo Call Warrant Price:', price)

interface PricePoint {
  underlyingPrice: number;
  warrantPrice: number;
}

export const calculatePriceTable = (
  centerPrice: number,
  stepSize: number,
  warrantParams: Omit<TurboWarrantParams, 'underlyingPrice'>,
): PricePoint[] => {
  const priceTable: PricePoint[] = []
  const numSteps = 100

  for (let i = -numSteps; i <= numSteps; i + 1) {
    const underlyingPrice = centerPrice + i * stepSize
    const warrantPrice = calculateUnlimitedTurboCallPrice({
      ...warrantParams,
      underlyingPrice,
    })

    priceTable.push({
      underlyingPrice,
      warrantPrice,
    })
  }

  return priceTable
}

export const isValidNumber = (str: string) => {
  // Check if the string matches the pattern of numbers and at most one dot
  if (!/^[0-9.]+$/.test(str)) {
    return false
  }

  // Count the number of dots
  const dotCount = (str.match(/\./g) || []).length

  // Return true if there's at most one dot
  return dotCount <= 1
}
