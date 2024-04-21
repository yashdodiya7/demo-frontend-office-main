"use client"

import { getUserPrefernce, updateUserPreference, userPreference } from '@/store/slice/authSlice'
import { RootState } from '@/types/user'
import { getCookie } from 'cookies-next'
import { Field, Formik, useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import FormikInputField from '../utils/inputs/formikInputField'

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

const userPreferencesArray = [
    {
        name: 'pet_lover',
        value: 'Pet Lover',
    }
]


const UserChoice = () => {

    const token = getCookie('token')
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

    const userState = useSelector((state: any) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await dispatch(getUserPrefernce(token));
            setPreferences(response.payload);
          } catch (error) {
            console.error('Error fetching user preferences:', error);
          }
        };
        fetchData();
    }, [dispatch]);


    const handleSubmit = async () => {

        // Extract user_name and preferences from form values
        const payload = {
          ...preferences // Spread the preferences object into the payload
        };
        
        try{
            const response = await dispatch(updateUserPreference({userToken: token, val: payload}));
            // if (response.payload) {
                // Redirect the user to the home page
            // }
        }
        catch (error) {
            throw error
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
          [preference]: !preferences[preference]
        });
    };

    const truePreferences = Object.entries(userState.userPreferences).filter(([key, value]) => value === true);
    const falsePreferences = Object.entries(userState.userPreferences).filter(([key, value]) => value === false);
      

  return (
    <Formik
        initialValues={preferences}
        onSubmit={handleSubmit}
    >
        {({ handleSubmit }) => (
        <div className='mx-28 my-8'>
            <ToastContainer/>
            <form action="#" method='POST' onSubmit={handleSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Your Preferences</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">It will show others what kind of flatmate you prefer.</p>
                        
                        <hr className='my-10'/>

                        <div className="mx-auto flex items-start justify-center gap-24">
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">Selected Preferences</h3>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                {truePreferences.map(([key]) => (
                                    <p key={key}>
                                    <span className="px-2 py-1 rounded bg-green-500 text-white">{key.replace(/_/g, ' ')}</span>
                                    </p>
                                ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Unselected Preferences</h3>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                {falsePreferences.map(([key]) => (
                                    <p key={key}>
                                    <span className="px-2 py-1 rounded bg-red-500 text-white">{key.replace(/_/g, ' ')}</span>
                                    </p>
                                ))}
                                </div>
                            </div>
                        </div>
                        
                        <hr className='my-10'/>

                        <div>
                            <h3 className="text-md font-semibold mb-6">Update Preferences</h3>
                            <div className="flex items-baseline justify-center">
                                <div className="grid grid-cols-6 gap-4">
                                    {Object.keys(preferences).map((preference: string) => (
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



                <div className="mt-6 flex items-center justify-end gap-x-6">
                    {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button> */}
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        UPDATE
                    </button>
                </div>
            </form>
        </div>
        )}
    </Formik>
  )
}

export default UserChoice