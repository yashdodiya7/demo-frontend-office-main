"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../../UserLayout'
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface UserProfile {
  name: string;
  phone_no: string;
  profile_image: string;
  email: string;
  gender: string;
  occupation: string;
  bio: string;
  age: string;
  is_host: boolean;
  is_verified: boolean;
  confirmed_deal: boolean;
  is_paid: boolean;
}

const ListProfile = ({ params }: { params: any }) => {

    const [data, setData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const token = getCookie("token");

    useEffect(() => {
      const fetchInterestedUserProfile = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/listing/interesteduserprofile/${params["intuser"]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(response.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching single listing:", error);
        }
      };
      fetchInterestedUserProfile();
    });
    
    
  return (
    <UserLayout>
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-center gap-16 items-center p-8 bg-gray-100 sm:h-[90vh]">
            <Link
              href={`/interested-users`}
              className="self-start flex items-center px-4 py-2 mb-4 rounded-md bg-stone-500 text-white shadow-sm hover:bg-stone-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 15.707a1 1 0 001.414-1.414L7.414 10l3.293-3.293a1 1 0 00-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 00.707.293z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </Link>
            <div className="flex flex-col items-center justify-center bg-white p-8 shadow-xl rounded-xl mb-8 w-full sm:w-auto">
              <Image
                src={data?.profile_image || ""}
                width={200}
                height={200}
                alt="Profile"
                className="object-cover rounded-full w-52 h-52"
              />
            </div>
            <div className="w-full sm:w-1/2 p-8 bg-white shadow-xl rounded-lg flex flex-col items-center">
              <div className="border-t border-gray-200 w-full">
                <dl>
                  <div className="bg-stone-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Contact No.
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.phone_no}
                    </dd>
                  </div>
                  <div className="bg-stone-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.email}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.age}
                    </dd>
                  </div>
                  <div className="bg-stone-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Occupation
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.occupation}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Gender
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.gender}
                    </dd>
                  </div>
                  <div className="bg-stone-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">About</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {data?.bio}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </>
      )}
    </UserLayout>
  );
}

export default ListProfile