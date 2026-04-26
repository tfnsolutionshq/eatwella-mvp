import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import api from "../../utils/api";
import { Link } from "react-router-dom";

import Header from "../../Components/LandingComponents/Header";
import Feeling from "../../Components/LandingComponents/Feeling";
import Menu from "../../Components/LandingComponents/Menu";
import Footer from "../../Components/LandingComponents/Footer";
import TestimonialSection from "../../Components/LandingComponents/TestimonialSection";
import HowItWorks from "../../Components/LandingComponents/HowItWorks";
import SEO from "../../Components/SEO";

const ONE_HOUR_MS = 60 * 60 * 1000;

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
          <Link
            to={campaign.url || "#"}
            target={campaign.url ? "_blank" : "_self"}
            key={campaign.id}
            className="mx-10 text-green-700 font-medium text-sm hover:underline"
          >
            📢 {campaign.title} — {campaign.brief}
          </Link>
        ))}
      </Marquee>
    </div>
  );
}

// ─── Modal Carousel ───────────────────────────────────────────────────────────

function CampaignModal({ campaigns, onClose }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Reset expanded state whenever the user navigates to a different campaign
  useEffect(() => {
    setExpanded(false);
  }, [index]);

  if (!campaigns.length) return null;

  const campaign = campaigns[index];
  const total = campaigns.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const hasDetails = !!campaign.details?.trim();
  const hasUrl = !!campaign.url?.trim();
  const showLearnMore = hasDetails || hasUrl;

  const handlePrev = (e) => {
    e.stopPropagation();
    setIndex((i) => i - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIndex((i) => i + 1);
  };

  const handleLearnMore = (e) => {
    e.stopPropagation();
    if (hasDetails) {
      setExpanded(true);
    } else if (hasUrl) {
      window.open(campaign.url, "_blank", "noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden
          transition-all duration-300 ease-in-out"
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

        {/* Campaign counter badge */}
        {total > 1 && (
          <div className="absolute top-3 left-3 z-10 bg-black/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {index + 1} / {total}
          </div>
        )}

        {/* Image — hidden when expanded so details get full focus */}
        {campaign.image_url && !expanded && (
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

          {/* Brief — always visible */}
          <p className="text-gray-600 mb-4">{campaign.brief}</p>

          {/* ── Expanded details panel ── */}
          {expanded && hasDetails && (
            <div
              className="overflow-y-auto max-h-56 mb-4 pr-1
                border-t border-gray-100 pt-3
                text-gray-600 text-sm leading-relaxed
                [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mt-1
                [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mt-1
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-1
                [&_h2]:text-xl  [&_h2]:font-bold [&_h2]:mb-1
                [&_h3]:text-lg  [&_h3]:font-semibold [&_h3]:mb-1
                [&_p]:mb-2 [&_strong]:font-semibold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: campaign.details }}
            />
          )}

          {/* Navigation + CTA row */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm transition-colors"
              >
                ← Prev
              </button>
            )}

            {/* Learn More / Collapse toggle */}
            {showLearnMore && (
              <button
                onClick={expanded ? () => setExpanded(false) : handleLearnMore}
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                {expanded ? "Show Less" : "Learn More"}
              </button>
            )}

            {isLast ? (
              <button
                onClick={onClose}
                className={`font-semibold px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 text-sm ${
                  !showLearnMore && isFirst ? "w-full" : ""
                }`}
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

          {/* Dot indicators */}
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

        const activeModals = list
          .filter((c) => isActiveCampaign(c) && c.type === "modal")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (!activeModals.length) return;

        const now = Date.now();

        // A campaign is "unseen" if it was never stored OR the stored
        // timestamp is older than ONE_HOUR_MS ago.
        const unseenCampaigns = activeModals.filter((c) => {
          const lastSeen = localStorage.getItem(`campaign_seen_${c.id}`);
          return !lastSeen || now - Number(lastSeen) >= ONE_HOUR_MS;
        });

        if (unseenCampaigns.length) {
          setModalCampaigns(unseenCampaigns);
          setShowModal(true);
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Stamp localStorage only when the user explicitly closes the modal,
  // so the 1-hour countdown starts from dismissal, not from page load.
  const handleModalClose = () => {
    const now = Date.now();
    modalCampaigns.forEach((c) =>
      localStorage.setItem(`campaign_seen_${c.id}`, String(now)),
    );
    setShowModal(false);
  };

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
        <CampaignModal campaigns={modalCampaigns} onClose={handleModalClose} />
      )}
    </>
  );
}

export default Homepage;
