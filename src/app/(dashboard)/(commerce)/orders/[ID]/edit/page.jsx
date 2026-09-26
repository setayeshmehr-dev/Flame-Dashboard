"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { getOrders, updateOrder } from "@/data/orders"
import { toast } from "sonner"

export default function EditOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.ID

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    productName: "",
    status: "pending",
    amount: "",
    date: undefined,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const orders = getOrders()
    const order = orders.find((o) => o.id === orderId)
    
    if (order) {
      setFormData({
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        productName: order.product.name,
        status: order.status,
        amount: String(order.amount),
        date: parseISO(order.date),
      })
    }
    
    setLoading(false)
  }, [orderId])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const newErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required."
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Customer email is required."
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    ) {
      newErrors.customerEmail = "Please enter a valid email address."
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Product is required."
    }

    if (!formData.status) {
      newErrors.status = "Please select a status."
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required."
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0."
    }

    if (!formData.date) {
      newErrors.date = "Date is required."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setSaving(true)

    updateOrder(orderId, {
      ...formData,
      date: format(formData.date, "yyyy-MM-dd"),
    })

    toast.success("Order updated successfully", {
      description: `${orderId} has been updated.`,
    })

    router.push(`/orders/${orderId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="./../../dashboard" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/orders" />}>
              Orders
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/orders/${orderId}`} />}>
              {orderId}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Order</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Order
        </h1>

        <p className="text-sm text-muted-foreground">
          Update the order information below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>

          <CardDescription>
            Modify the fields and save your changes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Customer Name
                </Label>

                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(event) =>
                    handleChange("customerName", event.target.value)
                  }
                  placeholder="Amirali Setayeshmehr"
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">
                  Customer Email
                </Label>

                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(event) =>
                    handleChange("customerEmail", event.target.value)
                  }
                  placeholder="Setayeshmehr@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-sm text-destructive">
                    {errors.customerEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">
                  Product
                </Label>

                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(event) =>
                    handleChange("productName", event.target.value)
                  }
                  placeholder="Product name"
                />
                {errors.productName && (
                  <p className="text-sm text-destructive">
                    {errors.productName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>

                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleChange("status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="pending">
                      Pending
                    </SelectItem>

                    <SelectItem value="completed">
                      Completed
                    </SelectItem>

                    <SelectItem value="cancelled">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">
                    {errors.status}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount
                </Label>

                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(event) =>
                    handleChange("amount", event.target.value)
                  }
                  placeholder="888"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount}
                  </p>
                )}
              </div>

             <div className=" space-y-2">
                <Label>Date</Label>

                <Popover>
                  <PopoverTrigger
                    type="button"
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-auto justify-between font-normal",
                    })}
                  >
                    {formData.date
                      ? format(formData.date, "PPP")
                      : "Select a date"}

                    <CalendarIcon className="size-4 opacity-50" />
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/orders/${orderId}`)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}