"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../UserLayout'
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const InterestedUsers = () => {

    const userToken = getCookie('token')

    const [interestedUsers, setInterestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
    }, []);

  return (
    <UserLayout>
        {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
        </div>
      ) : (
        <div className="flex flex-col mb-12 mt-8 mx-12">
        <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {interestedUsers.map(user => (
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
                            <div className="ml-4">
                            {user.user.name}
                            </div>
                        </div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.user.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.created_at.split('T')[0]} {user.created_at.split('T')[1].split(':')[0]}:{user.created_at.split('T')[1].split(':')[0]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <Link href={`/listprofile/${user.listing}`} type="button" className="mr-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">View Profile</Link>
                        <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
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
  )
}

export default InterestedUsers