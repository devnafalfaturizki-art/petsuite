"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusVariants: Record<string, string> = {
  // Appointment
  SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  NO_SHOW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",

  // Invoice
  UNPAID: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PARTIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",

  // Cage
  AVAILABLE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OCCUPIED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",

  // Inpatient
  ADMITTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  OBSERVED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  DISCHARGED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",

  // Grooming
  BOOKED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PROCESSING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",

  // Module
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",

  // Notification
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  SENT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variantClass =
    statusVariants[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClass,
        className
      )}
    >
      {status}
    </span>
  );
}