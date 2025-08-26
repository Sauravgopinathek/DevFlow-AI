import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text-rainbow mb-4">
              🔒 Privacy Policy
            </h1>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-6">
              We collect information you provide directly to us through GitHub OAuth, including your profile information, repository data, and issue/PR information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Provide workflow automation services</li>
              <li>Sync data between GitHub, Google Calendar, and Notion</li>
              <li>Improve our services and user experience</li>
              <li>Communicate with you about service updates</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties. We only share data with the services you explicitly connect (GitHub, Google Calendar, Notion).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information. Your GitHub tokens are encrypted and stored securely.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-6">
              You have the right to access, update, or delete your personal information. You can revoke access permissions at any time through your GitHub settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy, please contact us through our support channels.
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

export default Privacy;