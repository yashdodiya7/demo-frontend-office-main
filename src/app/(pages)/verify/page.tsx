"use client"

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ToastError, ToastSuccess } from '@/components/utils/custom-error/toast';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const Verify = () => {

    const userToken = getCookie('token');
    const [selectedFiles, setSelectedFiles] = useState(); // State to store selected files
    const router = useRouter()
  
    const handleSubmit = async (values, { setSubmitting }) => {
      const formData = new FormData();
      
        formData.append('aadhar', selectedFiles);

        for (const [name, value] of formData.entries()){
          console.log(`${name}: ${value}`);
        }
  
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
        if (response.data.is_verified){
          ToastSuccess("Verified")
          router.push('/createlist')
        }
      } catch (error) {
        ToastError(error.response.data.message)
      }
  
      setSubmitting(false);
    };

  const handleFileChange = (event) => {
    const files = event.currentTarget.files[0]
    setSelectedFiles(files);
  };

  return (
    <div className="flex justify-center items-center p-12 bg-gray-100 min-h-screen">
        <ToastContainer/>
    <div className="max-w-2xl p-8 bg-white shadow-xl rounded-lg flex flex-wrap gap-2">
        <h2 className="text-2xl font-semibold mb-4">Please Upload Aadhar Card for Verification</h2>
        <p className="text-gray-700">To complete the verification process, please follow these guidelines:</p>
        <ol className="list-decimal list-inside mb-6">
            <li className="mb-2 text-blue-600">Ensure the Aadhar card image is clear and legible.</li>
            <li className="mb-2 text-blue-600">The uploaded image should show the front page of the Aadhar card.</li>
            <li className="mb-2 text-blue-600">Make sure your name and surname on your user profile matches the name and surname on the Aadhar card.</li>
        </ol>
        <p className="text-gray-700">If an error occurs during upload, please:</p>
        <ol className="list-decimal list-inside mb-6">
            <li className="mb-2 text-red-500">Verify that the Aadhar card image is clear and not blurry.</li>
            <li className="mb-2 text-red-500">Ensure the uploaded image shows the complete front side of the Aadhar card.</li>
            <li className="mb-2 text-red-500">Check that the name and surname on your user profile match exactly with the name and surname on the Aadhar card.</li>
        </ol>
        <p className="text-gray-700">Thank you for your cooperation.</p>

        <Formik initialValues={{ aadhar: [] }} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form className="flex items-center gap-4">
                    <label htmlFor="file-input" className="sr-only">Choose file</label>
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
    </div>
</div>
  );
}

export default Verify