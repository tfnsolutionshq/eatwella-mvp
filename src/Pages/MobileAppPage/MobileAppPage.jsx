import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiTag,
  FiBell,
  FiZap,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import SEO from "../../Components/SEO";
import Navbar from "../../Components/LandingComponents/Navbar";
import Footer from "../../Components/LandingComponents/Footer";

// NOTE: swap these for real app screenshots/mockups once you have them.
// Reusing the same "feeling" photography from the Riders page in the
// meantime keeps the page from looking empty/broken.
import mobileOne from "../../assets/mobile_one.png";
import dineInImg from "../../assets/feeling/eatwella_dinein.jpeg";
import pickupImg from "../../assets/feeling/eatwella_pickup.jpeg";
import deliveryImg from "../../assets/feeling/eatwella_delivery.jpeg";

// ─── Animation Variants (kept identical to RidersPage for consistency) ───────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// ─── Order-Your-Way Cards ──────────────────────────────────────────────────

const orderWaysCards = [
  {
    title: "Dine In",
    description:
      "Reserve a table and order straight from your phone before you even arrive. Skip the wait, not the meal.",
    image: dineInImg,
  },
  {
    title: "Pick Up",
    description:
      "Place your order on the app and walk in only when it's ready. No queues, no waiting around.",
    image: pickupImg,
  },
  {
    title: "Delivery",
    description:
      "Get your favorite meals delivered to your doorstep, with live tracking from kitchen to your front door.",
    image: deliveryImg,
  },
];

// ─── Feature Grid Data ──────────────────────────────────────────────────────

const appFeatures = [
  {
    icon: FiMapPin,
    title: "Real-Time Order Tracking",
    description:
      "Watch your order move from the kitchen to your table, pickup counter, or doorstep, live.",
  },
  {
    icon: FiZap,
    title: "One-Tap Reorder",
    description:
      "Loved last week's order? Reorder your favorites in a single tap, no need to rebuild your cart.",
  },
  {
    icon: FiTag,
    title: "App-Only Deals",
    description:
      "Get early access to discounts, combo offers, and promo codes saved exclusively for app users.",
  },
  {
    icon: FiBell,
    title: "Smart Order Updates",
    description:
      "Get notified the moment your order is confirmed, being prepared, and out for delivery or ready for pickup.",
  },
];

// ─── How It Works Steps (matches homepage's numbered-circle style) ─────────

const howItWorksSteps = [
  {
    number: "01",
    title: "Join the Waitlist",
    description: "Drop your email so we can notify you the moment we launch.",
  },
  {
    number: "02",
    title: "Download the App",
    description: "Get the Eatwella app from the App Store or Google Play.",
  },
  {
    number: "03",
    title: "Browse & Choose",
    description:
      "Pick your meals and how you want them, dine-in, pickup, or delivery.",
  },
  {
    number: "04",
    title: "Track in Real Time",
    description: "Follow your order's progress right from your home screen.",
  },
  {
    number: "05",
    title: "Enjoy",
    description:
      "Sit back, your food is on the way (or already on your table).",
  },
];

// ─── FAQs Data ────────────────────────────────────────────────────────────

const faqs = [
  {
    question: "When is the Eatwella app launching?",
    answer:
      "We're putting the finishing touches on it right now. Join the waitlist below and you'll be the first to know the moment it's live.",
  },
  {
    question: "Can I still order food before the app launches?",
    answer:
      "Yes! Everything the app will offer, dine-in, pickup, and delivery ordering, is already available right here on the Eatwella website.",
  },
  {
    question: "Will the app have features the website doesn't?",
    answer:
      "The app will include extras like push notifications for order updates, app-only discounts, and faster one-tap reordering.",
  },
  {
    question: "Will the app be free to download?",
    answer:
      "Yes, the Eatwella app will be completely free to download on both the App Store and Google Play.",
  },
];

// ─── FAQ Accordion Item (identical pattern to RidersPage) ──────────────────

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

// ─── Waitlist Modal ─────────────────────────────────────────────────────────
// Kept self-contained (rather than a separate component file) since it's a
// simple single-field form. Swap in your own submit handler / API call.

// Paste the deployment URL from your Apps Script Web App here
// (Deploy → New deployment → Web app → copy the URL ending in /exec)
const WAITLIST_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbysDhOJcML89K2PPicgU1Trii5uCr98VTVeTMpYLDYYJUG4ZNdXsPVBrxP1jvAVUhRd/exec";

function WaitlistModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      // Apps Script web apps don't return CORS headers, so we send the
      // request in "no-cors" mode. We won't be able to read the response,
      // but the email + timestamp still gets appended to the sheet.
      await fetch(WAITLIST_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <FiX className="text-gray-600" />
            </button>

            {!submitted ? (
              <>
                <h3 className="text-2xl font-bolota font-black text-gray-900 mb-2">
                  Be the first to know
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Drop your email and we'll notify you the moment the Eatwella
                  app is live on the App Store and Google Play.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    {submitting ? "Joining..." : "Notify Me"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <FiCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-bolota font-black text-gray-900 mb-2">
                  You're on the list!
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We've saved your email, you'll hear from us as soon as the app
                  is ready. In the meantime, you can keep ordering right here on
                  the website.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────

function AppPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <SEO
        title="Eatwella App - Coming Soon"
        description="The Eatwella app is on its way. Order for dine-in, pickup, or delivery, track in real time, and unlock app-only deals. Join the waitlist."
      />

      <div className="min-h-screen bg-white">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Navbar />
        <div className="bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden min-h-[900px] md:min-h-screen">
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
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left flex-1"
              >
                <motion.span
                  variants={fadeUp}
                  className="inline-block bg-white/15 text-white text-xs font-bold tracking-wide uppercase px-4 py-2 rounded-full mb-6"
                >
                  Coming Soon
                </motion.span>
                <motion.h1
                  variants={fadeUp}
                  className="text-[44px] md:text-[60px] lg:text-[68px] font-bolota font-black text-white leading-tight mb-6"
                >
                  EATWELLA, NOW IN YOUR POCKET
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-lg text-green-100 mb-10 max-w-lg mx-auto lg:mx-0"
                >
                  Dine-in, pickup, and delivery ordering, plus real-time
                  tracking and app-only deals. We're putting the finishing
                  touches on it, join the waitlist and we'll let you know the
                  second it's ready.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center lg:justify-start"
                >
                  <button
                    onClick={() => setIsWaitlistOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
                  >
                    Notify Me at Launch
                  </button>
                  <button
                    onClick={() => navigate("/menu")}
                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3 rounded-full font-bold transition-colors"
                  >
                    Order on the Website
                  </button>
                </motion.div>

                {/* Disabled store badges */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-2 bg-black/30 text-white/60 px-4 py-2 rounded-xl cursor-not-allowed border border-white/10">
                    <FaApple className="text-lg" />
                    <div className="text-left leading-tight">
                      <p className="text-[10px]">Coming soon on the</p>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 text-white/60 px-4 py-2 rounded-xl cursor-not-allowed border border-white/10">
                    <FaGooglePlay className="text-base" />
                    <div className="text-left leading-tight">
                      <p className="text-[10px]">Coming soon on</p>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right — Phone mockups */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 14,
                  delay: 0.4,
                }}
                className="h-full w-full flex items-center justify-center flex-1"
              >
                <motion.div
                  animate={floatingAnimation}
                  className="w-[350px] h-[600px] rotate-[6deg] z-10"
                >
                  <img
                    src={mobileOne}
                    alt="Eatwella app screenshot 1"
                    className="w-full h-full object-cover rotate-[6deg]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Order Your Way ───────────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-4xl md:text-5xl font-bolota font-black text-gray-900 mb-4">
                Order However You Want It
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Whether you're dining in, swinging by to pick up, or want it
                brought to your door, the app makes it just as easy as the
                website does today.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {orderWaysCards.map((card, i) => (
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

        {/* ── Feature Grid ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-4xl md:text-5xl font-bolota font-black text-gray-900">
                Why You'll Love the App
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {appFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                      <Icon className="text-green-600 text-xl" />
                    </div>
                    <h3 className="font-bolota font-black text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bolota font-black text-gray-900">
                How It Will Work
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 relative"
            >
              {/* connecting line, desktop only */}
              <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-gray-200" />

              {howItWorksSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-green-600 text-green-600 font-bolota font-black flex items-center justify-center mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[180px]">
                    {step.description}
                  </p>
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
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <section
          className="relative py-24 overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${deliveryImg})` }}
        >
          <div className="absolute inset-0 bg-green-900/80" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[44px] md:text-[64px] lg:text-[80px] font-bolota font-black text-white leading-none mb-6">
                BE THE FIRST TO KNOW
              </h2>
              <p className="text-green-200 text-lg mb-10 max-w-xl mx-auto">
                Join the waitlist and we'll email you the moment the Eatwella
                app lands on the App Store and Google Play.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
                >
                  Join the Waitlist
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}

export default AppPage;
