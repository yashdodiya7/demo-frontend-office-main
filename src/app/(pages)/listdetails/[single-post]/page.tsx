"use client";

import { fetchSingleListing } from "@/store/slice/listingSlice";
import { getCookie } from "cookies-next";
import { Check, MapPin } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserLayout from "../../UserLayout";
import AmenitiesField from "@/components/utils/inputs/AmenitiesField";
import PreferncesField from "@/components/utils/inputs/PreferncesField";
import MapComponent from "@/components/map/map-component";
import Link from "next/link";
import { loadStripe, StripeError } from "@stripe/stripe-js";
import LoginPopup from "@/components/utils/popup/login-popup";
import { useRouter } from "next/navigation";
import SubscriptionPopUp from "@/components/utils/popup/subscription-popup";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

type Stripe = import("@stripe/stripe-js").Stripe;

const stripePromise: Promise<Stripe | null> = publicKey ? loadStripe(publicKey) : Promise.resolve(null);


const SingleDetails = ({ params }: { params: any }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [data, setData] = useState({});
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter()

  const token = getCookie("token");

  const userPaid = useSelector((state:any) => state?.user?.userProfile?.is_paid)

  useEffect(() => {
    // Define an asynchronous function inside the useEffect
    const fetchData = async () => {
      try {
        // Fetch listings when the component mounts
        const res = await dispatch(
          fetchSingleListing({ userToken: token, id: params["single-post"] })
        );
        setData({ ...res.payload });
      } catch (error) {
        console.error("Error fetching single listing:", error);
      }
    };
    // Call the asynchronous function
    fetchData();
  }, [dispatch]);

  const handleLinkClick = () => {
    if (!token) {
      setShowLoginPopup(true); // Show login popup if no token
    } else if (!userPaid) {
      setShowSubscriptionPopup(true); // Show subscription popup if user is not paid
    } else {
      router.push(`/listprofile/${params["single-post"]}`); // Redirect if user is paid and has token
    }
  };
  // console.log(data);

  return (
    <UserLayout>
      <div className="flex min-h-screen">
        <div className="container mx-auto px-28 py-8 flex justify-center">
          {/* Left side - Profile card */}
          <div className="w-96 pr-8">
            <div className="bg-white shadow flex flex-col justify-center items-center rounded-lg p-4">
              {/* Profile image */}
              <div className="mx-auto">
                <Image
                  alt="profile image"
                  className="object-cover w-20 h-20 bg-gray-200 rounded-full mb-4"
                  src={data?.user_profile_image}
                  width={1000}
                  height={1000}
                />
              </div>
              {/* User details */}
              <h2 className="text-lg font-semibold mb-2">{data?.user_name}</h2> 
              <p className="text-sm text-gray-600 mb-2">
                {data?.user_occupation}
              </p>
              <p className="text-sm text-gray-600">{data?.gender}</p>
                <button
                    onClick={handleLinkClick}
                    className="px-12 mt-4 rounded-md bg-stone-700 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800"
                >
                    View Profile
                </button>
            {showLoginPopup && (
                <LoginPopup
                    onClose={() => setShowLoginPopup(false)}
                    onLogin={() => {
                        // Handle login logic here
                        // For example, navigate to the login page
                        router.push('/auth/login');
                    }}
                />
            )}
            {showSubscriptionPopup && (
                <SubscriptionPopUp
                    onClose={() => setShowSubscriptionPopup(false)}
                    onLogin={() => {
                        // Handle subscription logic here
                        // For example, navigate to the subscription page
                        router.push('/subscription');
                    }}
                />
            )}
            </div>
            <h1 className="mt-6 mx-auto font-bold text-lg text-center">Nearby Listings</h1>
            <div className="relative h-full w-full">
              <div className="mt-4 h-96 shadow-lg rounded-2xl overflow-hidden">
                <MapComponent id={data?.id} />
              </div>
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="w-2/3">
            <div className="bg-white shadow rounded-lg p-8">
              {/* Product image */}
              {/* <div className="w-64 h-64 bg-gray-200 rounded-lg mb-8"></div> */}
              {/* Product details */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold ml-1 mb-4 text-gray-900">
                    Location
                  </h1>
                  <h1 className="text-xl text-gray-600 mb-4 flex justify-start gap-2 items-center">
                    <span className="inline-block">
                      <MapPin />
                    </span>{" "}
                    {data?.location}
                  </h1>
                </div>
                <div className="text-4xl font-serif">
                  {data?.max_vacancy}
                </div>
              </div>
              <hr />
              <div>
                <h1 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                  Basic Info
                </h1>
                <div className="flex items-center justify-between mt-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Gender</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.user_gender}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Approx Rent</p>
                    <p className="text-xl text-gray-800 font-semibold">
                      &#8377; {data?.approx_rent}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Occupancy</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.occupancy}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Looking For</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.looking_for}
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h1 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                  Property Info
                </h1>
                <div className="flex items-center justify-between mt-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Lease Term</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.lease_term}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Pet Policy</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.pet_policy?.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Smoking Policy</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.smoking_policy?.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Property Type</p>
                    <p className="text-xl text-gray-800 font-semibold capitalize">
                      {data?.property_type}
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <h1 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                Picture of Property
              </h1>
              <div>
                <div className="bg-stone-200 rounded-lg px-8 py-6">
                  {data?.image_urls?.length > 1 ? (
                    <Slider {...settings}>
                      {data.image_urls?.map(
                        (imageUrl: string, index: number) => (
                          <div key={index} className="h-60">
                            <Image
                              src={imageUrl}
                              alt={`image-${index}`}
                              width={500}
                              height={500}
                              className="w-full mx-auto h-full object-contain"
                            />
                          </div>
                        )
                      )}
                    </Slider>
                  ) : (
                    <div className="h-60">
                      {data?.image_urls?.length > 0 ? (
                        <Image
                          src={data.image_urls[0]} // Use index 0 to access the first image URL
                          alt={`image`}
                          width={500}
                          height={500}
                          className="w-full mx-auto h-full object-contain"
                        />
                      ) : (
                        <p>No image</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <hr />
                <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                  Prefernce
                </h2>
                <div className="flex flex-wrap items-center justify-center mt-2">
                  {data?.match_details?.user_preferences?.map((name: string) => (
                    <PreferncesField name={name} />
                  ))}
                </div>
              </div>
              <hr />
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                  Highlights
                </h2>
                <div className="flex flex-wrap items-center justify-start mt-2">
                  {data?.highlights?.map((highlight: string) => (
                    <div className="flex gap-1 justify-center items-center px-3 py-1 text-sm font-medium text-gray-600 bg-slate-200 rounded-full mr-2 mb-1">
                      <Check className="w-4 h-4" />
                      <span className="capitalize">
                        {highlight.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="mt-4" />
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                  Amenities
                </h2>
                <div className="flex flex-wrap items-center justify-center mt-2">
                  {data?.amenities?.map((name: string) => (
                    <AmenitiesField name={name} />
                  ))}
                </div>
              </div>
              <hr className="mt-4" />
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                  Description
                </h2>
                {userPaid ? (
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <p className="text-gray-700 capitalize">{data.description}</p>
                  </div>
                ) : (
                  <div className="p-4 border border-gray-300 rounded-lg blur">
                    <p className="text-gray-700 capitalize">Description blurred</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default SingleDetails;
