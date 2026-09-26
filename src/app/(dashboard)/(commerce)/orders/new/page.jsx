"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { format } from "date-fns"
import { createOrder } from "@/data/orders"

export default function NewOrderPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    productName: "",
    status: "pending",
    amount: "",
    date: undefined,
  })

  const [errors, setErrors] = useState({})

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

    createOrder({
      ...formData,
      date: format(formData.date, "yyyy-MM-dd"),
    })

    router.push("/orders?created=true")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="./../dashboard" />}>
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
            <BreadcrumbPage>New Order</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New Order
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new customer order.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>

          <CardDescription>
            Fill in the information below to create a new order.
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
                      className: " justify-between font-normal",
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
                onClick={() => router.push("/orders")}
              >
                Cancel
              </Button>

              <Button type="submit">
                Create Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}