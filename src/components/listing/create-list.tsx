"use client";

import { setUserData } from "@/store/slice/authSlice";
import { createPost } from "@/store/slice/listingSlice";
import { getCookie } from "cookies-next";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { FormEventHandler, useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import AmenitiesInputField from "../utils/inputs/AmenitiesInputField";
import HighlightsInputField from "../utils/inputs/HighlightsInputField";
import { PostCreationSchema } from "@/schemas/ListingSchema";
import TextNumberInputField from "../utils/inputs/TextNumberInputField";
import SelectInputField from "../utils/inputs/SelectInputField";

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

const CreateList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.list);
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });
  // const [isSelected, setIsSelected] = useState()

  const [amenitiesChecked, setAmenitiesChecked] = useState({
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
  const [newAmenity, setNewAmenity] = useState([]);

  const [highlightsChecked, setHighlightsChecked] = useState({
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
  const [newHighlight, setNewHighlight] = useState([]);

  const initialValues = {
    property_type: "apartment",
    lease_term: "",
    approx_rent: "",
    pet_policy: "allowed",
    smoking_policy: "allowed",
    images: [] as any,
    occupancy: "single",
    max_vacancy: "",
    looking_for: "male",
    amenities: [],
    highlights: [],
    description: "",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    setSelectedFiles(files);
  };

  const token = getCookie("token");

  const handleSubmit = async (val: any) => {
    try {
      const formData = new FormData();

      Object.entries(val).forEach(([key, value]) => {
        if (
          key !== "amenities" &&
          key !== "highlights" &&
          key !== "mobile_visible" &&
          key !== "images"
        ) {
          formData.append(key, value);
        }
      });

      if (val.mobile_visible?.length > 0) {
        formData.append("mobile_visible", true);
      }

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // formData.append("amenities", JSON.stringify(val.amenities.map(Number)));
      formData.append("amenities", JSON.stringify(newAmenity.map(Number)));
      formData.append("highlights", JSON.stringify(newHighlight.map(Number)));
      formData.append("location", address);
      formData.append("latitude", coordinates.lat);
      formData.append("longitude", coordinates.lng);

      formData.append("availability_date", "2024-04-30");

      // for (const [name, value] of formData.entries()){
      //     console.log(`${name}: ${value}`);
      // }
      setLoading(true);
      const res = await dispatch(
        createPost({ userToken: token, updatedata: formData })
      );

      if (res?.payload?.message === "Post Created") {
        dispatch(setUserData({ is_host: true }));
        setTimeout(() => {
          router.push("/");
          setLoading(false);
        }, 1000);
      }
      setLoading(false);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error as needed
    }
  };
  

  const handleAmenitiesChange = (amenity: any) => {
    setAmenitiesChecked({
      ...amenitiesChecked,
      [amenity]: !amenitiesChecked[amenity],
    });
  };

  const handleHighlightsChange = (highlight: any) => {
    setHighlightsChecked({
      ...highlightsChecked,
      [highlight]: !highlightsChecked[highlight],
    });
  };

  const updateNewAmenity = () => {
    const updatedNewAmenity = [];
    Object.entries(amenitiesChecked).forEach(([key, value]) => {
      if (value) {
        const amenityObj = amenitiesData.find((amenity) => amenity.id === key);
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
    const updatedNewHighlight = [];
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

  const handleSelect = async (value: any) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log(latLng);
    setAddress(results[0].formatted_address);

    // console.log(results[0].formatted_address);
    setCoordinates(latLng);
  };


  const renderImagePreviews = () => {
    return selectedFiles.map((file, index) => {
      // Render newly selected file with remove button
      return (
        <div key={index} className="relative inline-block mb-4 mr-4">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
        </div>
      );
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
          <div className="mx-28 my-8 mb-24">
            <form action="#" method="POST" onSubmit={handleSubmit}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Add a POST
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
                            <div>
                              <input
                                {...getInputProps({
                                  placeholder: "Type address",
                                  className:
                                    "py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                })}
                              />
                              {loading ? <div>...loading</div> : null}
                              {suggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  {...getSuggestionItemProps(suggestion, {
                                    className:
                                      "cursor-pointer p-2 hover:bg-gray-100",
                                  })}
                                >
                                  <span className="block text-sm text-gray-800">
                                    {suggestion.description}
                                  </span>
                                </div>
                              ))}
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

                    {/* <SelectInputField initialValue="apartment" name="Property Type" value="property_type" options={["apartment", "house", "room"]}/> */}

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

                    {/* <TextNumberInputField name="Lease Term" type="number" value="lease_term" placeholder="11"/> */}

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
                          placeholder="2"
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

                    <div className="sm:col-span-4">
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          value="True"
                          name="mobile_visible"
                          id="mobile_visible"
                          className="w-6 h-4 mr-3"
                        />
                        <label
                          htmlFor="mobile_visible"
                          className="text-black text-sm"
                        >
                          Mobile No Visible to Others ?
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-6 flex gap-2 flex-col md:flex-col md:gap-2">
                      <div>
                        <h3 className="text-md font-semibold mb-6">
                          Amenities
                        </h3>
                        <div className="flex flex-wrap items-baseline justify-center">
                          <div className="grid grid-cols-6 gap-4">
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
                          <div className="grid grid-cols-6 gap-4">
                            {Object.keys(highlightsChecked).map(
                              (highlight: string) => (
                                <HighlightsInputField
                                  type="checkbox"
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
                      <label htmlFor="file-input" className="sr-only">
                        Choose file
                      </label>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                        className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex">{renderImagePreviews()}</div>
                  <p className="mt-1 font-semibold text-sm text-red-600 dark:text-red-500">
                    {selectedFiles.length < 2 &&
                      "Minimum 2 Images to be uploaded"}
                    {selectedFiles.length > 5 && "Maximum 5 Images allowed"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <button
                  type="submit"
                  disabled={
                    selectedFiles.length < 2 || selectedFiles.length > 5
                  }
                  className="px-16 mb-8 rounded-md bg-stone-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
        )}
    </div>
  );
};

export default CreateList;
