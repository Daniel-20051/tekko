import { useState } from 'react'
import { getCryptoIconConfig } from '../../utils/crypto-icons'

interface CryptoImageProps {
  symbol: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showFallback?: boolean
  className?: string
}

const CryptoImage = ({ 
  symbol, 
  imageUrl, 
  size = 'md', 
  showFallback = true,
  className = ''
}: CryptoImageProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }

  const fallbackSizeMap = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }

  const iconConfig = getCryptoIconConfig(symbol)
  const Icon = iconConfig.icon

  // If we have a valid image URL, try to display it
  if (imageUrl && !imageError) {
    return (
      <>
        <img
          src={imageUrl}
          alt={symbol}
          className={`${sizeMap[size]} rounded-full object-cover ${className} ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Show fallback while image is loading */}
        {!imageLoaded && (
          <div className={`absolute ${sizeMap[size]} ${iconConfig.iconBg} rounded-full flex items-center justify-center`}>
            <Icon className={`${fallbackSizeMap[size]} ${iconConfig.iconColor}`} />
          </div>
        )}
      </>
    )
  }

  // Show icon fallback
  if (showFallback) {
    return (
      <div className={`${sizeMap[size]} ${iconConfig.iconBg} rounded-full flex items-center justify-center ${className}`}>
        <Icon className={`${fallbackSizeMap[size]} ${iconConfig.iconColor}`} />
      </div>
    )
  }

  // Return null if no fallback requested
  return null
}

export default CryptoImage
