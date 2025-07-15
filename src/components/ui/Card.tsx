import React, { forwardRef, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-white rounded-xl overflow-hidden'
    
    const variantClasses = {
      default: 'shadow-soft border border-gray-200',
      outlined: 'border-2 border-gray-200',
      elevated: 'shadow-large',
      interactive: 'shadow-soft border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1',
    }
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    }
    
    const hoverClasses = hover && variant !== 'interactive'
      ? 'transition-all duration-300 hover:shadow-medium hover:-translate-y-1'
      : ''
    
    const cardClasses = clsx(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className
    )
    
    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    const headerClasses = clsx(
      'flex items-center justify-between p-6 border-b border-gray-200',
      className
    )
    
    if (children) {
      return (
        <div ref={ref} className={headerClasses} {...props}>
          {children}
        </div>
      )
    }
    
    return (
      <div ref={ref} className={headerClasses} {...props}>
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    }
    
    const contentClasses = clsx(paddingClasses[padding], className)
    
    return (
      <div ref={ref} className={contentClasses} {...props}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between'
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify = 'end', children, ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    }
    
    const footerClasses = clsx(
      'flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50',
      justifyClasses[justify],
      className
    )
    
    return (
      <div ref={ref} className={footerClasses} {...props}>
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export default Card 