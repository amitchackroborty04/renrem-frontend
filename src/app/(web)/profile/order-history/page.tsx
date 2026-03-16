"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// ────────────────────────────────────────────────
// Types
interface PaymentItem {
  product:
    | string
    | {
        _id: string;
        name: string;
      };
  qty: number;
  size: string;
  price: number;
  _id: string;
}

interface Payment {
  _id: string;
  user?:
    | string
    | {
        _id: string;
        email: string;
      };
  items: PaymentItem[];
  amount: number;
  paymentType: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Payment[];
}

const PAGE_SIZE = 10;

// ────────────────────────────────────────────────
// Fetch function using native fetch
const fetchPayments = async (
  token: string,
  page: number,
  limit: number,
): Promise<ApiResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_API_URL");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`${baseUrl}/payment?${params.toString()}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to load payments");
  }
  return data;
};

const buildPaginationItems = (
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> => {
  if (totalPages <= 1) {
    return [];
  }
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [];
  const leftSibling = Math.max(currentPage - 1, 1);
  const rightSibling = Math.min(currentPage + 1, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  }

  for (let pageNumber = leftSibling; pageNumber <= rightSibling; pageNumber += 1) {
    if (pageNumber !== 1 && pageNumber !== totalPages) {
      pages.push(pageNumber);
    }
  }

  if (showRightEllipsis) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
};

// ────────────────────────────────────────────────
// Skeleton Row (Desktop)
function OrderRowSkeleton() {
  return (
    <TableRow className="h-[66px] border-b border-[#ededed]">
      <TableCell className="pl-8">
        <div className="h-5 w-28 rounded bg-gray-200 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-10 rounded bg-gray-200 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
      </TableCell>
      <TableCell className="pr-8 text-center">
        <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse mx-auto" />
      </TableCell>
    </TableRow>
  );
}

// Skeleton Card (Mobile)
function OrderCardSkeleton() {
  return (
    <div className="rounded-[12px] border border-[#e8e8e8] bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
        <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-[#f8fafc] p-3">
          <div className="h-3 w-12 rounded bg-gray-300" />
          <div className="mt-2 h-5 w-16 rounded bg-gray-300" />
        </div>
        <div className="rounded-md bg-[#f8fafc] p-3">
          <div className="h-3 w-16 rounded bg-gray-300" />
          <div className="mt-2 h-5 w-20 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
export default function OrderHistorySection() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken as string | undefined;
  const isAuthed = status === "authenticated" && !!token;
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthed) {
      setPage(1);
    }
  }, [isAuthed]);

  const { data, isLoading, isFetching, error } = useQuery<ApiResponse, Error>({
    queryKey: ["payments", token, page, PAGE_SIZE],
    queryFn: () => fetchPayments(token as string, page, PAGE_SIZE),
    enabled: isAuthed,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const limit = meta?.limit ?? PAGE_SIZE;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const paginationItems = buildPaginationItems(page, totalPages);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const payments = data?.data ?? [];
  const isPending = isLoading || isFetching || status === "loading";

  const formatMoney = (value: number) => `$${value.toFixed(2)}`;
  const getProductLabel = (product: PaymentItem["product"]) => {
    if (typeof product === "string") {
      return `Product #${product.slice(-6)}`;
    }
    return product?.name || `Product #${product?._id.slice(-6)}`;
  };

  const itemRows = payments.flatMap((payment) =>
    payment.items.map((item) => ({
      payment,
      item,
    })),
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }
    setPage(nextPage);
  };

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load orders: {error.message}
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f5f5f5] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-[#253C67] sm:text-[42px] lg:text-[52px]">
            Order history
          </h2>
        </div>

        {/* Desktop / Tablet Table */}
        <div className="mt-8 hidden overflow-hidden rounded-[10px] border border-[#e8e8e8] bg-white sm:mt-10 md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#dfe7ef] bg-[#DEEEFF] hover:bg-[#dbeeff]">
                <TableHead className="h-12 pl-8 text-[16px] font-medium text-[#28457a]">
                  Product
                </TableHead>
                <TableHead className="text-[16px] font-medium text-[#28457a]">
                  Size
                </TableHead>
                <TableHead className="text-[16px] font-medium text-[#28457a]">
                  Price
                </TableHead>
                <TableHead className="text-[16px] font-medium text-[#28457a]">
                  Qty
                </TableHead>
                <TableHead className="text-[16px] font-medium text-[#28457a]">
                  Ordered
                </TableHead>
                <TableHead className="pr-8 text-center text-[16px] font-medium text-[#28457a]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)
              ) : itemRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                itemRows.map(({ payment, item }) => (
                  <TableRow
                    key={item._id}
                    className="h-[66px] border-b border-[#ededed] hover:bg-[#fafafa]"
                  >
                    <TableCell className="pl-8 text-[15px] font-medium text-[#222]">
                      {getProductLabel(item.product)}
                    </TableCell>
                    <TableCell className="text-[15px] text-[#8a8a8a]">
                      {item.size}
                    </TableCell>
                    <TableCell className="text-[15px] text-[#5d5d5d]">
                      {formatMoney(item.price)}
                    </TableCell>
                    <TableCell className="text-[15px] text-[#5d5d5d]">
                      {item.qty}
                    </TableCell>
                    <TableCell className="text-[15px] text-[#7a7a7a]">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell className="pr-8 text-center">
                      <Link
                        href={`/profile/order-history/${payment._id}`}>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#f1f5f9]"
                        aria-label={`View order ${payment._id}`}
                      >
                        <Eye className="h-4.5 w-4.5 text-[#222]" />
                      </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="mt-8 space-y-4 md:hidden">
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => <OrderCardSkeleton key={i} />)
          ) : itemRows.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No orders found</div>
          ) : (
            itemRows.map(({ payment, item }) => (
              <div
                key={item._id}
                className="rounded-[12px] border border-[#e8e8e8] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#222]">
                      {getProductLabel(item.product)}
                    </h3>
                    <p className="mt-1 text-sm text-[#8a8a8a]">{`${item.size} • Qty ${item.qty}`}</p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] transition hover:bg-[#f8fafc]"
                    aria-label={`View order ${payment._id}`}
                  >
                    <Eye className="h-4.5 w-4.5 text-[#222]" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-[#f8fafc] p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#8a8a8a]">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#222]">
                      {formatMoney(item.price)}
                    </p>
                  </div>

                  <div className="rounded-md bg-[#f8fafc] p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#8a8a8a]">
                      Ordered
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#222]">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 ? (
          <div className="mt-6 rounded-[12px] border border-[#e8e8e8] bg-white px-4 py-3 shadow-sm sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-nowrap font-medium text-[#64748b]">
                Page {page} of {totalPages} • Total {total} orders
              </p>

              <Pagination className="sm:mx-0 sm:justify-end">
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Previous page"
                      className="h-9 w-9 rounded-[6px] border border-[#e2e8f0] bg-white p-0 hover:bg-[#f1f5f9]"
                      disabled={page === 1 || isPending}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>

                  {paginationItems.map((item, index) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          className="h-9 w-9 rounded-[6px] border border-[#e2e8f0] bg-white p-0 text-[14px] font-semibold hover:bg-[#f1f5f9]"
                          isActive={item === page}
                          disabled={item === page || isPending}
                          onClick={() => handlePageChange(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationLink
                      aria-label="Next page"
                      className="h-9 w-9 rounded-[6px] border border-[#e2e8f0] bg-white p-0 hover:bg-[#f1f5f9]"
                      disabled={page === totalPages || isPending}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
