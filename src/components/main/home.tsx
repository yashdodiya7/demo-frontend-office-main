"use client";

import React, { useEffect, useState } from "react";
import DetailCard from "../ui-component/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchListing, setSearchData } from "@/store/slice/listingSlice";
import { getCookie } from "cookies-next";
import Link from "next/link";
import ErrorCard from "../utils/custom-error/error-card";
import SearchComponent from "../search/search-name";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function HomePage() {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.list);
  // const stateUser = useSelector((state: any) => state.user)
  const token = getCookie("token");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Function to fetch listings with user's location
    const fetchListingsWithLocation = async (latitude, longitude) => {
      try {
        // Dispatch action to fetch listings with user's location
        
        const locationCoords = {"user_latitude": latitude, "user_longitude": longitude};
        const response = await dispatch(fetchListing({userToken: token, locationCoords: locationCoords }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    // Get user's location
    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch listings with user's location
          fetchListingsWithLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          // If unable to get user's location, fetch listings without location
          dispatch(fetchListing({userToken: token}))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
        }
      );
    };

    // Call function to get user's location
    getUserLocation();
  }, [dispatch]);



  // const [showError, setShowError] = useState(false)
  // useEffect(() => {
  //   if (state.listingData.length === 0) {
  //     const timer = setTimeout(() => {
  //       setShowError(true);
  //     }, 500);
  
  //     return () => clearTimeout(timer);
  //   }
  // }, [state.listingData.length]);
  
  // if (showError) {
  //   return <ErrorCard message={"No Data Found"} />;
  // }

  // useEffect(() => {
  //   // Fetch listings when the component mounts
  //   dispatch(fetchListing(token))
  //     .then(() => setLoading(false))
  //     .catch(() => setLoading(false));
  // }, [dispatch]);

  const handleSearch = async () => {
    // Perform search only if searchQuery is not empty

    const fetchListingsWithLocation = async (lat, lan) => {

      if (searchQuery.trim() !== '') {
        setLoading(true); // Set loading state to true while fetching data
        try {
          const response = await axios.get(`${BASE_URL}/listing/listsearch?user_name=${searchQuery}&occupation=${searchQuery}&user_latitude=${lat}&user_longitude=${lan}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(setSearchData(response.data)); // Update state with search results
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
        setLoading(false); // Set loading state back to false after fetching data
      }
      else {
        try {
          const response = await axios.get(`${BASE_URL}/listing/listsearch?user_latitude=${lat}&user_longitude=${lan}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(setSearchData(response.data)); // Update state with search results
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    }

    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch listings with user's location
          fetchListingsWithLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          // If unable to get user's location, fetch listings without location
          dispatch(fetchListing({userToken: token}))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
        }
      );
    };

    // Call function to get user's location
    getUserLocation();
  };

  return (
    <div className="w-full">
      {/* Features Section */}
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
        </div>
      ) : (
        <div className="mx-auto my-10 max-w-7xl px-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
          />
          <button onClick={handleSearch}>Search</button>
          <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-2">
            {state.listingData.map((listing: any, index: number) => (
              <Link key={index} href={`/listdetails/${listing.id}`}>
                <DetailCard listing={listing} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
