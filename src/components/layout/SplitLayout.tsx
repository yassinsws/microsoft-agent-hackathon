import React from 'react'
import { clsx } from 'clsx'

// Main SplitLayout component
export interface SplitLayoutProps {
  children: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical'
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const SplitLayout: React.FC<SplitLayoutProps> & {
  Left: typeof SplitLayoutLeft
  Right: typeof SplitLayoutRight
} = ({
  children,
  className,
  direction = 'horizontal',
  ratio = '50-50',
  gap = 'lg',
  responsive = true,
}) => {
  const containerClasses = clsx(
    'flex',
    direction === 'horizontal' ? 'flex-col lg:flex-row' : 'flex-col',
    {
      'gap-0': gap === 'none',
      'gap-4': gap === 'sm',
      'gap-6': gap === 'md',
      'gap-8': gap === 'lg',
      'gap-12': gap === 'xl',
    },
    className
  )

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

// Left side component
export interface SplitLayoutLeftProps {
  children: React.ReactNode
  className?: string
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70'
}

const SplitLayoutLeft: React.FC<SplitLayoutLeftProps> = ({
  children,
  className,
  ratio = '50-50',
}) => {
  const getRatioClasses = () => {
    switch (ratio) {
      case '60-40':
        return 'lg:w-3/5'
      case '40-60':
        return 'lg:w-2/5'
      case '70-30':
        return 'lg:w-7/10'
      case '30-70':
        return 'lg:w-3/10'
      default:
        return 'lg:w-1/2'
    }
  }

  const leftClasses = clsx(
    'w-full',
    getRatioClasses(),
    className
  )

  return (
    <div className={leftClasses}>
      {children}
    </div>
  )
}

// Right side component
export interface SplitLayoutRightProps {
  children: React.ReactNode
  className?: string
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70'
}

const SplitLayoutRight: React.FC<SplitLayoutRightProps> = ({
  children,
  className,
  ratio = '50-50',
}) => {
  const getRatioClasses = () => {
    switch (ratio) {
      case '60-40':
        return 'lg:w-2/5'
      case '40-60':
        return 'lg:w-3/5'
      case '70-30':
        return 'lg:w-3/10'
      case '30-70':
        return 'lg:w-7/10'
      default:
        return 'lg:w-1/2'
    }
  }

  const rightClasses = clsx(
    'w-full',
    getRatioClasses(),
    className
  )

  return (
    <div className={rightClasses}>
      {children}
    </div>
  )
}

// Attach Left and Right components to main component
SplitLayout.Left = SplitLayoutLeft
SplitLayout.Right = SplitLayoutRight

export default SplitLayout

// Alternative layout components for more flexibility

// Sidebar layout for dashboard-style interfaces
export interface SidebarLayoutProps {
  children: React.ReactNode
  className?: string
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export const SidebarLayout: React.FC<SidebarLayoutProps> & {
  Sidebar: typeof SidebarLayoutSidebar
  Main: typeof SidebarLayoutMain
} = ({
  children,
  className,
  sidebarWidth = 'md',
}) => {
  const containerClasses = clsx(
    'flex h-full',
    className
  )

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

export interface SidebarLayoutSidebarProps {
  children: React.ReactNode
  className?: string
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

const SidebarLayoutSidebar: React.FC<SidebarLayoutSidebarProps> = ({
  children,
  className,
  width = 'md',
}) => {
  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
    xl: 'w-96',
  }

  const sidebarClasses = clsx(
    'flex-shrink-0',
    widthClasses[width],
    'hidden lg:block',
    className
  )

  return (
    <aside className={sidebarClasses}>
      {children}
    </aside>
  )
}

export interface SidebarLayoutMainProps {
  children: React.ReactNode
  className?: string
}

const SidebarLayoutMain: React.FC<SidebarLayoutMainProps> = ({
  children,
  className,
}) => {
  const mainClasses = clsx(
    'flex-1 min-w-0',
    className
  )

  return (
    <main className={mainClasses}>
      {children}
    </main>
  )
}

SidebarLayout.Sidebar = SidebarLayoutSidebar
SidebarLayout.Main = SidebarLayoutMain

// Stack layout for mobile-first responsive design
export interface StackLayoutProps {
  children: React.ReactNode
  className?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export const StackLayout: React.FC<StackLayoutProps> = ({
  children,
  className,
  spacing = 'md',
  align = 'stretch',
}) => {
  const spacingClasses = {
    none: 'space-y-0',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const stackClasses = clsx(
    'flex flex-col',
    spacingClasses[spacing],
    alignClasses[align],
    className
  )

  return (
    <div className={stackClasses}>
      {children}
    </div>
  )
}

// Container wrapper for consistent max-width and padding
export interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = 'md',
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
    xl: 'px-12',
  }

  const containerClasses = clsx(
    'mx-auto w-full',
    sizeClasses[size],
    paddingClasses[padding],
    className
  )

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
} 