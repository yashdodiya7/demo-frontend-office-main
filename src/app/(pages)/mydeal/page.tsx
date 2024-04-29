"use client"

import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import UserLayout from '../UserLayout';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const MyDeal = () => {
  const [dealData, setDealData] = useState(null);
  const userToken = getCookie('token')

  useEffect(() => {
    const fetchDealData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/listing/my-deal`, {
          headers:{
            Authorization: `Bearer ${userToken}`,
          }
        });
        setDealData(response.data);
      } catch (error) {
        console.error('Error fetching deal data:', error);
      }
    };

    fetchDealData();
  }, []); // Empty dependency array ensures that the effect runs only once after the initial render

  return (
    <UserLayout>
      <div className="flex justify-center items-center max-h-screen p-10">
      {dealData ? (
        <div className="max-w-3xl p-8 bg-white shadow-xl rounded-lg flex flex-wrap gap-14">
          {/* User 1 Card */}
          <div className="flex flex-col items-center justify-center border border-gray-300 p-4 rounded-lg">
            <img
              src={dealData.logged_in_user_profile.profile_image}
              width={100}
              height={100}
              alt="Profile 1"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <p className="text-gray-900 font-bold mt-4">{dealData.logged_in_user_profile.name}</p>
            <p className="text-gray-700">{dealData.logged_in_user_profile.email}</p>
            <p className="text-gray-700">{dealData.logged_in_user_profile.phone_no}</p>
            {/* Add more user details here */}
          </div>
          {/* Deal Indicator */}
          <div className="text-center my-auto mx-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* User 2 Card */}
          <div className="flex flex-col items-center justify-center border border-gray-300 p-4 rounded-lg">
            <img
              src={dealData.listing_owner_profile.profile_image}
              width={100}
              height={100}
              alt="Profile 2"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <p className="text-gray-900 font-bold mt-4">{dealData.listing_owner_profile.name}</p>
            <p className="text-gray-700">{dealData.listing_owner_profile.email}</p>
            <p className="text-gray-700">{dealData.listing_owner_profile.phone_no}</p>
            {/* Add more user details here */}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </UserLayout>
  );
};

export default MyDeal;