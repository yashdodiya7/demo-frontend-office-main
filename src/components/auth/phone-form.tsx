"use client";

import { otpVerifySchema, phoneVerifySchema } from "@/schemas/UserSchema";
import {
  otpVerify,
  phoneVerify,
  setOtpSessionId,
  setPhoneNumber,
} from "@/store/slice/authSlice";
import { useFormik } from "formik";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import Logo from "../navbar/Logo";
import Loader from "../ui-component/loader";
import ButtonLoader from "../ui-component/button-loader";

const PhoneNumberField = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  // Handler for phone number submission
  const handlePhoneSubmit = async (val: any) => {
    setLoading(true);
    try {
      val.phone_number = "+91" + val.phone_number;
      const response = await dispatch(phoneVerify(val));
      if (response.payload.session_token) {
        setLoading(false);
        await dispatch(setPhoneNumber({ phone_no: val.phone_number }));
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handler for OTP submission
  const handleOtpSubmit = async (val: any) => {
    setLoading(true);
    val.session_token = state.otp_session_id;
    val.phone_number = state.phone_no;

    try {
      const response = await dispatch(otpVerify(val));
      if (response.payload.security_code) {
        setLoading(false);
        dispatch(setOtpSessionId());
        router.push("/auth/register");
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Formik setup for phone number form
  const phoneFormik = useFormik({
    initialValues: {
      phone_number: "",
    },
    validationSchema: phoneVerifySchema,
    onSubmit: handlePhoneSubmit,
  });

  // Formik setup for OTP form
  const otpFormik = useFormik({
    initialValues: {
      security_code: "",
    },
    validationSchema: otpVerifySchema,
    onSubmit: handleOtpSubmit,
  });

  return (
    <section>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="grid place-items-center mb-6">
              <Logo />
            </div>
            <h2 className="text-start text-2xl font-bold leading-tight text-black">
              Enter Your Contact No for Verification
            </h2>
            <p className="mt-4 text-base text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
            <form
              method="POST"
              onSubmit={phoneFormik.handleSubmit}
              className="mt-8"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="phone_number"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Phone No{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone_number"
                      name="phone_number"
                      value={phoneFormik.values.phone_number}
                      onChange={phoneFormik.handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="number"
                      placeholder="6353355965"
                    ></input>
                    {phoneFormik.touched.phone_number &&
                      phoneFormik.errors.phone_number && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          <span className="font-medium">
                            {phoneFormik.errors.phone_number}
                          </span>
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    {!loading ? "Send Otp" : <ButtonLoader/>}
                  </button>
                </div>
              </div>
            </form>
            <form
              method="POST"
              onSubmit={otpFormik.handleSubmit}
              className="mt-8"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="security_code"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Verify OTP{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      id="security_code"
                      name="security_code"
                      value={otpFormik.values.security_code}
                      onChange={otpFormik.handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="123456"
                    ></input>
                    {otpFormik.touched.security_code &&
                      otpFormik.errors.security_code && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          <span className="font-medium">
                            {otpFormik.errors.security_code}
                          </span>
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    Verify <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhoneNumberField;
