import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import api from "../../utils/api";

import Header from "../../Components/LandingComponents/Header";
import Feeling from "../../Components/LandingComponents/Feeling";
import Menu from "../../Components/LandingComponents/Menu";
import Footer from "../../Components/LandingComponents/Footer";
import TestimonialSection from "../../Components/LandingComponents/TestimonialSection";
import HowItWorks from "../../Components/LandingComponents/HowItWorks";
import SEO from "../../Components/SEO";

function isActiveCampaign(c) {
  const now = new Date();
  return (
    c.status === "published" &&
    new Date(c.start_date) <= now &&
    new Date(c.end_date) >= now
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function CampaignBanner({ campaigns, isLoading }) {
  const banners = campaigns.filter(
    (c) => isActiveCampaign(c) && c.type === "banner",
  );

  if (isLoading) {
    return (
      <div className="w-full bg-gray-100 animate-pulse flex items-center justify-center py-2.5">
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <div className="bg-green-50 border-b border-green-100 py-2">
      <Marquee speed={50} gradient={false} pauseOnHover>
        {banners.map((campaign) => (
          <span
            key={campaign.id}
            className="mx-10 text-green-700 font-medium text-sm"
          >
            {campaign.url ? (
              <a
                href={campaign.url}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                📢 {campaign.title} — {campaign.details}
              </a>
            ) : (
              <>
                📢 {campaign.title} — {campaign.details}
              </>
            )}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

// ─── Modal Carousel ───────────────────────────────────────────────────────────

function CampaignModal({ campaigns, onClose }) {
  const [index, setIndex] = useState(0);

  if (!campaigns.length) return null;

  const campaign = campaigns[index];
  const total = campaigns.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const handlePrev = (e) => {
    e.stopPropagation();
    setIndex((i) => i - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIndex((i) => i + 1);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Campaign counter badge — only shown when there are multiple */}
        {total > 1 && (
          <div className="absolute top-3 left-3 z-10 bg-black/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {index + 1} / {total}
          </div>
        )}

        {/* Image */}
        {campaign.image_url && (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-52 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {campaign.title}
          </h2>
          <p className="text-gray-600 mb-5">{campaign.details}</p>

          {/* Navigation + CTA row */}
          <div className="flex items-center gap-2">
            {/* Prev — hidden on first slide */}
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm transition-colors"
              >
                ← Prev
              </button>
            )}

            {/* Learn More — only shown when URL is present */}
            {campaign.url && (
              <a
                href={campaign.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                Learn More
              </a>
            )}

            {/* Next or Close on last slide */}
            {isLast ? (
              <button
                onClick={onClose}
                className={`font-semibold px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 text-sm ${!campaign.url && isFirst ? "w-full" : ""}`}
              >
                Maybe Later
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-3 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
              >
                Next →
              </button>
            )}
          </div>

          {/* Dot indicators — only shown when there are multiple */}
          {total > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {campaigns.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={`rounded-full transition-all ${
                    i === index
                      ? "w-4 h-2 bg-green-600"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to campaign ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

function Homepage() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalCampaigns, setModalCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/campaigns");
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setCampaigns(list);

        // All active modal campaigns, newest first
        const activeModals = list
          .filter((c) => isActiveCampaign(c) && c.type === "modal")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (!activeModals.length) return;

        // Only show the modal if at least one campaign hasn't been seen today.
        // We track each campaign individually so a newly added one still shows
        // even if the user already dismissed others today.
        const today = new Date().toDateString();
        const hasUnseen = activeModals.some(
          (c) => localStorage.getItem(`campaign_seen_${c.id}`) !== today,
        );

        if (hasUnseen) {
          setModalCampaigns(activeModals);
          setShowModal(true);
          // Mark all as seen for today up front
          activeModals.forEach((c) =>
            localStorage.setItem(`campaign_seen_${c.id}`, today),
          );
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <SEO
        title="Home"
        description="EatWella - Delicious, healthy, and affordable meals delivered to your doorstep. Experience the best of Nigerian cuisine."
      />

      <CampaignBanner campaigns={campaigns} isLoading={isLoading} />
      <Header />
      <Menu />
      <Feeling />
      <HowItWorks />
      <TestimonialSection />
      <Footer />

      {showModal && (
        <CampaignModal
          campaigns={modalCampaigns}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default Homepage;
