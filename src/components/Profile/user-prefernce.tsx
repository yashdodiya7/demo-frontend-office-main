"use client";

import {
  getUserPrefernce,
  updateUserPreference,
  userPreference,
} from "@/store/slice/authSlice";
import { RootState } from "@/types/user";
import { getCookie } from "cookies-next";
import { Field, Formik, useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
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

// const userPreferencesArray = [
//   {
//     name: "pet_lover",
//     value: "Pet Lover",
//   },
// ];

const UserChoice = () => {
  const token = getCookie("token");
  const [preferences, setPreferences] = useState<userPreferences>({
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
  const userState = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getUserPrefernce(token));
        setPreferences(response.payload);
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Calculate the count of selected preferences
    const count = Object.values(preferences).filter((value) => value).length;
    setSelectedCount(count);
  }, [preferences]);

  const handleSubmit = async () => {
    // Extract user_name and preferences from form values
    const payload = {
      ...preferences, // Spread the preferences object into the payload
    };

    try {
      const response = await dispatch(
        updateUserPreference({ userToken: token, val: payload })
      );
      // if (response.payload) {
      // Redirect the user to the home page
      // }
    } catch (error) {
      throw error;
    } finally {
    }
  };

  useEffect(() => {
    if (userState.userPreferences) {
      setPreferences(userState.userPreferences);
    }
  }, [userState.userPreferences]);

  const handleChange = (preference: keyof userPreferences) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference],
    });
  };

//   const truePreferences = Object?.entries(preferences).filter(
//     ([key, value]) => value === true
//   );
//   const falsePreferences = Object?.entries(preferences).filter(
//     ([key, value]) => value === false
//   );

  return (
    <Formik initialValues={preferences} onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <div className="mx-auto px-4 my-8 sm:px-6 lg:px-8 md:my-8">
          <ToastContainer />
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900 text-center">
                  Your Preferences
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
                  It will show others what kind of flatmate you prefer.
                </p>
                {selectedCount < 4 && (
                  <p className="text-red-500 text-center mt-4">
                    Please select at least four preferences.
                  </p>
                )}

                {/* <hr className="my-10" /> */}

                {/* <div className="mx-auto flex items-start justify-center gap-24">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                      Selected Preferences
                    </h3>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {truePreferences.map(([key]) => (
                        <p key={key}>
                          <span className="px-2 py-1 rounded bg-green-500 text-white">
                            {key.replace(/_/g, " ")}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Unselected Preferences
                    </h3>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {falsePreferences.map(([key]) => (
                        <p key={key}>
                          <span className="px-2 py-1 rounded bg-red-500 text-white">
                            {key.replace(/_/g, " ")}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div> */}

                {/* <hr className="my-10" /> */}

                <div className="mt-12 mx-auto">
                  <div className="flex items-baseline justify-center">
                    <div className="grid grid-cols-3 gap-2 md:gap-4 md:grid-cols-6">
                      {Object.keys(preferences).map((preference) => (
                        <FormikInputField
                          key={preference}
                          id={preference}
                          name={preference}
                          value={preference}
                          checked={
                            preferences[preference as keyof userPreferences]
                          }
                          onChange={() =>
                            handleChange(preference as keyof userPreferences)
                          }
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
                  ${
                    selectedCount < 4
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-stone-600 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
                  }`}
              >
                UPDATE
              </button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default UserChoice;
