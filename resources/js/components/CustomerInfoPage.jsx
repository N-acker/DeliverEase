import { useNavigate } from "react-router-dom";
import { useCheckout } from "../context/CheckoutContext.jsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddressInput from "../utilities/AddressInput.jsx";

export default function CustomerInfoPage() {

  const {
    cartInfo, setCartInfo,
    selectedStoreInfo, setSelectedStoreInfo,
    customerInfo, setCustomerInfo,
    quoteResponse, setQuoteResponse,
    quote, setQuote
  } = useCheckout();

  const navigate = useNavigate();

  // useRef is for storing values that persist across renders
  const debounceRef = useRef(null); //stores the timeout ID so you can cancel it if inputs change again before 700ms passes. Prevents spamming the API.
  const inFlightRef = useRef(false); // tracks if a request is already in progress, so you don't send overlapping requests.

  const handleChange = (e) => {

    let value = e.target.value;

    if (e.target.name === 'phone') {
      // keep display formatted, but limit to digits for formatting
      // all this does is format the number so that's it's good to be sent in
      let digits = value.replace(/\D/g, '').slice(0, 10); // max 10 digits (NANP)
      if (digits.length <= 3) {
        value = digits;
      } else if (digits.length <= 6) {
        value = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
      } else {
        value = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      }
    }

    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value }); //THIS RIGHT HERE IS WHERE NAME AND VALUE COME IN HANDY

  }; 

  const handleGenerateQuote = async () => {

     // guard: require necessary inputs
    if (
      !selectedStoreInfo?.address ||
      !customerInfo?.address ||
      !customerInfo?.name ||
      !customerInfo?.phone ||
      customerInfo?.coordinates?.lat == null ||
      selectedStoreInfo?.coordinates?.lat == null ||
      !(cartInfo?.manifestTotal > 0)
    ) {
      return null;
    }

     // clean phone for API (remove formatting)
    const dropoffPhoneDigits = (customerInfo.phone || '').replace(/\D/g, '');
    if (dropoffPhoneDigits.length < 10) {
      console.warn('Phone invalid for quote:', customerInfo.phone, dropoffPhoneDigits);
      return null; // or show UI error to user
    }

    const params = {
        pickup_address: selectedStoreInfo.address,
        dropoff_address: customerInfo.address,
        pickup_latitude: selectedStoreInfo.coordinates.lat,
        pickup_longitude: selectedStoreInfo.coordinates.lng,
        dropoff_latitude: customerInfo.coordinates.lat,
        dropoff_longitude: customerInfo.coordinates.lng,
        pickup_phone_number: selectedStoreInfo.phone,
        dropoff_phone_number: customerInfo.phone,
        manifest_total_value: cartInfo.manifestTotal,
        external_store_id: selectedStoreInfo.store_id,
    }

    setQuote(params);

     // avoid overlapping requests since inflight makes sure that the request is over before sending another
    if (inFlightRef.current) return null;
    inFlightRef.current = true;

    try {
      const response = await axios.post('/api/uber/quote', params);
      setQuoteResponse(response.data); //here we set up the quote in our context
      console.log('Quote generated:', quoteResponse);
    } catch (error) {
      console.error('Error generating quote', error.response?.data || error.message);
      return null;
    } finally {
      inFlightRef.current = false;
    }
  };

  const hasQuote = quoteResponse?.fee != null;

  // auto-generate quote when required inputs are present (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // all the conditions we check for
    const shouldGenerate =
      selectedStoreInfo?.address &&
      customerInfo?.address &&
      customerInfo?.name &&
      customerInfo?.phone &&
      customerInfo?.coordinates?.lat != null &&
      selectedStoreInfo?.coordinates?.lat != null &&
      cartInfo?.manifestTotal > 0;

    // make sure conditions are true 
    if (!shouldGenerate) return;

    // generate the quote
    debounceRef.current = setTimeout(() => {
      handleGenerateQuote();
    }, 700);

    // if user types again within 700ms, clear the old timer
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [
    selectedStoreInfo?.store_id,
    selectedStoreInfo?.address,
    selectedStoreInfo?.coordinates?.lat,
    selectedStoreInfo?.coordinates?.lng,
    customerInfo.address,
    customerInfo.name,
    customerInfo.phone,
    customerInfo.coordinates?.lat,
    customerInfo.coordinates?.lng,
    cartInfo?.manifestTotal,
  ]);
  // the useEffect is triggered when the above have a change to them

  const handleCreateOrder = async () => {

     try {
      const response = await axios.post('/api/uber/book', params);
      setQuoteResponse(response.data); //here we set up the quote in our context
      console.log('Quote generated:', quoteResponse);
    } catch (error) {
      console.error('Error generating quote', error.response?.data || error.message);
      return null;
    }
    navigate("/congrats");
  }

  return (
    <div className="p-6 max-w-lg mx-auto border w-full mb-4 mt-4">
      <h2 className="text-xl mb-4">Enter Your Info:</h2>

      <AddressInput
        name="address"
        value={customerInfo.address}
        onChange={handleChange} //onChange, which captures every keystroke, onSelect only fires when a meaningful selection is made
        onSelect={(coords) => {
          setCustomerInfo(prev => ({
            ...prev,
            coordinates: { ...coords },
          }));
          console.log("destination lat/lng:", coords);
        }}
        className="border p-2 w-full mb-4"
        placeholder="Delivery Address"
      />
      <input
        name="name"
        value={customerInfo.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="border p-2 w-full mb-2"
      />
      <input
        name="phone"
        value={customerInfo.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="border p-2 w-full mb-2"
      />

      {hasQuote && (<button
        onClick={handleCreateOrder}
        className="bg-black text-white px-4 py-2 mt-4 rounded"
      >
        Create Delivery
      </button>
      )}

      {/* Cart */}    
      <div className= "max-w-lg mx-auto border w-full mb-4 mt-4 pb-4 pl-4">

        {/* Chosen Location */}
        <h2 className="text-xl mt-6">Store Location:</h2>
        {selectedStoreInfo.address && ( // the first part means only show block if selectedStoreInfo.address exists
          <div className="mb-2">
            {selectedStoreInfo.address}
          </div>
        )}
        <h2 className="text-xl mt-6">Cart:</h2>
        <ul className="mb-4">
            {cartInfo.cart.map((c, idx) => ( // c is the current item in the cart and idx is the current index of the item in the cart
              <li key={idx} > {/* key is the unique identifier of every item in the map*/}  
                  <span>
                    {c.quantity} × {c.name} (${(c.price / 100).toFixed(2)})
                  </span>
                              
              </li>
              ))}
        </ul>  

        <h2 className="text-xl mt-6">Cart Totals (with Uber Direct Fee):</h2>
          <div className="mb-2">
            <div>Subtotal: ${((cartInfo.totalBeforeTax || 0) / 100).toFixed(2)}</div>
            <div>HST: ${(((cartInfo.manifestTotal || 0) - (cartInfo.totalBeforeTax || 0)) / 100).toFixed(2)}</div>
            <div>Uber Direct: ${(((quoteResponse?.fee ?? 0) / 100)).toFixed(2)}</div>
            <div>Total: ${((cartInfo.manifestTotal + quoteResponse?.fee || 0) / 100).toFixed(2)}</div>
          </div>   

      </div>

    </div>
  );
}
