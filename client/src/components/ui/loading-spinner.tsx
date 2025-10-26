import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  text = "Loading...",
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)} {...props}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-green-500",
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}