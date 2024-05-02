"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../UserLayout'
import { getCookie } from 'cookies-next';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ToastError, ToastSuccess } from '@/components/utils/custom-error/toast';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const MyInterests = () => {

    const userToken = getCookie('token')

    const [interestedUsers, setInterestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const userState = useSelector((state: any) => state?.user.user)

    useEffect(() => {
      const fetchInterestedUsers = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/listing/interested`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          console.log(response.data)
          setInterestedUsers(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching interested users:", error);
          setLoading(false);
        }
      };

      fetchInterestedUsers();
    }, []);

    const handleConfirmDeal = async (listingId) => {
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
        console.log("Deal confirmed:", response.data);
        ToastSuccess(response.data.message);
        // You can perform any actions after confirming the deal, such as showing a success message
      } catch (error) {
        // Handle error
        console.error("Error confirming deal:", error);
        ToastError(error?.response?.data);
        // If there's an error, enable the button again to allow retry
        setIsButtonDisabled(false);
        // You can also show an error message to the user
      } finally {
        // Always hide the loader
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
                          className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {interestedUsers.map((user) => (
                        <tr key={user?.id} className={`${userState?.confirmed_deal ? 'bg-gray-100' : undefined}`}>
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

                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            {user?.make_deal && !userState?.confirmed_deal && (
                              <button
                                type="button"
                                onClick={() => handleConfirmDeal(user?.listing)} // Pass the listingId to the function
                                disabled={
                                  isButtonDisabled ||
                                  isRequestPending ||
                                  userState?.confirmed_deal
                                } // Disable the button based on state, if request is pending, or if already confirmed
                                className={`mr-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 ${
                                  isButtonDisabled ||
                                  isRequestPending ||
                                  userState?.confirmed_deal
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                              >
                                {isRequestPending ? ( // Show loader if request is pending
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
                            <Link
                              href={`/listdetails/${user?.listing}`}
                              className="mr-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              View Profile
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
          </div>
        )}
      </UserLayout>
    );
}

export default MyInterests