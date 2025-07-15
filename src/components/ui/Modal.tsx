import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  children: React.ReactNode
  className?: string
  overlayClassName?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className,
  overlayClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])
  
  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore focus and scroll
      previousActiveElement.current?.focus()
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }
  
  const modalClasses = clsx(
    'relative bg-white rounded-xl shadow-2xl',
    sizeClasses[size],
    'w-full max-h-[90vh] overflow-hidden',
    className
  )
  
  const overlayClasses = clsx(
    'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50',
    'flex items-center justify-center p-4',
    overlayClassName
  )
  
  if (!isOpen) return null
  
  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={overlayClasses}
        onClick={handleOverlayClick}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
  
  return createPortal(modalContent, document.body)
}

// Modal Header Component
export interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  const headerClasses = clsx('p-6 border-b border-gray-200', className)
  
  return (
    <div className={headerClasses}>
      {children}
    </div>
  )
}

// Modal Body Component
export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const ModalBody: React.FC<ModalBodyProps> = ({ 
  children, 
  className, 
  padding = 'md' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const bodyClasses = clsx(paddingClasses[padding], className)
  
  return (
    <div className={bodyClasses}>
      {children}
    </div>
  )
}

// Modal Footer Component
export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
  justify?: 'start' | 'center' | 'end' | 'between'
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  className,
  justify = 'end'
}) => {
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
    <div className={footerClasses}>
      {children}
    </div>
  )
}

export default Modal 