import { useNavigate } from "react-router-dom";
import { useCheckout } from "../context/CheckoutContext.jsx";
import { useState } from "react";
import axios from "axios";
import AddressInput from "./AddressInput.jsx";

export default function CustomerInfoPage() {
  const { 
    selectedStore, 
    cart, 
    setCustomerInfo, 
    setQuote, 
    form, 
    setForm, 
    destLatLng,
    setDestLatLng, } = useCheckout();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }; //THIS RIGHT HERE IS WHERE NAME AND VALUE COME IN HANDY 

  const handleQuote = async () => {

    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store_id: selectedStore,
        cart,
        dropoff_address: form.address,
        name: form.name,
        phone: form.phone
      })
    });

    const data = await response.json();
    setQuote(data);
    navigate("/quote");
  };

  return (
    <div className="p-6 max-w-lg mx-auto border w-full mb-4 mt-4">
      <h2 className="text-xl mb-4">Enter Your Info:</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="border p-2 w-full mb-2"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="border p-2 w-full mb-2"
      />
      <AddressInput
        name="address"
        value={form.address}
        onChange={handleChange} //onChange, which captures every keystroke, onSelect only fires when a meaningful selection is made
        onSelect={(coords) => {
          setDestLatLng(coords);
          console.log("destination lat/lng:", coords);
        }}
        className="border p-2 w-full mb-4"
        placeholder="Delivery Address"
      />
      <button
        onClick={handleQuote}
        className="bg-black text-white px-4 py-2 mt-4"
      >
        Generate Quote
      </button>
    </div>
  );
}
