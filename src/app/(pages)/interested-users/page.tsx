"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../UserLayout'
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { ToastSuccess } from '@/components/utils/custom-error/toast';
import { ToastContainer } from 'react-toastify';

interface InterestedUser {
  id: number;
  user: User;
  make_deal: boolean;
  confirm_deal: boolean;
  created_at: string;
  listing: number;
}

interface User {
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

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const InterestedUsers = () => {

    const userToken = getCookie('token')

    const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
      const fetchInterestedUsers = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/listing/interestedusers`, {
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
    }, [refreshData, userToken]);

    const handleMakeDeal = async (listingId: number, userId: number) => {
      try {
          const response = await axios.post(
              `${BASE_URL}/listing/make-deal`,
              { listingId, userId },
              {
                  headers: {
                      Authorization: `Bearer ${userToken}`,
                  },
              }
          );
          setRefreshData(prev => !prev);
          ToastSuccess(response.data.success);
          // Handle success, e.g., show a success message
      } catch (error) {
          console.error("<<<Error making deal:", error);
          // Handle error, e.g., show an error message
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
            Interested users
          </h3>
          {interestedUsers.length === 0 ? ( // Conditional rendering for no interested users
            <div className="flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
              <Image
              src={"https://res.cloudinary.com/dxwxpfxgi/image/upload/v1715514165/tnbdbmrvt2mfmwtpvr1g.png"}
              width={1000}
              height={1000}
              alt='no Data'
              className='object-cover w-full h-full'
              />
              <p className="text-lg text-gray-800 mt-4 font-mono font-bold">No one is interested at the moment.</p>
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
                          className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {interestedUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  width={1000}
                                  height={1000}
                                  className="h-10 w-10 rounded-full"
                                  src={user.user.profile_image} // Replace 'profile_image' with the actual field name
                                  alt={user.user.name}
                                />
                              </div>
                              <div className="ml-4">{user.user.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {user.user.age}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {user.created_at.split("T")[0]}{" "}
                            {user.created_at.split("T")[1].split(":")[0]}:
                            {user.created_at.split("T")[1].split(":")[0]}
                          </td>

                          <td className="px-6 flex justify-end items-center py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              type="button"
                              disabled={user.make_deal}
                              onClick={() =>
                                handleMakeDeal(user.listing, user.user.id)
                              }
                              className="mr-2 inline-flex items-center text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              {user.confirm_deal ? (
                                // Render a "Deal Done" button icon if confirm_deal is true
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-green-800"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                // Render a "Make a Deal" button if confirm_deal is false
                                "Make a Deal"
                              )}
                            </button>

                            <Link
                              href={`/interested-user-profile/${user.user.id}`}
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
          )}
        </div>
      )}
    </UserLayout>
  );
}

export default InterestedUsers