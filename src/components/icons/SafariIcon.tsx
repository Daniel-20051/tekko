interface SafariIconProps {
  className?: string
}

const SafariIcon = ({ className }: SafariIconProps) => (
  <div className={className}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      {/* Blue compass circle with gradient */}
      <defs>
        <linearGradient id="safariBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#357ABD" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#safariBlue)" />
      
      {/* White tick marks around the circumference */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 - 90) * (Math.PI / 180)
        const x1 = 12 + 9 * Math.cos(angle)
        const y1 = 12 + 9 * Math.sin(angle)
        const x2 = 12 + (i % 3 === 0 ? 7.5 : 8.5) * Math.cos(angle)
        const y2 = 12 + (i % 3 === 0 ? 7.5 : 8.5) * Math.sin(angle)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.8" />
        )
      })}
      
      {/* Compass needle - red upper right, white lower left */}
      <path d="M12 12 L18 6" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 12 L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="white" />
    </svg>
  </div>
)

export default SafariIcon
