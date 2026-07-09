import React from 'react'

function PrivacyPolicyContent() {
  const sections = [
    {
      number: "1",
      title: "Information We Collect",
      items: ["Name", "Phone Number", "Email Address", "Delivery Address", "Order Details", "Payment Information (processed securely by third parties)"]
    },
    {
      number: "2",
      title: "Information Collected Automatically",
      items: ["IP Address", "Browser Information", "Device Information", "Cookies"]
    },
    {
      number: "3",
      title: "How We Use Information",
      items: ["Process orders", "Deliver meals", "Communicate updates", "Improve customer experience", "Send promotions (with consent)", "Meet legal obligations"]
    },
    {
      number: "4",
      title: "Legal Basis",
      items: ["Contract", "Consent", "Legal Obligations", "Legitimate Interests"]
    },
    {
      number: "5",
      title: "Sharing Information",
      description: "We do not sell personal information. Data may be shared with delivery partners, payment processors, analytics providers, and legal authorities when required."
    },
    {
      number: "6",
      title: "Cookies",
      description: "Cookies help improve website functionality and user experience."
    },
    {
      number: "7",
      title: "Data Retention",
      description: "Data is retained only as long as necessary for operational and legal purposes."
    },
    {
      number: "8",
      title: "Your Rights",
      description: "You may request access, correction, deletion, or restriction of your personal data."
    },
    {
      number: "9",
      title: "Data Security",
      description: "We use reasonable safeguards to protect your information."
    },
    {
      number: "10",
      title: "Children's Privacy",
      description: "We do not knowingly collect personal information from children without consent."
    },
    {
      number: "11",
      title: "Third-Party Links",
      description: "We are not responsible for external websites linked from our platform."
    },
    {
      number: "12",
      title: "Policy Updates",
      description: "This policy may be updated from time to time."
    },
    {
      number: "13",
      title: "Contact & Complaints",
      items: ["Phone/WhatsApp: 09111086770", "Website: eatwella.ng", "Instagram: @eatwella"]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="mb-8">
          <p className="text-gray-600 text-sm mb-1">Effective Date: 6th May, 2026</p>
          <p className="text-gray-600 text-sm">Last Updated: 7th July, 2026</p>
        </div>

        <p className="text-gray-700 mb-10 text-lg">At Eatwella, your privacy matters to us.</p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.number} className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {section.number}. {section.title}
              </h3>
              {section.items ? (
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{section.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyContent
