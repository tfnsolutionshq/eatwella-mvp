import { createPortal } from "react-dom";

const ModalWrapper = ({ onClose, children, wide = false }) => {
  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white rounded-3xl w-full shadow-xl ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default ModalWrapper;
