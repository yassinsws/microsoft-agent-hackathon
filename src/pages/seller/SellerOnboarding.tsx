import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockPropertyAPI, PropertyAPI, AIGeneratedProperty, PropertyGenerationResponse } from '../../services/api'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

interface UploadedImage {
  file: File
  preview: string
  base64: string
}

type ProcessingStep = 'upload' | 'processing' | 'review' | 'completed'

const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // State management
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [generatedProperty, setGeneratedProperty] = useState<AIGeneratedProperty | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Steps configuration
  const steps = [
    { id: 'upload', label: 'Upload & Describe', icon: '1' },
    { id: 'processing', label: 'AI Processing', icon: '2' },
    { id: 'review', label: 'Review Listing', icon: '3' },
    { id: 'completed', label: 'Publish', icon: '4' }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  // File upload handlers
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // Validate files
    const validationErrors = PropertyAPI.validateImageFiles(files)
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const newImages: UploadedImage[] = []
      for (const file of Array.from(files)) {
        const base64 = await PropertyAPI.fileToBase64(file)
        const preview = URL.createObjectURL(file)
        newImages.push({ file, preview, base64 })
      }
      
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 10)) // Max 10 images
    } catch (error) {
      setError('Failed to process images. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview) // Clean up preview URL
      newImages.splice(index, 1)
      return newImages
    })
  }

  // API integration
  const handleUploadAndProcess = async () => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image')
      return
    }

    if (description.trim().length < 10) {
      setError('Please provide a description of at least 10 characters')
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentStep('processing')
    setProcessingProgress(0)

    try {
      // Step 1: Upload images and description
      setProcessingProgress(25)
      const uploadResponse = await mockPropertyAPI.uploadProperty({
        images: uploadedImages.map(img => img.base64),
        description: description.trim(),
        user_prompt: 'Create a professional property listing'
      })

      setPropertyId(uploadResponse.property_id)
      setProcessingProgress(50)

      // Step 2: Generate AI listing
      setProcessingProgress(75)
      const generationResponse = await mockPropertyAPI.generatePropertyListing(uploadResponse.property_id)
      
      setGeneratedProperty(generationResponse.property)
      setProcessingProgress(100)
      
      // Move to review step
      setTimeout(() => {
        setCurrentStep('review')
        setIsLoading(false)
      }, 500)

    } catch (error: any) {
      console.error('Error processing property:', error)
      setError(error.detail || 'Failed to process property. Please try again.')
      setCurrentStep('upload')
      setIsLoading(false)
    }
  }

  const handlePublishListing = () => {
    // In a real app, this would save to database and publish
    setCurrentStep('completed')
    setTimeout(() => {
      navigate('/seller/dashboard')
    }, 2000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('€', '€ ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= currentStepIndex ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStepIndex ? '✓' : step.icon}
                </div>
                <span className={`ml-2 text-sm transition-colors ${
                  index <= currentStepIndex ? 'text-primary-600' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px ml-4 transition-colors ${
                    index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Image Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Property Images</h3>
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-gray-600 mb-2">Click to upload images or drag and drop</p>
                <p className="text-sm text-gray-500">JPEG, PNG, WebP up to 10MB each (max 10 images)</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Uploaded Images ({uploadedImages.length})</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Describe Your Property</h3>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your property... Include details like location, size, special features, condition, and any unique selling points."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={1000}
              />
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  {description.length}/1000 characters
                </span>
                <span className="text-sm text-gray-500">
                  Minimum 10 characters required
                </span>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={handleUploadAndProcess}
                  disabled={uploadedImages.length === 0 || description.trim().length < 10 || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Generate AI Listing'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {currentStep === 'processing' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI is Analyzing Your Property</h3>
            <p className="text-gray-600 mb-8">
              Our AI is analyzing your images and description to create a professional property listing.
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Processing: {processingProgress}%
            </p>
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && generatedProperty && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Review Your AI-Generated Listing</h3>
                    <p className="text-gray-600 mt-1">
                      Confidence Score: {(generatedProperty.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-900">
                      {formatPrice(generatedProperty.price)}
                    </div>
                    <p className="text-sm text-gray-600">AI Estimated Price</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-6">
                {/* Left Side - Property Preview */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Property Preview
                  </h4>
                  
                  {/* Image Gallery */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    {uploadedImages.length > 0 ? (
                      <div>
                        {/* Main Image */}
                        <div className="aspect-video relative">
                          <img
                            src={uploadedImages[0].preview}
                            alt="Property main"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {uploadedImages.length} photo{uploadedImages.length !== 1 ? 's' : ''}
                          </div>
                          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                            Main Photo
                          </div>
                        </div>
                        
                        {/* Thumbnail Gallery */}
                        {uploadedImages.length > 1 && (
                          <div className="p-4 bg-white border-t">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">All Photos</h6>
                            <div className="flex space-x-2 overflow-x-auto">
                              {uploadedImages.slice(1, 6).map((image, index) => (
                                <div key={index} className="relative flex-shrink-0">
                                  <img
                                    src={image.preview}
                                    alt={`Property ${index + 2}`}
                                    className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                                  />
                                </div>
                              ))}
                              {uploadedImages.length > 6 && (
                                <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-200 flex items-center justify-center text-sm text-gray-600 flex-shrink-0 font-medium">
                                  +{uploadedImages.length - 6}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video flex items-center justify-center text-gray-500 bg-gray-50">
                        <div className="text-center">
                          <p className="font-medium">No images uploaded</p>
                          <p className="text-sm">Upload images to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Card Preview */}
                  <div className="border-2 border-primary-200 rounded-lg overflow-hidden bg-gradient-to-br from-white to-primary-50">
                    <div className="bg-primary-600 text-white px-4 py-2">
                      <h5 className="font-semibold text-sm">How Your Listing Will Appear</h5>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{generatedProperty.title}</h3>
                      <p className="text-3xl font-bold text-primary-600 mb-4">${generatedProperty.price.toLocaleString()}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          {generatedProperty.details.bedrooms} bed{generatedProperty.details.bedrooms !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          {generatedProperty.details.bathrooms} bath{generatedProperty.details.bathrooms !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          {generatedProperty.details.sqft} sqft
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                        {generatedProperty.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {generatedProperty.features.slice(0, 6).map((feature, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                            {feature}
                          </span>
                        ))}
                        {generatedProperty.features.length > 6 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{generatedProperty.features.length - 6} more features
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 border-t pt-3">
                        <span className="flex items-center">
                          {generatedProperty.location.city}, {generatedProperty.location.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-4">
                      AI Analysis & Recommendations
                    </h5>
                    <div className="space-y-3">
                      {generatedProperty.ai_suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-white bg-opacity-70 rounded-lg">
                          <div className="text-blue-600 mt-0.5 font-bold">•</div>
                          <p className="text-blue-900 text-sm font-medium">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Analysis */}
                  <div className={`rounded-lg p-5 border ${
                    generatedProperty.pricing_analysis.market_position === 'competitive' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                    generatedProperty.pricing_analysis.market_position === 'below_market' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' :
                    'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">
                        Price Analysis
                      </h5>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          generatedProperty.pricing_analysis.market_position === 'competitive' ? 'bg-green-100 text-green-700' :
                          generatedProperty.pricing_analysis.market_position === 'below_market' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {generatedProperty.pricing_analysis.market_position === 'competitive' ? 'Competitive' :
                           generatedProperty.pricing_analysis.market_position === 'below_market' ? 'Below Market' : 'Above Market'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {(generatedProperty.pricing_analysis.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white bg-opacity-70 rounded-lg p-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Market Comparison</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Your Price:</span>
                            <span className="font-medium">${generatedProperty.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Market Average:</span>
                            <span className="font-medium">${generatedProperty.pricing_analysis.comparable_properties.avg_price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price Range:</span>
                            <span className="font-medium">
                              ${generatedProperty.pricing_analysis.comparable_properties.min_price.toLocaleString()} - 
                              ${generatedProperty.pricing_analysis.comparable_properties.max_price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Difference:</span>
                            <span className={`font-medium ${
                              generatedProperty.pricing_analysis.price_difference_percentage > 0 ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              {generatedProperty.pricing_analysis.price_difference_percentage > 0 ? '+' : ''}
                              {generatedProperty.pricing_analysis.price_difference_percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white bg-opacity-70 rounded-lg p-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">AI Recommendations</h6>
                        <div className="space-y-2">
                          {generatedProperty.pricing_analysis.recommendations.slice(0, 3).map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <div className="text-gray-500 mt-1">•</div>
                              <p className="text-gray-700">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white bg-opacity-70 rounded-lg p-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-3">Market Insights</h6>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {generatedProperty.pricing_analysis.market_insights.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="text-gray-500 mt-1">•</div>
                            <p className="text-gray-700">{insight}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                        Based on analysis of {generatedProperty.pricing_analysis.comparable_properties.sample_size} similar properties in the area
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Editable Details */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Edit Listing Details
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Basic Information</h5>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                          <input
                            type="text"
                            defaultValue={generatedProperty.title}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter a catchy title for your property"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                            <input
                              type="number"
                              defaultValue={generatedProperty.price}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                            <select 
                              defaultValue={generatedProperty.details.type}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="House">House</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Condo">Condo</option>
                              <option value="Villa">Villa</option>
                              <option value="Townhouse">Townhouse</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Property Details</h5>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                            <input
                              type="number"
                              defaultValue={generatedProperty.details.bedrooms}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                            <input
                              type="number"
                              defaultValue={generatedProperty.details.bathrooms}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Size (sqft)</label>
                            <input
                              type="number"
                              defaultValue={generatedProperty.details.sqft}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            defaultValue={`${generatedProperty.location.city}, ${generatedProperty.location.state} ${generatedProperty.location.zipCode}`}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter full address or area"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Description</h5>
                      <textarea
                        defaultValue={generatedProperty.description}
                        rows={6}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe your property in detail..."
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Property Features</h5>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                        {generatedProperty.features.map((feature, index) => (
                          <label key={index} className="flex items-center space-x-2 p-2 hover:bg-white rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="rounded text-primary-600 focus:ring-primary-500" 
                            />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-primary-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">AI-Generated Listing</span> • Ready to publish
                    </div>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCurrentStep('upload')
                        setGeneratedProperty(null)
                      }}
                    >
                      ← Start Over
                    </Button>
                    <Button onClick={handlePublishListing} className="bg-primary-600 hover:bg-primary-700">
                      Publish Listing
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed Step */}
        {currentStep === 'completed' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Listing Published Successfully!</h3>
            <p className="text-gray-600 mb-8">
              Your property listing has been published and is now live. You'll be redirected to your dashboard shortly.
            </p>
            <div className="flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerOnboarding 