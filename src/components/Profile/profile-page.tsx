"use client";
import {
  otpVerifySchema,
  phoneVerifySchema,
  updateUser,
} from "@/schemas/UserSchema";
import {
  getUserProfile,
  otpVerify,
  phoneVerify,
  setOtpSessionId,
  setPhoneNumber,
  setUserData,
  updateUserProfile,
} from "@/store/slice/authSlice";
import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Loader from "../ui-component/loader";
import { ToastSuccess } from "../utils/custom-error/toast";

const ProfileComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const token: string | undefined = getCookie("token");
  const state = useSelector((state: any) => state.user);
  const userData = state.userProfile;
  const [imagePreview, setPreviewImage] = useState<any>(null);
  const [updateContact, setUpdateContact] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await dispatch(getUserProfile(token));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token, dispatch]);

  // for update a user profile
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName: string = e.target.name;
    const fieldValue: undefined | string | File =
      e.target.type === "file" ? e.target.files?.[0] : e.target.value;

    formik.setFieldValue(fieldName, fieldValue); // Set formik field value
    if (fieldName === "profile_image" && fieldValue instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(fieldValue);
      formik.setFieldValue("profile_image", fieldValue); // Set profile_image field value
    }
  };

  const handleSubmit = async (val: any) => {
    const formData = new FormData();
    formData.append("name", val.name);
    formData.append("phone_no", val.phone_no);
    formData.append("email", val.email);
    formData.append("gender", val.gender);
    formData.append("occupation", val.occupation);
    formData.append("age", val.age);
    formData.append("bio", val.bio);
    // Append other form fields as needed
    formData.append("profile_image", val.profile_image);

    try {
      setLoading(true);
      const response = await dispatch(
        updateUserProfile({ userToken: token, updatedata: formData })
      );
      dispatch(setUserData(response.payload));
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: `${userData?.name}`,
      phone_no: `${userData?.phone_no}`,
      email: `${userData?.email}`,
      bio: `${userData?.bio}`,
      profile_image: `${userData?.profile_image || ""}`,
      gender: `${userData?.gender}`,
      occupation: `${userData?.occupation}`,
      age: `${userData?.age}`,
    },
    enableReinitialize: true,
    validationSchema: updateUser,
    onSubmit: handleSubmit,
  });

  const handlePhoneSubmit = async (values: any) => {
    try {
      setLoading(true);
      // values.phone_number = "+91" + values.phone_number;
      const response = await dispatch(phoneVerify(values));
      setLoading(false);

      if (response.payload.session_token) {
        await dispatch(setPhoneNumber({ phone_no: values.phone_number }));
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleOtpSubmit = async (val: any) => {
    val.session_token = state.otp_session_id;
    val.phone_number = state.phone_no;

    try {
      const response = await dispatch(otpVerify(val));

      if (response.payload?.security_code) {
        setUpdateContact(false);
        dispatch(setPhoneNumber({ phone_no: val.phone_number }));
        dispatch(setUserData({ phone_no: val.phone_number }));
        ToastSuccess("Phone Number Updated Successfully")
        dispatch(setOtpSessionId());
      }
    } catch (error) {
      throw error;
    }
  };

  const phoneFormik = useFormik({
    initialValues: {
      phone_number: "",
    },
    validationSchema: phoneVerifySchema,
    onSubmit: handlePhoneSubmit,
  });

  const otpFormik = useFormik({
    initialValues: {
      security_code: "",
    },
    validationSchema: otpVerifySchema,
    onSubmit: handleOtpSubmit,
  });

  return (
    <div className="p-16">
      <ToastContainer />
      {loading ? <Loader/> : (
        <div className="p-4 sm:p-8 bg-stone-100 sm:w-[70%] mx-auto rounded-3xl shadow mt-24 relative">
          <div className="felx felx-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={
                  userData?.profile_image
                    ? userData?.profile_image
                    : "/images/placeholder.jpg"
                }
                width={1000}
                height={1000}
                alt="Profile"
                className="w-24 sm:w-48 h-24 sm:h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-12 sm:-mt-24 flex items-center justify-center text-indigo-500 object-cover"
              />
            </div>
          </div>

          <form
            className="mt-12 sm:mt-20"
            method="POST"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col gap-2 mt-12 sm:mt-24 items-center justify-center text-center border-b pb-6 sm:pb-12">
              <div className="bg-stone-700 cursor-pointer text-white rounded-xl shadow-lg shadow-stone-400 font-semibold px-8 py-4 hover:bg-stone-800">
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer"
                >
                  Change Profile
                </label>
                <input
                  type="file"
                  name="profile_image"
                  className="cursor-pointer"
                  id="profile-image-upload"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />
              </div>
              {imagePreview && (
                <div>
                  <Image
                    width={200}
                    height={200}
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16"
                  />
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl mt-4 sm:mt-8 font-medium text-gray-700">
                {userData?.name},{" "}
                <span className="font-light text-gray-500">
                  {userData?.age}
                </span>
              </h1>
              <p className="mt-1 text-gray-500">{userData?.occupation}</p>
              {/* <p className="mt-2 text-gray-500">University of Computer Science</p> */}
            </div>

            <div className="mb-4 sm:mb-8 mt-4 flex flex-col justify-center">
              <p className="text-gray-600 text-center font-light sm:px-16">
                {userData?.bio}
              </p>
            </div>

            {/* user profile updation form */}

            <div className="space-y-6 sm:space-y-12">
              <div className="border-b border-gray-900/10 pb-6 sm:pb-12">
                <h2 className="text-lg sm:text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Update your profile here
                </p>

                <div className="mt-10 grid grid-cols-1 gap-y-6 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.name}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* More input fields for address */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone_no"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contact Number
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone_no"
                        name="phone_no"
                        value={formik.values.phone_no}
                        type="tel"
                        placeholder="+914545453635"
                        autoComplete="tel"
                        className="px-2 bg-stone-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        placeholder="John Doe"
                        autoComplete="email"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          <span className="font-medium">
                            {formik.errors.email}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
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

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="occupation"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Occupation
                    </label>
                    <div className="mt-2">
                      <input
                        id="occupation"
                        name="occupation"
                        value={formik.values.occupation}
                        onChange={formik.handleChange}
                        type="text"
                        placeholder="Software Developer"
                        autoComplete="occupation"
                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {formik.touched.occupation && formik.errors.occupation && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.occupation}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Age
                    </label>
                    <div className="mt-2">
                      <input
                        id="age"
                        name="age"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        type="text"
                        placeholder="21"
                        autoComplete="age"
                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {formik.touched.age && formik.errors.age && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">{formik.errors.age}</span>
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-full">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Bio
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="bio"
                        name="bio"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                        placeholder="Add Something about yourself"
                        className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-12 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-x-6">
              <button
                type="submit"
                className="rounded-md shadow-stone-400 bg-stone-700 px-16 md:px-28 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setUpdateContact((prev) => !updateContact)}
                className="rounded-md shadow-stone-400 bg-gray-700 px-12 md:px-24 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {updateContact ? "Cancel" : "Update Contact"}
              </button>
            </div>

            {/* form for the update Contact */}
          </form>
          {updateContact && (
            <div className="mt-8">
              <form method="POST" onSubmit={phoneFormik.handleSubmit}>
                <div className="flex items-end justify-center">
                  <div className="w-3/4 flex flex-col">
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Phone No
                    </label>
                    <div className="mt-1 flex">
                      <input
                        id="phone_number"
                        name="phone_number"
                        value={phoneFormik.values.phone_number}
                        onChange={phoneFormik.handleChange}
                        className="flex-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500 sm:text-sm"
                        type="text"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {phoneFormik.touched.phone_number &&
                      phoneFormik.errors.phone_number && (
                        <p className="mt-2 text-sm text-red-600">
                          {phoneFormik.errors.phone_number}
                        </p>
                      )}
                  </div>
                  <div className="w-1/4 ml-4">
                    <button
                      type="submit"
                      className="inline-block w-full h-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stone-700 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              </form>

              <form
                method="POST"
                onSubmit={otpFormik.handleSubmit}
                className="mt-4"
              >
                <div className="flex items-end justify-between">
                  <div className="w-3/4 flex flex-col">
                    <label
                      htmlFor="security_code"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Verify OTP
                    </label>
                    <div className="mt-1 flex">
                      <input
                        id="security_code"
                        name="security_code"
                        value={otpFormik.values.security_code}
                        onChange={otpFormik.handleChange}
                        className="flex-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500 sm:text-sm"
                        type="number"
                        placeholder="Enter OTP"
                      />
                    </div>
                    {otpFormik.touched.security_code &&
                      otpFormik.errors.security_code && (
                        <p className="mt-2 text-sm text-red-600">
                          {otpFormik.errors.security_code}
                        </p>
                      )}
                  </div>
                  <div className="w-1/4 ml-4">
                    <button
                      type="submit"
                      className="inline-block w-full h-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stone-700 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
