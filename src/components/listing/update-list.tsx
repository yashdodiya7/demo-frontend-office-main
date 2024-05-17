"use client"


import { fetchUpdateListingData, updatePost } from '@/store/slice/listingSlice';
import { getCookie } from 'cookies-next';
import { ErrorMessage, Field, FieldArray, Formik} from 'formik';
import React, { FormEventHandler, useEffect, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Logo from '../navbar/Logo';
import AmenitiesInputField from '../utils/inputs/AmenitiesInputField';
import { AiOutlineColumnHeight } from 'react-icons/ai';
import HighlightsInputField from '../utils/inputs/HighlightsInputField';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastSuccess } from '../utils/custom-error/toast';
import { setUserData } from '@/store/slice/authSlice';
import Image from 'next/image';
import { PostCreationSchema } from '@/schemas/ListingSchema';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const amenitiesData = [
  { id: "tv", value: "9" },
  { id: "power_backup", value: "8" },
  { id: "fridge", value: "7" },
  { id: "cook", value: "6" },
  { id: "kitchen", value: "5" },
  { id: "parking", value: "4" },
  { id: "wifi", value: "3" },
  { id: "washing_machine", value: "2" },
  { id: "ac", value: "1" },
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

interface FormDataState {
  property_type: string;
  lease_term: string;
  approx_rent: string;
  pet_policy: string;
  smoking_policy: string;
  occupancy: string;
  looking_for: string;
  max_vacancy: string;
  amenities: string[];
  highlights: string[];
  description: string;
  images: string[];
}

type FormDataStateWithoutAmenitiesAndHighlights = Omit<FormDataState, "amenities" | "highlights">;

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

const UpdateList = () => {

    const dispatch = useDispatch()
    const token = getCookie('token')
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [address, setAddress] = useState<string>("");
    const [coordinates, setCoordinates] = useState<Coordinates>({
        lat: null,
        lng: null
    });

    const router = useRouter();

    const [amenitiesChecked, setAmenitiesChecked] = useState<{ [key: string]: boolean }>({
      tv: false,
      power_backup: false,
      fridge: false,
      cook: false,
      kitchen: false,
      parking: false,
      wifi: false,
      washing_machine: false,
      ac: false,
    });

    const [highlightsChecked, setHighlightsChecked] = useState<{ [key: string]: boolean }>({
      gated_society: false,
      park_nearby: false,
      market_nearby: false,
      no_restriction: false,
      attached_balcony: false,
      close_to_metro_station: false,
      newly_built: false,
      separate_washrooms: false,
      house_keeping: false,
      public_transport_nearby: false,
      gym_nearby: false,
    });
    
    const [newAmenity, setNewAmenity] = useState<string[]>([]);
    const [newHighlight, setNewHighlight] = useState<string[]>([]);

    
    // updated code for fetching data
    const [formDataState, setFormDataState] = useState<FormDataState>({
      property_type: "",
      lease_term: "",
      approx_rent: "",
      pet_policy: "",
      smoking_policy: "",
      occupancy: "",
      looking_for: "", 
      max_vacancy: "",
      amenities: [],
      highlights: [],
      description: "",
      images: [],
    });

    useEffect(() => {
      const fetchUpdateData = async () => {
        try {
          setLoading(true)
          const data = await dispatch(fetchUpdateListingData(token));
          const latLng = {
            lat: data.payload.latitude,
            lng: data.payload.longitude,
          };
          setCoordinates(latLng);
          setAddress(data.payload.location);

          // Update amenitiesChecked based on data from the backend
          const updatedAmenitiesChecked = { ...amenitiesChecked };
          data.payload.amenities.forEach((amenity: string) => {
            if (updatedAmenitiesChecked.hasOwnProperty(amenity)) {
              updatedAmenitiesChecked[amenity] = true;
            }
          });
          setAmenitiesChecked(updatedAmenitiesChecked);

          // Update highlightsChecked based on data from the backend
          const updatedHighlightsChecked = { ...highlightsChecked };
          data.payload.highlights.forEach((highlight: string) => {
            if (updatedHighlightsChecked.hasOwnProperty(highlight)) {
              updatedHighlightsChecked[highlight] = true;
            }
          });
          setHighlightsChecked(updatedHighlightsChecked);

          setSelectedFiles(data.payload.image_urls);

          setFormDataState(data.payload);

          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUpdateData();
    }, [dispatch]);


    
    const initialValues: FormDataState = {
        property_type: formDataState ? formDataState.property_type : "",
        lease_term: formDataState ? formDataState.lease_term : "",
        approx_rent: formDataState ? formDataState.approx_rent : "",
        max_vacancy: formDataState ? formDataState.max_vacancy: "",
        pet_policy: formDataState ? formDataState.pet_policy : "",
        smoking_policy: formDataState ? formDataState.smoking_policy : "",
        images: [] as any,
        amenities: [], // Add this line to match FormDataState
        highlights: [],
        occupancy: formDataState ? formDataState.occupancy : "",
        looking_for: formDataState ? formDataState.looking_for : "",
        description: formDataState ? formDataState.description : "",
    };
    
    
    const handleSubmit = async (val: FormDataState) => {

        // console.log("<<<",val);
        
        const formData = new FormData();

        Object.entries(val).forEach(([key, value]) => {
          if (
            key !== "amenities" &&
            key !== "highlights" &&
            key !== "images"
          ) {
            formData.append(key, value);
          }
        });

        // if (val.mobile_visible.length > 0) {
        //   formData.append("mobile_visible", true);
        // }

        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        formData.append("amenities", JSON.stringify(newAmenity.map(Number)));
        formData.append("highlights", JSON.stringify(newHighlight.map(Number)));
        formData.append("location", address);
        if (coordinates.lat && coordinates.lng) {
          formData.append("latitude", coordinates.lat.toString());
          formData.append("longitude", coordinates.lng.toString());
        }

        // formData.append("availability_date", "2024-04-30");

        // for (const [name, value] of formData.entries()) {
        //   console.log(`<<< ${name}: ${value}`);
        // }
        setLoading(true)
        const res = await dispatch(updatePost({userToken: token , updatedata: formData}))
        setLoading(false)
        // console.log("<<<Response: ",res.data);
    }
        
    const handleSelect = async (value: any) => {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setAddress(results[0].formatted_address);
      setCoordinates(latLng);
    };
    
    const handleAmenitiesChange = (amenity: any) => {
        setAmenitiesChecked({
            ...amenitiesChecked,
            [amenity]: !amenitiesChecked[amenity]
        });
    };

    const handleHighlightsChange = (highlight: any) => {
      setHighlightsChecked({
        ...highlightsChecked,
        [highlight]: !highlightsChecked[highlight],
      });
    };

    // Function to update newAmenity based on amenitiesChecked
    const updateNewAmenity = () => {
      const updatedNewAmenity: string[] = [];
      Object.entries(amenitiesChecked).forEach(([key, value]) => {
        if (value) {
          const amenityObj = amenitiesData.find(
            (amenity) => amenity.id === key
          );
          if (amenityObj) {
            updatedNewAmenity.push(amenityObj.value);
          }
        }
      });
      setNewAmenity(updatedNewAmenity);
    };

    useEffect(() => {
      updateNewAmenity();
    }, [amenitiesChecked]);

    const updateNewHighlight = () => {
      const updatedNewHighlight: string[] = [];
      Object.entries(highlightsChecked).forEach(([key, value]) => {
        if (value) {
          const highlightObj = highlightsData.find(
            (highlight) => highlight.id === key
          );
          if (highlightObj) {
            updatedNewHighlight.push(highlightObj.value);
          }
        }
      });
      setNewHighlight(updatedNewHighlight);
    };

    useEffect(() => {
      updateNewHighlight();
    }, [highlightsChecked]);

    const handleDelete = async () => {
      try {
        const response = await axios.delete(`${BASE_URL}/listing/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        
        if (response.status === 204) {
          ToastSuccess("Listing deleted successfully")
          dispatch(setUserData({is_host: false}))
          setLoading(true)
          setTimeout(() => {
            setLoading(false);
            router.push('/'); // Redirect to the home page
          }, 2000)
        } else {
          console.error('Failed to delete listing');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.currentTarget?.files;
    if (!files) return;

    const fileList = Array.from(files);
    const mergedFiles = [...selectedFiles, ...fileList];
    setSelectedFiles(mergedFiles);
    // setSelectedFiles(files);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file, index) => index !== indexToRemove)
    );
  };

  const renderImagePreviews = () => {
    return selectedFiles.map((file, index) => {
      if (typeof file === "string") {
        // Render existing image URL with remove button
        return (
          <div key={index} className="relative inline-block mb-4 mr-4">
            <Image
              width={500}
              height={500}
              src={file}
              alt={`Preview ${index}`}
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
            >
              X
            </button>
          </div>
        );
      } else {
        // Render newly selected file with remove button
        return (
          <div key={index} className="relative inline-block mb-4 mr-4">
            <Image
              width={500}
              height={500}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
            >
              X
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div>
      <ToastContainer />
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={PostCreationSchema}
        >
          {({ handleSubmit }) => (
            <div className="mx-4 md:mx-28 my-8 mb-24">
              <div className="grid place-items-center mb-4">
                <Logo />
              </div>
              <form action="#" method="POST" onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Update a POST
                    </h2>
                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">Add Choices based on your Preferences</p> */}
                    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Location
                        </label>
                        <div className="mt-2">
                          <PlacesAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div className='relative'>
                                <input
                                  {...getInputProps({
                                    placeholder: "Type address",
                                    className:
                                      "py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                  })}
                                />
                                <div className="absolute z-10 left-0 bg-white mt-1 border border-gray-300 rounded-md shadow-md">
                                  {loading ? <div>...loading</div> : null}
                                  {suggestions.map((suggestion, index) => (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className:
                                          "cursor-pointer p-2 hover:bg-gray-100",
                                        key: index,
                                      })}
                                    >
                                      <span className="block text-sm text-gray-800">
                                        {suggestion.description}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="property_type"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Property Type
                        </label>
                        <div className="mt-2">
                          <Field
                            as="select"
                            id="property_type"
                            name="property_type"
                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="room">Room</option>
                          </Field>
                          <ErrorMessage
                            name="property_type"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="lease_term"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Lease Term
                        </label>
                        <div className="mt-2">
                          <Field
                            id="lease_term"
                            name="lease_term"
                            type="number"
                            placeholder="11"
                            className="py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <ErrorMessage
                            name="lease_term"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="max_vacancy"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Max Vacancy
                        </label>
                        <div className="mt-2">
                          <Field
                            id="max_vacancy"
                            name="max_vacancy"
                            type="number"
                            placeholder="11"
                            className="py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <ErrorMessage
                            name="max_vacancy"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="approx_rent"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Approx Rent
                        </label>
                        <div className="mt-2">
                          <Field
                            id="approx_rent"
                            name="approx_rent"
                            type="text"
                            placeholder="5000"
                            className="block w-full px-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <ErrorMessage
                            name="approx_rent"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="pet_policy"
                          className="block text-sm font-medium leading-6 text-gray-900 capitalize"
                        >
                          Pet Policy
                        </label>
                        <div className="mt-2">
                          <Field
                            as="select"
                            id="pet_policy"
                            name="pet_policy"
                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="allowed">Allowed</option>
                            <option value="not_allowed">Not Allowed</option>
                          </Field>
                          <ErrorMessage
                            name="pet_policy"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="smoking_policy"
                          className="block text-sm font-medium leading-6 text-gray-900 capitalize"
                        >
                          Smoking Policy
                        </label>
                        <div className="mt-2">
                          <Field
                            as="select"
                            id="smoking_policy"
                            name="smoking_policy"
                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="allowed">Allowed</option>
                            <option value="not_allowed">Not Allowed</option>
                          </Field>
                          <ErrorMessage
                            name="smoking_policy"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="occupancy"
                          className="block text-sm font-medium leading-6 text-gray-900 capitalize"
                        >
                          Occupancy
                        </label>
                        <div className="mt-2">
                          <Field
                            as="select"
                            id="occupancy"
                            name="occupancy"
                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="single">Single</option>
                            <option value="shared">Shared</option>
                            <option value="any">Any</option>
                          </Field>
                          <ErrorMessage
                            name="occupancy"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="looking_for"
                          className="block text-sm font-medium leading-6 text-gray-900 capitalize"
                        >
                          Looking For
                        </label>
                        <div className="mt-2">
                          <Field
                            as="select"
                            id="looking_for"
                            name="looking_for"
                            className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="any">Any</option>
                          </Field>
                          <ErrorMessage
                            name="looking_for"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6 flex gap-2 flex-col md:flex-col md:gap-2">
                        <div>
                          <h3 className="text-md font-semibold mb-6">
                            Amenities
                          </h3>
                          <div className="flex flex-wrap items-baseline justify-center">
                            <div className="grid grid-cols-3 sm:grid-cols-6 sm:gap-4">
                              {Object.keys(amenitiesChecked).map(
                                (amenity: string) => (
                                  <AmenitiesInputField
                                    key={amenity}
                                    id={amenity}
                                    name={amenity}
                                    value={amenity}
                                    checked={amenitiesChecked[amenity]}
                                    onChange={() =>
                                      handleAmenitiesChange(amenity)
                                    }
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-md font-semibold mb-6">
                            Highlights
                          </h3>
                          <div className="flex flex-wrap items-center justify-center">
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                              {Object.keys(highlightsChecked).map(
                                (highlight: string) => (
                                  <HighlightsInputField
                                    key={highlight}
                                    id={highlight}
                                    name={highlight}
                                    value={highlight}
                                    checked={highlightsChecked[highlight]}
                                    onChange={() =>
                                      handleHighlightsChange(highlight)
                                    }
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label
                          htmlFor="bio"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
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
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="mt-3 text-sm text-red-600 dark:text-red-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-sm text-black mb-2 block">
                          Upload Image file
                        </label>
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={handleFileChange}
                          multiple
                          className="w-full text-black text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-black rounded"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          PNG, JPG are Allowed.
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex">{renderImagePreviews()}</div>

                    <p className="mt-1 font-semibold text-sm text-orange-600">
                      {selectedFiles.length < 2 &&
                        "Minimum 2 Images to be uploaded"}
                      {selectedFiles.length > 5 && "Maximum 5 Images allowed"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-baseline justify-start sm:flex-row">
                  <button
                    type="submit"
                    disabled={
                      selectedFiles.length < 2 || selectedFiles.length > 5
                    }
                    className="capitalize mb-2 px-16 sm:mb-8 rounded-md bg-stone-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="capitalize ml-8 px-16 mb-2 rounded-md bg-red-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          )}
        </Formik>
      )}
    </div>
  );
}

export default UpdateList