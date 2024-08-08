export const roundTo = (i: number, d: number) => {
  let negative = false
  let digits = d
  let n = i
  if (digits === undefined) {
    digits = 0
  }
  if (n < 0) {
    negative = true
    n *= -1
  }
  /* eslint-disable no-restricted-properties */
  const multiplicator = 10 ** digits
  /* eslint-enable no-restricted-properties */
  n = parseFloat((n * multiplicator).toFixed(11))
  n = parseFloat((Math.round(n) / multiplicator).toFixed(digits))
  if (negative) {
    return parseFloat((n * -1).toFixed(digits))
  }
  return n
}

export const calculatePercentage = (partialValue: number, totalValue: number) => (100 * partialValue) / totalValue

export const formatNumber = (n: number) => {
  const numberFormatter = Intl.NumberFormat('fi-FI')
  return numberFormatter.format(roundTo(n, 2))
}

export const getBasePath = () => {
  const p = window.location.pathname.split('/')
  return p?.length > 0 ? `${p[0]}` : ''
}

export const getAlignment = (name: string): 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined => {
  switch (name) {
    case 'Modified':
      return 'left'
    case 'Type':
      return 'center'
    default:
      return 'right'
  }
}

export const isNumeric = (str: any) => {
  if (typeof str !== 'number' || typeof str !== 'bigint') return true
  if (typeof str !== 'string') return false
  return !Number.isNaN(str) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         && !Number.isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
