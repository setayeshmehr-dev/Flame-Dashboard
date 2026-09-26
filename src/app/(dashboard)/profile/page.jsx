"use client"

import Link from "next/link"
import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  Pencil,
  Save,
  X,
  Clock,
  Package,
  Settings,
  LogOut,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"

const userData = {
  name: "Amirali Setayeshmehr",
  role: "Admin",
  email: "Setayeshmehr@flame.com",
  phone: "+98 9198383305",
  location: "Iran, Tehran",
  bio: "I'm a passionate frontend developer with a strong attention to detail, focused on building responsive and user-friendly web applications. With expertise in modern JavaScript technologies like React, I transform ideas into functional, engaging, and seamless digital experiences.",
  department: "Engineering",
  language: "English, Persian",
  initials: "AS",
}

const activityLog = [
  { action: "Updated order ORD-7891", time: "2 hours ago", icon: Package },
  { action: "Changed theme to Dark", time: "5 hours ago", icon: Settings },
  { action: "Created new order ORD-8012", time: "Yesterday", icon: Package },
  { action: "Exported orders CSV", time: "2 days ago", icon: Briefcase },
  { action: "Updated profile information", time: "3 days ago", icon: User },
  { action: "Logged in from new device", time: "1 week ago", icon: Shield },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ ...userData })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSave = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Name is required."
    if (!form.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsEditing(false)
    toast.success("Profile updated successfully")
  }

  const handleCancel = () => {
    setForm({ ...userData })
    setErrors({})
    setIsEditing(false)
  }

  const joinedDate = new Date(userData.joined).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="dashboard" />}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Profile Header */}
      <Card className="relative p-0! overflow-hidden">
        <div className="h-32 bg-linear-to-br from-primary to-secondary from-25%  to-85%" />
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-card bg-linear-to-br from-primary to-secondary from-25%  to-85% flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userData.initials}
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">{userData.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="w-auto p-2 text-black capitalize">
                  {userData.role}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {userData.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Link href="settings" className="group/button inline-flex shrink-0 items-center justify-center rounded-4xl border  border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"  >
                  <Pencil className="h-4 w-4 mr-1.5" />
                  Edit Profile
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Full Name</p>
                    <p className="text-sm font-medium truncate">{userData.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email</p>
                    <p className="text-sm font-medium truncate">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Phone</p>
                    <p className="text-sm font-medium">{userData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Location</p>
                    <p className="text-sm font-medium">{userData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Department</p>
                    <p className="text-sm font-medium">{userData.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Role</p>
                    <p className="text-sm font-medium">{userData.role}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Bio</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{userData.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}