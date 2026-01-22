/**
 * Format an ISO date string to a relative time string
 * Examples: "2 hours ago", "Yesterday", "2 days ago"
 */
export const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return 'Just now'
  }

  // Less than 1 hour
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }

  // Less than 24 hours
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  // Yesterday
  if (diffInDays === 1) {
    return 'Yesterday'
  }

  // Less than 7 days
  if (diffInDays < 7) {
    return `${diffInDays} days ago`
  }

  // Less than 30 days
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }

  // More than 30 days - show actual date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
  })
}

/**
 * Format a number with commas for thousands, millions, etc.
 * Preserves decimal places up to the specified maximum, but removes trailing zeros
 */
export const formatNumber = (value: string | number, maxDecimals: number = 8): string => {
  if (!value && value !== 0) return '0'
  
  // If it's a string, try to preserve the original format if it's a valid number
  if (typeof value === 'string') {
    // Remove commas if present
    const cleanValue = value.replace(/,/g, '')
    const num = parseFloat(cleanValue)
    
    if (isNaN(num)) return '0'
    
    // If the original string had a decimal point, preserve it (up to maxDecimals)
    // Otherwise, format as integer
    if (cleanValue.includes('.')) {
      const parts = cleanValue.split('.')
      const integerPart = parts[0]
      const decimalPart = parts[1] || ''
      
      // Format integer part with commas
      const formattedInteger = parseFloat(integerPart).toLocaleString('en-US')
      
      // Preserve decimal part up to maxDecimals, but remove trailing zeros
      if (decimalPart) {
        const trimmedDecimal = decimalPart.substring(0, maxDecimals).replace(/0+$/, '')
        return trimmedDecimal ? `${formattedInteger}.${trimmedDecimal}` : formattedInteger
      }
      
      return formattedInteger
    } else {
      // No decimal point in original - format as integer
      return num.toLocaleString('en-US')
    }
  }
  
  // For numbers, format normally but remove trailing zeros
  const num = value
  if (isNaN(num)) return '0'
  
  // Split into integer and decimal parts
  const parts = num.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1] || ''
  
  // Format integer part with commas
  const formattedInteger = parseFloat(integerPart).toLocaleString('en-US')
  
  // Preserve decimal part up to maxDecimals, but remove trailing zeros
  if (decimalPart) {
    const trimmedDecimal = decimalPart.substring(0, maxDecimals).replace(/0+$/, '')
    return trimmedDecimal ? `${formattedInteger}.${trimmedDecimal}` : formattedInteger
  }
  
  return formattedInteger
}

/**
 * Format a number as currency with proper decimals
 */
export const formatCurrency = (amount: string, currency: string): string => {
  const num = parseFloat(amount)
  
  // Crypto currencies - show more decimals
  if (['BTC', 'ETH'].includes(currency)) {
    return num.toFixed(8).replace(/\.?0+$/, '')
  }
  
  // Stablecoins and USDT
  if (['USDT', 'USD'].includes(currency)) {
    return num.toFixed(2)
  }
  
  // Fiat currencies like NGN
  if (currency === 'NGN') {
    return num.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }
  
  return amount
}
