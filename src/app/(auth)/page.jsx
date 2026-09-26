"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const handleAutoFill = () => {
    setEmail("admin@flame.dev")
    setPassword("flame123")
  }

  const handleSubmit = (e) => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!password.trim()) {
      newErrors.password = "Password is required."
    }

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault()
      setErrors(newErrors)
      return
    }

    setErrors({})
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-background px-4">
      <svg className="md:w-300 w-200 md:h-220 h-220 z-10 absolute bottom-0 overflow-visible right-0 -rotate-45">
        <defs>
          <linearGradient id="flame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="25%" stopColor="var(--primary)" />
            <stop offset="85%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>

        <Flame size="1400" className="size-full" stroke="url(#flame-gradient)"/>
      </svg>
      <Card className="w-full bg-background/80 z-20 max-w-sm border-border/60 shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto m-0 flex size-11 items-center justify-center rounded-xl">
            <Flame className="size-7" stroke="url(#flame-gradient)"/>
          </div>

          <span className="bg-linear-to-br m-0 from-primary from-25% to-secondary to-85% bg-clip-text text-transparent text-3xl ps-2.5 font-semibold">Flame</span>
          <div className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Flame dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@flame.dev"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((prev) => ({ ...prev, email: "" }))
                }}
              />

              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  className="pr-10"
                />

                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}

                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Link href="dashboard" onClick={handleSubmit} className="flex bg-primary items-center h-9 gap-1.5 px-3 justify-center text-primary-foreground hover:bg-primary/90 rounded-full w-full">
              Sign in
            </Link>

            <Button type="button" variant="outline" className="w-full" onClick={handleAutoFill}>
              Auto Fill
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}