import { ErrorMessage, Field } from "formik";
import React from "react";

interface SelectInput {
    name: string;
    value: string;
    options: string[];
    initialValue: string;
}

const SelectInputField: React.FC<SelectInput> = ({name, value, options, initialValue}) => {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="property_type"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {name}
      </label>
      <div className="mt-2">
        <Field
          as="select"
          id={value}
          name={value}
          className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {options.map((option) => (
            <option key={option} value={option} className="capitalize">
              {option}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name={value}
          component="div"
          className="mt-2 text-sm text-red-600 dark:text-red-500"
        />
      </div>
    </div>
  );
};

export default SelectInputField;
