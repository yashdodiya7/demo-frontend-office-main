"use client"
import PostCreationSchema from '@/schemas/ListingSchema';
import { setUserData } from '@/store/slice/authSlice';
import { createPost } from '@/store/slice/listingSlice';
import { getCookie } from 'cookies-next';
import { ErrorMessage, Field, FieldArray, Formik} from 'formik';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const amenitiesData = [
  { id: "tv", value: "1", url: "https://www.flatmate.in/TV.png" },
  {
    id: "power_backup",
    value: "2",
    url: "https://www.flatmate.in/power_backup.png",
  },
  { id: "fridge", value: "3", url: "https://www.flatmate.in/fridge.png" },
  { id: "cook", value: "4", url: "https://www.flatmate.in/cook.png" },
  { id: "kitchen", value: "5", url: "https://www.flatmate.in/kitchen.png" },
  { id: "parking", value: "6", url: "https://www.flatmate.in/parking.png" },
  { id: "wifi", value: "7", url: "https://www.flatmate.in/wifi.png" },
  {
    id: "washing_machine",
    value: "8",
    url: "https://www.flatmate.in/washing_machine.png",
  },
  { id: "ac", value: "9", url: "https://www.flatmate.in/air_conditioner.png" },
];

const highlightsData = [
  {
    id: "gated_society",
    value: "11",
  },
  { id: "park_nearby", value: "10" },
  { id: "market_nearby", value: "9" },
  { id: "no_restriction", value: "8" },
  { id: "attached_balcony", value: "7" },
  {
    id: "close_to_metro_station",
    value: "6",
  },
  { id: "newly_built", value: "5" },
  { id: "separate_washrooms", value: "4" },
  { id: "house_keeping", value: "3" },
  { id: "public_transport_nearby", value: "2" },
  { id: "gym_nearby", value: "1" },
];

