import { useLocation } from "react-router-dom";

// ── Config ────────────────────────────────────────────────────────────────────
const WHATSAPP_PHONE_NUMBER = "09017777701"; // Replace with actual number (no + or spaces)
const WHATSAPP_MESSAGE = "Hello! I'd like to place an order."; // Pre-filled message

// ─────────────────────────────────────────────────────────────────────────────

function WhatsAppChatButton() {
  const location = useLocation();

  const isExcluded = location.pathname.startsWith("/admin");

  if (isExcluded) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      {/* Tooltip label */}
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap pointer-events-none">
        Chat with us
      </span>

      {/* WhatsApp icon button */}
      <div className="relative w-14 h-14">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />

        {/* Main circle */}
        <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20b858] rounded-full shadow-lg shadow-green-300/50 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          {/* WhatsApp SVG logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8"
            fill="white"
          >
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.773L.064 31.25a1 1 0 0 0 1.228 1.228l7.593-1.975A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.843l-.484-.291-5.01 1.304 1.322-4.874-.318-.5A13.26 13.26 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.778c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.63-.199-.896.199-.265.397-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.811.179-.178.398-.465.597-.697.199-.232.265-.398.397-.663.133-.265.066-.497-.033-.696-.1-.199-.896-2.16-1.228-2.957-.323-.776-.652-.671-.896-.683l-.763-.013c-.265 0-.696.1-1.062.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.854 1.626 4.12c.199.265 2.808 4.287 6.802 6.014.951.41 1.693.655 2.272.838.954.303 1.823.26 2.51.158.765-.114 2.354-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.365-.265-.763-.464z" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default WhatsAppChatButton;
