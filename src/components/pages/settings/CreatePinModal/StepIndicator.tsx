interface StepIndicatorProps {
  currentStep: 'create' | 'confirm' | 'otp'
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
        currentStep === 'create' 
          ? 'bg-primary text-white' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}>
        1
      </div>
      <div className={`w-12 h-0.5 transition-colors ${
        currentStep === 'confirm' || currentStep === 'otp'
          ? 'bg-primary' 
          : 'bg-gray-200 dark:bg-gray-700'
      }`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
        currentStep === 'confirm' 
          ? 'bg-primary text-white' 
          : currentStep === 'otp'
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}>
        2
      </div>
      <div className={`w-12 h-0.5 transition-colors ${
        currentStep === 'otp'
          ? 'bg-primary' 
          : 'bg-gray-200 dark:bg-gray-700'
      }`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
        currentStep === 'otp' 
          ? 'bg-primary text-white' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}>
        3
      </div>
    </div>
  )
}

export default StepIndicator

