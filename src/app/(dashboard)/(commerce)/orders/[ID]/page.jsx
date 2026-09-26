"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Mail,
  MoreHorizontal,
  Package,
  Pencil,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrders, deleteOrder } from "@/data/orders";
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
    currency: currency,
  }).format(amount);
}

function getStatusConfig(status) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
        badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0",
      };
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        badge: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-0",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
        badge: "bg-red-500/15 text-red-600 dark:text-red-400 border-0",
      };
    default:
      return {
        label: status,
        icon: Clock,
        color: "text-muted-foreground",
        bg: "bg-muted",
        border: "border-border",
        badge: "bg-muted text-muted-foreground border-0",
      };
  }
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orders = getOrders();
    const found = orders.find((o) => o.id === params.ID);
    if (found) {
      setOrder(found);
    }
    setLoading(false);
  }, [params.ID]);

  const handleCopyId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      toast.success("Order ID copied to clipboard");
    }
  };

    const handleDelete = () => {
      if (!order) return;
      deleteOrder(order.id);
      toast.success("Order deleted successfully");
      router.push("/orders");
    };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The order you are looking for does not exist.
          </p>
          <Button asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="../dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/orders"
          className="hover:text-foreground transition-colors"
        >
          Orders
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{order.id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              {order.id}
              <button
                onClick={handleCopyId}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy order ID"
              >
                <Copy className="h-4 w-4" />
              </button>
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Placed on {formatDate(order.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/orders/${order.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-lg border p-4 flex items-center gap-3 ${statusConfig.bg} ${statusConfig.border}`}
      >
        <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
        <div>
          <p className={`font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.status === "completed"
              ? "This order has been completed and delivered."
              : order.status === "pending"
              ? "This order is awaiting processing."
              : "This order has been cancelled."}
          </p>
        </div>
      </div>

      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Order Details
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Core order information
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Order ID
              </p>
              <p className="text-sm font-semibold">{order.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Date
              </p>
              <p className="text-sm font-medium">{formatDate(order.date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Amount
              </p>
              <p className="text-sm font-semibold">
                {formatCurrency(order.amount, order.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Customer
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customer information
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {order.customer?.initials ||
                  order.customer?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") ||
                  "?"}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {order.customer?.name || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">Customer</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">
                {order.customer?.email || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Product */}
        <Card>
          <CardHeader >
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Product
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Purchased product details
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Name
              </p>
              <p className="text-sm font-medium">
                {order.product?.name || "Unknown Product"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Price
              </p>
              <p className="text-sm font-semibold">
                {formatCurrency(order.amount, order.currency)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}