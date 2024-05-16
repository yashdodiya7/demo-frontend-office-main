"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  ToastError,
  ToastSuccess,
} from "@/components/utils/custom-error/toast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { setUserData } from "@/store/slice/authSlice";
import { useDispatch } from "react-redux";
import UserLayout from "../UserLayout";
import Image from "next/image";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Verify = () => {
  const userToken = getCookie("token");
  const [selectedFiles, setSelectedFiles] = useState<File | null>(null); // State to store selected files
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (!selectedFiles) {
      // Handle the case where selectedFiles is null
      ToastError("Please select a file");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("aadhar", selectedFiles);

    try {
      const response = await axios.post(
        `${BASE_URL}/user/aadharverify`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.is_verified) {
        ToastSuccess("Verified");
        dispatch(setUserData({ is_verified: true }));
        router.push("/create-listing");
      }
    } catch (error: any) {
      ToastError(error.response.data.message);
    }

    setSubmitting(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.currentTarget.files;
    if (files?.length) {
      setSelectedFiles(files[0]);
    }
  };

  const renderImagePreviews = () => {
    if (selectedFiles) {
      const imageUrl = URL.createObjectURL(selectedFiles);
      return (
        <div className="relative inline-block mb-4 mr-4">
          <Image
            width={500}
            height={500}
            src={imageUrl}
            alt="Preview Image"
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <UserLayout>
      <div className="flex justify-center items-center p-8 bg-gray-100 h-[89vh]">
        <ToastContainer />
        <div className="max-w-2xl p-8 bg-white shadow-xl rounded-lg flex flex-wrap gap-2 justify-between">
          <h2 className="text-2xl font-semibold mb-4">
            Please Upload Aadhar Card for Verification
          </h2>
          <p className="text-blue-700 font-semibold">We won't store your aadhar card it is only for the verification</p>
          <p className="text-gray-700">
            To complete the verification process, please follow these
            guidelines:
          </p>
          <ol className="list-decimal list-inside mb-6">
            <li className="mb-2 text-orange-600">
              Ensure the Aadhar card image is clear and legible.
            </li>
            <li className="mb-2 text-orange-600">
              The uploaded image should show the front page of the Aadhar card.
            </li>
            <li className="mb-2 text-orange-600">
              Make sure your name and surname on your user profile matches the
              name and surname on the Aadhar card.
            </li>
          </ol>
          <p className="text-red-600 font-semibold -mt-5">With this verification you are agree to provide your <span>contact No.</span> for the communication between users</p>
          <p className="text-gray-700 mt-4">Thank you for your cooperation.</p>

          <Formik initialValues={{ aadhar: [] }} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="flex items-center gap-4">
                <label htmlFor="file-input" className="sr-only">
                  Choose file
                </label>
                <input
                  type="file"
                  name="aadhar"
                  onChange={handleFileChange}
                  className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-stone-700 focus:ring-stone-700 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:py-3 file:px-4"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-stone-700 text-white rounded-lg font-semibold hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
          {renderImagePreviews()}
        </div>
      </div>
    </UserLayout>
  );
};

export default Verify;
