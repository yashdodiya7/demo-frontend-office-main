import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CustomSlide(props: any) {
  const { index, ...otherProps } = props;
  return (
    <div {...otherProps}>
      <Image src={props.src} width={1000} height={1000}
          alt="Image"
          className="h-full w-full rounded-l-md object-contain"
        />
    </div>
  );
}


function DetailCard({listing}:{listing: any}) {
  const [showTags, setShowTags] = React.useState(false);
  
  return (
    <div className="flex flex-col max-w-2xl items-center rounded-md border md:flex-row">
      <div className="md:w-[200px] md:h-[200px] w-full mb-4 md:mb-0">
        <Image src={listing?.user_profile_image} width={1000} height={1000}
          alt="Image"
          className="h-full w-full rounded-l-md object-cover"
        />
      </div>
        <div className="p-4 w-full">
          <div className='flex items-center justify-between mb-2'>
            <h1 className="text-lg font-semibold flex flex-col items-baseline gap-1">
              {listing?.user_name}
              <p className='text-sm font-normal'>
                <span className='font-semibold'>Occupation:</span> {listing?.user_occupation}
              </p>
            </h1>
            <p className="mt-1 text-sm text-gray-600 flex items-center justify-start gap-1">
              <MapPin />{listing?.location.length > 30 ? `${listing.location.slice(0, 30)} ...` : listing?.location}
            </p>
          </div>

          <div className='flex items-center justify-between mt-6'>
              <div className='flex flex-col gap-1'>
                  <p className='text-gray-500 text-sm'>Approx Rent</p>
                  <p className='text-base text-gray-800 font-semibold'>&#8377; {listing?.approx_rent}</p>
              </div>
              <div className='flex flex-col gap-1'>
                  <p className='text-gray-500 text-sm'>Occupancy</p>
                  <p className='text-base text-gray-800 font-semibold capitalize'>{listing?.occupancy}</p>
              </div>
              <div className='flex flex-col gap-1'>
                  <p className='text-gray-500 text-sm'>Looking For</p>
                  <p className='text-base text-gray-800 font-semibold capitalize'>{listing?.looking_for}</p>
              </div>
          </div>
          <hr className='mt-4'/>

          <div className="flex items-center flex-wrap justify-between w-full space-x-2 mt-2">
            <p
              className="text-sm text-gray-600 relative"
              onMouseEnter={() => setShowTags(true)}
              onMouseLeave={() => setShowTags(false)}
            >
              {listing?.match_details && <span className={`ml-1`}>{listing?.match_details?.match_percentage}% Match</span>}
            
              {/* Conditionally render tags on hover */}
              {showTags && listing?.match_details && (
                <div className="absolute w-52 z-50 bottom-full left-0 p-2 bg-white border border-gray-200 rounded shadow-md">
                  <p className='py-4 text-sm text-stone-700 font-semibold'>Common Interests</p>
                  {listing?.match_details && listing?.match_details?.matched_fields.map((name: any, index: number) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-xs font-medium text-gray-900 bg-green-200 rounded-full mr-2 mb-1"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </p>
            {listing?.distance && <p className='text-sm text-gray-600 relative'><span className='font-bold'>{+listing?.distance?.toFixed(1)}</span> km from your location</p>}
          </div>
        </div>
    </div>
  )
}

export default DetailCard