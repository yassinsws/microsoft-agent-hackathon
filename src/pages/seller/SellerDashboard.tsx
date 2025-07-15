import React from 'react'

const SellerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Seller Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your listings and view analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard 