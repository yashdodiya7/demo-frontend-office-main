import { ErrorMessage, Field } from "formik";
import React from "react";

interface TextNumber {
    name: string;
    value: string;
    type: string;
    placeholder: string;
}

const TextNumberInputField: React.FC<TextNumber> = ({name, value, type, placeholder}) => {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor={value}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {name}
      </label>
      <div className="mt-2">
        <Field
          id={value}
          name={value}
          type={type}
          placeholder={placeholder}
          className="py-2 block w-full px-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <ErrorMessage
          name={value}
          component="div"
          className="mt-2 text-sm text-red-600 dark:text-red-500"
        />
      </div>
    </div>
  );
};

export default TextNumberInputField;
