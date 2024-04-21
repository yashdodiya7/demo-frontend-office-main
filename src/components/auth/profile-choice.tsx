"use client";

import { userPreference } from "@/store/slice/authSlice";
import { getCookie } from "cookies-next";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormikInputField from "../utils/inputs/formikInputField";

interface userPreferences {
  night_owl: boolean;
  party_lover: boolean;
  early_bird: boolean;
  pet_lover: boolean;
  studious: boolean;
  vegan: boolean;
  fitness_freak: boolean;
  non_alcoholic: boolean;
  sporty: boolean;
  music_lover: boolean;
  non_smoker: boolean;
  wanderer: boolean;
}

const ProfileChoice = () => {
  const token = getCookie("token");
  const [preferences, setPreferences] = useState({
    night_owl: false,
    party_lover: false,
    early_bird: false,
    pet_lover: false,
    studious: false,
    vegan: false,
    fitness_freak: false,
    non_alcoholic: false,
    sporty: false,
    music_lover: false,
    non_smoker: false,
    wanderer: false,
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const payload = {
      ...preferences,
    };

    try {
      const response = await dispatch(userPreference({ userToken: token, val: payload }));
      console.log(response.payload);

      if (response.payload) {
        // Redirect the user to the home page
        // setSuccess(true)
        router.push("/");
      }
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const handleChange = (preference: keyof userPreferences) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference],
    });
  };

  // Disable scrolling when the component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <Formik
      initialValues={preferences}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit }) => (
        <div className="mx-28 my-8">
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Your Preferences
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  It will show others what kind of flatmate you prefer.
                </p>

                <h4 className="mb-14 mt-8 text-center font-semibold text-black">
                  Select Preferences
                </h4>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <div className="grid grid-cols-6 gap-4">
                      {Object.keys(preferences).map((preference) => (
                        <FormikInputField
                          type="checkbox"
                          key={preference}
                          id={preference}
                          name={preference}
                          value={preference}
                          checked={preferences[preference]}
                          onChange={() => handleChange(preference)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-x-6">
              {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button> */}
              <button
                type="submit"
                className="rounded-md bg-stone-600 px-16 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default ProfileChoice;
