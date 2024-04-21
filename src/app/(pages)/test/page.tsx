"use client"

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ToastError, ToastSuccess } from '@/components/utils/custom-error/toast';
import { ToastContainer } from 'react-toastify';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const MyForm = () => {
    const userToken = getCookie('token');
    const [selectedFiles, setSelectedFiles] = useState(); // State to store selected files
  
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
    <>
      <ToastContainer/>
      <Formik initialValues={{ aadhar: [] }} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <input
              type="file"
              name="aadhar"
              onChange={handleFileChange} // Handle file input change
            />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default MyForm;
