import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import SEO from "../../Components/SEO";
import Navbar from "../../Components/LandingComponents/Navbar";
import Footer from "../../Components/LandingComponents/Footer";
import RiderApplicationModal from "../../Components/Modals/RiderApplicationModal";

import riderLoginImg from "../../assets/rider_login.png";
import riderDashboardImg from "../../assets/rider_dashboard.png";
import riderCompleteImg from "../../assets/rider_complete.png";
import deliveryImg from "../../assets/feeling/eatwella_delivery.jpeg";
import dineInImg from "../../assets/feeling/eatwella_dinein.jpeg";
import pickupImg from "../../assets/feeling/eatwella_pickup.jpeg";
import riderDemo from "../../assets/eatwella_rider_demo.mp4";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// ─── Network Cards Data ───────────────────────────────────────────────────────

const networkCards = [
  {
    title: "Order in 3 steps",
    description:
      "Receive your assignments directly on your dashboard. Log in, check your orders, and head out — it's that simple.",
    image: riderDashboardImg,
  },
  {
    title: "Start earning",
    description:
      "Every completed delivery adds to your earnings. Withdraw straight to your bank account at any time with no delays.",
    image: deliveryImg,
  },
  {
    title: "Behind the scenes",
    description:
      "Our team is always available to support you. From order disputes to technical issues, we've got your back.",
    image: riderCompleteImg,
  },
];

// ─── FAQs Data ────────────────────────────────────────────────────────────────

const faqs = [
  {
    question: "How many rides can I do per day for Eatwella?",
    answer:
      "There is no hard limit. You can take as many delivery assignments as are available and assigned to you through your dashboard.",
  },
  {
    question: "How often are payments made to riders?",
    answer:
      "Payments are processed promptly after each completed delivery. You can request a withdrawal to your bank account at any time from your rider dashboard.",
  },
  {
    question: "Do I need a smartphone to become a rider?",
    answer:
      "Yes. You'll need a smartphone with an internet connection to access your dashboard and manage your delivery assignments.",
  },
  {
    question: "What happens if an order goes wrong or is disputed?",
    answer:
      "Our support team handles all disputes fairly. Simply report the issue through the platform and our team will investigate and resolve it promptly.",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left gap-4 group"
      >
        <span className="text-gray-900 font-semibold text-base group-hover:text-green-600 transition-colors">
          {question}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
          {isOpen ? (
            <FiChevronUp className="text-green-600" />
          ) : (
            <FiChevronDown className="text-gray-500 group-hover:text-green-600 transition-colors" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-gray-500 leading-relaxed text-sm pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function RidersPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <SEO
        title="Become a Rider - Eatwella"
        description="Join the Eatwella rider network. Earn money, ride on your own schedule, and get paid straight to your account."
      />

      <div className="min-h-screen bg-white">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Navbar />
        <div className="bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden min-h-screen">

          {/* Decorative blobs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.15, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-24 h-24 bg-orange-400 rounded-full blur-2xl opacity-30 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-32 left-10 w-36 h-36 bg-orange-500 rounded-full blur-3xl opacity-20 pointer-events-none"
          />

          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left"
              >
                <motion.h1
                  variants={fadeUp}
                  className="text-[48px] md:text-[64px] lg:text-[72px] font-bolota font-black text-white leading-tight mb-6"
                >
                  BECOME AN EATWELLA RIDER
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-lg text-green-100 mb-10 max-w-lg mx-auto lg:mx-0"
                >
                  Earn on your own terms, be your own boss, and unlock amazing
                  benefits for yourself. Be part of a growing community of
                  delivery agents.
                </motion.p>

                <button
                  onClick={() => setIsRiderModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
                >
                  Join the Team
                </button>
              </motion.div>

              {/* Right — Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 14,
                  delay: 0.4,
                }}
                className="flex items-center justify-center h-full"
              >
                <div className="w-[80%] h-[90%] max-w-md rounded-3xl overflow-hidden shadow-2xl border-8 border-white rotate-3">
                  <img
                    src={deliveryImg}
                    alt="Image of an Eatwella delivery agent"
                    className="h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Earnings Highlight ───────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* App mockup */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-green-50 rounded-3xl p-8 shadow-xl border border-green-100">
                  {/* Fake earnings card */}
                  <div className="bg-green-600 text-white rounded-2xl p-6 mb-4 shadow-lg">
                    <p className="text-green-200 text-sm font-medium mb-1">
                      Today's Earnings
                    </p>
                    <p className="text-4xl font-bolota font-black">₦2,650.00</p>
                    <div className="mt-4 flex gap-3">
                      <div className="bg-white/20 rounded-xl px-4 py-2 text-sm font-semibold">
                        Withdraw
                      </div>
                      <div className="bg-orange-400 rounded-xl px-4 py-2 text-sm font-semibold">
                        View History
                      </div>
                    </div>
                  </div>
                  {/* Completed deliveries row */}
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                      <p className="text-2xl font-black text-gray-900 font-bolota">
                        8
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Deliveries
                      </p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                      <p className="text-2xl font-black text-orange-500 font-bolota">
                        ★ 4.9
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Rating
                      </p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                      <p className="text-2xl font-black text-green-600 font-bolota">
                        ✓
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Paid Out
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bolota font-black text-gray-900 mb-6 leading-tight">
                  Earn for every completed delivery
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Your earnings are calculated based on all deliveries you have
                  completed. Access to earnings can be made on the transfer of
                  funds to yours provided bank accounts.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-3xl font-bolota font-black text-green-600">
                      Safe
                    </p>
                    <p className="text-sm text-gray-500">Secure Platform</p>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div>
                    <p className="text-3xl font-bolota font-black text-green-600">
                      Yours
                    </p>
                    <p className="text-sm text-gray-500">Flexible Schedule</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Join Our Growing Network ─────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-4xl md:text-5xl font-bolota font-black text-gray-900">
                Join our growing network{" "}
                <span className="inline-block">👇</span>
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {networkCards.map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-3 font-bolota">
                      {card.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FAQs ─────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bolota font-black text-gray-900">
                FAQs.
              </h2>
            </motion.div>

            <div className="grid gap-12 items-start">
              {/* Accordion */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full"
              >
                {faqs.map((faq, i) => (
                  <FaqItem
                    key={i}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaq === i}
                    onToggle={() => toggleFaq(i)}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <section
          className="relative py-24 overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${deliveryImg})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-green-900/80" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[52px] md:text-[72px] lg:text-[90px] font-bolota font-black text-white leading-none mb-6">
                READY TO JOIN THE TEAM? 
              </h2>
              <p className="text-green-200 text-lg mb-10 max-w-xl mx-auto">
                Click the button below, fill in the required details and submit your application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsRiderModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
                >
                  Join the Team
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      <RiderApplicationModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
      />
    </>
  );
}

export default RidersPage;
