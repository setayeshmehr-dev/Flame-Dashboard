"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Columns3, Download, MoreHorizontal, Plus, Search, Trash2, ChevronLeft, ChevronRight, Package } from "lucide-react"

import { getProducts } from "@/data/product"

import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const columns = [
  { id: "product", label: "Product" },
  { id: "category", label: "Category" },
  { id: "status", label: "Status" },
  { id: "stock", label: "Stock" },
  { id: "price", label: "Price" },
  { id: "created", label: "Created" },
]

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedProducts, setSelectedProducts] = useState(new Set())

  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    category: true,
    status: true,
    stock: true,
    price: true,
    created: true,
  })

  const filteredProducts = products.filter((product) => {
    const matchesStatus = status === "all" || product.status === status
    const searchValue = search.toLowerCase()

    const matchesSearch =
      product.id.toLowerCase().includes(searchValue) ||
      product.name.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue)

    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage)

  const pageProductIds = paginatedProducts.map((product) => product.id)
  const selectedOnPage = pageProductIds.filter((id) => selectedProducts.has(id))
  const allSelected = pageProductIds.length > 0 && selectedOnPage.length === pageProductIds.length
  const someSelected = selectedOnPage.length > 0 && !allSelected

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const toggleProduct = (id) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  const togglePageProducts = () => {
    setSelectedProducts((prev) => {
      const next = new Set(prev)

      if (allSelected) {
        pageProductIds.forEach((id) => next.delete(id))
      } else {
        pageProductIds.forEach((id) => next.add(id))
      }

      return next
    })
  }

  const clearSelection = () => {
    setSelectedProducts(new Set())
  }

  const deleteProduct = (id) => {
    setProducts((prev) => {
      const updatedProducts = prev.filter((product) => product.id !== id)
      return updatedProducts
    })

    setSelectedProducts((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const deleteSelected = () => {
    setProducts((prev) => {
      const updatedProducts = prev.filter((product) => !selectedProducts.has(product.id))
      return updatedProducts
    })

    setSelectedProducts(new Set())

    if (currentPage > 1 && startIndex >= filteredProducts.length - selectedProducts.size) {
      setCurrentPage((page) => Math.max(1, page - 1))
    }
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("all")
    setCurrentPage(1)
  }

  const handleExport = () => {
    const headers = ["Product", "Description", "Category", "Status", "Stock", "Price", "Created"]

    const rows = filteredProducts.map((product) => [
      product.name,
      product.description,
      product.category,
      product.status,
      product.stock,
      `${product.price} ${product.currency}`,
      product.createdAt,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "products.csv"
    link.click()

    URL.revokeObjectURL(url)
  }

  const statusClass = {
    active: "bg-green-500/15 text-green-600 dark:text-green-400",
    draft: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    archived: "bg-red-500/15 text-red-600 dark:text-red-400",
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("created") === "true") {
      toast.success("Product created successfully", {
        description: "The new product has been added to the products list.",
        duration: 5000,
      })

      window.history.replaceState({}, "", "/products")
    }
  }, [])

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages]

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-0">

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="dashboard" />}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Products
          </h1>

          <p className="text-sm text-muted-foreground">
            Browse and manage your product catalog.
          </p>
        </div>

        <Button onClick={() => router.push("/products/new")} className="w-auto">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={status}
        onValueChange={(value) => {
          setStatus(value)
          setCurrentPage(1)
          clearSelection()
        }}
      >
        <TabsList className="">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Toolbar */}
      <div className="flex gap-3 items-center justify-between">
        {selectedProducts.size > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">
              {selectedProducts.size} selected
            </span>

            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
            >
              <Trash2 className="size-4" />

              <span className="hidden sm:inline">
                Delete ({selectedProducts.size})
              </span>

              <span className="sm:hidden">
                Delete
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="hover:bg-secondary hover:text-black"
            >
              Clear
            </Button>
          </div>
        ) : (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-2 sm:px-3"
                >
                  <Columns3 className="size-4" />

                  <span className="sr-only sm:not-sr-only sm:ml-2">
                    Columns
                  </span>
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-48">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns[column.id]}
                  onCheckedChange={() => toggleColumn(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleExport}
          >
            <Download className="size-4" />

            <span className="hidden sm:inline ml-2">
              Export
            </span>
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>

                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      allSelected
                        ? true
                        : someSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={togglePageProducts}
                    aria-label="Select all products"
                  />
                </TableHead>

                {visibleColumns.product && (
                  <TableHead>Product</TableHead>
                )}

                {visibleColumns.category && (
                  <TableHead>Category</TableHead>
                )}

                {visibleColumns.status && (
                  <TableHead>Status</TableHead>
                )}

                {visibleColumns.stock && (
                  <TableHead>Stock</TableHead>
                )}

                {visibleColumns.price && (
                  <TableHead>Price</TableHead>
                )}

                {visibleColumns.created && (
                  <TableHead>Created</TableHead>
                )}

                <TableHead className="w-12" />

              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                        aria-label={`Select ${product.id}`}
                      />
                    </TableCell>

                    {visibleColumns.product && (
                      <TableCell className="flex items-center gap-3">
                        <Package />
                        <div className="min-w-0">
                          <p className="font-medium">
                            {product.name}
                          </p>

                          <p className="text-xs text-muted-foreground max-w-md truncate">
                            {product.description}
                          </p>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.category && (
                      <TableCell>
                        {product.category}
                      </TableCell>
                    )}

                    {visibleColumns.status && (
                      <TableCell>
                        <Badge
                          className={`w-auto p-2 capitalize ${statusClass[product.status]}`}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.stock && (
                      <TableCell>
                        {product.stock}
                      </TableCell>
                    )}

                    {visibleColumns.price && (
                      <TableCell className="font-medium">
                        ${product.price.toLocaleString()}
                      </TableCell>
                    )}

                    {visibleColumns.created && (
                      <TableCell>
                        {product.createdAt}
                      </TableCell>
                    )}

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/products/${product.id}`)
                            }
                          >
                            View Product
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/products/${product.id}/edit`)
                            }
                          >
                            Edit Product
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-600 focus:bg-red-500/10 focus:text-red-600"
                          >
                            <Trash2
                              className="size-4 mr-2"
                              style={{ stroke: "#dc2626" }}
                            />

                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      Object.values(visibleColumns).filter(Boolean).length + 2
                    }
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="font-medium">
                        No products found
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filter.
                      </p>

                      {(search || status !== "all") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards — Columns کاملاً فعال */}
      <div className="md:hidden space-y-3">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <div
              onClick={() => router.push(`/products/${product.id}`)}
              key={product.id}
              className="rounded-xl border cursor-pointer hover:bg-muted/80 border-border bg-card p-4 space-y-3"
            >

              {/* Top: Checkbox + Product + Status + Actions */}
              <div className="flex items-center justify-between gap-3">

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3 min-w-0"
                >
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                    aria-label={`Select ${product.id}`}
                  />

                  {visibleColumns.product && (
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 shrink-0"
                >
                  {visibleColumns.status && (
                    <Badge
                      className={`capitalize rounded-2xl w-18 h-6 text-xs ${statusClass[product.status]}`}
                    >
                      {product.status}
                    </Badge>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/products/${product.id}`)
                        }
                      >
                        View Product
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/products/${product.id}/edit`)
                        }
                      >
                        Edit Product
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 cursor-pointer hover:text-red-600 focus:bg-red-500/10 focus:text-red-600"
                      >
                        <Trash2
                          className="size-4 mr-2"
                          style={{ stroke: "#dc2626" }}
                        />

                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>

              {/* Description */}
              {visibleColumns.product && (
                <div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">

                {visibleColumns.category && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Category
                    </p>

                    <p className="text-sm truncate mt-0.5">
                      {product.category}
                    </p>
                  </div>
                )}

                {visibleColumns.stock && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Stock
                    </p>

                    <p className="text-sm mt-0.5">
                      {product.stock}
                    </p>
                  </div>
                )}

                {visibleColumns.created && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Created
                    </p>

                    <p className="text-sm mt-0.5">
                      {product.createdAt}
                    </p>
                  </div>
                )}

                {visibleColumns.price && (
                  <div className="col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Price
                    </p>

                    <p className="text-base font-semibold mt-0.5">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                )}

              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">
              No products found
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Try changing your search or filter.
            </p>

            {(search || status !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-border bg-card rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Showing {filteredProducts.length ? startIndex + 1 : 0}-
          {Math.min(
            startIndex + rowsPerPage,
            filteredProducts.length
          )}{" "}
          of {filteredProducts.length} results
        </p>

        <div className="flex items-center justify-between gap-3 sm:justify-end">

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Rows
            </span>

            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value))
                setCurrentPage(1)
                clearSelection()
              }}
              className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center gap-1">

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((page) => page - 1)
                clearSelection()
              }}
            >
              Previous
            </Button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={idx}
                  className="px-2 text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentPage(page)
                    clearSelection()
                  }}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => {
                setCurrentPage((page) => page + 1)
                clearSelection()
              }}
            >
              Next
            </Button>

          </div>

          {/* Mobile Pagination */}
          <div className="flex sm:hidden items-center gap-2">

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((page) => page - 1)
                clearSelection()
              }}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <span className="text-sm font-medium min-w-12 text-center">
              {currentPage} / {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => {
                setCurrentPage((page) => page + 1)
                clearSelection()
              }}
            >
              <ChevronRight className="size-4" />
            </Button>

          </div>

        </div>
      </div>

    </div>
  )
}