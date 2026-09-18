'use client'

import { useState } from 'react'
import { login } from './actions'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden selection:bg-brand-primary/20">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 dark:bg-brand-primary/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/10 dark:bg-brand-secondary/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] dark:opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6 animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
        
        {/* KICKS Branding */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-14 w-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-md ring-1 ring-border/10">
            <span className="font-black text-2xl tracking-tighter">K</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Sign in to the KICKS operations panel
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-card/80 dark:bg-card/40 backdrop-blur-2xl border border-border/50 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-brand-primary/5 dark:shadow-black/40 relative overflow-hidden">
          {/* Subtle inner highlight for 3D effect */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 dark:ring-white/5 pointer-events-none" />
          
          <form action={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-foreground/80 pl-1">
                Email Address
              </label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email"
                required
                className="h-12 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-brand-primary rounded-xl px-4 text-[15px] transition-all" 
                placeholder="name@kicks.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1">
                <label htmlFor="password" className="text-[13px] font-medium text-foreground/80">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  required
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-brand-primary rounded-xl px-4 pr-12 text-[15px] transition-all" 
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p className="text-[13px] text-rose-600 dark:text-rose-400 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className={cn(
                "w-full h-12 rounded-xl text-[15px] font-medium transition-all group relative overflow-hidden",
                "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md shadow-brand-primary/20",
                isLoading && "opacity-90 cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60 font-medium">
            Protected by KICKS Secure Operations
          </p>
        </div>

      </div>
    </div>
  )
}
