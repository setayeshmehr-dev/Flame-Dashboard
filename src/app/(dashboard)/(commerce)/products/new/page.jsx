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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { createProduct } from "@/data/product"

export default function NewProductPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "active",
    stock: "",
    price: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required."
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required."
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required."
    }

    if (!formData.status) {
      newErrors.status = "Please select a status."
    }

    if (!formData.stock) {
      newErrors.stock = "Stock is required."
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative."
    }

    if (!formData.price) {
      newErrors.price = "Price is required."
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0."
    }

    if (!formData.date) {
      newErrors.date = "Date is required."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    createProduct({
      ...formData,
      createdAt: format(formData.date, "yyyy-MM-dd"),
    })

    router.push("/products?created=true")
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
            <BreadcrumbLink render={<Link href="/products" />}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New Product
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new product for your catalog.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>

          <CardDescription>
            Fill in the information below to create a new product.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name
                </Label>

                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  placeholder="Pro Dashboard License"
                />

                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>


              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Input
                  id="description"
                  value={formData.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  placeholder="Product description"
                />

                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category
                </Label>

                <Input
                  id="category"
                  value={formData.category}
                  onChange={(event) =>
                    handleChange("category", event.target.value)
                  }
                  placeholder="Templates"
                />

                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category}
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
                    <SelectItem value="active">
                      Active
                    </SelectItem>

                    <SelectItem value="draft">
                      Draft
                    </SelectItem>

                    <SelectItem value="archived">
                      Archived
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
                <Label htmlFor="stock">
                  Stock
                </Label>

                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(event) =>
                    handleChange("stock", event.target.value)
                  }
                  placeholder="100"
                />

                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price
                </Label>

                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(event) =>
                    handleChange("price", event.target.value)
                  }
                  placeholder="299"
                />

                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price}
                  </p>
                )}
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>

              <Button type="submit">
                Create Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}