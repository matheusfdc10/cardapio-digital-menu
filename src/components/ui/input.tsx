import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldError } from "react-hook-form"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: FieldError | undefined
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input shadow bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-80",
          error && `focus-visible:ring-red-500 ring-red-500`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
