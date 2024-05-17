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

  const [selectedCount, setSelectedCount] = useState<number>(0);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Calculate the count of selected preferences
    const count = Object.values(preferences).filter((value) => value).length;
    setSelectedCount(count);
  }, [preferences]);

  const handleSubmit = async () => {
    const payload = {
      ...preferences,
    };

    try {
      const response = await dispatch(userPreference({ userToken: token, val: payload }));
      console.log(response.payload);

      if (response.payload) {
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
                {selectedCount < 4 && (
                  <p className="text-red-500 text-center mt-4">
                    Please select at least four preferences.
                  </p>
                )}
                </h4>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <div className="grid grid-cols-6 gap-4">
                      {Object.keys(preferences).map((preference) => (
                        <FormikInputField
                          key={preference}
                          id={preference}
                          name={preference}
                          value={preference}
                          checked={preferences[preference as keyof userPreferences]}
                          onChange={() => handleChange(preference as keyof userPreferences)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-x-6">
              <button
                type="submit"
                disabled={selectedCount < 4}
                className={`rounded-md px-16 py-2 text-sm font-semibold text-white shadow-sm 
                  ${selectedCount < 4 ? 'bg-gray-400 cursor-not-allowed' : 'bg-stone-600 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600'}`}
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
