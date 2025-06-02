// Inspired by react-hot-toast library
import * as React from "react"
import { toast as sonnerToast } from "sonner"

export function toast({
  title,
  description,
  variant = "default",
}: {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}) {
  sonnerToast[variant === "destructive" ? "error" : "success"](title, {
    description: description,
  })
} 