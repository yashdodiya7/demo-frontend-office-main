"use client"
import { getUserProfile, updateUserProfile } from '@/store/slice/authSlice'
import { getCookie } from 'cookies-next'
import { useFormik } from 'formik'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'


const ProfileComponent = () => {

    // const userAge = getUserAge(userData?.date_of_birth)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const token = getCookie('token')
    // const [previewImage, setPreviewImage] = useState();
    const userData = useSelector((state: any) => state.user.userProfile)

    useEffect(() => {
        dispatch(getUserProfile(token))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }, [])

    useEffect(() => {
        // Update form values when userData changes
        if (userData) {
            formik.setValues({
                name: userData.name || '',
                phone_no: userData.phone_no || '',
                profile_image: userData.profile_image || null,
                bio: userData.bio || '',
                gender: userData.gender || '',
                occupation: userData.occupation || '',
                age: userData.age || '',
            });
        }
    }, [userData]);

    // for update a user profile
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    
        formik.setFieldValue(fieldName, fieldValue); // Set formik field value
    
        if (fieldName === 'profile_image') {
            formik.setFieldValue('profile_image', fieldValue); // Set profile_image field value
        }
    };
    
    
    
    const handleSubmit = async (val: any) => {
        const formData = new FormData();
        formData.append('name', val.name);
        formData.append('phone_no', val.phone_no);
        formData.append('gender', val.gender);
        formData.append('occupation', val.occupation);
        formData.append('age', val.age);
        // Append other form fields as needed
        formData.append('profile_image', val.profile_image);

        try {
            
            await dispatch(updateUserProfile({ userToken: token, updatedata: formData }))
            
            }
            catch (error) {
                throw error
            } finally {
            }
            // console.log(status);
        }
        
        const formik = useFormik({
            initialValues: {
                name: `${userData.name}`,
                phone_no: `${userData.phone_no}`,
                bio: `${userData.bio}`,
                profile_image: null,
                // date_of_birth: `${userData.date_of_birth}`,
                gender: `${userData.gender}`,
                occupation: `${userData.occupation}`,
                age: `${userData.age}`,
            },
            // validationSchema: loginValidation,
            onSubmit: handleSubmit,
        })


    return (
        <div className="p-16">
            <ToastContainer/>
            {loading ? ( // Show loader if loading is true
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
                </div>
            ) : (
            <div className="p-8 bg-stone-100 sm:w-[70%] mx-auto rounded-3xl shadow mt-24 relative">
                <div className="felx felx-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Image src={userData.profile_image !== "null" ? userData.profile_image : "/images/placeholder.jpg"} width={1000} height={1000} alt='Profile' className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500 object-cover" />
                    </div>
                </div>

                <form className='mt-20' method='POST' onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-1 mt-24 items-center justify-center text-center border-b pb-12">
                        <div className="bg-stone-700 cursor-pointer text-white rounded-xl shadow-lg shadow-stone-400 font-semibold px-8 py-4 hover:bg-stone-800">
                            <label htmlFor="profile-image-upload" className='cursor-pointer'>Change Profile</label>
                            <input type="file" name='profile_image' className='cursor-pointer' id="profile-image-upload" accept="image/*" hidden onChange={handleChange}/>
                        </div>
                        <h1 className="text-4xl mt-8 font-medium text-gray-700">{userData?.name}, <span className="font-light text-gray-500">{userData.age}</span></h1>
                        <p className="font-light text-gray-600 mt-1">{userData.location} Surat</p>
                        <p className="mt-1 text-gray-500">{userData.occupation}</p>
                        {/* <p className="mt-2 text-gray-500">University of Computer Science</p> */}
                    </div>

                    <div className="mb-8 mt-4 flex flex-col justify-center">
                        <p className="text-gray-600 text-center font-light lg:px-16">{userData.bio}</p>

                        {/* <button
                        className="text-indigo-500 py-2 px-4  font-medium mt-4"
                    >
                        Show more
                    </button> */}
                    </div>

                    {/* user profile updation form */}

                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Update your profile here</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Full Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="name"
                                            name="name"
                                            type="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            placeholder='John Doe'
                                            autoComplete="email"
                                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                {/* More input fields for address */}

                                <div className="sm:col-span-2">
                                    <label htmlFor="phone_no" className="block text-sm font-medium leading-6 text-gray-900">
                                        Contact Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="phone_no"
                                            name="phone_no"
                                            value={formik.values.phone_no}
                                            onChange={formik.handleChange}
                                            type="tel"
                                            placeholder='+914545453635'
                                            autoComplete="tel"
                                            className="px-2     block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                {/* <div className="sm:col-span-2">
                                    <label htmlFor="date-of-birth" className="block text-sm font-medium leading-6 text-gray-900">
                                        Date of Birth
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="date-of-birth"
                                            name="date-of-birth"
                                            value={formik.values.date_of_birth}
                                            onChange={formik.handleChange}
                                            type="date"
                                            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div> */}

                                <div className="sm:col-span-2">
                                    <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
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
                                    {/* {formik.touched.gender && formik.errors.gender && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            <span className='font-medium'>{formik.errors.gender}</span>
                                        </p>
                                    )} */}
                            </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="occupation" className="block text-sm font-medium leading-6 text-gray-900">
                                        Occupation
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="occupation"
                                            name="occupation"
                                            value={formik.values.occupation}
                                            onChange={formik.handleChange}
                                            type="text"
                                            placeholder='Software Developer'
                                            autoComplete="occupation"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
                                        Age
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="age"
                                            name="age"
                                            value={formik.values.age}
                                            onChange={formik.handleChange}
                                            type="text"
                                            placeholder='21'
                                            autoComplete="age"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-full">
                                    <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                                        Bio
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={formik.values.bio}
                                            onChange={formik.handleChange}
                                            placeholder='Add Something about yourself'
                                            className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        ></textarea>
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
                            className="rounded-md shadow-lg shadow-stone-400 bg-stone-700 px-28 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            )}
        </div>
    )
}

export default ProfileComponent