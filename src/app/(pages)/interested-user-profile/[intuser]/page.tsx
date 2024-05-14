"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../../UserLayout'
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import axios from 'axios';

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
        //   console.log("<<<",params["intuser"])
        //   console.log("<<<", response.data)
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
        <div className="flex justify-center items-center p-12 bg-gray-100">
          <div className="max-w-2xl p-8 bg-white shadow-xl rounded-lg flex flex-wrap gap-14">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={data?.profile_image || ""}
                width={1000}
                height={1000}
                alt="Profile"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Name:
              </label>
              <p className="text-gray-900">{data?.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email:
              </label>
              <p className="text-gray-900">{data?.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Contact No:
              </label>
              <p className="text-gray-900">{data?.phone_no}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Gender:
              </label>
              <p className="text-gray-900 capitalize">{data?.gender}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Occupation:
              </label>
              <p className="text-gray-900">{data?.occupation}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Age:</label>
              <p className="text-gray-900">{data?.age}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Bio:</label>
              <p className="text-gray-900">{data?.bio}</p>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default ListProfile