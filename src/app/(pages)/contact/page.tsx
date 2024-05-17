"use client";

import React, { useEffect, useState } from "react";
import UserLayout from "../UserLayout";
import { useFormik } from "formik";
import { ContactFormSchema } from "@/schemas/UserSchema";
import axios from "axios";
import {
  ToastError,
  ToastSuccess,
} from "@/components/utils/custom-error/toast";
import { ToastContainer } from "react-toastify";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ContactPageOne() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() =>{
    setLoading(false)
  },[])

  const handleSubmit = async (val: any) => {
    try {
      val.phone_no = "+91" + val.phone_no;
      const response = await axios.post(
        `${BASE_URL}/user/submit-contact-form/`,
        val
      );
      ToastSuccess(response.data.message);
    } catch (error: any) {
      console.error("API Error:", error);
      ToastError("An error occurred. Please try again later.");
      throw error;
    } finally {
      formik.resetForm();
    }
    // console.log(status);
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      message: "",
    },
    validationSchema: ContactFormSchema,
    onSubmit: handleSubmit,
  });

  return (
    <UserLayout>
      <ToastContainer />
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-7xl py-12 md:py-24">
          <div className="grid items-center justify-items-center gap-x-4 gap-y-10 lg:grid-cols-2">
            {/* contact from */}
            <div className="flex items-center justify-center">
              <div className="px-2 md:px-12">
                <p className="text-2xl font-bold text-gray-900 md:text-4xl">
                  Get in touch with us
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  Our friendly team would love to hear from you.
                </p>
                <form onSubmit={formik.handleSubmit} className="mt-8 space-y-4">
                  <div className="grid w-full gap-y-4 md:gap-x-4 lg:grid-cols-2">
                    <div className="grid w-full  items-center gap-1.5">
                      <label
                        className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="first_name"
                      >
                        First Name
                      </label>
                      <input
                        onChange={formik.handleChange}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        name="first_name"
                        value={formik.values.first_name}
                        id="first_name"
                        placeholder="First Name"
                      />
                      {formik.touched.first_name &&
                        formik.errors.first_name && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                            <span className="font-medium">
                              {formik.errors.first_name}
                            </span>
                          </p>
                        )}
                    </div>
                    <div className="grid w-full  items-center gap-1.5">
                      <label
                        className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="last_name"
                      >
                        Last Name
                      </label>
                      <input
                        onChange={formik.handleChange}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        name="last_name"
                        value={formik.values.last_name}
                        id="last_name"
                        placeholder="Last Name"
                      />
                      {formik.touched.last_name && formik.errors.last_name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          <span className="font-medium">
                            {formik.errors.last_name}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full  items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      onChange={formik.handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.email}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="grid w-full  items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="phone_number"
                    >
                      Phone number
                    </label>
                    <input
                      onChange={formik.handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="tel"
                      id="phone_number"
                      value={formik.values.phone_no}
                      name="phone_no"
                      placeholder="Phone number"
                    />
                    {formik.touched.phone_no && formik.errors.phone_no && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.phone_no}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="grid w-full  items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      onChange={formik.handleChange}
                      name="message"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      id="message"
                      value={formik.values.message}
                      placeholder="Leave us a message"
                      cols={3}
                    />
                    {formik.touched.message && formik.errors.message && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.message}
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
            <Image
              width={500}
              height={500}
              alt="Contact us"
              className="hidden max-h-full w-full rounded-lg object-cover lg:block"
              src={"https://res.cloudinary.com/dxwxpfxgi/image/upload/v1715511089/jmjjtdn28dw15oqbexzx.jpg" || ""}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
