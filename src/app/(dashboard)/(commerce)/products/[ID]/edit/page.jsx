
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Loader2 } from "lucide-react"

import { getProducts, updateProduct } from "@/data/product"
import { toast } from "sonner"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.ID

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    category: "",
    price: "",
    stock: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const products = getProducts()
    const product = products.find((p) => p.id === productId)

    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        status: product.status || "active",
        category: product.category || "",
        price: String(product.price ?? ""),
        stock: String(product.stock ?? ""),
      })
    }

    setLoading(false)
  }, [productId])

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

    if (!formData.status) {
      newErrors.status = "Please select a status."
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required."
    }

    if (!formData.price) {
      newErrors.price = "Price is required."
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0."
    }

    if (formData.stock === "") {
      newErrors.stock = "Stock is required."
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setSaving(true)

    updateProduct(productId, {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    })

    toast.success("Product updated successfully", {
      description: `${formData.name} has been updated.`,
    })

    router.push(`/products/${productId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
          <div className="h-96 rounded bg-muted" />
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
            <BreadcrumbLink render={<Link href="/products" />}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/products/${productId}`} />}>
              {formData.name || productId}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Product
        </h1>

        <p className="text-sm text-muted-foreground">
          Update the product information below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>

          <CardDescription>
            Modify the fields and save your changes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
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

              {/* Category */}

              {/* Description */}
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
                  placeholder="Full-featured admin dashboard template with all components and pages."
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
              
              {/* Status */}
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

                    <SelectItem value="inactive">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>

                {errors.status && (
                  <p className="text-sm text-destructive">
                    {errors.status}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price
                </Label>

                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
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

              {/* Stock */}
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
                  placeholder="999"
                />

                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/products/${productId}`)
                }
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

