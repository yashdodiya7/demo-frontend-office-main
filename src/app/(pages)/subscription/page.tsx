"use client"

import React from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import axios from "axios";
import { getCookie } from "cookies-next";
import UserLayout from "../UserLayout";

const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const publicKey: string = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";

const Payment: React.FC = () => {
  const userToken: string | undefined = getCookie('token');

  const handlePayment = async (planType: string) => {
    try {
      const response = await axios.post<{ sessionId: string }>(
        `${BASE_URL}/payment/create-checkout-session/`,
        { planType },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const sessionId: string = response.data.sessionId;

      const stripe: Stripe | null = await loadStripe(publicKey);

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

  const handleBasicPlanClick = () => {
    handlePayment('basic');
  };
  
  const handlePremiumPlanClick = () => {
    handlePayment('premium');
  };

  return (
    <UserLayout>
      <div className="flex justify-center items-center max-h-screen">
        <div className="grid lg:grid-cols-2 px-8 gap-10 text-stone-800 my-12">
          <div className="flex flex-col items-center bg-slate-100 p-8 rounded-lg shadow-lg max-w-sm overflow-hidden">
            <div>
              <h2 className="font-extrabold text-3xl text-center mb-2">
                Basic
              </h2>
              <p className="opacity-60 text-center">For the interim.</p>
              <div className="flex flex-col items-center my-8">
                <p className="font-extrabold text-4xl">&#8377;200</p>
                <p className="text-sm opacity-60">/month</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="flex items-center text-sm">
                <b>Access to all user profiles and details</b>
              </p>
              <p className="flex items-center text-sm">
                <b>Full website access for 1 month</b>
              </p>
              <div className="flex justify-center mt-8">
                <button
                  className="border px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl"
                  onClick={handleBasicPlanClick}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-100 via-orange-100 to-purple-100 p-8 rounded-lg shadow-lg relative border-8 border-orange-200 max-w-sm overflow-hidden">
            <div>
              <h2 className="font-extrabold text-3xl text-center mb-2">Premium</h2>
              <p className="opacity-60 text-center">Long-term commitment sought.</p>
              <div className="flex gap-4 justify-center">
                <div className="flex flex-col items-center my-8">
                  <p className="font-extrabold text-4xl">&#8377; 349</p>
                  <p className="text-sm opacity-60">/2 month</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="flex items-center text-sm">
                <b>Access to all user profiles and details</b>
              </p>
              <p className="flex items-center text-sm">
                <b>Full website access for 2 month</b>
              </p>
              <div className="flex justify-center mt-8">
                <button
                  className="px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl"
                  onClick={handlePremiumPlanClick}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Payment;
