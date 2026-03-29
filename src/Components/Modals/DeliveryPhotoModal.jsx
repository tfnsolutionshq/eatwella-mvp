import React, { useRef, useState, useEffect } from "react";
import { FiX, FiCamera, FiRefreshCw, FiUploadCloud } from "react-icons/fi";

const DeliveryPhotoModal = ({ isOpen, onClose, onConfirm }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [useUpload, setUseUpload] = useState(false);

  useEffect(() => {
    if (isOpen && !useUpload) {
      startCamera();
    } else {
      stopCamera();
      if (!isOpen) {
        setPhoto(null);
        setCameraError("");
        setUseUpload(false);
      }
    }

    return () => stopCamera();
  }, [isOpen, useUpload]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError("Unable to access camera. Please check your permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg"));
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const handleConfirm = () => {
    onConfirm(photo);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-5">
        <div className="border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Delivery Confirmation
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Take a photo of the delivered goods
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center mt-5">
          {photo ? (
            <img
              src={photo}
              alt="Delivery"
              className="w-full h-full object-cover"
            />
          ) : useUpload ? (
            <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full text-gray-400 hover:text-gray-300 transition-colors">
              <FiUploadCloud className="w-10 h-10" />
              <span className="text-sm">Click to upload an image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          ) : cameraError ? (
            <p className="text-red-400 text-sm text-center px-4">
              {cameraError}
            </p>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={() => {
              setUseUpload((prev) => !prev);
              setPhoto(null);
            }}
            className="text-sm text-orange-500 hover:text-orange-600 underline transition-colors"
          >
            {useUpload ? "Use camera instead" : "Upload image instead"}
          </button>
        </div>

        <div className="border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
          >
            Cancel
          </button>
          {photo ? (
            <>
              <button
                onClick={retakePhoto}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-all"
              >
                <FiRefreshCw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all"
              >
                Confirm Delivery
              </button>
            </>
          ) : (
            <button
              onClick={takePhoto}
              disabled={!!cameraError}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all disabled:opacity-50"
            >
              <FiCamera className="w-4 h-4" />
              Take Photo
            </button>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default DeliveryPhotoModal;
