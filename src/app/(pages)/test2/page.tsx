"use client"

import React from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import axios from "axios";
import { getCookie } from "cookies-next";

const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const publicKey: string = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";

const Payment: React.FC = () => {
  const userToken: string | undefined = getCookie('token');

  const handlePayment = async (planType: string) => {
    try {
      const response = await axios.post<{ sessionId: string }>(
        `${BASE_URL}/payment/wallet-add/`,
        {},
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
    <div className="flex justify-center items-center h-screen">
      <div className="grid lg:grid-cols-2 px-8 gap-10 text-zinc-800 mt-10">
        <div className="flex flex-col items-center bg-slate-100 p-8 rounded-lg shadow-lg max-w-sm">
          <div>
            <h2 className="font-extrabold text-3xl text-center mb-2">
              Basic
            </h2>
            <p className="opacity-60 text-center">
              For the interim.
            </p>
            <div className="flex flex-col items-center my-8">
              <p className="font-extrabold text-4xl">&#8377;200</p>
              <p className="text-sm opacity-60">/month</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <b>Access to all user profiles and details</b>
            </p>
            <p className="flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <b>Full website access for 1 month</b>
            </p>
            <div className="flex justify-center mt-8 ">
              <button className="border px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl"
                onClick={handleBasicPlanClick}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-gradient-to-br from-blue-100 via-orange-100 to-purple-100 p-8 rounded-lg shadow-lg relative border-8 border-orange-200 max-w-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="w-20 h-20 absolute -top-11 -left-11 fill-red-400"
          >
            <path
              fillRule="evenodd"
              d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="mono text-sm absolute -top-4 bg-red-400 text-zinc-100 py-0.5 px-2 font-bold tracking-wider rounded">
            POPULAR
          </p>
          <div>
            <div className="flex gap-4 justify-center">
              <p className="font-extrabold text-3xl mb-2">Pro</p>
            </div>
            <p className="opacity-60 text-center">
              Long-term commitment sought.
            </p>
            <p className="opacity-60 text-center"></p>
            <div className="flex gap-4 justify-center">
              <div className="flex flex-col items-center my-8">
                <p className="font-extrabold text-4xl">&#8377; 349</p>
                <p className="text-sm opacity-60">/2 month</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <b>Access to all user profiles and details</b>
            </p>
            <p className="flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <b>Full website access for 2 month</b>
            </p>
            <div className="flex justify-center mt-8">
              <button className="px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl"
                onClick={handlePremiumPlanClick}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
