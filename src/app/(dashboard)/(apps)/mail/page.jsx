"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Rocket, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="p-6 flex flex-col min-h-[calc(100vh-64px)]">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="dashboard" />}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Coming Soon</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md border-dashed">
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            {/* Animated Icon */}
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="h-10 w-10 text-primary" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Coming Soon</h1>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                This feature is currently under development. We are working hard to bring it to you as soon as possible.
              </p>
            </div>

            {/* Info Badges */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <Clock className="h-3.5 w-3.5" />
                In Progress
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <Mail className="h-3.5 w-3.5" />
                Updates via email
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Go Back
              </Button>
              <Button >
                <Link href="dashboard">Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
