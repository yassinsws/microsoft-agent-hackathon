import React, { forwardRef, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'pill'
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      shape = 'rounded',
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center font-medium'
    
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      error: 'bg-error-100 text-error-800',
      outline: 'border border-gray-300 text-gray-700 bg-white',
    }
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }
    
    const shapeClasses = {
      rounded: 'rounded-md',
      pill: 'rounded-full',
    }
    
    const badgeClasses = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      shapeClasses[shape],
      className
    )
    
    if (dot) {
      return (
        <span ref={ref} className={badgeClasses} {...props}>
          <span className="w-2 h-2 rounded-full bg-current mr-1.5"></span>
          {children}
        </span>
      )
    }
    
    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge 