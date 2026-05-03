const ModalWrapper = ({ onClose, children, wide = false }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div
      className={`bg-white rounded-3xl w-full shadow-xl ${wide ? "max-w-2xl" : "max-w-md"}`}
    >
      {children}
    </div>
  </div>
);

export default ModalWrapper;
