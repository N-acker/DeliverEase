import { useNavigate } from "react-router-dom"; // drop if not needed
import { useCheckout} from "../context/CheckoutContext";

export default function OrderComplete() {
  // add any props/context/hooks you need here
    const navigate = useNavigate();
    const {
      cartInfo, setCartInfo,
      selectedStoreInfo, setSelectedStoreInfo,
      customerInfo, setCustomerInfo,
      quoteResponse, setQuoteResponse,
      quote, setQuote,
      bookingResponse, setBookingResponse
  } = useCheckout();    

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order Complete</h1>
      <p className="mb-4">Thanks for your order! We’re preparing it now.</p>
      <p className="mb-4">Your Booking ID is {bookingResponse?.id}</p>
      <button onClick={() => navigate("/")} className="bg-black text-white px-4 py-2 rounded mt-6 hover:bg-gray-800 hover:shadow cursor-pointer">
        Back to home
      </button>
    </div>
  );
}
