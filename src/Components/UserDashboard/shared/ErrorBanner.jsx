const ErrorBanner = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">
    {message}
  </div>
);

export default ErrorBanner;
