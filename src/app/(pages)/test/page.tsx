"use client"

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ToastError, ToastSuccess } from '@/components/utils/custom-error/toast';
import { ToastContainer } from 'react-toastify';
import UserLayout from '../UserLayout';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const MyForm = () => {

  return (
    <>
    <UserLayout>
      <div className="flex items-center justify-center my-14">
        <div className="bg-white max-w-lg w-full rounded-lg shadow-lg shadow-stone-200">
          <div className="p-8">
              
              <h2 className="text-2xl font-semibold mb-4 text-center">Yash Dodiya</h2>
              <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
                  <div className="bg-stone-200 rounded-lg shadow p-4">
                      <p className="text-lg text-stone-800">Total Amount: $500</p>
                  </div>
              </div>

              <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
              <div className="mb-8 max-h-56 overflow-y-auto">
                  <div className="bg-white rounded-lg shadow">
                      <ul>
                          <li className="border-b border-gray-200">
                              <div className="flex items-center justify-between px-4 py-3">
                                  <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-stone-700 text-white flex items-center justify-center">
                                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5l7 7-7 7"></path>
                                          </svg>
                                      </div>
                                      <div className="ml-4">
                                          <p className="text-lg font-semibold">Added $100</p>
                                      </div>
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                      02 May 2024
                                  </div>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>

              <div className="flex justify-end">
                  <button className="bg-stone-700 hover:bg-stone-800 text-white font-semibold px-4 py-2 rounded">Add to Wallet</button>
              </div>
          </div>
        </div>
      </div>
      </UserLayout>
    </>
  );
};

export default MyForm;
