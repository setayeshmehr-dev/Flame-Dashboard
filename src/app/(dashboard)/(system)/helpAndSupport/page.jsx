"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  HelpCircle,
  Settings,
  User,
  Bug,
  Send,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

const faqData = {
  general: [
    {
      q: "How do I get started with Flame?",
      a: "After logging in, you can access the Dashboard to see an overview of your data. Use the sidebar to navigate between different sections like Orders, Products, and Analytics.",
    },
    {
      q: "Can I customize the dashboard appearance?",
      a: "Yes! Click the appearance icon in the header to switch between Light, Dark, and System themes. You can also choose from multiple color presets including Slate, Blue, Violet, Rose, Orange, and Red.",
    },
    {
      q: "Is Flame responsive on mobile devices?",
      a: "Absolutely. Flame is designed to work seamlessly from 360px mobile screens up to large desktop displays. The sidebar collapses on mobile and tables adapt to card layouts.",
    },
  ],
  orders: [
    {
      q: "How do I create a new order?",
      a: "Navigate to the Orders page and click the New Order button in the top right. Fill in the customer details, product information, and submit the form.",
    },
    {
      q: "What order statuses are available?",
      a: "Orders can have three statuses: Completed, Pending, or Cancelled. You can filter orders by status using the tabs on the Orders page.",
    },
    {
      q: "Can I export orders to CSV?",
      a: "Yes, the Orders page includes an Export button that downloads all filtered orders as a CSV file with complete order details.",
    },
  ],
  account: [
    {
      q: "How do I update my profile information?",
      a: "Go to the Profile page from the user dropdown in the header. You can update your name, email, and other profile details there.",
    },
    {
      q: "How do I change my password?",
      a: "Password changes can be managed from the Settings page under the Security section.",
    },
    {
      q: "Can I switch between sidebar and top navigation?",
      a: "Yes, open the Appearance panel from the header and select your preferred layout mode: Sidebar or Top Nav.",
    },
  ],
  technical: [
    {
      q: "What browsers are supported?",
      a: "Flame supports all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, Flame uses secure authentication and all data is handled with industry-standard security practices. Sensitive information is never stored in plain text.",
    },
    {
      q: "I found a bug, how do I report it?",
      a: "Use the ticket form on this page to report any bugs or technical issues. Our team will investigate and respond as soon as possible.",
    },
  ],
}

const supportCategories = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "orders", label: "Orders", icon: FileText },
  { id: "account", label: "Account", icon: User },
  { id: "technical", label: "Technical", icon: Bug },
]

export default function HelpAndSupportPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("general")
  const [openFaq, setOpenFaq] = useState(null)
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  })
  const [ticketErrors, setTicketErrors] = useState({})

  const handleTicketChange = (field, value) => {
    setTicketForm((prev) => ({ ...prev, [field]: value }))
    setTicketErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!ticketForm.name.trim()) errors.name = "Name is required."
    if (!ticketForm.email.trim()) {
      errors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketForm.email)) {
      errors.email = "Please enter a valid email address."
    }
    if (!ticketForm.subject.trim()) errors.subject = "Subject is required."
    if (!ticketForm.message.trim()) errors.message = "Message is required."

    setTicketErrors(errors)
    if (Object.keys(errors).length > 0) return

    toast.success("Ticket submitted successfully", {
      description: "We will get back to you within 24 hours.",
    })
    setTicketForm({
      name: "",
      email: "",
      subject: "",
      category: "general",
      message: "",
    })
  }

  const allFaqs = search.trim()
    ? Object.entries(faqData).flatMap(([cat, items]) =>
        items
          .filter(
            (item) =>
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => ({ ...item, category: cat }))
      )
    : []

  const currentFaqs = search.trim() ? allFaqs : faqData[activeTab] || []

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
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
            <BreadcrumbPage>Help &amp; Support</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Help &amp; Support</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find answers to common questions or get in touch with our team.
        </p>
      </div>

      {/* Search */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2  space-y-9">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpenFaq(null)
              }}
              placeholder="Search for answers..."
              className="pl-10 max-w-3xl bg-background/80"
            />
          </div>
          {search.trim() && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing results for &quot;{search}&quot; across all categories
            </p>
          )}
          {!search.trim() && (
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setOpenFaq(null) }}>
              <TabsList className="w-full justify-start overflow-x-auto">
                {supportCategories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{cat.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          )}

          <Card >
            <CardHeader className="lg:mb-5">
              <CardTitle className="text-base ">
                {search.trim() ? "Search Results" : "Frequently Asked Questions"}
              </CardTitle>
              <CardDescription>
                {search.trim()
                  ? `${currentFaqs.length} result${currentFaqs.length !== 1 ? "s" : ""} found`
                  : "Select a question to reveal the answer"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 lg;mb-5">
              {currentFaqs.length > 0 ? (
                currentFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg lg:mb-5 border border-border overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{faq.q}</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          openFaq === idx ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4">
                        <Separator className="mb-3" />
                        <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                          {faq.a}
                        </p>
                        {faq.category && (
                          <Badge variant="secondary" className="mt-3 ml-7 text-[10px] capitalize">
                            {faq.category}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try a different search term or browse by category
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              className="hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => router.push("/orders")}
            >
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-sm">Orders</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Manage orders, create new ones, and track status.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => router.push("/settings")}
            >
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-sm">Settings</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Configure appearance, notifications, and preferences.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => router.push("/profile")}
            >
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-sm">Profile</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Update your personal information and details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Contact & Ticket */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Us</CardTitle>
              <CardDescription>Reach out through any channel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground truncate">Setayeshmehr@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-xs text-muted-foreground">+989198383305</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-xs text-muted-foreground">All days / 8:00AM - 5:00PM</p> 
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submit a Ticket</CardTitle>
              <CardDescription>Describe your issue and we will help</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={ticketForm.name}
                    onChange={(e) => handleTicketChange("name", e.target.value)}
                    placeholder="Your name"
                  />
                  {ticketErrors.name && (
                    <p className="text-xs text-destructive">{ticketErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={ticketForm.email}
                    onChange={(e) => handleTicketChange("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                  {ticketErrors.email && (
                    <p className="text-xs text-destructive">{ticketErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={ticketForm.message}
                    onChange={(e) => handleTicketChange("message", e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows={4}
                  />
                  {ticketErrors.message && (
                    <p className="text-xs text-destructive">{ticketErrors.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
