import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import ThemeToggle from '../components/ui/ThemeToggle'
import { BackgroundBeams } from '../components/ui/BackgroundBeams'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col transition-colors overflow-hidden">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-30 dark:opacity-50" />
      {/* Header */}
      <header className="relative z-50 w-full  ">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <Link to="/" className="flex items-center">
              {/* Light mode logo */}
              <img 
                src="/Tekko-logo/cover.png" 
                className="h-10 dark:hidden" 
                alt="TEKKO Logo" 
              />
              {/* Dark mode logo - white monochrome SVG */}
              <img 
                src="/Tekko-logo/vector/default-monochrome-white.svg" 
                className="h-10 hidden dark:block" 
                alt="TEKKO Logo" 
              />
            </Link>

            {/* Navigation - Right Side */}
            <div className="flex items-center gap-6">
              {/* Login Link */}
              <a
                href="/login"
                className="text-sm text-black dark:text-dark-text hover:text-gray-300 transition-colors font-medium"
              >
                Login
              </a>
             

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-black dark:text-dark-text font-medium">English</span>
              </div>

               {/* Theme Toggle */}
               <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Auth pages get this simple centered layout */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative z-10 w-full max-w-4xl px-5">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full ">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TEKKO. All Rights Reserved.
            </p>
            
            {/* Policy Links */}
            <div className="flex items-center gap-6">
              <a 
                href="/aml-kyc-policy" 
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                AML & KYC Policy
              </a>
              <a 
                href="/terms-conditions" 
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Terms & Conditions
              </a>
              <a 
                href="/privacy-policy" 
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
