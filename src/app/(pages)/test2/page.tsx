"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { getCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

// type Stripe = import("@stripe/stripe-js").Stripe;

// const stripePromise: Promise<Stripe | null> = publicKey ? loadStripe(publicKey) : Promise.resolve(null);

const Payment = () => {

  const userToken = getCookie('token')

  const handlePayment = async () => {
    try {
      // Fetch checkout session ID from backend
      const response = await axios.get(`${BASE_URL}/payment/create-checkout-session/`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
      });
      const sessionId = response.data.sessionId;

      // Load Stripe instance
      const stripe = await loadStripe(publicKey);
      
      // Redirect to Checkout
      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
          console.error("Error redirecting to checkout:", result.error);
        }
      }
    } catch (error) {
      console.error("Error fetching session ID:", error);
    }
  };



  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col h-full text-center">
            <div className="bg-white py-8 px-8">
              <button
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-stone-900 text-white shadow-md shadow-stone-900/10 hover:shadow-lg hover:shadow-stone-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              onClick={handlePayment}
              >
                Subscribe
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
