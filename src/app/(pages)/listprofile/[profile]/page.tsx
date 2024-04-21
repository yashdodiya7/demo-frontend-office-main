"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../../UserLayout'
import ProfileComponent from '@/components/Profile/profile-page'
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { fetchSingleListingUserProfile } from '@/store/slice/listingSlice';
import { getCookie } from 'cookies-next';

const ListProfile = ({ params }: { params: any }) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const token = getCookie("token");

    useEffect(() => {
      // Define an asynchronous function inside the useEffect
      const fetchData = async () => {
        try {
          // Fetch listings when the component mounts
          const res = await dispatch(
            fetchSingleListingUserProfile({
              userToken: token,
              id: params["profile"],
            })
          );
          setData({ ...res.payload });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching single listing:", error);
        }
      };
      // Call the asynchronous function
      fetchData();
    }, [dispatch]);
    
    
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
                src={data.profile_image}
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
              <p className="text-gray-900">{data.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email:
              </label>
              <p className="text-gray-900">{data.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Contact No:
              </label>
              <p className="text-gray-900">{data.phone_no}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Gender:
              </label>
              <p className="text-gray-900 capitalize">{data.gender}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Occupation:
              </label>
              <p className="text-gray-900">{data.occupation}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Age:</label>
              <p className="text-gray-900">{data.age}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Bio:</label>
              <p className="text-gray-900">{data.bio}</p>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default ListProfile