const CreateList = () => {

    const dispatch = useDispatch()
    const state = useSelector((state: any) => state.list)
    const router = useRouter()
    
    const [checked, setChecked] = useState<{ [key: string]: boolean }>({
        "tv":false,
        "power_backup":false,
        "fridge":false,
        "cook":false,
        "kitchen":false,
        "parking":false,
        "wifi":false,
        "washing_machine":false,
        "ac":false,
    });

    const [maxImages, setMaxImages] = useState<number>(10);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [address, setAddress] = useState<string>('');
    const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
      lat: null,
      lng: null,
    });
    // const [isSelected, setIsSelected] = useState()
    
        
    const initialValues = {
        property_type: "",
        lease_term: "",
        approx_rent: "",
        pet_policy: "",
        smoking_policy: "",
        images: [] as any,
        occupancy: "",
        max_vacancy: "",
        looking_for: "",
        amenities: [],
        highlights: [],
        description: "",
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.currentTarget.files || []);
        setSelectedFiles(files);
    };

    const token = getCookie('token')

    const handleSubmit = async (val: any) => {
        
        const formData = new FormData();

        Object.entries(val).forEach(([key, value]) => {
            if (key !== 'amenities' && key !== 'highlights' && key !== 'mobile_visible' && key !== 'images') {
              formData.append(key, value);
            }
        });

        if (val.mobile_visible?.length > 0){
            formData.append('mobile_visible', true);
        }

        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        formData.append('amenities', JSON.stringify(val.amenities.map(Number)));
        formData.append('highlights', JSON.stringify(val.highlights.map(Number)));
        formData.append('location', address)
        formData.append('latitude', coordinates.lat)
        formData.append('longitude', coordinates.lng)

        formData.append('availability_date', '2024-04-30')

        // for (const [name, value] of formData.entries()){
        //     console.log(`${name}: ${value}`);
        // }
        
        const res = await dispatch(createPost({userToken: token , updatedata: formData}))
        if(res?.payload?.message === "Post Created"){
            dispatch(setUserData({is_host: true}))
            setTimeout(() => {
                router.push("/")
            }, 2000)
        }
    }

    const handleSelect = async (value: any) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        console.log(latLng);
        setAddress(results[0].formatted_address);
        
        // console.log(results[0].formatted_address);
        setCoordinates(latLng);
    };

  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={PostCreationSchema}
    >
      {({ handleSubmit }) => (
      <div className='mx-28 my-8 mb-24'>
        <ToastContainer/>
        <form action="#" method='POST' onSubmit={handleSubmit}>
        <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Add a POST</h2>
                            {/* <p className="mt-1 text-sm leading-6 text-gray-600">Add Choices based on your Preferences</p> */}

                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="sm:col-span-2">
                                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                        Location
                                    </label>
                                    <div className="mt-2">
                                        <PlacesAutocomplete
                                        value={address}
                                        onChange={setAddress}
                                        onSelect={handleSelect}
                                        >
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                            <input {...getInputProps({ placeholder: "Type address", className: "py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" })} />
                                            {loading ? <div>...loading</div> : null}
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className: "cursor-pointer p-2 hover:bg-gray-100"
                                                    })}
                                                >
                                                    <span className="block text-sm text-gray-800">{suggestion.description}</span>
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                        </PlacesAutocomplete>
                                    </div>
                                </div>
                                

                                <div className="sm:col-span-2">
                                    <label htmlFor="property_type" className="block text-sm font-medium leading-6 text-gray-900">
                                        Property Type
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            as="select"
                                            id="property_type"
                                            name="property_type"
                                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >   
                                            <option value="">Select Property Type</option>
                                            <option value="apartment">Apartment</option>
                                            <option value="house">House</option>
                                            <option value="room">Room</option>
                                        </Field>
                                        <ErrorMessage name="property_type" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="lease_term" className="block text-sm font-medium leading-6 text-gray-900">
                                        Lease Term
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            id="lease_term"
                                            name="lease_term"
                                            type="number"
                                            placeholder='11'
                                            className="py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage name="lease_term" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="max_vacancy" className="block text-sm font-medium leading-6 text-gray-900">
                                        Max Vacancy
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            id="max_vacancy"
                                            name="max_vacancy"
                                            type="number"
                                            placeholder='2'
                                            className="py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage name="max_vacancy" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="approx_rent" className="block text-sm font-medium leading-6 text-gray-900">
                                        Approx Rent
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            id="approx_rent"
                                            name="approx_rent"
                                            type="text"
                                            placeholder='5000'
                                            className="block w-full px-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <ErrorMessage name="approx_rent" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="pet_policy" className="block text-sm font-medium leading-6 text-gray-900 capitalize">
                                        Pet Policy
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            as="select"
                                            id="pet_policy"
                                            name="pet_policy"
                                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >   
                                            <option value="">Pet Policy</option>
                                            <option value="allowed">Allowed</option>
                                            <option value="not_allowed">Not Allowed</option>
                                        </Field>
                                        <ErrorMessage name="pet_policy" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="smoking_policy" className="block text-sm font-medium leading-6 text-gray-900 capitalize">
                                        Smoking Policy
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            as="select"
                                            id="smoking_policy"
                                            name="smoking_policy"
                                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            <option value="">Smoking Policy</option>
                                            <option value="allowed">Allowed</option>
                                            <option value="not_allowed">Not Allowed</option>
                                        </Field>
                                        <ErrorMessage name="smoking_policy" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="occupancy" className="block text-sm font-medium leading-6 text-gray-900 capitalize">
                                    Occupancy
                                    </label>
                                    <div className="mt-2">
                                    <Field
                                        as="select"
                                        id="occupancy"
                                        name="occupancy"
                                        className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">Select occupancy</option>
                                        <option value="single">Single</option>
                                        <option value="shared">Shared</option>
                                        <option value="any">Any</option>
                                    </Field>
                                    <ErrorMessage name="occupancy" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="looking_for" className="block text-sm font-medium leading-6 text-gray-900 capitalize">
                                        Looking For
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            as="select"
                                            id="looking_for"
                                            name="looking_for"
                                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >   
                                            <option value="">Looking For</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="any">Any</option>
                                        </Field>
                                        <ErrorMessage name="looking_for" component="div" className="mt-2 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className='sm:col-span-4'>
                                    <div className="flex items-center">
                                        <Field type="checkbox" value="True" name="mobile_visible" id="mobile_visible" className="w-6 h-4 mr-3" />
                                        <label htmlFor="mobile_visible" className="text-black text-sm">Mobile No Visible to Others ?</label>
                                    </div>
                                </div>

                                <div className='sm:col-span-4 flex gap-8 flex-col md:flex-row md:gap-28'>
                                    <div className=''>
                                        <FieldArray name="amenities">
                                            {({ push, remove }) => (
                                            <>
                                                <h4 className='mb-2 font-semibold text-black'>Amenities</h4>
                                                {amenitiesData.map(amenity => (
                                                    <div className="flex items-center mt-2">
                                                        <Field type="checkbox" id={amenity.id} name="amenities" value={amenity.value} className="w-6 h-4 mr-3" />
                                                        <label htmlFor={amenity.id} className="text-black text-sm capitalize">{amenity.id.replace("_", " ")}</label>
                                                    </div>
                                                ))}
                                            </>
                                            )}
                                        </FieldArray>
                                        <ErrorMessage name="amenities" component="div" className="mt-4 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                    <div className=''>
                                        <FieldArray name="highlights">
                                            {({ push, remove }) => (
                                            <>
                                                <h4 className='mb-2 font-semibold text-black'>Highlights</h4>
                                                {highlightsData.map(highlight => (
                                                    <div className="flex items-center mt-2">
                                                        <Field type="checkbox" id={highlight.id} name="highlights" value={highlight.value} className="w-6 h-4 mr-3" />
                                                        <label htmlFor={highlight.id} className="text-black text-sm capitalize">{highlight.id.replace("_", " ")}</label>
                                                    </div>
                                                ))}
                                            </>
                                            )}
                                        </FieldArray>
                                        <ErrorMessage name="highlights" component="div" className="mt-4 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>

                                <div className="sm:col-span-full">
                                    <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                                        Bio
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            as="textarea"
                                            id="bio"
                                            name="description"
                                            placeholder="Add Description"
                                            className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {/* Optional: Display validation errors */}
                                        <ErrorMessage name="description" component="div" className="mt-3 text-sm text-red-600 dark:text-red-500" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="file-input" className="sr-only">Choose file</label>
                                        <input
                                            type="file"
                                            name='images'
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            multiple
                                            className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4" 
                                        />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mt-6 flex items-center justify-center">
                        {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button> */}
                        <button
                            type="submit"
                            className="px-16 mb-8 rounded-md bg-stone-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
                        >
                            Save
                        </button>
                    </div>
            </form>
      </div>
        )}
    </Formik>
  )
}

export default CreateList