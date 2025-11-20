import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/help')({
  component: HelpPage,
})

function HelpPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Help & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get help and support
        </p>
      </div>
    </div>
  )
}
