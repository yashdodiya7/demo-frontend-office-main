import { ErrorMessage, Field, FieldArray } from "formik";
import { Check } from "lucide-react";
import React, { useState } from "react";

interface FormikInputFieldProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}

const HighlightsInputField: React.FC = ({
  id,
  name,
  value,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-44">
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
            className={`flex gap-1 justify-center items-center px-2 py-1 text-sm font-medium rounded-xl mr-2 ${
              checked ? "bg-stone-600 text-white" : "bg-slate-200 text-gray-600"
            }`}
          >
            <span className="capitalize">#{name.replace(/_/g, " ")}</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default HighlightsInputField;
