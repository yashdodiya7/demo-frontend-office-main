"use client";

import React, { useEffect, useState } from "react";
import DetailCard from "../ui-component/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchListing, setSearchData } from "@/store/slice/listingSlice";
import { getCookie } from "cookies-next";
import Link from "next/link";
import ErrorCard from "../utils/custom-error/error-card";
import axios from "axios";
import { Footer } from "../footer";

const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || '';


function HomePage() {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.list);
  const stateUser = useSelector((state: any) => state.user);
  // const stateUser = useSelector((state: any) => state.user)
  const token: string | undefined = getCookie("token");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedGender, setSelectedGender] = useState<string>("");

  useEffect(() => {
    // Function to fetch listings with user's location
    const fetchListingsWithLocation = async (latitude: number, longitude: number) => {
      try {
        // Dispatch action to fetch listings with user's location
        
        const locationCoords = {"user_latitude": latitude, "user_longitude": longitude};
        const response = await dispatch(fetchListing({userToken: token, locationCoords: locationCoords, page: currentPage }));
        // console.log("<<<",response.payload.total_pages)
        setTotalPages(response?.payload?.total_pages)
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
  }, [dispatch, stateUser, token, currentPage]);


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearchNextPage = () => {
    if (searchCurrentPage < totalPages) {
      setSearchCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchPrevPage = () => {
    if (searchCurrentPage > 1) {
      setSearchCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchPageClick = (pageNumber: number) => {
    setSearchCurrentPage(pageNumber);
  };

  const handleSearch = async () => {

    const fetchListingsWithLocation = async (lat: number, lan: number) => {

      if (searchQuery.trim() !== '') {
        setLoading(true); // Set loading state to true while fetching data
        try {
          const response = await axios.get(`${BASE_URL}/listing/listsearch`,
            {
              params: {
                location: searchQuery,
                male: selectedGender === 'male',
                female: selectedGender === 'female',
                page: currentPage,
                user_latitude: lat, // Assuming you have latitude and longitude in your user state
                user_longitude: lan,
              },

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("<<<", response.data);
          dispatch(setSearchData(response.data)); // Update state with search results
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
        setLoading(false); // Set loading state back to false after fetching data
      }
      else {
        try {
          const response = await axios.get(`${BASE_URL}/listing/listsearch`,
            {
              params: {
                user_latitude: lat, // Assuming you have latitude and longitude in your user state
                user_longitude: lan,
                male: selectedGender === 'male',
                female: selectedGender === 'female',
                page: currentPage, // Include selected gender in the API call
              },

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTotalPages(response.data?.total_pages);
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

  useEffect(() => {
    handleSearch();
  }, [searchCurrentPage, selectedGender]);

  return (
    <div className="w-full">
      {/* Features Section */}
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
        </div>
      ) : (
        <div className="mx-auto my-10 max-w-7xl px-2">
          <div className="flex justify-between items-baseline">
            <div className="relative mt-4 w-[30%]">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-stone-500 focus:border-stone-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                required
              />
              <button
                type="submit"
                onClick={handleSearch}
                className="text-white absolute end-2.5 bottom-2.5 bg-stone-700 hover:bg-stone-800 focus:ring-4 focus:outline-none focus:ring-stone-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>

            <div>
              <select
                value={selectedGender}
                onChange={(e) => {
                  setSelectedGender(prev => e.target.value);
                }}
                className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="">Looking For</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-2">
            {state.listingData.map((listing: any, index: number) => (
              <Link key={index} href={`/listdetails/${listing.id}`}>
                <DetailCard listing={listing} />
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-stone-700 text-white"
              }`}
            >
              Previous
            </button>
            {/* Page buttons */}
            {Array.from(Array(totalPages).keys()).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber + 1)}
                className={`px-4 py-2 mx-2 rounded-md ${
                  currentPage === pageNumber + 1
                    ? "bg-stone-700 text-white"
                    : "bg-stone-300 text-gray-500"
                }`}
              >
                {pageNumber + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-stone-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <div className="mt-2 ">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
