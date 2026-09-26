"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  User,
  Save,
  X,
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelTop,
  Palette,
  Settings2,
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

/* ─── Reuse existing appearance components ─── */
import AppearanceItem from "@/components/layout/appearanceItem"
import AppearanceColorItem from "@/components/layout/appearanceColorItem"

/* ─── Mock user data (same as Profile) ─── */
const userData = {
  name: "Amirali Setayeshmehr",
  role: "Admin",
  email: "Setayeshmehr@flame.com",
  phone: "+98 9198383305",
  location: "Iran, Tehran",
  bio: "I'm a passionate frontend developer with a strong attention to detail, focused on building responsive and user-friendly web applications.",
  department: "Engineering",
  initials: "AS",
}

/* ─── Color presets ─── */
const colorPresets = [
  { id: "slate",  label: "Slate",  color: "#6a727e" },
  { id: "blue",   label: "Blue",   color: "#0079d3" },
  { id: "violet", label: "Violet", color: "#615cdc" },
  { id: "rose",   label: "Rose",   color: "#bb3181" },
  { id: "orange", label: "Orange", color: "oklch(71.867% 0.19168 49.367)" },
  { id: "red",    label: "Red",    color: "#ae0000" },
]

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [color, setColor] = useState("red")
  const [layoutMode, setLayoutMode] = useState("sidebar")

  useEffect(() => {
    const savedColor = localStorage.getItem("colorPreset") || "red"
    const savedLayout = localStorage.getItem("layoutMode") || "sidebar"

    setColor(savedColor)
    setLayoutMode(savedLayout)
    document.documentElement.dataset.colorPreset = savedColor
  }, [])

  /* ─── Profile form state ─── */
  const [activeTab, setActiveTab] = useState("profile")
  const [form, setForm] = useState({ ...userData })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSaveProfile = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Name is required."
    if (!form.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    toast.success("Profile updated successfully")
  }

  const handleCancelProfile = () => {
    setForm({ ...userData })
    setErrors({})
  }

   const changeColor = (value) => {
    setColor(value)
    localStorage.setItem("colorPreset", value)
    document.documentElement.dataset.colorPreset = value
    window.dispatchEvent(new Event("preferencesChange"))
  }

  const changeLayout = (value) => {
    setLayoutMode(value)
    localStorage.setItem("layoutMode", value)
    window.dispatchEvent(new Event("preferencesChange"))
  }

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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile and personalize your dashboard experience.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ───────── Edit Profile Tab ───────── */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your profile details. These will be displayed across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
              <div className="space-y-2 min-w-0">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  className="min-w-0"
                />
                {errors.name && (
                  <p className="text-xs text-destructive wrap-break-word">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0"
                />
                {errors.email && (
                  <p className="text-xs text-destructive wrap-break-word">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 234 567 890"
                  className="min-w-0"
                />
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, Country"
                  className="min-w-0"
                />
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={form.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="Department"
                  className="min-w-0"
                />
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder="Role"
                  className="min-w-0"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 min-w-0">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="min-w-0 resize-y"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t mt-6 pt-6">
              <Button variant="outline" onClick={handleCancelProfile} className="flex-1 sm:flex-none">
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1 sm:flex-none">
                <Save className="h-4 w-4 mr-1.5" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ───────── Appearance Tab ───────── */}
      {activeTab === "appearance" && (
        <div className=" gap-6">
          <div className=" space-y-6">
            {/* Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun className="h-4 w-4 text-primary" />
                  Theme
                </CardTitle>
                <CardDescription>
                  Choose between light, dark, or system preference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <AppearanceItem
                    active={theme === "light"}
                    onClick={() => setTheme("light")}
                    icon={Sun}
                    label="Light"
                  />
                  <AppearanceItem
                    active={theme === "dark"}
                    onClick={() => setTheme("dark")}
                    icon={Moon}
                    label="Dark"
                  />
                  <AppearanceItem
                    active={theme === "system"}
                    onClick={() => setTheme("system")}
                    icon={Monitor}
                    label="System"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Color */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Color Preset
                </CardTitle>
                <CardDescription>
                  Select a primary color for your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 *:w-[47%] ">
                  {colorPresets.map((preset) => (
                    <AppearanceColorItem
                      key={preset.id}
                      active={color === preset.id}
                      onClick={() => changeColor(preset.id)}
                      color={preset.color}
                      label={preset.label}
                      
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Layout — hidden on mobile */}
            <Card className="hidden md:block">
              <CardHeader className="mb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" />
                  Layout
                </CardTitle>
                <CardDescription>
                  Choose your preferred navigation layout.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  <AppearanceItem
                    active={layoutMode === "sidebar"}
                    onClick={() => changeLayout("sidebar")}
                    icon={PanelLeft}
                    label="Sidebar"
                  />
                  <AppearanceItem
                    active={layoutMode === "topnav"}
                    onClick={() => changeLayout("topnav")}
                    icon={PanelTop}
                    label="Top Nav"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}