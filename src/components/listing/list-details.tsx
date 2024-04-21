import { Check, IndianRupee, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";

function ListingDetails() {
  return (
    <div className="flex min-h-screen">
      <div className="container mx-auto px-28 py-8 flex justify-center">
        {/* Left side - Profile card */}
        <div className="w-96 pr-8">
          <div className="bg-white shadow flex flex-col justify-center items-center rounded-lg p-4">
            {/* Profile image */}
            <div className="mx-auto">
              <Image
                className="object-cover w-20 h-20 bg-gray-200 rounded-full mb-4"
                src="https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                width={1000}
                height={1000}
              />
            </div>
            {/* User details */}
            <h2 className="text-lg font-semibold mb-2">John Doe</h2>
            <p className="text-sm text-gray-600 mb-2">Software Developer</p>
            <p className="text-sm text-gray-600">Location: Surat</p>
            <button
              type="submit"
              className="px-12 mt-4 rounded-md bg-stone-700 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
            >
              Request
            </button>
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="w-2/3">
          <div className="bg-white shadow rounded-lg p-8">
            {/* Product image */}
            <div className="w-64 h-64 bg-gray-200 rounded-lg mb-8"></div>
            {/* Product details */}
            <h1 className="text-xl font-semibold mb-4 text-gray-900">
              Location
            </h1>
            <h1 className="text-xl text-gray-600 mb-4 flex justify-start gap-2 items-center">
              <span className="inline-block">
                <MapPin />
              </span>{" "}
              Surat, Gujarat
            </h1>
            <hr />
            <div>
              <h1 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                Basic Info
              </h1>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-500 text-sm">Gender</p>
                  <p className="text-xl text-gray-800 font-semibold">Male</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-500 text-sm">Approx Rent</p>
                  <p className="text-xl text-gray-800 font-semibold">
                    &#8377; 2000
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-500 text-sm">Occupancy</p>
                  <p className="text-xl text-gray-800 font-semibold">Shared</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-500 text-sm">Looking For</p>
                  <p className="text-xl text-gray-800 font-semibold">Any</p>
                </div>
              </div>
            </div>
            <hr />
            <h1 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
              Picture Section
            </h1>
            <hr />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                Prefernce
              </h2>
              <div className="flex items-center justify-center mt-2">
                <div className="w-36 h-36">
                  {" "}
                  {/* Set a fixed width */}
                  <div
                    className={`w-24 h-24 flex items-center justify-center border-2 rounded-full mb-1 border-green-500`}
                  >
                    <img
                      src="https://www.flatmate.in/owl.png"
                      alt={"https://www.flatmate.in/owl.png"}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                Highlights
              </h2>
              <div className="flex flex-wrap items-center justify-start mt-2">
                <div className="flex gap-1 justify-center items-center px-3 py-1 text-sm font-medium text-gray-600 bg-slate-200 rounded-full mr-2 mb-1">
                  <Check className="w-4 h-4"/>
                  <span>
                    Highlights
                  </span>
                </div>
                <div className="flex gap-1 justify-center items-center px-3 py-1 text-sm font-medium text-gray-600 bg-slate-200 rounded-full mr-2 mb-1">
                  <Check className="w-4 h-4"/>
                  <span>
                    Highlights
                  </span>
                </div>
                <div className="flex gap-1 justify-center items-center px-3 py-1 text-sm font-medium text-gray-600 bg-slate-200 rounded-full mr-2 mb-1">
                  <Check className="w-4 h-4"/>
                  <span>
                    Highlights
                  </span>
                </div>
              </div>
            </div>
            <hr className="mt-4" />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                Amenities
              </h2>
              <div className="flex items-center justify-center mt-2">
                <div className="w-36 h-36">
                  {" "}
                  {/* Set a fixed width */}
                  <div
                    className={`w-24 h-24 flex items-center justify-center border-2 rounded-full mb-1 border-green-500`}
                  >
                    <img
                      src="https://www.flatmate.in/owl.png"
                      alt={"https://www.flatmate.in/owl.png"}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-4" />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-900">
                Description
              </h2>
              <div className="p-4 border border-gray-300 rounded-lg">
                <p className="text-gray-700">
                  Your static text message goes here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
