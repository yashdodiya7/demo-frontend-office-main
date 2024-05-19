"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { registerSchema } from "@/schemas/UserSchema";
import FormMessage from "../ui-component/message";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "@/store/slice/authSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/types/user";
import { ToastContainer } from "react-toastify";
import Logo from "../navbar/Logo";
import Loader from "../ui-component/loader";
import ButtonLoader from "../ui-component/button-loader";

interface RegisterFormValues {
  email: string;
  password: string;
  password2: string;
  name: string;
  gender: string;
  phone_no: string;
  age: string | number | readonly string[] | undefined;
}

interface FormikErrors {
  [key: string]: string | undefined;
}

const RegisterForm: React.FC = () => {
  const [success, setSuccess] = useState<boolean | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.user);
  const router = useRouter();

  // Handle submit for the register form
  const handleSubmit = async (val: RegisterFormValues) => {
    try {
      setLoading(true)
      val.phone_no = state.phone_no
      const response = await dispatch(userRegister(val));
      if (response.payload.message === "registration successfull") {
        // Redirect the user to the home page
        setLoading(true)
        setSuccess(true);
        router.push("/auth/choice");
      }
    } catch (error) {
      setLoading(false)
      throw error;
    } finally {
      setLoading(false)
    }
  };

  // Formik for the form submission
  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      email: "",
      name: "",
      gender: "",
      phone_no: "",
      password: "",
      password2: "",
      age: "",
    },
    validationSchema: registerSchema,
    onSubmit: handleSubmit,
  });

  return (
    <section>
      <ToastContainer />
      {/* {loading ? <Loader/> : ( */}
        <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:pb-16 lg:px-8 lg:pb-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="grid place-items-center mb-4">
              <Logo />
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight text-black">
              Sign up to create account
            </h2>
            <p className="mt-2 text-center text-base text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
            <form onSubmit={formik.handleSubmit} method="POST" className="mt-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Full Name{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      name="name"
                      id="name"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="John Doe"
                    ></input>
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.name}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      name="email"
                      type="email"
                      placeholder="johndoe@example.com"
                      id="email"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    ></input>
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.email}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-start gap-10">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Gender
                    </label>
                    <div className="mt-2">
                      <select
                        id="gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">-----</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    {formik.touched.gender && formik.errors.gender && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.gender}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="age"
                        className="text-base font-medium text-gray-900"
                      >
                        Age{" "}
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        name="age"
                        type="number"
                        placeholder="20"
                        id="age"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      ></input>
                      {formik.touched.age && formik.errors.age && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          <span className="font-medium">
                            {formik.errors.age}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Password{" "}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      name="password"
                      type="password"
                      placeholder="*****"
                      id="password"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    ></input>
                    {formik.touched.password && formik.errors.password && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.password}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Confirm Password{" "}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      value={formik.values.password2}
                      onChange={formik.handleChange}
                      name="password2"
                      type="password"
                      placeholder="*****"
                      id="password2"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    ></input>
                    {formik.touched.password2 && formik.errors.password2 && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.password2}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80`}
                  >
                    {loading ? <ButtonLoader/> : <>Create Account <ArrowRight className="ml-2" size={16} /></>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      {/* // )} */}
    </section>
  );
};

export default RegisterForm;
