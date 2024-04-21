import { ErrorMessage, Field, FieldArray } from "formik";
import React, { useState } from "react";

interface FormikInputFieldProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}

const checkboxIcons: Record<string, string> = {
  tv: "https://www.flatmate.in/TV.png",
  power_backup: "https://www.flatmate.in/power_backup.png",
  fridge: "https://www.flatmate.in/fridge.png",
  cook: "https://www.flatmate.in/cook.png",
  kitchen: "https://www.flatmate.in/kitchen.png",
  parking: "https://www.flatmate.in/parking.png",
  wifi: "https://www.flatmate.in/wifi.png",
  washing_machine: "https://www.flatmate.in/washing_machine.png",
  ac: "https://www.flatmate.in/air_conditioner.png",
};

// const amenitiesData = [
//   { id: "tv", value: "1" },
//   { id: "power_backup", value: "2" },
//   { id: "fridge", value: "3" },
//   { id: "cook", value: "4" },
//   { id: "kitchen", value: "5" },
//   { id: "parking", value: "6" },
//   { id: "wifi", value: "7" },
//   { id: "washing_machine", value: "8" },
//   { id: "ac", value: "9" },
// ];

const AmenitiesInputField: React.FC = ({
  id,
  name,
  value,
  checked,
  onChange,
}) => {
  const formattedValue = value.replace(/_/g, " ");

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="w-36 h-36">
        {" "}
        {/* Set a fixed width */}
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <label htmlFor={id} className="cursor-pointer">
          <div
            className={`w-24 h-24 flex items-center justify-center border-2 rounded-full mb-1 ${
              checked ? "border-green-500" : "border-gray-300"
            }`}
          >
            <img
              src={checkboxIcons[id]}
              alt={formattedValue}
              className="w-16 h-16 object-contain"
            />
          </div>
          <span className="text-black text-sm capitalize p-4">
            {formattedValue}
          </span>
        </label>
      </div>
    </div>
  );
};

export default AmenitiesInputField;
