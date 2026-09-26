"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Copy,
  Package,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { getProducts, deleteProduct } from "@/data/product";
import { toast } from "sonner";

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function getStatusConfig(status) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
      };

    case "inactive":
      return {
        label: "Inactive",
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
      };

    default:
      return {
        label: status || "-",
        icon: Package,
        color: "text-muted-foreground",
        bg: "bg-muted",
        border: "border-border",
      };
  }
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = getProducts();

    const found = products.find((p) => p.id === params.ID);

    if (found) {
      setProduct(found);
    }

    setLoading(false);
  }, [params.ID]);

  const handleCopyId = () => {
    if (product?.id) {
      navigator.clipboard.writeText(product.id);
      toast.success("Product ID copied to clipboard");
    }
  };

  const handleDelete = () => {
    if (!product) return;

    deleteProduct(product.id);

    toast.success("Product deleted successfully");

    router.push("/products");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />

          <h2 className="mb-2 text-xl font-semibold">
            Product Not Found
          </h2>

          <p className="mb-6 text-muted-foreground">
            The product you are looking for does not exist.
          </p>

          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="./../dashboard"
          className="transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>

        <span>/</span>

        <Link
          href="/products"
          className="transition-colors hover:text-foreground"
        >
          Products
        </Link>

        <span>/</span>

        <span className="text-foreground">
          {product.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              {product.name}

              <button
                type="button"
                onClick={handleCopyId}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Copy Product ID"
              >
                <Copy className="h-4 w-4" />
              </button>
            </h1>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Created on {formatDate(product.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/products/${product.id}/edit`)
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Product Image / Icon */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-10 w-10 text-primary" />
              </div>

              <div className="min-w-0">
                <h3 className="font-medium">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
            </div>

            <Separator />

            {/* Name */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Name
              </p>

              <p className="text-sm font-medium">
                {product.name}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>

              <p className="text-sm leading-6">
                {product.description}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Category
              </p>

              <p className="text-sm">
                {product.category}
              </p>
            </div>

            {/* Created */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>

              <p className="text-sm">
                {formatDate(product.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Price */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Price
              </p>

              <p className="text-2xl font-semibold">
                {formatCurrency(product.price)}
              </p>
            </div>

            <Separator />

            {/* Stock */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Stock
              </p>

              <p className="text-2xl font-semibold">
                {product.stock}
              </p>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>

              <Badge variant="outline" className={` px-8 py-2 ${product.status === "active" ? "border-emerald-200 bg-emerald-500/10 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400" : "border-red-200 bg-red-500/10 text-red-600 dark:border-red-800 dark:text-red-400"}`}>
                {statusConfig.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}