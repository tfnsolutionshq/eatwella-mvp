import ReceiptHeader from "../../Components/ReceiptComponents/ReceiptHeader";
import ReceiptDetails from "../../Components/ReceiptComponents/ReceiptDetails";
import Footer from "../../Components/LandingComponents/Footer";
import SEO from "../../Components/SEO";

function ReceiptPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Order Receipt"
        description="View your order receipt and details. Thank you for ordering from Eatwella."
      />
      <ReceiptHeader />
      <ReceiptDetails />
      <Footer />
    </div>
  );
}

export default ReceiptPage;
