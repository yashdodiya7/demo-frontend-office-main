"use client"

import Image from 'next/image'
import React from 'react'

const amenitiesIcons: Record<string, string> = {
    tv: "https://www.flatmate.in/TV.png",
    power_backup: "https://www.flatmate.in/power_backup.png",
    fridge: "https://www.flatmate.in/fridge.png",
    cook: "https://www.flatmate.in/cook.png",
    kitchen: "https://www.flatmate.in/kitchen.png",
    parking: "https://www.flatmate.in/parking.png",
    wifi: "https://www.flatmate.in/wifi.png",
    washing_machine: "https://www.flatmate.in/washing_machine.png",
    ac: "https://www.flatmate.in/air_conditioner.png",
}

const AmenitiesField: React.FC<{name: string}> = ({name}) => {
  return (
    <div className="w-36 h-36 flex flex-col items-center justify-center gap-2">
    {" "}
    {/* Set a fixed width */}
        <div
            className={`w-24 h-24 flex items-center justify-center border-2 rounded-full border-stone-500 bg-stone-100`}
        >
            <Image
            width={500}
            height={500}
            src={amenitiesIcons[name]}
            alt={name}
            className="w-16 h-16 object-contain"
            />
        </div>
        <span className='capitalize'>{name.replace(/_/g, " ")}</span>
    </div>
  )
}

export default AmenitiesField