import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text-rainbow mb-4">
              📋 Terms of Service
            </h1>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using DevFlow AI, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-6">
              Permission is granted to temporarily use DevFlow AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. GitHub Integration</h2>
            <p className="text-gray-700 mb-6">
              DevFlow AI integrates with GitHub to provide workflow automation. We only access the permissions you explicitly grant during the OAuth process.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Usage</h2>
            <p className="text-gray-700 mb-6">
              We use your GitHub data solely for the purpose of providing workflow automation services. We do not sell or share your data with third parties.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Service Availability</h2>
            <p className="text-gray-700 mb-6">
              DevFlow AI is provided "as is" without any warranties. We strive for high availability but cannot guarantee uninterrupted service.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/" 
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>🏠 Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;