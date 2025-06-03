import React from 'react';

const LegalNoticePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-6">Legal Notice</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">1. Legal Information</h2>
          <p className="mb-2">Website published by:</p>
          <p className="mb-4">
            MR FERREIRA THOMAS<br />
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">2. Hosting</h2>
          <p className="mb-4">
            This website is hosted by:<br />
            Hostinger.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">3. Intellectual Property</h2>
          <p className="mb-4">
            The entire website is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved, including for downloadable documents and iconographic and photographic representations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">4. Personal Data Protection</h2>
          <p className="mb-4">
            In accordance with the French Data Protection Act of January 6, 1978, as amended, and the General Data Protection Regulation (GDPR), you have the right to access, rectify and delete your personal data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">5. Cookies</h2>
          <p className="mb-4">
            This website uses cookies to improve your browsing experience. You can disable the use of cookies at any time by selecting the appropriate settings in your browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">6. Online Games</h2>
          <p className="mb-4">
            The games presented on this site are intended for all ages. We strive to maintain a safe and appropriate gaming environment. Users are invited to respect the rules of good conduct and to report any inappropriate content.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalNoticePage; 