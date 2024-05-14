"use client";

import React, { useEffect, useState } from "react";
import UserLayout from "../UserLayout";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ToastError,
  ToastSuccess,
} from "@/components/utils/custom-error/toast";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { setUserData } from "@/store/slice/authSlice";
import { RootState } from "@/types/user";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  gender: string;
  phone_no: string;
  occupation: string;
  age: string;
  bio: string;
  profile_image: string;
}

interface ListingInterest {
  id: number;
  user: UserProfile;
  make_deal: boolean;
  confirm_deal: boolean;
  deposit_paid: boolean;
  created_at: string;
  listing: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const publicKey: string = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";

const MyInterests = () => {
  const userToken = getCookie("token");

  const [interestedUsers, setInterestedUsers] = useState<ListingInterest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state?.user.userProfile);

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/listing/interested`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log(response.data);
        setInterestedUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interested users:", error);
        setLoading(false);
      }
    };

    fetchInterestedUsers();
  }, [userToken, dispatch, confirmationSuccess]);

  const handlePay = async (listingId: number) => {
    try {
      setIsRequestPending(true)
      const response = await axios.post<{ sessionId: string }>(
        `${BASE_URL}/payment/wallet-add/`,
        { listing_id: listingId },
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
        setIsRequestPending(false)
        if (result.error) {
          console.error("Error redirecting to checkout:", result.error);
        }
      }
    } catch (error) {
      setIsRequestPending(false)
      console.error("Error fetching session ID:", error);
    }
  };

  const handleConfirmDeal = async (listingId: number) => {
    try {
      // Disable the button to prevent multiple clicks
      setIsButtonDisabled(true);
      setIsRequestPending(true);

      // Make the API request to confirm the deal
      const response = await axios.post(
        `${BASE_URL}/listing/confirm-deal/${listingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // Handle success response
      setConfirmationSuccess(true);
      ToastSuccess(response.data.message);
      dispatch(setUserData({ confirmed_deal: true }));
      setCookie("confirmed_deal", true);
    } catch (error: any) {
      // Handle error
      ToastError(error?.response?.data?.error);
      // If there's an error, enable the button again to allow retry
      setIsButtonDisabled(false);
    } finally {
      setIsRequestPending(false);
    }
  };

  return (
    <UserLayout>
      <ToastContainer />
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
        </div>
      ) : (
        <div className="flex flex-col mb-12 mt-8 mx-12">
          <h3 className="text-center text-m=lg font-bold uppercase text-stone-800 mb-4">
            My Interests
          </h3>
          <h3 className="text-center text-sm font-semibold uppercase text-orange-700 my-4">
            You Have to Pay Deposit First for the deal confirmation
          </h3>
          {interestedUsers.length === 0 ? ( // Conditional rendering for no interested users
            <div className="flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                <Image
                  src={
                    "https://res.cloudinary.com/dxwxpfxgi/image/upload/v1715514165/tnbdbmrvt2mfmwtpvr1g.png"
                  }
                  width={1000}
                  height={1000}
                  alt="no Data"
                  className="object-cover w-full h-full"
                />
                <p className="text-lg text-gray-800 mt-4 font-mono font-bold">
                  You do not have any interests
                </p>
              </div>
            </div>
          ) : (
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Age
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Pay
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {interestedUsers.map((user) => (
                        <tr
                          key={user?.id}
                          className={`${
                            userState?.confirmed_deal
                              ? "bg-gray-100"
                              : undefined
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  width={1000}
                                  height={1000}
                                  className="h-10 w-10 rounded-full"
                                  src={user?.user?.profile_image} // Replace 'profile_image' with the actual field name
                                  alt={user?.user?.name}
                                />
                              </div>
                              <div className="ml-4">{user?.user?.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {user?.user?.age}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {user?.created_at?.split("T")[0]}{" "}
                            {user?.created_at?.split("T")[1].split(":")[0]}:
                            {user?.created_at?.split("T")[1].split(":")[0]}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {user?.make_deal && !user?.confirm_deal && !userState?.confirmed_deal && (
                              <button
                                type="button"
                                onClick={() => handlePay(user?.listing)} // Pass the listingId to the function
                                disabled={
                                  isButtonDisabled ||
                                  isRequestPending ||
                                  userState?.confirmed_deal
                                }
                                className={`mr-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 ${
                                  isButtonDisabled ||
                                  isRequestPending ||
                                  userState?.confirmed_deal
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                              >
                                {isRequestPending ? (
                                  <svg
                                    className="animate-spin h-5 w-5 mr-3 text-blue-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.863a4.001 4.001 0 00-3.195 7.12L6 17.291z"
                                    ></path>
                                  </svg>
                                ) : (
                                  "Pay Deposit"
                                )}
                              </button>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            {user?.make_deal && !user?.confirm_deal && !userState?.confirmed_deal && (
                              <button
                                type="button"
                                onClick={() => handleConfirmDeal(user?.listing)}
                                disabled={
                                  isButtonDisabled ||
                                  isRequestPending ||
                                  userState?.confirmed_deal
                                }
                                className={`mr-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 ${
                                  isButtonDisabled ||
                                  isRequestPending ||
                                  userState?.confirmed_deal
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                              >
                                {isRequestPending ? (
                                  <svg
                                    className="animate-spin h-5 w-5 mr-3 text-blue-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.863a4.001 4.001 0 00-3.195 7.12L6 17.291z"
                                    ></path>
                                  </svg>
                                ) : (
                                  "Confirm Deal"
                                )}
                              </button>
                            )}

                            {user?.confirm_deal && userState?.confirmed_deal && (
                              <Image
                                src="/images/dealstamp.png" // Replace with the path to your deal stamp image
                                alt="Deal Stamp"
                                width={500}
                                height={500}
                                className="inline-block w-32 h-12 mr-6"
                              />
                            )}
                            <Link
                              href={`/listdetails/${user?.listing}`}
                              className="mr-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              View Listing
                            </Link>
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </UserLayout>
  );
};

export default MyInterests;
