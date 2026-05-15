import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLogIn,
  FiPackage,
  FiMapPin,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import SEO from "../../Components/SEO";
import RidersHeader from "../../Components/Riders/RidersHeader";
import Footer from "../../Components/LandingComponents/Footer";
import riderLogin from "../../assets/rider_login.png";
import riderDashboard from "../../assets/rider_dashboard.png";
import deliveryImg from "../../assets/feeling/eatwella_delivery.jpeg";
import riderLocation from "../../assets/rider_location.png";
import riderComplete from "../../assets/rider_complete.png";
import riderPin from "../../assets/rider_pin.png";
import riderDemo from "../../assets/eatwella_rider_demo.mp4";

function RidersPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  const steps = [
    {
      icon: FiLogIn,
      title: "Log In to Your Account",
      description: (
        <>
          Head to{" "}
          <a
            href="https://eatwella.ng/admin/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline transition-colors"
          >
            eatwella.ng/admin/login
          </a>
          . Log in to your account by typing your email and password. You'll be
          redirected to your dashboard.
        </>
      ),
      image: riderLogin,
    },
    {
      icon: FiPackage,
      title: "View Assigned Orders",
      description:
        "On your dashboard, you'll see every order assigned to you for delivery.",
      image: riderDashboard,
    },
    {
      icon: FiPackage,
      title: "Pick Up from Restaurant",
      description:
        "For every delivery, report to the restaurant to get the order to be delivered.",
      image: deliveryImg,
    },
    {
      icon: FiMapPin,
      title: "Locate Delivery Address",
      description:
        "After getting the goods, locate delivery address of customer to deliver the goods at. The location is specified in the order details.",
      image: riderLocation,
    },
    {
      icon: FiCheckCircle,
      title: "Complete",
      description:
        "When dropping off the goods with customer, complete the order by clicking the 'Complete Order' button. You'll be prompted to enter a delivery PIN.",
      image: riderComplete,
    },
    {
      icon: FiLock,
      title: "Enter Delivery PIN",
      description:
        "Ask the customer for this delivery PIN and enter it into the input. Your order is finally completed.",
      image: riderPin,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <>
      <SEO
        title="Rider Tutorial - Eatwella"
        description="Learn how to use the Eatwella rider app for efficient order delivery and management."
      />

      <div className="min-h-screen bg-gray-50">
        <RidersHeader />

        {/* Tutorial Steps */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`}
                >
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                        <step.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        Step {index + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Image */}
                  <div className="flex-1">
                    <div
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden aspect-video cursor-pointer"
                      onClick={() => setSelectedImage(step.image)}
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Video Tutorial Section */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Video Tutorial
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Watch this complete screen recording of the delivery process
              </p>

              <div className="bg-black rounded-xl shadow-2xl overflow-hidden aspect-video">
                <video
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source
                    src={riderDemo}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Quick Reference
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Before Delivery
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Log in with your credentials</li>
                    <li>• Check dashboard for assigned orders</li>
                    <li>• Review order details and pickup location</li>
                    <li>• Contact restaurant if needed</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    During Delivery
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Navigate to restaurant location</li>
                    <li>• Verify order contents</li>
                    <li>• Navigate to customer address</li>
                    <li>• Contact customer if needed</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    After Delivery
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Click "Complete Order" button</li>
                    <li>• Request delivery PIN from customer</li>
                    <li>• Enter PIN to confirm delivery</li>
                    <li>• Check for next assigned order</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Important Notes
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Always verify order details</li>
                    <li>• Handle food with care</li>
                    <li>• Be professional with customers</li>
                    <li>• Report issues immediately</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-6xl max-h-[95vh] bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Screenshot preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <svg
                  className="w-8 h-8"
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
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RidersPage;
