"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../../UserLayout'
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleListingUserProfile } from '@/store/slice/listingSlice';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { ToastError, ToastSuccess } from '@/components/utils/custom-error/toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const ListProfile = ({ params }: { params: any }) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false);
    const [buttonClick, setButtonClick] = useState(false);
    const userStateData = useSelector((state: any) => state.user.userProfile)
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
    }, [dispatch, buttonClick]);


    const handleInterestedClick = async () => {
      try {
        setButtonLoading(true);
        const res = await axios.post(`${BASE_URL}/listing/listings/${params['profile']}/interested`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("<<<",res.data)
        if(res.status == 201){
          ToastSuccess("Successfully Interested")
        }
        setButtonLoading(true);
        // If API call is successful, you can add further actions here if needed
      } catch (error) {
        console.log("<<<",error);
        ToastError(error.response?.data?.error)
        setButtonLoading(false);
        console.error('Error marking as interested:', error);
      } finally {
        setButtonLoading(false);
        setButtonClick(prevState => !prevState);
      }
    };
    
    
  return (
    <UserLayout>
      <ToastContainer/>
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
            <button
              onClick={handleInterestedClick}
              className={`px-12 mt-4 rounded-md bg-stone-700 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 ${
                buttonLoading || data.interested || userStateData.is_host || userStateData.confirmed_deal ? 'opacity-50 pointer-events-none' : ''
              }`}
              disabled={buttonLoading || data.interested || userStateData.is_host || userStateData.confirmed_deal}
            >
              {buttonLoading ? 'Loading...' : 'Interested'}
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default ListProfile