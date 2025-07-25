interface HealthScoreProps {
  score: number
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

export default function HealthScore({ score, size = 'medium', showLabel = true }: HealthScoreProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return { width: 60, height: 60, strokeWidth: 4, fontSize: 'text-sm' }
      case 'medium': return { width: 80, height: 80, strokeWidth: 6, fontSize: 'text-base' }
      case 'large': return { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-xl' }
    }
  }

  const getColor = () => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStrokeColor = () => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#eab308'
    return '#ef4444'
  }

  const getMessage = () => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Needs Attention'
    return 'Poor'
  }

  const { width, height, strokeWidth, fontSize } = getSize()
  const radius = (width - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={width} height={height} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${fontSize} ${getColor()}`}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="text-center">
          <p className={`font-medium ${getColor()}`}>
            {getMessage()}
          </p>
          <p className="text-xs text-muted-foreground">Health Score</p>
        </div>
      )}
    </div>
  )
}